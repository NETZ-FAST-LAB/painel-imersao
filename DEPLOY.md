# Subir o painel da imersão — GitHub + Coolify

Guia passo a passo. Você executa os comandos; eu já deixei o app pronto (trava de senha, Dockerfile, .gitignore).

> ⚠️ **Importante:** o painel é **interno e confidencial** (finanças, sócios, Sebrae, estratégia). Numa VPS ele fica acessível pela internet. Por isso o app agora tem **trava de senha (Basic Auth)**: sem usuário e senha, ninguém entra. **Nunca** suba sem preencher `BASIC_AUTH_USER`/`BASIC_AUTH_PASS`, e mantenha o **repositório privado**.

---

## O que já está pronto no código
- **Trava de senha** no `server.js` (ativa quando você define `BASIC_AUTH_USER` e `BASIC_AUTH_PASS`).
- **Deploy sem Docker via Nixpacks** — Node puro (`npm start` → `node server.js`), sem dependências; a Coolify builda direto do `package.json`. (Há também um `Dockerfile` no repo como alternativa.)
- **.gitignore / .dockerignore** — a chave (`.env.shared`) e os backups pesados (`_downloads`, `_pre-rekey`, `_white-originals`, `_diag`) ficam fora do repositório.
- A chave do Gemini vira **variável de ambiente** no Coolify (não vai no repo).

---

## Passo 1 — Preparar o repositório local (uma vez)

No Terminal, dentro da pasta `mintzie-site-assistant`:

```bash
rm -f .git/index.lock            # remove um lock preso (se existir)
git rm --cached .env.shared      # para de versionar a chave (o arquivo continua na sua máquina)
git add -A
git commit -m "Painel da imersao: deploy (Basic Auth + Dockerfile)"
```

## Passo 2 — Enviar para o GitHub via `gh` (repo PRIVADO)

Confirme que o `gh` está logado (se não, `gh auth login`):

```bash
gh auth status
```

**Se o repositório ainda NÃO existe** — cria privado na org e já faz o push, tudo de uma vez:

```bash
gh repo create NETZ-FAST-LAB/painel-imersao --private --source=. --remote=origin --push
```

**Se o repositório JÁ existe** (você citou a URL) — conecta e envia:

```bash
git remote add origin https://github.com/NETZ-FAST-LAB/painel-imersao.git
git branch -M main
git push -u origin main
```

## Passo 3 — Deploy no Coolify

1. **New Resource → Application → Public/Private Repository** e escolha `NETZ-FAST-LAB/painel-imersao` (conecte sua conta GitHub à Coolify se ainda não conectou; para repo privado é preciso autorizar).
2. **Build Pack:** escolha **Nixpacks** (recomendado — sem Docker). A Coolify detecta o Node pelo `package.json` e roda `npm start` (`node server.js`) sozinha; não precisa de `Dockerfile`.
   - _Alternativa:_ **Dockerfile** — o repo também tem um `Dockerfile` pronto na raiz, caso prefira. Os dois funcionam; use um só.
3. **Port / Ports Exposes:** `3000`. (O app respeita a variável `PORT` da plataforma; deixe `3000` ou o que a Coolify sugerir.)
4. **Environment Variables** (aba *Environment*), adicione:

   | Nome | Valor |
   |---|---|
   | `GEMINI_API_KEY` | sua chave do Gemini |
   | `MINTZIE_MODE` | `internal` |
   | `BASIC_AUTH_USER` | um usuário (ex.: `netzlab`) |
   | `BASIC_AUTH_PASS` | uma senha forte |

5. **Deploy.**
6. Em **Domains**, configure seu domínio e ligue **HTTPS** (a Coolify emite o certificado Let's Encrypt automaticamente).

## Passo 4 — Testar

Abra `https://SEU-DOMINIO/painel`. O navegador vai pedir **usuário e senha** (os do Basic Auth). Sem eles → `401`. Com eles → o painel abre, com o Mintzie embutido.

URLs (todas atrás da senha):
- `/inicio` — hub · `/painel` — imersão · `/governanca` — governança · `/site` — site público.

---

## Atualizar depois de mudanças

```bash
git add -A
git commit -m "descrição da mudança"
git push
```

Na Coolify, clique **Redeploy** (ou configure o webhook para deploy automático a cada push).

---

## Segurança — leia antes de subir

- **Basic Auth protege tudo.** Só compartilhe usuário/senha com a equipe. Troque a senha periodicamente.
- **A chave não vai no repositório** — só como variável no Coolify. Nunca cole a chave num arquivo versionado.
- **Repositório privado, sempre.** O acervo interno está no repo.
- **Histórico antigo:** a chave do Gemini foi versionada em commits antigos deste projeto. Como o repo é privado, tudo bem — mas **se algum dia tornar o repo público, rotacione a chave antes** (gere uma nova no Google AI Studio e troque a variável no Coolify).
- Mantido o princípio de sempre: nada de expor esse conteúdo sem a trava de senha.
