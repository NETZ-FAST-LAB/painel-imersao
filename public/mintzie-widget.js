/* ============================================================
   Mintzie — assistente felino da NETZ (widget de site)
   Auto-contido: injeta o próprio CSS e DOM.

   Layout: cabeçalho · mensagens (topo) · vídeo do gato (abaixo) · input (rodapé)
   O fundo branco do vídeo é removido AO VIVO num canvas (white-key).
   Transição entre estados com efeito de GLITCH.

   Embed: <script src="mintzie-widget.js"></script>
   Config opcional via window.MINTZIE_CONFIG antes do script.
   ============================================================ */
(function () {
  "use strict";

  const CFG = Object.assign(
    {
      apiUrl: "/api/chat",
      assetBase: "",
      startOpen: true,
      removeBg: true,
      keySimilarity: 84,
      keySmoothness: 28,
      glitchMs: 460,           // duração do glitch na troca de estado
      loopGlitch: true,        // glitch no ponto de emenda do loop (disfarça o "pulo")
      randomGlitch: false,     // (opcional) micro-glitches aleatórios no meio do vídeo
      randomGlitchMinMs: 2600, // intervalo mínimo entre micro-glitches
      randomGlitchMaxMs: 8000, // intervalo máximo
      greeting:
        "Miau. Sou o Mintzie, guardião do laboratório da NETZ. " +
        "O que te trouxe aqui?",
    },
    window.MINTZIE_CONFIG || {}
  );

  let autoBase = "";
  try {
    const s = (document.currentScript && document.currentScript.src) || "";
    if (s) autoBase = s.replace(/\/[^\/]*$/, "");
  } catch (e) {}
  const BASE = (CFG.assetBase || autoBase).replace(/\/$/, "");
  const prefix = BASE ? BASE + "/" : "";

  const STATES = {
    idle: prefix + "videos/mintzie-idle.mp4",
    thinking: prefix + "videos/mintzie-thinking.mp4",
    talking: prefix + "videos/mintzie-talking.mp4",
  };

  /* ---------- estilos ---------- */
  const CSS = `
  .mz-root{position:fixed;right:24px;bottom:24px;z-index:2147483000;
    font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
  .mz-launcher{width:64px;height:64px;border-radius:50%;border:2px solid rgba(150,230,90,.55);
    cursor:pointer;overflow:hidden;background:#0c1620;box-shadow:0 12px 34px rgba(0,0,0,.4);
    padding:0;display:grid;place-items:center;transition:transform .18s ease;}
  .mz-launcher:hover{transform:translateY(-2px) scale(1.05);}
  .mz-launcher canvas{width:100%;height:100%;object-fit:cover;}

  .mz-panel{position:absolute;right:0;bottom:0;width:384px;max-width:calc(100vw - 32px);
    height:620px;max-height:calc(100vh - 48px);border-radius:22px;overflow:hidden;
    background:linear-gradient(180deg,#0b1620,#0a121b);
    border:1px solid rgba(150,230,90,.16);
    box-shadow:0 28px 70px rgba(0,0,0,.5);display:none;flex-direction:column;
    opacity:0;transform:translateY(14px) scale(.985);transition:opacity .22s ease,transform .22s ease;}
  .mz-root.mz-open .mz-panel{display:flex;opacity:1;transform:none;}
  .mz-root.mz-open .mz-launcher{display:none;}

  /* cabeçalho */
  .mz-header{flex:0 0 auto;display:flex;align-items:center;gap:9px;padding:13px 16px;
    border-bottom:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);}
  .mz-dot{width:8px;height:8px;border-radius:50%;background:#9be65a;box-shadow:0 0 10px #9be65a;
    animation:mzpulse 2.4s ease-in-out infinite;}
  @keyframes mzpulse{0%,100%{opacity:1}50%{opacity:.45}}
  .mz-title{font-weight:600;font-size:14px;color:#eaf7d8;letter-spacing:.01em;}
  .mz-sub{font-size:11px;color:#7e93a5;margin-left:2px;}
  .mz-close{margin-left:auto;width:30px;height:30px;border-radius:50%;border:none;
    background:rgba(255,255,255,.05);color:#c9dcef;cursor:pointer;font-size:15px;
    display:grid;place-items:center;transition:background .15s;}
  .mz-close:hover{background:rgba(255,255,255,.12);}

  /* mensagens (topo) */
  .mz-log{flex:1 1 auto;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:9px;}
  .mz-msg{max-width:86%;padding:9px 13px;border-radius:15px;font-size:13.5px;line-height:1.42;
    white-space:pre-wrap;word-wrap:break-word;animation:mzin .22s ease;}
  @keyframes mzin{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  .mz-msg.mz-bot{align-self:flex-start;background:#15242f;color:#e7f1ea;border-bottom-left-radius:5px;}
  .mz-msg.mz-user{align-self:flex-end;background:#9be65a;color:#0a1a06;border-bottom-right-radius:5px;font-weight:500;}
  .mz-typing{align-self:flex-start;display:flex;gap:4px;padding:11px 14px;background:#15242f;border-radius:15px;}
  .mz-typing span{width:7px;height:7px;border-radius:50%;background:#7f93a5;animation:mzb 1s infinite;}
  .mz-typing span:nth-child(2){animation-delay:.15s;} .mz-typing span:nth-child(3){animation-delay:.3s;}
  @keyframes mzb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}

  /* sugestões (chips) */
  .mz-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;}
  .mz-chip{font-size:12px;color:#cde6ad;background:rgba(150,230,90,.1);border:1px solid rgba(150,230,90,.25);
    border-radius:999px;padding:6px 11px;cursor:pointer;transition:background .15s,transform .1s;}
  .mz-chip:hover{background:rgba(150,230,90,.2);transform:translateY(-1px);}

  /* palco do vídeo (abaixo das mensagens) */
  .mz-stage{flex:0 0 auto;position:relative;height:184px;overflow:hidden;
    background:radial-gradient(circle at 50% 120%, rgba(150,230,90,.18), transparent 62%),
    linear-gradient(180deg,#0a121b,#0c1722);
    border-top:1px solid rgba(255,255,255,.05);}
  .mz-canvas{position:absolute;inset:0;width:100%;height:100%;
    object-fit:contain;object-position:center bottom;}
  .mz-src{position:absolute;width:2px;height:2px;left:-9999px;top:-9999px;opacity:0;pointer-events:none;}

  /* input (rodapé) */
  .mz-input{flex:0 0 auto;display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.06);
    background:#0b1722;}
  .mz-input textarea{flex:1;resize:none;border:1px solid rgba(150,230,90,.2);border-radius:13px;
    background:#0e1b26;color:#eaf2f8;padding:10px 13px;font-size:14px;font-family:inherit;max-height:90px;line-height:1.4;}
  .mz-input textarea:focus{outline:none;border-color:rgba(150,230,90,.55);}
  .mz-input textarea::placeholder{color:#5f7488;}
  .mz-send{border:none;border-radius:13px;background:#9be65a;color:#0a1a06;font-weight:700;
    padding:0 16px;cursor:pointer;font-size:14px;transition:filter .15s;}
  .mz-send:hover{filter:brightness(1.05);} .mz-send:disabled{opacity:.5;cursor:not-allowed;}
  .mz-log::-webkit-scrollbar{width:7px;} .mz-log::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:7px;}
  `;

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const root = el(`
    <div class="mz-root">
      <button class="mz-launcher" aria-label="Abrir chat com o Mintzie">
        <canvas class="mz-launcher-canvas" width="128" height="128"></canvas>
      </button>
      <div class="mz-panel" role="dialog" aria-label="Mintzie - assistente da NETZ">
        <div class="mz-header">
          <span class="mz-dot"></span>
          <span class="mz-title">Mintzie</span>
          <span class="mz-sub">· guardião do laboratório</span>
          <button class="mz-close" aria-label="Fechar">✕</button>
        </div>
        <div class="mz-log"></div>
        <div class="mz-chips"></div>
        <div class="mz-stage">
          <canvas class="mz-canvas" width="480" height="270"></canvas>
          <video class="mz-src" data-state="idle" src="${STATES.idle}" muted loop playsinline preload="auto" crossorigin="anonymous"></video>
          <video class="mz-src" data-state="thinking" src="${STATES.thinking}" muted loop playsinline preload="auto" crossorigin="anonymous"></video>
          <video class="mz-src" data-state="talking" src="${STATES.talking}" muted loop playsinline preload="auto" crossorigin="anonymous"></video>
        </div>
        <div class="mz-input">
          <textarea rows="1" placeholder="Escreva pro Mintzie..." aria-label="Mensagem"></textarea>
          <button class="mz-send">Enviar</button>
        </div>
      </div>
    </div>
  `);
  document.body.appendChild(root);

  const launcher = root.querySelector(".mz-launcher");
  const launcherCanvas = root.querySelector(".mz-launcher-canvas");
  const closeBtn = root.querySelector(".mz-close");
  const stageCanvas = root.querySelector(".mz-canvas");
  const log = root.querySelector(".mz-log");
  const chipsBox = root.querySelector(".mz-chips");
  const input = root.querySelector(".mz-input textarea");
  const sendBtn = root.querySelector(".mz-send");
  const vids = {};
  root.querySelectorAll(".mz-src").forEach((v) => (vids[v.dataset.state] = v));

  /* ---------- white-key + glitch + render ---------- */
  const W = 480, H = 270;
  const work = document.createElement("canvas"); work.width = W; work.height = H;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  const tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H;
  const tctx = tmp.getContext("2d");
  const sctx = stageCanvas.getContext("2d");
  const lctx = launcherCanvas.getContext("2d");

  let current = "idle";
  let talkTimer = null;
  let glitchUntil = 0;
  const rand = (a, b) => a + Math.random() * (b - a);
  let nextRandomGlitch = performance.now() + rand(CFG.randomGlitchMinMs, CFG.randomGlitchMaxMs);
  let lastVideoTime = 0; // p/ detectar quando o vídeo volta ao início (loop)

  function keyFrame(v) {
    wctx.drawImage(v, 0, 0, W, H);
    const frame = wctx.getImageData(0, 0, W, H);
    if (!CFG.removeBg) return frame;
    const d = frame.data;
    const sim = CFG.keySimilarity;
    const smooth = Math.max(CFG.keySmoothness, 1);
    for (let i = 0; i < d.length; i += 4) {
      const dr = 255 - d[i], dg = 255 - d[i + 1], db = 255 - d[i + 2];
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < sim) d[i + 3] = 0;
      else if (dist < sim + smooth) d[i + 3] = ((dist - sim) / smooth) * 255;
    }
    return frame;
  }

  // glitch: deslocamento de fatias + ghost verde + ruído, intensidade decai
  function applyGlitch(intensity) {
    tctx.clearRect(0, 0, W, H);
    tctx.drawImage(stageCanvas, 0, 0);            // snapshot do frame recortado
    sctx.clearRect(0, 0, W, H);
    // ghost verde com deslocamento (aberração)
    sctx.globalCompositeOperation = "lighter";
    sctx.globalAlpha = 0.35 * intensity;
    sctx.drawImage(tmp, -6 * intensity, 0);
    sctx.fillStyle = "rgba(150,230,90,1)";
    sctx.globalAlpha = 0.10 * intensity;
    sctx.fillRect(0, 0, W, H);
    sctx.globalCompositeOperation = "source-over";
    sctx.globalAlpha = 1;
    // base + fatias horizontais deslocadas
    sctx.drawImage(tmp, 0, 0);
    const slices = 4 + Math.floor(Math.random() * 5);
    for (let k = 0; k < slices; k++) {
      const y = Math.random() * H;
      const h = 4 + Math.random() * 26;
      const dx = (Math.random() - 0.5) * 60 * intensity;
      sctx.clearRect(0, y, W, h);
      sctx.drawImage(tmp, 0, y, W, h, dx, y, W, h);
    }
    // linhas de scanline aleatórias
    sctx.globalAlpha = 0.5 * intensity;
    sctx.fillStyle = "rgba(220,255,200,0.9)";
    for (let k = 0; k < 2; k++) {
      sctx.fillRect(0, Math.random() * H, W, 1);
    }
    sctx.globalAlpha = 1;
  }

  function render() {
    const v = vids[current];
    if (v && v.readyState >= 2 && v.videoWidth > 0) {
      const frame = keyFrame(v);
      sctx.clearRect(0, 0, W, H);
      sctx.putImageData(frame, 0, 0);
      const now = performance.now();
      // glitch no ponto de emenda do loop: o vídeo voltou ao início
      if (CFG.loopGlitch && v.currentTime + 0.05 < lastVideoTime && now >= glitchUntil) {
        glitchUntil = now + rand(150, 260);
      }
      lastVideoTime = v.currentTime;
      // (opcional) micro-glitch aleatório no meio do vídeo
      if (CFG.randomGlitch && now >= nextRandomGlitch) {
        if (now >= glitchUntil) glitchUntil = now + rand(110, 230);
        nextRandomGlitch = now + rand(CFG.randomGlitchMinMs, CFG.randomGlitchMaxMs);
      }
      if (now < glitchUntil) {
        const intensity = (glitchUntil - now) / CFG.glitchMs; // 1 -> 0
        applyGlitch(Math.max(0.15, intensity));
      }
      // mini-render no launcher
      lctx.clearRect(0, 0, 128, 128);
      lctx.drawImage(stageCanvas, 120, 10, 240, 240, 0, 0, 128, 128);
    }
    requestAnimationFrame(render);
  }

  function setState(name) {
    if (!vids[name] || name === current) return;
    clearTimeout(talkTimer);
    current = name;
    glitchUntil = performance.now() + CFG.glitchMs;  // dispara o glitch
    lastVideoTime = 0;
    const v = vids[name];
    try { v.currentTime = 0; v.play(); } catch (e) {}
  }

  /* ---------- abrir / fechar ---------- */
  function open() {
    root.classList.add("mz-open");
    Object.values(vids).forEach((v) => v.play().catch(() => {}));
    setTimeout(() => input.focus(), 200);
  }
  function close() { root.classList.remove("mz-open"); }
  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  /* ---------- chat ---------- */
  const history = [];

  function addMsg(text, who) {
    const m = el(`<div class="mz-msg mz-${who}"></div>`);
    m.textContent = text;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  function showTyping() {
    const t = el(`<div class="mz-typing"><span></span><span></span><span></span></div>`);
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }
  function typeInto(node, text, done) {
    let i = 0; node.textContent = "";
    const step = () => {
      node.textContent = text.slice(0, i);
      log.scrollTop = log.scrollHeight;
      i++;
      if (i <= text.length) talkTimer = setTimeout(step, 16);
      else if (done) done();
    };
    step();
  }

  // chips de sugestão (some após o primeiro envio)
  const SUGGESTIONS = (CFG.suggestions || [
    "O que a Netz faz?",
    "Vocês trabalham com IA?",
    "Quero ver cases",
    "Como começo um projeto?",
  ]);
  function renderChips() {
    chipsBox.innerHTML = "";
    SUGGESTIONS.forEach((s) => {
      const c = el(`<button class="mz-chip"></button>`);
      c.textContent = s;
      c.addEventListener("click", () => { input.value = s; send(); });
      chipsBox.appendChild(c);
    });
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = ""; autosize();
    chipsBox.innerHTML = "";
    addMsg(text, "user");
    history.push({ role: "user", content: text });

    sendBtn.disabled = true;
    setState("thinking");
    const typing = showTyping();

    try {
      const res = await fetch(CFG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.detail) console.warn("[Mintzie] detalhe do erro:", data.detail);
      const reply = (data.reply || "").trim() ||
        "Tive um lapso indigno de um gato do meu calibre. Repete pra mim?";
      typing.remove();
      history.push({ role: "assistant", content: reply });
      setState("talking");
      const node = addMsg("", "bot");
      typeInto(node, reply, () => { talkTimer = setTimeout(() => setState("idle"), 800); });
    } catch (err) {
      typing.remove();
      setState("talking");
      const node = addMsg("", "bot");
      typeInto(node,
        "Hm. Não falei com meu cérebro agora. Confere se o servidor (node server.js) está de pé e tenta de novo.",
        () => { talkTimer = setTimeout(() => setState("idle"), 800); });
      console.error("[Mintzie]", err);
    } finally {
      sendBtn.disabled = false; input.focus();
    }
  }

  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 90) + "px";
  }
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener("click", send);

  /* ---------- start ---------- */
  vids.idle.play().catch(() => {});
  render();
  addMsg(CFG.greeting, "bot");
  renderChips();
  if (CFG.startOpen) open();
})();
