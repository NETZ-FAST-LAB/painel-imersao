// background.js — service worker (MV3). Faz o fetch ao servidor local do Mintzie,
// contornando o CORS/CSP da página (o content script não pode fazer isso direto).
const ENDPOINT = "http://localhost:3000/api/chat";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg && msg.type === "mintzie-capture") {   // print da aba visível
    try {
      chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 55 }, function (dataUrl) {
        sendResponse({ dataUrl: chrome.runtime.lastError ? null : dataUrl });
      });
    } catch (e) { sendResponse({ dataUrl: null }); }
    return true;
  }
  if (!msg || msg.type !== "mintzie-chat") return;
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg.body || {})
  })
    .then(function (r) { return r.json(); })
    .then(function (data) { sendResponse(data); })
    .catch(function (e) {
      sendResponse({
        reply: "Não alcancei o servidor local do Mintzie (node server.js em localhost:3000). " + e.message,
        emotion: "confused"
      });
    });
  return true; // mantém o canal aberto para a resposta assíncrona
});
