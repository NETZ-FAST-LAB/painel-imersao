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
      removeBg: false,         // vídeos já vêm com fundo cinza escuro (#202225); sem keying
      keySimilarity: 84,
      keySmoothness: 28,
      glitchMs: 460,           // duração do glitch na troca de estado
      loopGlitch: true,        // glitch no ponto de emenda do loop (disfarça o "pulo")
      randomGlitch: false,     // (opcional) micro-glitches aleatórios no meio do vídeo
      randomGlitchMinMs: 2600, // intervalo mínimo entre micro-glitches
      randomGlitchMaxMs: 8000, // intervalo máximo
      grabInteraction: true,   // Mintzie "agarra" o cursor no hover do palco
      grabState: "thinking",   // pose usada ao agarrar (troque por 'grab' quando houver o vídeo)
      afterGrabState: "idle",  // estado do gato depois que o cursor sai do quadro
      sound: true,             // banco de sons (ronronado + miados)
      soundVolume: 0.5,        // volume mestre (0-1)
      video: true,             // false = modo sem vídeo (avatar SVG); auto-cai pra SVG se o vídeo não carregar (ex.: CSP)
      videoTimeoutMs: 3500,    // tempo p/ decidir que o vídeo não vai carregar
      greetOnOpen: true,       // acena (greeting) ao abrir o chat
      sleepAfterMs: 30000,     // sem atividade por X ms -> dorme (antes disso, variações de ocioso)
      routes: {},              // rotas do site p/ navegação multi-página (ex.: {contato:"/pt/contato/"}); só mesmo domínio
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
  const SKEY = "mintzie_chat_v1"; // memória da conversa entre páginas (mesma aba)
  // avatar em SVG (usado no modo sem vídeo — funciona mesmo com CSP bloqueando mídia)
  const CAT_SVG = '<svg class="mz-catsvg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M24 42 L18 13 L45 34 Z" fill="#9be65a"/><path d="M76 42 L82 13 L55 34 Z" fill="#9be65a"/>' +
    '<ellipse cx="50" cy="57" rx="31" ry="28" fill="#9be65a"/>' +
    '<circle cx="39" cy="54" r="4.5" fill="#0a1a06"/><circle cx="61" cy="54" r="4.5" fill="#0a1a06"/>' +
    '<path d="M46 64 L54 64 L50 69 Z" fill="#0a1a06"/>' +
    '<path d="M30 60 L14 57 M30 65 L15 66 M70 60 L86 57 M70 65 L85 66" stroke="#5aa62e" stroke-width="1.5"/></svg>';

  const STATES = {
    idle: prefix + "videos/mintzie-idle.mp4",
    thinking: prefix + "videos/mintzie-thinking.mp4",
    talking: prefix + "videos/mintzie-talking.mp4",
    greeting: prefix + "videos/mintzie-greeting.mp4",  // acena ao abrir
    listening: prefix + "videos/mintzie-listening.mp4",// atento enquanto digita
    sleeping: prefix + "videos/mintzie-sleeping.mp4",  // dorme quando ocioso
    happy: prefix + "videos/mintzie-happy.mp4",        // resposta calorosa
    pointing: prefix + "videos/mintzie-pointing.mp4",  // convida / próximo passo
    confused: prefix + "videos/mintzie-confused.mp4",  // não sabe
    celebrating: prefix + "videos/mintzie-celebrating.mp4", // visitante avança
    laughing: prefix + "videos/mintzie-laughing.mp4",  // piada / deboche
    surprised: prefix + "videos/mintzie-surprised.mp4",// reação de surpresa
    grooming: prefix + "videos/mintzie-grooming.mp4",  // variação de ocioso
    stretching: prefix + "videos/mintzie-stretching.mp4", // variação de ocioso
    coffee: prefix + "videos/mintzie-coffee.mp4",      // toma um café (ocioso)
    spin: prefix + "videos/mintzie-spin.mp4",          // gira na cadeira (ocioso)
    knock: prefix + "videos/mintzie-knock.mp4",        // derruba a xícara (ocioso travesso)
    scroll: prefix + "videos/mintzie-scroll.mp4",      // acompanha a rolagem
    exit: prefix + "videos/mintzie-exit.mp4",          // "não vai embora!" (exit intent)
    reading: prefix + "videos/mintzie-reading.mp4",    // lê enquanto você lê a resposta
    welcomeback: prefix + "videos/mintzie-welcomeback.mp4", // volta pra aba
    loaf: prefix + "videos/mintzie-loaf.mp4",          // posição de pão (ocioso)
    blep: prefix + "videos/mintzie-blep.mp4",          // línguinha de fora (ocioso)
    grab: prefix + "videos/mintzie-grab.mp4",          // brincadeira com cursor (pool)
    grab2: prefix + "videos/mintzie-grab2.mp4",
    grab3: prefix + "videos/mintzie-grab3.mp4",
    grab4: prefix + "videos/mintzie-grab4.mp4",
  };
  const GRAB_POOL = ["grab", "grab2", "grab3", "grab4"]; // variações sorteadas no hover

  /* ---------- estilos ---------- */
  const CSS = `
  .mz-root{position:fixed;right:24px;bottom:24px;z-index:2147483000;
    font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
  .mz-launcher{width:64px;height:64px;border-radius:50%;border:2px solid rgba(150,230,90,.55);
    cursor:pointer;overflow:hidden;background:#0c1620;box-shadow:0 12px 34px rgba(0,0,0,.4);
    padding:0;display:grid;place-items:center;transition:transform .18s ease;}
  .mz-launcher:hover{transform:translateY(-2px) scale(1.05);}
  .mz-launcher canvas{width:100%;height:100%;object-fit:cover;}
  .mz-catsvg{width:100%;height:100%;display:block;}
  .mz-launcher-fallback{display:none;width:100%;height:100%;padding:10px;place-items:center;background:#0c1620;}
  .mz-root.mz-novideo .mz-launcher-canvas{display:none;}
  .mz-root.mz-novideo .mz-launcher-fallback{display:grid;}
  .mz-root.mz-novideo .mz-stage{display:none;}
  .mz-header-avatar{display:none;width:24px;height:24px;flex:0 0 auto;}
  .mz-root.mz-novideo .mz-header-avatar{display:block;}
  .mz-root.mz-novideo .mz-fakecursor{display:none;}

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
  .mz-mute{margin-left:auto;width:30px;height:30px;border-radius:50%;border:none;
    background:rgba(255,255,255,.05);color:#cfe0f0;cursor:pointer;font-size:14px;
    display:grid;place-items:center;transition:background .15s;}
  .mz-mute:hover{background:rgba(255,255,255,.12);}
  .mz-close{margin-left:6px;width:30px;height:30px;border-radius:50%;border:none;
    background:rgba(255,255,255,.05);color:#c9dcef;cursor:pointer;font-size:15px;
    display:grid;place-items:center;transition:background .15s;}
  .mz-close:hover{background:rgba(255,255,255,.12);}
  .mz-split{margin-left:6px;width:30px;height:30px;border-radius:50%;border:none;
    background:rgba(255,255,255,.05);color:#c9dcef;cursor:pointer;font-size:14px;
    display:grid;place-items:center;transition:background .15s;}
  .mz-split:hover{background:rgba(255,255,255,.12);}
  .mz-root.mz-split .mz-split{background:rgba(155,230,90,.22);color:#bff780;}
  /* modo meia-tela: painel vira uma coluna fixa de tela cheia à direita */
  .mz-root.mz-split .mz-panel{position:fixed;top:0;right:0;bottom:0;left:auto;
    width:44vw;max-width:none;height:100vh;max-height:none;border-radius:0;
    transform:none;box-shadow:-18px 0 60px rgba(0,0,0,.5);}
  @media (max-width:720px){ .mz-root.mz-split .mz-panel{width:100vw;} }

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
    background:#202225;
    border-top:1px solid rgba(255,255,255,.05);}
  .mz-canvas{position:absolute;inset:0;width:100%;height:100%;
    object-fit:contain;object-position:center bottom;}
  .mz-src{position:absolute;width:2px;height:2px;left:-9999px;top:-9999px;opacity:0;pointer-events:none;}
  .mz-fakecursor{position:absolute;left:0;top:0;width:26px;height:26px;pointer-events:none;z-index:3;
    opacity:0;transition:opacity .12s ease;will-change:transform;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));}

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
  .mz-eye{display:none;border:none;border-radius:13px;background:rgba(255,255,255,.07);color:#cfe0f0;font-size:16px;padding:0 11px;cursor:pointer;}
  .mz-root.mz-has-eye .mz-eye{display:block;}
  .mz-eye.on{background:#9be65a;}
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
        <div class="mz-launcher-fallback">${CAT_SVG}</div>
      </button>
      <div class="mz-panel" role="dialog" aria-label="Mintzie - assistente da NETZ">
        <div class="mz-header">
          <span class="mz-header-avatar">${CAT_SVG}</span>
          <span class="mz-dot"></span>
          <span class="mz-title">Mintzie</span>
          <span class="mz-sub">· guardião do laboratório</span>
          <button class="mz-mute" aria-label="Som" title="Ligar/desligar som">🔊</button>
          <button class="mz-split" aria-label="Meia tela" title="Abrir em meia tela (lado a lado com a página)">◧</button>
          <button class="mz-close" aria-label="Minimizar" title="Minimizar">—</button>
        </div>
        <div class="mz-log"></div>
        <div class="mz-chips"></div>
        <div class="mz-stage">
          <canvas class="mz-canvas" width="480" height="270"></canvas>
          ${Object.keys(STATES).map((s) => `<video class="mz-src" data-state="${s}" src="${STATES[s]}" muted loop playsinline preload="auto" crossorigin="anonymous"></video>`).join("")}
        </div>
        <div class="mz-input">
          <button class="mz-eye" title="Deixar o Mintzie ver a tela na próxima mensagem" aria-label="Ver a tela">👁</button>
          <textarea rows="1" placeholder="Escreva pro Mintzie..." aria-label="Mensagem"></textarea>
          <button class="mz-send">Enviar</button>
        </div>
      </div>
    </div>
  `);
  document.body.appendChild(root);

  const launcher = root.querySelector(".mz-launcher");
  const launcherCanvas = root.querySelector(".mz-launcher-canvas");
  const panel = root.querySelector(".mz-panel");
  const closeBtn = root.querySelector(".mz-close");
  const splitBtn = root.querySelector(".mz-split");
  let prevBodyMR = "";   // margem original da página (restaurada ao sair da meia-tela)
  const muteBtn = root.querySelector(".mz-mute");
  const stageCanvas = root.querySelector(".mz-canvas");
  const log = root.querySelector(".mz-log");
  const chipsBox = root.querySelector(".mz-chips");
  const input = root.querySelector(".mz-input textarea");
  const sendBtn = root.querySelector(".mz-send");
  const eyeBtn = root.querySelector(".mz-eye");
  let lookNext = false; // "olhar a tela" na próxima mensagem
  if (typeof CFG.captureScreen === "function") {
    root.classList.add("mz-has-eye");
    eyeBtn.addEventListener("click", () => { lookNext = !lookNext; eyeBtn.classList.toggle("on", lookNext); });
  }
  const vids = {};
  root.querySelectorAll(".mz-src").forEach((v) => (vids[v.dataset.state] = v));

  // modo sem vídeo: por config, ou automático se o vídeo não carregar (ex.: CSP bloqueia mídia de outra origem)
  function enableNoVideo() { root.classList.add("mz-novideo"); }
  if (CFG.video === false) enableNoVideo();
  else {
    vids.idle.addEventListener("error", enableNoVideo);
    setTimeout(() => { if (!vids.idle || vids.idle.readyState < 2) enableNoVideo(); }, CFG.videoTimeoutMs || 3500);
  }

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
  let greetTimer = null;
  let idleTimer = null;
  let glitchUntil = 0;
  const rand = (a, b) => a + Math.random() * (b - a);
  let nextRandomGlitch = performance.now() + rand(CFG.randomGlitchMinMs, CFG.randomGlitchMaxMs);
  let lastVideoTime = 0; // p/ detectar quando o vídeo volta ao início (loop)

  // --- interação: o cursor "entra" no vídeo ---
  const stageEl = root.querySelector(".mz-stage");
  let grabbing = false, releaseUntil = 0, overlayOn = false;
  const CUR = document.createElement("div");
  CUR.className = "mz-fakecursor";
  CUR.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 3 L4 20 L9.2 14.8 L12.4 22 L15.6 20.6 L12.4 13.7 L19 13.7 Z" fill="#ffffff" stroke="#0a1206" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  stageEl.appendChild(CUR);
  const cur = { x: 0, y: 0 }, curT = { x: 0, y: 0 };
  function stageXY(e) {
    const r = stageEl.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function updateCursor() {
    // lag elástico: dá a sensação de o gato "batendo" no cursor
    const k = grabbing ? 0.26 : 0.5;
    cur.x += (curT.x - cur.x) * k;
    cur.y += (curT.y - cur.y) * k;
    CUR.style.transform = "translate(" + (cur.x - 4) + "px," + (cur.y - 3) + "px)";
  }

  /* ---------- banco de sons (arquivos de gato) ---------- */
  let muted = false;
  const VOL = { purr: 0.16, meow: 0.42, chirp: 0.34, glitch: 0.3, cry: 0.42 }; // volumes baixos
  const AUD = prefix + "audio/";
  const MEOWS = [1, 2, 3, 4, 5].map((n) => AUD + "mintzie-meow-" + n + ".mp3"); // rotação de miados
  const purrAudio = new Audio(AUD + "mintzie-purr.mp3");
  purrAudio.loop = true; purrAudio.preload = "auto";
  function playFile(url, vol) {
    if (muted || !CFG.sound) return;
    try { const a = new Audio(url); a.volume = vol * CFG.soundVolume; a.play().catch(() => {}); } catch (e) {}
  }
  function startPurr() {
    if (muted || !CFG.sound) return;
    purrAudio.volume = VOL.purr * CFG.soundVolume;
    purrAudio.play().catch(() => {});
  }
  function stopPurr() { try { purrAudio.pause(); } catch (e) {} }
  function meow(kind) { // 'meow' (atenção, sorteia entre os 5) | 'chirp' (resposta, curto)
    if (kind === "chirp") playFile(AUD + "mintzie-chirp.mp3", VOL.chirp);
    else playFile(MEOWS[Math.floor(Math.random() * MEOWS.length)], VOL.meow);
  }
  function glitchSound() { playFile(AUD + "mintzie-glitch.mp3", VOL.glitch); }
  function cry() { playFile(AUD + "mintzie-cry.mp3", VOL.cry); } // "não vai embora!" (exit)
  function applyMute(m) {
    muted = m;
    muteBtn.textContent = m ? "🔇" : "🔊";
    if (m) stopPurr(); else if (root.classList.contains("mz-open")) startPurr();
  }
  muteBtn.addEventListener("click", () => applyMute(!muted));

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
      if ((grabbing || now < releaseUntil) && overlayOn) updateCursor();
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

  /* ---------- ocioso: variações -> dorme / desperta ---------- */
  const IDLE_VARIATIONS = ["grooming", "stretching", "coffee", "spin", "knock", "loaf", "blep"];
  // pode interromper com reações leves só quando está "à toa"
  function canInterrupt() { return current === "idle" || IDLE_VARIATIONS.includes(current); }
  function reactOnce(state, backMs) {
    if (!(vids[state] && vids[state].readyState >= 2)) return;
    if (current === "sleeping") wake();
    if (!canInterrupt()) return;
    setState(state);
    setTimeout(() => { if (current === state) setState("idle"); }, backMs || 4200);
  }
  let lastActivity = performance.now();
  function wake() {
    if (current === "sleeping") { glitchUntil = performance.now() + 300; glitchSound(); setState("idle"); }
  }
  function bump() { lastActivity = performance.now(); wake(); }
  function goListening() {
    if (current === "sleeping") wake();
    if (current === "idle" && vids.listening && vids.listening.readyState >= 2) setState("listening");
  }
  function idleTick() {
    if (!root.classList.contains("mz-open") || current !== "idle") return;
    const idleFor = performance.now() - lastActivity;
    if (idleFor > CFG.sleepAfterMs && vids.sleeping && vids.sleeping.readyState >= 2) {
      setState("sleeping");
    } else if (idleFor > 7000 && Math.random() < 0.4) {
      const pool = IDLE_VARIATIONS.filter((k) => vids[k] && vids[k].readyState >= 2);
      if (pool.length) {
        const v = pool[Math.floor(Math.random() * pool.length)];
        setState(v);
        setTimeout(() => { if (current === v) setState("idle"); }, 4600);
      }
    }
  }
  setInterval(idleTick, 3000);

  /* ---------- abrir / fechar ---------- */
  function open() {
    root.classList.add("mz-open");
    Object.values(vids).forEach((v) => v.play().catch(() => {}));
    if (!muted) { startPurr(); setTimeout(() => meow("meow"), 250); } // ronrona + miado de atenção
    if (CFG.greetOnOpen && vids.greeting) {          // acena, depois volta pro idle
      setState("greeting");
      clearTimeout(greetTimer);
      greetTimer = setTimeout(() => { if (current === "greeting") setState("idle"); }, 4200);
    }
    lastActivity = performance.now();
    saveState();
    setTimeout(() => input.focus(), 200);
  }
  // minimizar: recolhe para o launcher (a conversa fica salva), e sai da meia-tela se estiver nela
  function close() { root.classList.remove("mz-open"); if (root.classList.contains("mz-split")) applySplit(false); stopPurr(); saveState(); }
  // meia-tela: o painel vira uma coluna fixa à direita e a página é empurrada para a esquerda
  function applySplit(on) {
    root.classList.toggle("mz-split", on);
    if (on) {
      if (!root.classList.contains("mz-open")) open();
      prevBodyMR = document.body.style.marginRight;
      document.body.style.transition = "margin-right .25s ease";
      const w = getComputedStyle(panel).width;              // largura real do painel (44vw, ou 100vw no mobile)
      document.body.style.marginRight = w;
    } else {
      document.body.style.marginRight = prevBodyMR || "";
    }
  }
  function toggleSplit() { applySplit(!root.classList.contains("mz-split")); saveState(); }
  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  splitBtn.addEventListener("click", toggleSplit);

  /* ---------- gatilhos: digitar (listening) e atividade (acorda) ---------- */
  input.addEventListener("focus", goListening);
  input.addEventListener("blur", () => { if (current === "listening") setState("idle"); });
  panel.addEventListener("mousemove", bump);

  /* ---------- reações a ações do usuário (scroll / exit / volta) ---------- */
  let scrollTimer = null, exitCooldown = 0;
  window.addEventListener("scroll", () => {
    bump();
    if (!root.classList.contains("mz-open")) return;
    if (canInterrupt() && vids.scroll && vids.scroll.readyState >= 2) {
      if (current !== "scroll") setState("scroll");
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { if (current === "scroll") setState("idle"); }, 1400);
    }
  }, { passive: true });
  document.addEventListener("mouseout", (e) => {           // exit intent (mouse sai por cima)
    if (e.clientY > 0 || e.relatedTarget) return;
    if (!root.classList.contains("mz-open")) return;
    const now = performance.now();
    if (now < exitCooldown) return;
    if (!canInterrupt()) return;
    exitCooldown = now + 8000;
    reactOnce("exit", 4500);
    cry();                                   // choro "não vai embora!"
  });
  document.addEventListener("visibilitychange", () => {    // voltou pra aba
    if (document.hidden || !root.classList.contains("mz-open")) return;
    if (current === "sleeping") wake();
    if (canInterrupt() && vids.welcomeback && vids.welcomeback.readyState >= 2) {
      reactOnce("welcomeback", 3500);
      if (!muted) meow("meow");
    }
  });

  /* ---------- hover: Mintzie agarra o cursor ---------- */
  if (CFG.grabInteraction) {
    stageEl.addEventListener("mouseenter", (e) => {
      if (current !== "idle") return;             // não interrompe pensar/falar
      grabbing = true; releaseUntil = 0;
      stageEl.style.cursor = "none";              // some o cursor do sistema
      const p = stageXY(e); cur.x = curT.x = p.x; cur.y = curT.y = p.y;
      CUR.style.transform = "translate(" + (p.x - 4) + "px," + (p.y - 3) + "px)";
      const pool = GRAB_POOL.filter((k) => vids[k] && vids[k].readyState >= 2);
      const gs = pool.length ? pool[Math.floor(Math.random() * pool.length)] : CFG.grabState;
      overlayOn = (pool.length === 0);             // vídeos de grab já têm cursor embutido
      CUR.style.opacity = overlayOn ? "1" : "0";
      setState(gs);
    });
    stageEl.addEventListener("mousemove", (e) => {
      if (!grabbing) return;
      const p = stageXY(e); curT.x = p.x; curT.y = p.y;
    });
    stageEl.addEventListener("mouseleave", () => {
      if (!grabbing) return;
      grabbing = false; overlayOn = false; releaseUntil = performance.now() + 380;
      CUR.style.opacity = "0";                     // cursor "volta" pra tela da pessoa
      stageEl.style.cursor = "";
      glitchUntil = performance.now() + 320;       // glitch ao sair do quadro
      glitchSound();                               // som do glitch
      setState(CFG.afterGrabState || "idle");      // muda o estado do gato
    });
  }

  /* ---------- chat ---------- */
  const history = [];

  function addMsg(text, who) {
    const m = el(`<div class="mz-msg mz-${who}"></div>`);
    m.textContent = text;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  // persiste a conversa na aba (sobrevive à troca de página)
  function saveState() {
    try { sessionStorage.setItem(SKEY, JSON.stringify({ history, open: root.classList.contains("mz-open"), split: root.classList.contains("mz-split") })); } catch (e) {}
  }
  // markdown leve (rede de segurança p/ negrito/listas que o LLM às vezes solta)
  function mdLite(t) {
    const esc = String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|\n)\s*[-*]\s+/g, "$1• ")
      .replace(/\n/g, "<br>");
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

  // --- helpers p/ ações genéricas de página (estilo page-agent) ---
  function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && el.offsetParent !== null; }
  function elText(el) { return (el.innerText || el.value || el.getAttribute("aria-label") || el.getAttribute("title") || el.getAttribute("placeholder") || el.getAttribute("name") || "").trim(); }
  function findClickable(text) {
    const t = (text || "").toLowerCase().trim(); if (!t) return null;
    const cands = [...document.querySelectorAll('a,button,[role="button"],input[type="submit"],input[type="button"],summary,[onclick]')].filter(isVisible);
    return cands.find((el) => elText(el).toLowerCase().includes(t)) || null;
  }
  function findField(label) {
    const t = (label || "").toLowerCase().trim(); if (!t) return null;
    const cands = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]),textarea,select,[contenteditable="true"]')].filter(isVisible);
    return cands.find((el) => {
      const bits = [el.getAttribute("placeholder"), el.getAttribute("aria-label"), el.getAttribute("name"), el.id, el.getAttribute("title")];
      if (el.labels && el.labels[0]) bits.push(el.labels[0].innerText);
      return bits.some((b) => b && b.toLowerCase().includes(t));
    }) || null;
  }
  const RISKY = /enviar|send|submit|pagar|\bpay\b|comprar|\bbuy\b|transferir|transfer|excluir|delete|remover|apagar/i;
  function flashEl(el) { try { const p = el.style.outline; el.style.outline = "2px solid #9be65a"; el.style.outlineOffset = "2px"; setTimeout(() => { el.style.outline = p; el.style.outlineOffset = ""; }, 1300); } catch (e) {} }
  function setFieldValue(el, val) {
    if (el.isContentEditable) el.textContent = val; else el.value = val;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    flashEl(el);
  }

  // serializa os elementos interativos da página (o LLM mira por índice) — núcleo do page-agent
  let pageEls = [];
  function serializePage() {
    const sel = 'a[href],button,[role="button"],input:not([type="hidden"]),textarea,select,[contenteditable="true"],[onclick],[role="link"],[role="textbox"],[role="checkbox"],[role="tab"],[role="menuitem"]';
    pageEls = [...document.querySelectorAll(sel)].filter(isVisible).slice(0, 60);
    return pageEls.map((el, i) => {
      const tag = (el.getAttribute("role") || el.tagName).toLowerCase();
      const type = el.getAttribute("type");
      const isInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      // NUNCA envia o valor digitado (senha/texto sensível) — só rótulo/placeholder/nome
      const label = (el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.getAttribute("title") ||
        (isInput ? (el.getAttribute("name") || "") : el.innerText) || "").replace(/\s+/g, " ").trim().slice(0, 60);
      return { i: i, tag: type ? tag + ":" + type : tag, x: label };
    });
  }

  // executor de ações na página
  function runAction(action) {
    if (!action) return;
    if (Array.isArray(action)) {                 // várias ações (ex.: preencher vários campos)
      action.forEach((a, k) => setTimeout(() => runAction(a), k * 220));
      return;
    }
    if (action.type === "screenshot") return;    // tratado no fluxo de resposta (deliver), aqui é no-op
    if (!action.type) return;
    try {
      if (action.type === "scrollTo" || action.type === "navigate") {
        const allowed = ["cases", "contato", "hero", "case-corsan", "case-cris", "case-bss"];
        if (!allowed.includes(action.target)) return;
        const el = document.getElementById(action.target);
        if (el) {                                    // seção está nesta página -> rola até ela
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.remove("mz-flash"); void el.offsetWidth; el.classList.add("mz-flash");
        } else {                                     // não está aqui -> navega por rota (mesmo domínio)
          const url = (CFG.routes || {})[action.target];
          if (url) { try { const u = new URL(url, location.href); if (u.origin === location.origin) location.href = u.href; } catch (e) {} }
        }
      } else if (action.type === "prefillContact") {
        if (!document.getElementById("f-nome")) {        // form não está nesta página -> guarda e navega
          try { sessionStorage.setItem("mintzie_prefill", JSON.stringify(action)); } catch (e) {}
          const url = (CFG.routes || {}).contato;
          if (url) { try { const u = new URL(url, location.href); if (u.origin === location.origin) location.href = u.href; } catch (e) {} }
          return;
        }
        const contato = document.getElementById("contato");
        if (contato) contato.scrollIntoView({ behavior: "smooth", block: "start" });
        const fields = { nome: "f-nome", empresa: "f-empresa", desafio: "f-desafio" };
        Object.keys(fields).forEach((k) => {
          const val = action[k];
          if (val == null || val === "") return;
          const inp = document.getElementById(fields[k]);
          if (!inp) return;
          inp.value = val;
          const lbl = inp.closest("label"); if (lbl) lbl.classList.add("field-lit");
        });
      } else if (action.type === "click") {                    // clicar num botão/link por texto
        const el = findClickable(action.text || action.label || "");
        if (!el) return;
        if (RISKY.test(elText(el)) && action.confirmed !== true) { flashEl(el); return; } // ação de risco: exige confirmação
        flashEl(el); el.click();
      } else if (action.type === "fill") {                     // preencher um campo por rótulo
        const el = findField(action.field || action.label || "");
        if (el && action.value != null) setFieldValue(el, String(action.value));
      } else if (action.type === "scrollPage") {               // rolar a página
        const to = action.to || action.direction || "down";
        if (to === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (to === "bottom") window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        else window.scrollBy({ top: (to === "up" ? -1 : 1) * window.innerHeight * 0.85, behavior: "smooth" });
      } else if (action.type === "clickIndex") {               // clicar por índice do DOM serializado
        const el = pageEls[action.i];
        if (!el) return;
        if (RISKY.test(elText(el)) && action.confirmed !== true) { flashEl(el); return; }
        flashEl(el); el.click();
      } else if (action.type === "fillIndex") {                // preencher por índice
        const el = pageEls[action.i];
        if (el && action.value != null) setFieldValue(el, String(action.value));
      } else if (action.type === "scrollToId") {               // navegar até uma seção por id (painel da imersão)
        // se a página oferecer um roteador (ex.: painel troca de aba antes de rolar), usa ele
        if (window.MZ_NAV && typeof window.MZ_NAV.goto === "function") { window.MZ_NAV.goto(action.id); return; }
        const el = document.getElementById(String(action.id || ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          if (el.classList) { el.classList.remove("mz-flash"); void el.offsetWidth; el.classList.add("mz-flash"); }
          flashEl(el);                                          // destaque genérico (funciona em qualquer painel)
        }
      }
    } catch (e) { console.warn("[Mintzie] ação falhou:", e); }
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

  // faz uma rodada com o cérebro (opcionalmente com um print da tela)
  async function postChat(image) {
    const reqBody = {
      messages: history,
      page: { url: location.href.slice(0, 200), title: (document.title || "").slice(0, 120), elements: serializePage() },
      image: image || undefined,
      canSee: (typeof CFG.captureScreen === "function") || undefined,
      brain: CFG.brain || undefined   // "imersao" usa o cérebro do acervo da imersão
    };
    if (typeof CFG.transport === "function") {
      // usado pela extensão (roteia via background service worker do Chrome)
      return (await CFG.transport(reqBody)) || {};
    }
    const res = await fetch(CFG.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });
    return await res.json().catch(() => ({}));
  }

  function wantsScreenshot(action) {
    if (!action) return false;
    if (Array.isArray(action)) return action.some((a) => a && a.type === "screenshot");
    return action.type === "screenshot";
  }

  // renderiza a resposta do cérebro (texto + pose + ação). fromShot evita loop de print.
  function deliver(data, opts) {
    opts = opts || {};
    if (data && data.detail) console.warn("[Mintzie] detalhe do erro:", data.detail);
    const reply = (data.reply || "").trim() ||
      "Tive um lapso indigno de um gato do meu calibre. Repete pra mim?";
    history.push({ role: "assistant", content: reply });
    saveState();
    // emoção escolhida pelo LLM decide a pose da resposta
    const emoMap = { happy: "happy", pointing: "pointing", confused: "confused", celebrating: "celebrating", laughing: "laughing", surprised: "surprised", neutral: "talking" };
    let est = emoMap[data.emotion] || "talking";
    if (!(vids[est] && vids[est].readyState >= 2)) est = "talking"; // fallback se o vídeo não existir
    setState(est);
    meow(est === "celebrating" ? "meow" : "chirp");

    // o LLM pediu pra olhar a tela? captura e faz uma nova rodada já com a imagem.
    const doShot = !opts.fromShot && wantsScreenshot(data.action) && typeof CFG.captureScreen === "function";
    if (data.action && !doShot) setTimeout(() => runAction(data.action), 550); // age na página

    const node = addMsg("", "bot");
    typeInto(node, reply, () => {
      node.innerHTML = mdLite(reply);   // renderiza negrito/listas no fim
      if (doShot) { runScreenshotTurn(); return; }  // segue direto pra "olhar a tela"
      talkTimer = setTimeout(() => {
        if (vids.reading && vids.reading.readyState >= 2 && current === est) {
          setState("reading");                                   // "lê" junto enquanto você lê
          talkTimer = setTimeout(() => { if (current === "reading") setState("idle"); }, 7000);
        } else setState("idle");
      }, 700);
    });
  }

  // captura a tela e manda de volta pro cérebro, que responde já enxergando
  async function runScreenshotTurn() {
    setState("thinking");
    const typing = showTyping();
    try {
      let image = null;
      try { image = await CFG.captureScreen(); } catch (e) {}
      const data = await postChat(image);
      typing.remove();
      deliver(data, { fromShot: true });
    } catch (err) {
      typing.remove(); setState("idle");
      console.error("[Mintzie] print falhou:", err);
    }
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = ""; autosize();
    chipsBox.innerHTML = "";
    grabbing = false; stageEl.style.cursor = ""; CUR.style.opacity = "0"; // solta o cursor
    bump();
    addMsg(text, "user");
    history.push({ role: "user", content: text });
    saveState();

    sendBtn.disabled = true;
    setState("thinking");
    const typing = showTyping();

    try {
      let image = null;
      if (lookNext && typeof CFG.captureScreen === "function") {
        try { image = await CFG.captureScreen(); } catch (e) {}
        lookNext = false; eyeBtn.classList.remove("on");
      }
      const data = await postChat(image);
      typing.remove();
      deliver(data, {});
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
  input.addEventListener("input", () => { autosize(); bump(); goListening(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener("click", send);

  /* ---------- start ---------- */
  vids.idle.play().catch(() => {});
  render();
  // restaura a conversa se veio de outra página (mesma aba)
  let restored = null;
  try { restored = JSON.parse(sessionStorage.getItem(SKEY) || "null"); } catch (e) {}
  if (restored && Array.isArray(restored.history) && restored.history.length) {
    restored.history.forEach((m) => {
      const node = addMsg("", m.role === "user" ? "user" : "bot");
      if (m.role === "user") node.textContent = m.content;
      else node.innerHTML = mdLite(m.content);
      history.push(m);
    });
  } else {
    addMsg(CFG.greeting, "bot");
    renderChips();
  }
  if (CFG.startOpen || (restored && restored.open)) open();
  if (restored && restored.split) applySplit(true);   // mantém a meia-tela ao navegar entre páginas
  // aplica preenchimento pendente que veio de outra página
  try {
    const pf = JSON.parse(sessionStorage.getItem("mintzie_prefill") || "null");
    if (pf) { sessionStorage.removeItem("mintzie_prefill"); setTimeout(() => runAction(pf), 600); }
  } catch (e) {}
})();
