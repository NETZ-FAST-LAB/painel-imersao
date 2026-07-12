# Como colocar o Mintzie no painel da imersão

O Mintzie agora tem **dois cérebros** no mesmo servidor:
- `netz` (padrão) — o assistente do site institucional.
- `imersao` — o guia do acervo da imersão (as pesquisas e análises que você reuniu).

O que muda no painel é só a **configuração** do widget: `brain: "imersao"`.

---

## Jeito recomendado (vídeo funciona, zero dor de CSP)

Sirva o painel pelo próprio servidor do Mintzie. Salve o HTML do painel dentro de `mintzie-site-assistant/public/` (ex.: `public/painel.html`) e abra em `http://localhost:3000/painel.html`. Como tudo vem da mesma origem, os vídeos do gato carregam normalmente.

Cole isto **antes do `</body>`** do painel:

```html
<!-- Mintzie — guia da imersão -->
<script>
  window.MINTZIE_CONFIG = {
    brain: "imersao",
    apiUrl: "/api/chat",
    assetBase: "",              // mesma origem: vídeos e áudios de /videos e /audio
    startOpen: false,
    greeting: "Sou o Mintzie. Li os nove documentos antes de você chegar. Pergunte o que quiser do acervo — ou peça que eu te leve até uma seção.",
    suggestions: [
      "Qual é a tese central da imersão?",
      "Quais são as 3 decisões de maior alavancagem?",
      "Me leva até a decisão d1",
      "O que tem no cemitério de ideias?"
    ]
  };
</script>
<script src="/mintzie-widget.js"></script>
```

---

## Se o painel rodar em outra origem (arquivo solto, outra porta)

Aponte os assets para o servidor local. Se os vídeos não aparecerem (CSP de mídia cross-origin), o widget cai sozinho no avatar SVG — ou force `video: false`.

```html
<script>
  window.MINTZIE_CONFIG = {
    brain: "imersao",
    apiUrl: "http://localhost:3000/api/chat",
    assetBase: "http://localhost:3000",
    video: false,               // avatar SVG (evita bloqueio de mídia cross-origin)
    startOpen: false,
    greeting: "Sou o Mintzie. Li os nove documentos antes de você chegar. Pergunte o que quiser do acervo — ou peça que eu te leve até uma seção.",
    suggestions: [
      "Qual é a tese central da imersão?",
      "Quais são as 3 decisões de maior alavancagem?",
      "Me leva até a decisão d1",
      "O que tem no cemitério de ideias?"
    ]
  };
</script>
<script src="http://localhost:3000/mintzie-widget.js"></script>
```

---

## Navegação dentro do painel

Se as seções do painel tiverem `id` (ex.: `id="d1"`, `id="i7"`, `id="b4"`), o Mintzie leva a pessoa até elas quando pedirem ("me leva pra decisão 1"). Se não tiverem id, ele usa os elementos visíveis (clica a aba/ботão certo). Quanto mais os ids baterem com o esquema `d1–d6` / `i1–i10` / `b1–b6`, mais preciso ele fica.

## Privacidade

O acervo tem conteúdo interno e sensível. Rode **local** (localhost), na imersão. Não suba esse painel com esse cérebro para um servidor público aberto. O servidor lê o acervo do disco e nunca o expõe cru; as respostas só saem pela conversa.

## Rodar

Na pasta `mintzie-site-assistant`: `node server.js` (ou o `start-mintzie.command`). Reinicie o servidor sempre que mudar persona/conhecimento — eles são carregados na subida.
