# Mintzie no site — protótipo

Assistente felino da NETZ para o site: o **Mintzie** em vídeos pré-definidos (em vez de render 3D em tempo real) + chat de verdade com LLM. Ele recebe o visitante, responde sobre a NETZ e guia a jornada de compra.

## O que tem aqui

```
mintzie-site-assistant/
├── server.js                 # backend: serve o site + proxy do LLM (zero dependências, Node 18+)
├── persona/
│   └── mintzie_web_persona.md # personalidade do Mintzie adaptada pro site
├── knowledge/
│   └── netz_knowledge.md      # ⚠️ PLACEHOLDER — base de conhecimento da NETZ (preencher com o site)
├── public/
│   ├── index.html             # página de demo
│   ├── mintzie-widget.js      # o widget (máquina de estados de vídeo + chat), auto-contido
│   ├── videos/                # mintzie-idle / -thinking / -talking .mp4
│   └── poster/                # frame inicial
├── .env.example               # variáveis (copie para .env)
└── package.json
```

## Como rodar

1. **Configure a chave do modelo.** O cérebro padrão é o **Google Gemini** (`LLM_PROVIDER=gemini`).
   O `.env` já está criado com a chave do Google e `GEMINI_MODEL=gemini-2.0-flash`.
   (Também dá pra usar um endpoint compatível com OpenAI: `LLM_PROVIDER=openai` — veja `.env.example`.)

   ```bash
   # se precisar recriar:
   cp .env.example .env   # e preencha GEMINI_API_KEY
   ```

2. **Suba o servidor** (precisa de Node 18+; sem `npm install`):

   ```bash
   node server.js
   ```

3. Abra **http://localhost:3000** e clique no Mintzie no canto inferior direito.

## Como o vídeo reage (máquina de estados)

| Estado     | Quando                                   | Vídeo                  |
|------------|------------------------------------------|------------------------|
| `idle`     | parado, esperando o visitante            | `mintzie-idle.mp4`     |
| `thinking` | enquanto o LLM processa a resposta       | `mintzie-thinking.mp4` |
| `talking`  | enquanto o texto da resposta aparece     | `mintzie-talking.mp4`  |

Os três vídeos ficam pré-carregados. Estão mudos (autoplay de navegador exige `muted`). Trocar/adicionar estados = só colocar novos `.mp4` em `public/videos/` e referenciar em `mintzie-widget.js`.

## Remoção do fundo branco (white-key ao vivo)

O fundo branco dos vídeos é removido **em tempo real, no navegador**, desenhando o vídeo num `<canvas>` e tornando transparente tudo que está perto do branco. Assim o gato "flutua" sobre o painel — funciona em **todos os navegadores, inclusive Safari**, sem precisar reprocessar/reexportar vídeo.

Por que não um WebM/MOV com alpha? WebM (VP9 alpha) não funciona no Safari, e MOV/HEVC com alpha exige exportação específica. O white-key no canvas evita esse problema e mantém os `.mp4` originais.

Ajuste fino pelo `window.MINTZIE_CONFIG` (ou direto no `mintzie-widget.js`):

```js
window.MINTZIE_CONFIG = {
  removeBg: true,        // liga/desliga o recorte
  keySimilarity: 84,     // ↑ remove mais (corta mais perto do gato) | ↓ remove menos
  keySmoothness: 28,     // suavidade da borda
};
```

Se algum vídeo novo tiver fundo diferente (não branco), me avise que troco a lógica para a cor certa.

## O cérebro (chat)

- `server.js` monta o **system prompt** juntando `persona/mintzie_web_persona.md` + `knowledge/netz_knowledge.md` e chama o modelo (Gemini por padrão, ou OpenAI-compatível).
- A chave **nunca** vai pro navegador — fica só no servidor. O front-end só fala com `/api/chat`.
- **Regra central:** o Mintzie responde apenas com base na base de conhecimento. Sem ela preenchida, ele admite que não sabe e oferece conectar com o time.

## Pendência

`knowledge/netz_knowledge.md` está como **placeholder**. Assim que a URL do site da NETZ for definida, extraímos o conteúdo real (sobre, produtos/serviços, diferenciais, jornada de compra, FAQ, contato) e o Mintzie passa a responder de fato.

## Embutir no site real (depois)

O widget é auto-contido. No site da NETZ, basta:

```html
<script>
  window.MINTZIE_CONFIG = { apiUrl: "https://SEU-BACKEND/api/chat", startOpen: false };
</script>
<script src="/caminho/mintzie-widget.js"></script>
```

E hospedar `server.js` (ou portar a rota `/api/chat` pro backend que a NETZ já usa) + os vídeos.
