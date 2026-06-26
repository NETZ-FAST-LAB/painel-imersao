/* ============================================================
   Mintzie — servidor do assistente de site da NETZ
   Zero dependências externas. Requer Node 18+ (fetch nativo).
   Suporta dois cérebros:
     - LLM_PROVIDER=gemini  -> Google Gemini (generativelanguage)
     - LLM_PROVIDER=openai  -> endpoint compatível com OpenAI
   Uso:  node server.js   (lê variáveis do .env)
   ============================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");

/* ---------- .env mínimo (sem dependência) ---------- */
(function loadEnv() {
  try {
    const file = path.join(__dirname, ".env");
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (!(m[1] in process.env)) process.env[m[1]] = v;
    }
  } catch (e) { console.warn("Aviso ao ler .env:", e.message); }
})();

/* ---------- config ---------- */
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const LLM_API_KEY = process.env.LLM_API_KEY || "";
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://models.inference.ai.azure.com";
const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o";

// provider: explícito, ou auto (gemini se houver chave Google)
const LLM_PROVIDER = (process.env.LLM_PROVIDER ||
  (GEMINI_API_KEY ? "gemini" : "openai")).toLowerCase();

// permite que o portal de governança teste com um ajuste temporário de prompt.
// Mantenha "true" no protótipo interno; desligue ("false") em produção pública.
const ALLOW_PROMPT_OVERRIDE = (process.env.ALLOW_PROMPT_OVERRIDE || "true").toLowerCase() === "true";

/* ---------- system prompt = persona + base de conhecimento ---------- */
function readSafe(p) { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } }
const PERSONA = readSafe(path.join(__dirname, "persona", "mintzie_web_persona.md"));
const KNOWLEDGE = readSafe(path.join(__dirname, "knowledge", "netz_knowledge.md"));
function buildSystemPrompt(persona, knowledge) {
  return (
    persona +
    "\n\n---\n\n# BASE DE CONHECIMENTO DA NETZ\n" +
    "Responda SOMENTE com base no conteúdo abaixo. " +
    "Se a resposta não estiver aqui, admita com charme e ofereça conectar a pessoa com o time.\n\n" +
    knowledge
  );
}
const SYSTEM_PROMPT = buildSystemPrompt(PERSONA, KNOWLEDGE);

/* ---------- helpers HTTP ---------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".mp4": "video/mp4",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
};
function send(res, code, body, headers = {}) { res.writeHead(code, headers); res.end(body); }
function json(res, code, obj) { send(res, code, JSON.stringify(obj), { "Content-Type": "application/json" }); }

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split("?")[0]);
  if (rel === "/") rel = "/index.html";
  const filePath = path.join(PUBLIC_DIR, path.normalize(rel));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden");
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, "Not found");
    const range = req.headers.range;
    const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    if (range && type === "video/mp4") {
      const m = range.match(/bytes=(\d+)-(\d*)/);
      const start = parseInt(m[1], 10);
      const end = m[2] ? parseInt(m[2], 10) : stat.size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes", "Content-Length": end - start + 1, "Content-Type": type,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

/* ---------- cérebros ---------- */
let resolvedGeminiModel = GEMINI_MODEL; // pode mudar se o configurado sumir

async function geminiGenerate(model, messages, sysPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content || "") }],
  }));
  const body = {
    system_instruction: { parts: [{ text: sysPrompt }] },
    contents,
    generationConfig: { temperature: 0.85, maxOutputTokens: 220 },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  return { ok: r.ok, status: r.status, data };
}

