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

/* ---------- carregamento de env (sem dependência) ----------
   Prioridade: variáveis do shell  >  .env (local, fora do git)  >  .env.shared (do time, commitado) */
(function loadEnv() {
  const fromShell = new Set(Object.keys(process.env));
  function parse(file, canOverrideShell) {
    try {
      if (!fs.existsSync(file)) return;
      for (const line of fs.readFileSync(file, "utf8").split("\n")) {
        const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        let v = m[2].trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
          v = v.slice(1, -1);
        const key = m[1];
        // nunca sobrescreve o que veio do shell; .env sobrescreve o .env.shared
        if (fromShell.has(key)) continue;
        if (canOverrideShell || !(key in process.env)) process.env[key] = v;
      }
    } catch (e) { console.warn("Aviso ao ler", path.basename(file) + ":", e.message); }
  }
  parse(path.join(__dirname, ".env.shared"), false); // defaults do time (commitado)
  parse(path.join(__dirname, ".env"), true);          // override local (fora do git)
})();

/* ---------- config ---------- */
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

/* modo de execução (v0.4 — segurança):
   - "public"   -> padrão. Seguro para deploy: só o cérebro do site (netz), painel/governança
                   bloqueados, CORS restrito, rate limit, sem override de prompt.
   - "internal" -> uso da equipe, local: tudo liberado como antes (painel da imersão,
                   governança, cérebro imersao, CORS aberto). O start-mintzie.command já usa este modo. */
const MODE = (process.env.MINTZIE_MODE || "public").toLowerCase() === "internal" ? "internal" : "public";
const IS_PUBLIC = MODE === "public";

// token para acessar /api/governance em modo public (Authorization: Bearer <token> ou ?token=)
const GOVERNANCE_TOKEN = process.env.GOVERNANCE_TOKEN || "";

// Trava de senha (HTTP Basic Auth). Se definidas, protegem TODA a instância — essencial
// ao expor o painel (modo internal) numa VPS. Deixe vazias para uso local sem senha.
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || "";
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || "";

// origens autorizadas a chamar a API em modo public (CORS)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://netz.now,https://www.netz.now")
  .split(",").map((s) => s.trim()).filter(Boolean);

// rate limit por IP (só em modo public)
const RATE_PER_MIN = parseInt(process.env.RATE_PER_MIN || "8", 10);
const RATE_PER_DAY = parseInt(process.env.RATE_PER_DAY || "150", 10);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const LLM_API_KEY = process.env.LLM_API_KEY || "";
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://models.inference.ai.azure.com";
const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o";

// provider: explícito, ou auto (gemini se houver chave Google)
const LLM_PROVIDER = (process.env.LLM_PROVIDER ||
  (GEMINI_API_KEY ? "gemini" : "openai")).toLowerCase();

// permite que o portal de governança teste com um ajuste temporário de prompt.
// v0.4: em modo PUBLIC é sempre desligado (era um bypass total de guardrails via API) —
// nem variável de ambiente liga. Em internal: configurável, padrão true (banca de testes).
const ALLOW_PROMPT_OVERRIDE = !IS_PUBLIC &&
  (process.env.ALLOW_PROMPT_OVERRIDE || "true").toLowerCase() === "true";

