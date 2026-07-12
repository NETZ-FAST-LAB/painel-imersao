# Mintzie — extensão do Chrome (MVP experimental)

Injeta o Mintzie (gato + chat + ações curadas) em **qualquer página** que você visitar. É um experimento — o cérebro continua no **servidor local**, então ele precisa estar rodando.

## Pré-requisitos
1. O servidor do Mintzie rodando: na pasta `mintzie-site-assistant`, `node server.js` (ou o `start-mintzie.command`). Ele precisa estar em `http://localhost:3000`.
2. Reinicie o servidor depois desta versão (adicionei CORS para a extensão poder usá-lo).

## Como instalar (modo desenvolvedor)
1. Abra `chrome://extensions`.
2. Ligue o **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação** e selecione a pasta **`extension/`**.
4. Pronto — abra qualquer site e o Mintzie aparece no canto inferior direito.

## Como funciona
- `manifest.json` (MV3): injeta `config.js` + `mintzie-widget.js` em todas as páginas.
- `config.js`: configura o widget para carregar vídeos/áudios de `localhost:3000` e falar com o chat via background.
- `background.js`: service worker que faz o fetch ao `/api/chat` local (padrão seguro do MV3 — o content script não pode fazer esse fetch cross-origin direto).
- O widget é o mesmo do site; o "hook de transporte" (`CFG.transport`) roteia as mensagens pelo background.

## "Mintzie enxerga a tela" (visão)
- Botão **👁** no campo de mensagem: ao ativar, a **próxima** mensagem inclui um **print da aba visível** (`chrome.tabs.captureVisibleTab`), que vai pro Gemini (multimodal). Assim ele entende o que está na tela — inclusive coisas fora do DOM (imagens, gráficos, layout).
- Por isso o `manifest.json` pede `tabs` + `host_permissions: <all_urls>` (o Chrome avisa "ler e alterar dados em todos os sites"). É o custo de poder tirar print em qualquer aba. O print só é capturado quando **você** aperta o 👁 — nunca automático.
- Também mandamos ao LLM uma lista dos **elementos interativos** da página (para agir por índice — "clica no terceiro"). Nunca mandamos o valor digitado dos campos (senha/texto).

## Limitações conhecidas (é um MVP)
- **Precisa do servidor local** rodando. Sem ele, o chat responde com erro em personagem.
- **Vídeos/áudios vêm de `localhost:3000`.** Em sites com Content-Security-Policy rígida (`media-src`), o vídeo/áudio do gato pode não carregar — o chat continua funcionando.
- **Ações curadas:** rolar e pré-preencher contato só funcionam onde os elementos existem (ex.: o site de demo da Netz). Em sites genéricos, o Mintzie é um companheiro de chat. (Modo "DOM aberto" via page-agent seria o próximo passo.)
- **Memória por site:** a conversa é lembrada por origem (sessionStorage), não entre sites diferentes.

## Próximos passos possíveis
- Empacotar os vídeos/áudios dentro da extensão (evita depender do CSP do site).
- Integrar o `page-agent` como motor de ação aberta (clicar/digitar em qualquer elemento), com confirmação antes de agir.
- Publicar o cérebro num servidor real (em vez de localhost) para uso fora da sua máquina.
