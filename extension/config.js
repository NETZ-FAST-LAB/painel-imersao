// config.js — roda como content script (mundo isolado) ANTES do widget.
// Configura o Mintzie para: carregar assets do servidor local e falar com o
// /api/chat via background service worker (padrão seguro do MV3).
window.MINTZIE_CONFIG = {
  assetBase: "http://localhost:3000",   // vídeos e áudios vêm do servidor local
  video: false,                         // universal: usa o avatar SVG (mídia cross-origin costuma ser bloqueada por CSP)
  startOpen: false,                     // começa fechado (só o launcher no canto)
  routes: {},                           // universal: sem rotas específicas de site
  transport: function (body) {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "mintzie-chat", body: body }, function (resp) {
          if (chrome.runtime.lastError) {
            resolve({ reply: "Meu cérebro (servidor local) não respondeu. Confere se o node server.js está rodando.", emotion: "confused" });
          } else {
            resolve(resp || { reply: "", emotion: "neutral" });
          }
        });
      } catch (e) {
        resolve({ reply: "Erro ao falar com o servidor local. " + e.message, emotion: "confused" });
      }
    });
  },
  // "Mintzie enxerga a tela": captura a aba visível via background (chrome.tabs.captureVisibleTab)
  captureScreen: function () {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "mintzie-capture" }, function (resp) {
          resolve((resp && resp.dataUrl) || null);
        });
      } catch (e) { resolve(null); }
    });
  }
};