/* ---------- system prompt = persona + base de conhecimento ---------- */
function readSafe(p) { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } }
const PERSONA = readSafe(path.join(__dirname, "persona", "mintzie_web_persona.md"));
const KNOWLEDGE = readSafe(path.join(__dirname, "knowledge", "netz_knowledge.md"));
// segundo cérebro: guia da imersão (persona + acervo das pesquisas/análises)
// v0.4: em modo public o conteúdo interno NÃO é carregado (nem fica em memória).
const PERSONA_IMERSAO = IS_PUBLIC ? "" : readSafe(path.join(__dirname, "persona", "mintzie_imersao_persona.md"));
const KNOWLEDGE_IMERSAO = IS_PUBLIC ? "" : readSafe(path.join(__dirname, "imersao", "imersao_knowledge.md"));
const EMOTION_INSTRUCTION =
  "\n\n---\n\n# MARCADOR DE EMOÇÃO (uso interno)\n" +
  "Ao final de CADA resposta, em uma linha separada, inclua um marcador no formato <emo>X</emo>, " +
  "onde X é UM de: neutral, happy, pointing, confused, celebrating, laughing, surprised.\n" +
  "- happy: resposta calorosa, positiva, um elogio ou algo que agrada.\n" +
  "- pointing: quando você convida a pessoa a falar com o time ou mostra o próximo passo (WhatsApp, e-mail, contato).\n" +
  "- confused: quando você não sabe, não tem a informação, ou o pedido está fora de escopo.\n" +
  "- celebrating: quando o visitante decide avançar, fecha algo ou há uma boa notícia.\n" +
  "- laughing: quando você faz uma piada, deboche leve ou algo divertido.\n" +
  "- surprised: quando algo é inesperado ou surpreendente.\n" +
  "- neutral: qualquer outro caso.\n" +
  "Esse marcador é REMOVIDO antes de exibir ao usuário; NUNCA o mencione, explique ou repita.";

const ACTION_INSTRUCTION =
  "\n\n---\n\n# AÇÕES NA PÁGINA (uso interno)\n" +
  "Se o pedido do visitante corresponder claramente a uma ação na página, adicione ao final, em linha separada, " +
  "um marcador <act>{JSON}</act>. Ações válidas:\n" +
  "- Levar a pessoa a uma seção/página: {\"type\":\"scrollTo\",\"target\":\"contato\"} — o widget rola se a seção estiver na página, ou navega até ela se for outra página. Use quando pedirem 'me leva pro contato', 'me mostra os cases', etc. (targets: cases, contato, hero, case-corsan, case-cris, case-bss).\n" +
  "- Pré-preencher o formulário de contato: {\"type\":\"prefillContact\",\"nome\":\"...\",\"empresa\":\"...\",\"desafio\":\"...\"} — inclua APENAS os campos que a pessoa já te deu na conversa; omita o resto.\n" +
  "- (Qualquer página) Clicar num botão/link pelo texto visível: {\"type\":\"click\",\"text\":\"Ver cases\"}.\n" +
  "- (Qualquer página) Preencher um campo pelo rótulo/placeholder: {\"type\":\"fill\",\"field\":\"Assunto\",\"value\":\"...\"}.\n" +
  "- (Qualquer página) Rolar a página: {\"type\":\"scrollPage\",\"to\":\"top\"} (to: top, bottom, up, down).\n" +
  "SEGURANÇA das ações de clique: para qualquer clique de RISCO (enviar, submeter, pagar, comprar, excluir, apagar, transferir), você DEVE primeiro pedir a confirmação explícita do usuário nesta conversa; só depois emita a ação com \"confirmed\":true. Sem confirmação, não execute.\n" +
  "Exemplos: 'me mostra o case da Corsan' -> scrollTo case-corsan; 'quero falar com o time' -> scrollTo contato; 'pode preencher pra mim, sou o João da Acme e preciso de um site' -> prefillContact.\n" +
  "Regras: emita no MÁXIMO uma ação por resposta, só quando fizer sentido óbvio. NUNCA envie o formulário nem navegue para links sozinho. " +
  "O marcador é removido antes de exibir; nunca o mencione. Na sua resposta em texto, diga naturalmente o que você fez (ex.: 'te levei até os cases').";

