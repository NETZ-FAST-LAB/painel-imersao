# Processo de higiene de informações & consistência — acervo NETZ

*Como manter contexto/, painel e cérebro do Mintzie consistentes ao longo do tempo. 14/jul/2026.*

## Por que isto existe
Ao longo da imersão o acervo cresceu rápido e apareceram as inconsistências típicas: um conceito errado que precisou ser corrigido em 4 lugares (o "PI = patente do cliente"), duas análises do Fable sobrepostas, duas definições de produto não conciliadas, um doc fora do índice, o mapa de abas do intro desatualizado, e o cérebro que só entra no ar depois de rebuild + redeploy. Higiene é o processo que impede isso de voltar.

## Princípios (as 5 regras de ouro)
1. **Fonte única.** `contexto/` é a verdade. O painel e o cérebro (`imersao/imersao_knowledge.md`) são **derivados** — nunca se edita o cérebro à mão; regenera-se com `build-brain.sh`.
2. **Um fato, um lugar.** Cada definição/decisão mora em UM doc. Se dois docs falam do mesmo, um deles é o canônico e o outro aponta pra ele (ou é arquivado).
3. **Datar e versionar.** Toda peça tem data absoluta (não "semana passada") e diz o que **supersede**. O mais novo vence; o antigo é marcado como superado, não apagado silenciosamente.
4. **Classificar.** Cada doc é interno-confidencial ou público. Regras específicas viajam com o conteúdo (ex.: o case de saneamento é **sempre anonimizado**; a chave do Gemini **nunca** no git).
5. **Derivados regenerados, não editados.** Mudou algo em contexto/ → roda `build-brain.sh` → commit → push → **redeploy** (senão o Mintzie no ar não vê).

## O fluxo canônico (todo add/update)
1. O md novo/editado entra em `contexto/netz/` (interno) ou `contexto/referencias-externas/` (input externo).
2. Uma linha no índice `contexto/README.md` — com data e, se for o caso, "supersede X".
3. **Se muda um conceito**, propagar aos derivados: a aba do painel, o parking lot, e o `imersao/_intro.md` (o mapa de abas + conceitos travados).
4. `bash imersao/build-brain.sh` → `git add -A && commit && push` → **Redeploy** no Coolify.
5. `bash imersao/hygiene-check.sh` — confere as invariantes antes de fechar.

## As invariantes (o que o check garante)
- **Sem órfãos:** todo arquivo em `contexto/` tem linha no README.
- **Sem índice-fantasma:** nenhuma entrada do README aponta pra arquivo que não existe.
- **Cérebro fresco:** `imersao_knowledge.md` é mais novo que qualquer doc-fonte (senão falta rebuild).
- **Sem regressão de conceito:** termos proibidos não voltam (ex.: "patente do cliente", `sebrae-pi-observatorio`, o nome real do case de saneamento).
- **Tudo datado:** docs sem data aparente são sinalizados.
- **Sem duplicata divergente:** pares de docs que cobrem o mesmo tema entram numa lista de reconciliação (curadoria manual).

## Conceitos "travados" (não podem regredir)
Uma lista curta de asserções que o acervo já fechou — qualquer coisa que as contradiga é bug:
- **PI** = o Edital 02 do Sebrae; a NETZ credencia a **sua própria metodologia**. Nunca "vender patente/marca ao cliente".
- **Case de saneamento** = sempre anonimizado ("uma das maiores companhias de saneamento do Sul"). O Planaterra é público.
- **Fonte da verdade operacional** = Notion/Discord/GitHub; "se ficou só na conversa, morreu".
- **Segredos** (Gemini key, `.env*`) nunca no repositório.

## Cadência & responsáveis
- **A cada commit de acervo:** rodar o `hygiene-check.sh` (ideal: virar pre-commit hook).
- **No ritual de terça:** um "curador da semana" (rodízio entre os 4) roda o check, resolve os ✗ e reporta.
- **Mensal:** revisão de reconciliação — fundir duplicatas, arquivar o que foi superado, conferir classificação.

## Backlog imediato de higiene (o que já está sujo)
1. **Reconciliar as duas definições de produto** — `metodologia-netz-assistentes.md` (assistentes + POC) × `priorizacao-e-roteiro-comercial.md` (aprendizagem/nichos do consórcio). Decidir a relação (esteira única? dois produtos?) e escrever.
2. **Reconciliar as duas análises Fable** — `reanalise-pos-invernetz.md` (canônica) × `revisao-pos-imersao-fable.md` (anterior). Já indexadas com a relação; decidir se arquiva a antiga.
3. **Bandeira de confidencialidade** — o site nomeia publicamente a companhia de saneamento e linka `/cases/corsan/`, enquanto o consórcio manda anonimizar. Confirmar/corrigir.
4. **Garantir o redeploy** após todo rebuild — o cérebro no ar ≠ o arquivo no repo.

## Ferramenta
`imersao/hygiene-check.sh` — read-only, roda as invariantes e imprime um relatório ✓/✗. Não altera nada; é diagnóstico.