// Consulta os modelos disponíveis na conta e escolhe um bom para chat.
async function pickGeminiModel() {
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(GEMINI_API_KEY)}&pageSize=200`
    );
    const data = await r.json();
    const usable = (data.models || []).filter((m) =>
      (m.supportedGenerationMethods || []).includes("generateContent")
    );
    const names = usable.map((m) => m.name.replace(/^models\//, ""));
    // preferência: flash estável > flash qualquer > pro estável > qualquer
    const stable = (n) => !/(vision|thinking|exp|preview|tts|image|embedding|learnlm)/i.test(n);
    const pick =
      names.find((n) => /flash/i.test(n) && stable(n)) ||
      names.find((n) => /flash/i.test(n)) ||
      names.find((n) => /pro/i.test(n) && stable(n)) ||
      names[0];
    if (pick) console.log("    ↪ modelo Gemini resolvido automaticamente:", pick);
    return pick || null;
  } catch (e) {
    console.error("Não consegui listar modelos Gemini:", e.message);
    return null;
  }
}

async function callGemini(messages, sysPrompt) {
  let r = await geminiGenerate(resolvedGeminiModel, messages, sysPrompt);
  // se o modelo não existe mais (404), descobre um válido e tenta de novo
  if (!r.ok && r.status === 404) {
    const better = await pickGeminiModel();
    if (better && better !== resolvedGeminiModel) {
      resolvedGeminiModel = better;
      r = await geminiGenerate(resolvedGeminiModel, messages, sysPrompt);
    }
  }
  if (!r.ok) {
    const msg = r.data?.error?.message || JSON.stringify(r.data).slice(0, 300);
    throw new Error(`Gemini ${r.status}: ${msg}`);
  }
  const cand = r.data.candidates?.[0];
  return (cand?.content?.parts || []).map((p) => p.text || "").join("").trim();
}

async function callOpenAI(messages, sysPrompt) {
  const body = {
    model: LLM_MODEL,
    messages: [{ role: "system", content: sysPrompt }, ...messages],
    temperature: 0.85,
    max_tokens: 220,
  };
  const r = await fetch(`${LLM_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_API_KEY}` },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    const msg = data?.error?.message || JSON.stringify(data).slice(0, 300);
    throw new Error(`OpenAI ${r.status}: ${msg}`);
  }
  return (data.choices?.[0]?.message?.content || "").trim();
}

/* ---------- /api/chat ---------- */
function handleChat(req, res) {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", async () => {
    const hasKey = LLM_PROVIDER === "gemini" ? !!GEMINI_API_KEY : !!LLM_API_KEY;
    if (!hasKey) {
      return json(res, 500, {
        error: "missing_key",
        reply: "Meu cérebro não foi ligado: falta a chave do modelo no servidor. Avise um humano.",
      });
    }
    let body = {};
    try { body = JSON.parse(raw || "{}"); } catch {}
    const messages = (body.messages || []).slice(-16);
    // banca de testes: ajuste temporário de definição (não toca nos arquivos)
    let sysPrompt = SYSTEM_PROMPT;
    if (ALLOW_PROMPT_OVERRIDE && body.testAdjustment && String(body.testAdjustment).trim()) {
      sysPrompt = SYSTEM_PROMPT +
        "\n\n---\n\n# AJUSTE TEMPORÁRIO DE TESTE (tem prioridade sobre o conteúdo acima)\n" +
        String(body.testAdjustment).trim();
    }
    try {
      const reply = LLM_PROVIDER === "gemini"
        ? await callGemini(messages, sysPrompt)
        : await callOpenAI(messages, sysPrompt);
      json(res, 200, { reply: reply || "" });
    } catch (e) {
      console.error("Falha LLM:", e.message);
      json(res, 502, {
        error: "llm_error",
        detail: e.message, // detalhe técnico p/ debug (aparece no console do navegador)
        reply: "O laboratório engasgou e não consegui pensar agora. Confere as credenciais do modelo e tenta de novo.",
      });
    }
  });
}

/* ---------- /api/governance ---------- */
function handleGovernance(req, res) {
  let index = {};
  try { index = JSON.parse(readSafe(path.join(__dirname, "governance", "faq-index.json")) || "{}"); }
  catch (e) { index = { error: "faq-index.json inválido: " + e.message }; }
  json(res, 200, {
    index,
    persona: PERSONA,
    knowledge: KNOWLEDGE,
    provider: LLM_PROVIDER,
    model: LLM_PROVIDER === "gemini" ? resolvedGeminiModel : LLM_MODEL,
    allowOverride: ALLOW_PROMPT_OVERRIDE,
  });
}

/* ---------- roteador ---------- */
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") return handleChat(req, res);
  if (req.method === "GET" && req.url.split("?")[0] === "/api/governance") return handleGovernance(req, res);
  if (req.method === "GET") return serveStatic(req, res);
  send(res, 405, "Method not allowed");
});

server.listen(PORT, () => {
  const model = LLM_PROVIDER === "gemini" ? GEMINI_MODEL : LLM_MODEL;
  const hasKey = LLM_PROVIDER === "gemini" ? !!GEMINI_API_KEY : !!LLM_API_KEY;
  console.log(`\n🐈  Mintzie rodando em  http://localhost:${PORT}`);
  console.log(`    Provider: ${LLM_PROVIDER}  |  Modelo: ${model}`);
  if (!hasKey) console.log("    ⚠️  Sem chave de modelo — configure o .env (veja .env.example)\n");
  else console.log("");
});