// ações do guia da imersão: navegar o painel (sem formulário de contato)
const IMERSAO_ACTION_INSTRUCTION =
  "\n\n---\n\n# AÇÕES NO PAINEL (uso interno)\n" +
  "Quando a pessoa pedir para ser levada a algo do painel, adicione ao final, em linha separada, um marcador <act>{JSON}</act>. Ações válidas:\n" +
  "- Ir até uma seção/item por id: {\"type\":\"scrollToId\",\"id\":\"d1\"} — rola até o elemento com esse id e o destaca. Use os ids do painel (decisões d1–d6, cemitério i1–i10, benchmarking b1–b6) ou qualquer id que apareça na lista de elementos da página.\n" +
  "- Clicar num elemento da lista viva (aba, botão, item) por índice: {\"type\":\"clickIndex\",\"i\":N}.\n" +
  "- Rolar o painel: {\"type\":\"scrollPage\",\"to\":\"top\"} (top, bottom, up, down).\n" +
  "Prefira scrollToId quando souber o id; senão use clickIndex a partir dos elementos visíveis. Para vários passos, pode emitir um ARRAY de ações. " +
  "Nunca clique em algo de risco (excluir, apagar, resetar) sem a pessoa confirmar antes (\"confirmed\":true). " +
  "O marcador é removido antes de exibir; nunca o mencione. No texto, diga naturalmente o que você fez (ex.: 'te levei até a decisão d1').";

function buildSystemPrompt(persona, knowledge) {
  return (
    persona +
    "\n\n---\n\n# BASE DE CONHECIMENTO DA NETZ\n" +
    "Responda SOMENTE com base no conteúdo abaixo. " +
    "Se a resposta não estiver aqui, admita com charme e ofereça conectar a pessoa com o time.\n\n" +
    knowledge +
    EMOTION_INSTRUCTION +
    ACTION_INSTRUCTION
  );
}
const SYSTEM_PROMPT = buildSystemPrompt(PERSONA, KNOWLEDGE);

// cérebro da imersão: o acervo já é auto-descritivo (traz o mapa + os documentos na íntegra)
const SYSTEM_PROMPT_IMERSAO = (
  PERSONA_IMERSAO +
  "\n\n---\n\n" + KNOWLEDGE_IMERSAO +
  EMOTION_INSTRUCTION +
  IMERSAO_ACTION_INSTRUCTION
);

// registro de cérebros — escolhido por body.brain (padrão: netz)
// v0.4: em modo public só existe o cérebro do site; pedir "imersao" cai no netz.
const BRAINS = IS_PUBLIC
  ? { netz: SYSTEM_PROMPT }
  : { netz: SYSTEM_PROMPT, imersao: SYSTEM_PROMPT_IMERSAO };

/* ---------- helpers HTTP ---------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".mp4": "video/mp4",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
};
// CORS por requisição (v0.4): internal = aberto (*); public = só origens da lista.
// Requisições da mesma origem (o widget rodando no próprio site) não dependem de CORS.
function corsFor(req) {
  if (!IS_PUBLIC) return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
  return {}; // origem desconhecida: sem cabeçalhos CORS
}
// trava de senha global (se BASIC_AUTH_USER/PASS estiverem configuradas)
function checkBasicAuth(req, res) {
  if (!BASIC_AUTH_USER || !BASIC_AUTH_PASS) return true; // desligada por padrão (uso local)
  const h = req.headers.authorization || "";
  const m = h.match(/^Basic\s+(.+)$/i);
  if (m) {
    let dec = "";
    try { dec = Buffer.from(m[1], "base64").toString("utf8"); } catch (e) {}
    const i = dec.indexOf(":");
    const u = i >= 0 ? dec.slice(0, i) : "";
    const p = i >= 0 ? dec.slice(i + 1) : "";
    if (u === BASIC_AUTH_USER && p === BASIC_AUTH_PASS) return true;
  }
  res.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Mintzie", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end("Acesso restrito — autenticação necessária.");
  return false;
}
function send(res, code, body, headers = {}) { res.writeHead(code, Object.assign({}, res._cors || {}, headers)); res.end(body); }
function json(res, code, obj) { send(res, code, JSON.stringify(obj), { "Content-Type": "application/json" }); }

/* ---------- rate limit por IP (v0.4, só em modo public) ---------- */
const hits = new Map(); // ip -> { stamps: [ms, ...] }
function clientIp(req) {
  const xf = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xf || req.socket.remoteAddress || "?";
}
function rateLimited(req) {
  if (!IS_PUBLIC) return false;
  const now = Date.now();
  const ip = clientIp(req);
  let h = hits.get(ip);
  if (!h) { h = { stamps: [] }; hits.set(ip, h); }
  h.stamps = h.stamps.filter((t) => now - t < 86400000); // janela de 24h
  const lastMin = h.stamps.filter((t) => now - t < 60000).length;
  if (lastMin >= RATE_PER_MIN || h.stamps.length >= RATE_PER_DAY) return true;
  h.stamps.push(now);
  return false;
}
const rateSweeper = setInterval(() => {
  const now = Date.now();
  for (const [ip, h] of hits) {
    h.stamps = h.stamps.filter((t) => now - t < 86400000);
    if (!h.stamps.length) hits.delete(ip);
  }
}, 600000);
if (rateSweeper.unref) rateSweeper.unref();

