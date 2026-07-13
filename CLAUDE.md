# CLAUDE.md — Mintzie / Painel da Imersão (NETZ)

Contexto do projeto para o Claude Code. Leia antes de mexer.

## O que é
Assistente felino (**Mintzie**) + **painel da imersão** da NETZ. Servidor Node **sem dependências** (`server.js`) que serve um site, um painel interno e um chat com IA (Gemini). O Mintzie tem **dois cérebros**:
- **netz** — público, para o site institucional (base: `knowledge/netz_knowledge.md`).
- **imersao** — interno/confidencial, guia do acervo da imersão (base: `imersao/imersao_knowledge.md`).

## Rodar
- Local (equipe): duplo-clique em `start-mintzie.command` (já sobe em **modo internal** e abre `/inicio`). Ou `MINTZIE_MODE=internal node server.js`.
- URLs: `/inicio` (hub), `/painel` (imersão 🔒), `/governanca` 🔒, `/site` (público). Aliases resolvidos em `serveStatic`.
- **Reinicie o servidor depois de editar `persona/`, `knowledge/` ou `imersao/`** — são carregados na subida.

## Modos (segurança) — `MINTZIE_MODE`
- `public` (padrão): só o cérebro do site; `/painel` e `/governanca` retornam 404; CORS restrito; rate limit. Seguro para deploy aberto.
- `internal`: tudo liberado (painel + acervo interno). **Nunca exponha à internet sem trava de senha.**
- **Basic Auth**: se `BASIC_AUTH_USER` e `BASIC_AUTH_PASS` estão setadas, protegem TODA a instância (401 sem senha). Use ao subir na VPS.

## Mapa de arquivos
- `server.js` — proxy do LLM (Gemini/OpenAI), roteamento, modos, Basic Auth, dois cérebros (`BRAINS`), ações/emoção.
- `public/` — servido estático:
  - `mintzie-widget.js` — o widget (vídeo + chat + ações + memória + minimizar/meia-tela). Config via `window.MINTZIE_CONFIG` (`brain`, `apiUrl`, `assetBase`…).
  - `index.html` (site), `painel-imersao.html` (painel), `governanca.html`, `hub.html`, `sons.html`.
  - `videos/mintzie-<estado>.mp4` (fundo cinza #202225), `audio/mintzie-*.mp3`.
- `persona/` — `mintzie_web_persona.md` (site) e `mintzie_imersao_persona.md` (guia). Guardrails incl. fronteira público×interno.
- `knowledge/netz_knowledge.md` — cérebro público.
- `imersao/imersao_knowledge.md` — cérebro interno (acervo montado: síntese do Fable + docs + reunião Sebrae + narrativa). `imersao/EMBED-no-painel.md` — como embutir.
- `governance/` — `faq-index.json`, `classificacao-informacao.md` (o que é público × interno).
- `extension/` — extensão Chrome (MV3). **`extension/mintzie-widget.js` é CÓPIA** de `public/mintzie-widget.js` — re-copie após editar o widget.
- `docs/` — documentação (definições, FAQs/poses, revisão e planos).
- `_dev/` — **gitignored**, só na máquina: `_diag/` (diagnóstico + `rekey.py`), `_downloads/` e `_white-originals/` (fontes brutas dos vídeos), `_pre-rekey/` (backup), `sounds/`, `ref/`, `tests/`.

## Gotchas importantes
- **Widget da extensão é cópia manual** — sempre `cp public/mintzie-widget.js extension/mintzie-widget.js` depois de editar.
- **Vídeos**: gato verde. Fundo removido por `_dev/_diag/rekey.py` (recorte do branco + preenchimento de buracos pequenos, `CAP=250`, pra não comer os brilhos do rosto e não deixar manchas). Fontes em `_dev/_downloads/` e `_dev/_white-originals/`. Pra reprocessar: `python3 _dev/_diag/rekey.py <fonte.mp4> public/videos/mintzie-<estado>.mp4`.
- **Painel** (`painel-imersao.html`): views orientadas a dados (`CRONOGRAMA`, `DECISOES`, `SEBRAE_*`, `SINT_*`…). Menu em 2 níveis: `GROUPS` (Imersão/Análises/Referências) → sub-abas (`TABS`). Mintzie embutido com `brain:"imersao"`; navegação por `window.MZ_NAV.goto("d1")`.
- **Fronteira público×interno**: nunca copie conteúdo interno (finanças, sócios, Sebrae, acervo) para `knowledge/netz_knowledge.md`. Regra em `governance/classificacao-informacao.md`.
- **Segredos**: a chave fica em `.env.shared` (local, **fora do git** — gitignored) ou como variável no Coolify. Nunca commite a chave.

## Deploy (Coolify)
- Build por `Dockerfile` (ou Nixpacks, que usa `npm start`). Variáveis no Coolify (marcar *Available at Runtime*): `GEMINI_API_KEY`, `MINTZIE_MODE=internal`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`. Passo a passo em `DEPLOY.md`.
- Repositório: **privado** (contém o acervo interno).

## Contexto / acervo (para agentes)
`contexto/` reúne os documentos processados, divididos em `contexto/netz/` (interno: síntese do Fable, 5 problemas, acervo de decisões, Hermes, auditoria, Sebrae + reunião, narrativa, cronograma, check-in) e `contexto/referencias-externas/` (China, 3 Ondas). Índice em `contexto/README.md`. O servidor usa o **montado** em `imersao/imersao_knowledge.md`; `contexto/` são as fontes organizadas para consulta. (As fontes brutas originais também seguem em `../análises e pesquisas/` e `../Reuniões/`.)