// URLs curtas e fáceis de lembrar -> arquivo real
const ROUTE_ALIASES = {
  "/": "/index.html",
  "/site": "/index.html",
  "/inicio": "/hub.html", "/hub": "/hub.html", "/home": "/hub.html",
  "/painel": "/painel-imersao.html", "/imersao": "/painel-imersao.html", "/imersão": "/painel-imersao.html",
  "/governanca": "/governanca.html", "/governança": "/governanca.html",
  "/sons": "/sons.html", "/som": "/sons.html"
};
// páginas internas — nunca servidas em modo public (v0.4)
const INTERNAL_PAGES = new Set(["/painel-imersao.html", "/governanca.html", "/hub.html", "/sons.html"]);
function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split("?")[0]);
  const key = rel.replace(/\/+$/, "") || "/";        // ignora barra final
  if (ROUTE_ALIASES[key]) rel = ROUTE_ALIASES[key];
  if (IS_PUBLIC && INTERNAL_PAGES.has(rel)) return send(res, 404, "Not found");
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
      res.writeHead(206, Object.assign({
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes", "Content-Length": end - start + 1, "Content-Type": type,
      }, res._cors || {}));
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, Object.assign({ "Content-Type": type, "Content-Length": stat.size }, res._cors || {}));
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

/* ---------- cérebros ---------- */
let resolvedGeminiModel = GEMINI_MODEL; // pode mudar se o configurado sumir

async function geminiGenerate(model, messages, sysPrompt, image) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content || "") }],
  }));
  // "Mintzie enxerga a tela": anexa o print na última fala do usuário (Gemini é multimodal).
  // Busca de trás pra frente, pois no fluxo "olhar a tela" a última fala pode ser do modelo.
  if (image && contents.length) {
    const im = String(image).match(/^data:(.*?);base64,(.*)$/);
    if (im) {
      let target = null;
      for (let k = contents.length - 1; k >= 0; k--) { if (contents[k].role === "user") { target = contents[k]; break; } }
      if (target) target.parts.push({ inline_data: { mime_type: im[1], data: im[2] } });
    }
  }
  const body = {
    system_instruction: { parts: [{ text: sysPrompt }] },
    contents,
    generationConfig: { temperature: 0.85, maxOutputTokens: 500, thinkingConfig: { thinkingBudget: 0 } },
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

async function callGemini(messages, sysPrompt, image) {
  let r = await geminiGenerate(resolvedGeminiModel, messages, sysPrompt, image);
  // se o modelo não existe mais (404), descobre um válido e tenta de novo
  if (!r.ok && r.status === 404) {
    const better = await pickGeminiModel();
    if (better && better !== resolvedGeminiModel) {
      resolvedGeminiModel = better;
      r = await geminiGenerate(resolvedGeminiModel, messages, sysPrompt, image);
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
    max_tokens: 320,
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
  // v0.4: rate limit por IP antes de qualquer processamento (só em modo public)
  if (rateLimited(req)) {
    return json(res, 429, {
      error: "rate_limited",
      reply: "Calma, humano — mensagens demais de uma vez. Respira, espera um instante e tenta de novo.",
    });
  }
  const MAX_BODY = IS_PUBLIC ? 300 * 1024 : 8 * 1024 * 1024; // public: sem prints/anexos grandes
  let raw = "";
  let tooLarge = false;
  req.on("data", (c) => {
    if (tooLarge) return;
    raw += c;
    if (raw.length > MAX_BODY) {
      tooLarge = true;
      json(res, 413, { error: "too_large", reply: "Isso é grande demais até pra um gato digerir. Manda algo menor." });
      req.destroy();
    }
  });
  req.on("end", async () => {
    if (tooLarge) return;
    const hasKey = LLM_PROVIDER === "gemini" ? !!GEMINI_API_KEY : !!LLM_API_KEY;
    if (!hasKey) {
      return json(res, 500, {
        error: "missing_key",
        reply: "Meu cérebro não foi ligado: falta a chave do modelo no servidor. Avise um humano.",
      });
    }
    let body = {};
    try { body = JSON.parse(raw || "{}"); } catch {}
    // v0.4: sanitiza histórico (papéis válidos + limite de tamanho por mensagem)
    const messages = (Array.isArray(body.messages) ? body.messages : []).slice(-16).map((m) => ({
      role: m && m.role === "assistant" ? "assistant" : "user",
      content: String((m && m.content) || "").slice(0, 4000),
    }));
    // escolhe o cérebro (netz = site institucional; imersao = guia do acervo da imersão)
    const base = BRAINS[String(body.brain || "").toLowerCase()] || SYSTEM_PROMPT;
    // banca de testes: ajuste temporário de definição (não toca nos arquivos)
    let sysPrompt = base;
    if (ALLOW_PROMPT_OVERRIDE && body.testAdjustment && String(body.testAdjustment).trim()) {
      sysPrompt = base +
        "\n\n---\n\n# AJUSTE TEMPORÁRIO DE TESTE (tem prioridade sobre o conteúdo acima)\n" +
        String(body.testAdjustment).trim();
    }
    if (body.page && Array.isArray(body.page.elements) && body.page.elements.length) {
      const list = body.page.elements.slice(0, 60)
        .map((e) => `[${e.i}] ${e.tag}${e.x ? " — " + e.x : ""}`).join("\n");
      sysPrompt += "\n\n---\n\n# PÁGINA ATUAL (contexto vivo)\n" +
        "URL: " + (body.page.url || "") + "\nTítulo: " + (body.page.title || "") + "\n" +
        "Elementos interativos visíveis (índice · tipo · texto):\n" + list + "\n" +
        "Para interagir com um deles, aja por índice: {\"type\":\"clickIndex\",\"i\":N} ou {\"type\":\"fillIndex\",\"i\":N,\"value\":\"...\"}. " +
        "IMPORTANTE — preencher formulário nesta página: NÃO use prefillContact aqui (ele só serve no site da Netz). " +
        "Identifique os campos na lista acima pelos rótulos (nome, e-mail, empresa, mensagem, etc.) e preencha CADA um com fillIndex no índice correto. " +
        "Para preencher VÁRIOS campos de uma vez, emita um ARRAY de ações no marcador, ex.: " +
        "<act>[{\"type\":\"fillIndex\",\"i\":3,\"value\":\"João\"},{\"type\":\"fillIndex\",\"i\":5,\"value\":\"Acme\"}]</act>. " +
        "Preencha só os campos cujo valor a pessoa já te deu; nunca invente dados; nunca envie/submeta o formulário sozinho. " +
        "Regras de segurança iguais (confirmar antes de enviar/pagar/excluir; \"confirmed\":true só após o usuário confirmar). " +
        "Se perguntarem o que dá pra fazer nesta página, resuma pelos elementos acima.";
      if (body.canSee) {
        sysPrompt += "\n\nVISÃO: você PODE olhar a tela quando a pessoa pedir ('tira um print', 'olha a tela', 'o que você está vendo', 'me ajuda com o que está aí'). " +
          "Para isso, emita {\"type\":\"screenshot\"} — o widget captura a tela e te mostra a imagem, e então você responde já enxergando. " +
          "Não peça pra pessoa apertar botão nenhum; é só emitir a ação. Use quando o pedido depender de ver algo que não está na lista de elementos acima (imagens, gráficos, layout).";
      }
    }
    // v0.4: em modo public não aceitamos imagem (o site público não tem captura de tela; evita custo/abuso)
    const image = IS_PUBLIC ? undefined : body.image;
    try {
      let reply = LLM_PROVIDER === "gemini"
        ? await callGemini(messages, sysPrompt, image)
        : await callOpenAI(messages, sysPrompt);
      // extrai o marcador de emoção <emo>X</emo> e remove do texto exibido
      let emotion = "neutral";
      const m = (reply || "").match(/<emo>\s*([a-zA-Z]+)\s*<\/emo>/i);
      if (m) { emotion = m[1].toLowerCase(); reply = reply.replace(m[0], "").trim(); }
      // extrai ação <act>{json}</act>
      let action = null;
      const am = (reply || "").match(/<act>\s*([\s\S]*?)\s*<\/act>/i);
      if (am) {
        try { action = JSON.parse(am[1]); } catch (e) { action = null; }
        reply = reply.replace(am[0], "").trim();
      }
      json(res, 200, { reply: reply || "", emotion, action });
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
  // v0.4: em modo public este endpoint expõe persona+base (o "prompt"); exige token.
  if (IS_PUBLIC) {
    const bearer = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    let qtoken = "";
    try { qtoken = new URL(req.url, "http://local").searchParams.get("token") || ""; } catch (e) {}
    const token = bearer || qtoken;
    if (!GOVERNANCE_TOKEN || token !== GOVERNANCE_TOKEN) {
      return json(res, 401, { error: "unauthorized", hint: "defina GOVERNANCE_TOKEN e envie Authorization: Bearer <token>" });
    }
  }
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
  res._cors = corsFor(req); // v0.4: CORS calculado por requisição (aberto no internal, lista no public)
  if (req.method === "OPTIONS") return send(res, 204, ""); // preflight CORS (extensão)
  if (!checkBasicAuth(req, res)) return; // trava de senha (protege tudo quando configurada)
  if (req.method === "POST" && req.url === "/api/chat") return handleChat(req, res);
  if (req.method === "GET" && req.url.split("?")[0] === "/api/governance") return handleGovernance(req, res);
  if (req.method === "GET") return serveStatic(req, res);
  send(res, 405, "Method not allowed");
});

server.listen(PORT, () => {
  const model = LLM_PROVIDER === "gemini" ? GEMINI_MODEL : LLM_MODEL;
  const hasKey = LLM_PROVIDER === "gemini" ? !!GEMINI_API_KEY : !!LLM_API_KEY;
  console.log(`\n🐈  Mintzie rodando em  http://localhost:${PORT}`);
  console.log(`    Modo: ${MODE.toUpperCase()}  |  Provider: ${LLM_PROVIDER}  |  Modelo: ${model}`);
  console.log(`    ─────────────────────────────────────────`);
  if (IS_PUBLIC) {
    console.log(`    Site (público) ....... http://localhost:${PORT}/site`);
    console.log(`    Painel/governança .... bloqueados neste modo (use MINTZIE_MODE=internal)`);
    console.log(`    CORS ................. ${ALLOWED_ORIGINS.join(", ") || "(nenhuma origem externa)"}`);
    console.log(`    Rate limit ........... ${RATE_PER_MIN}/min · ${RATE_PER_DAY}/dia por IP`);
    if (!GOVERNANCE_TOKEN) console.log(`    ⚠️  /api/governance sem GOVERNANCE_TOKEN — ficará inacessível (401).`);
    console.log(`    Prompt override ...... desligado (fixo em modo public)`);
  } else {
    console.log(`    Início (hub) ......... http://localhost:${PORT}/inicio`);
    console.log(`    Site (público) ....... http://localhost:${PORT}/site`);
    console.log(`    Painel imersão 🔒 .... http://localhost:${PORT}/painel`);
    console.log(`    Governança 🔒 ........ http://localhost:${PORT}/governanca`);
    console.log(`    ⚠️  Modo INTERNAL: conteúdo interno carregado. Nunca exponha esta instância à internet.`);
  }
  console.log(`    ─────────────────────────────────────────`);
  if (!hasKey) console.log("    ⚠️  Sem chave de modelo — configure o .env (veja .env.example)\n");
  else console.log("");
});
