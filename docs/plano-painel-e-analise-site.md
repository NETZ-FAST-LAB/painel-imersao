# Plano de melhoria do painel + análise do site NETZ

*Lente: Hallmark (skill anti-AI-slop para Claude Code) cruzada com a auditoria técnica do acervo. 14/jul/2026.*

> **Nota de acesso.** O repositório `NETZ-FAST-LAB/site-netz-2026-astro` é **privado** — não consegui ler o código. A análise do site é feita sobre a **página publicada** (`www.netz.now/pt/`, renderizada) + a `auditoria-tecnica-netz-now.md` do contexto. Para um audit no nível de componente Astro, me dá acesso ao repo ou cola os arquivos-chave (`Layout.astro`, o hero, o header, `tokens`).

---

# Parte 1 — Plano de melhoria do painel (`painel-imersao.html`)

## O que já está bom (não mexer)
- **Honest copy.** O painel usa dados reais (scores, metas, transcrições) — passa direto no gate de "métrica inventada".
- **Tabelas com overflow tratado** (`overflow-x:auto`) — as tabelas largas (ranking, panorama, matriz) não quebram no mobile.
- **Colapsáveis** (`<details>`) já usados no cronograma, mapa comercial e síntese — bom controle de densidade.
- **Paleta consistente** — verde #BFFF80 + acentos (azul #7Fd4ff, âmbar #ffd97f, roxo #c79fff, coral #ff9f7f) aplicados com coerência semântica.

## Os "tells" de IA que o painel dispara (pela lente Hallmark)

1. **Mesmice estrutural — o item nº 1.** Toda aba renderiza como a **mesma grade de cards** (`grid repeat(auto-fit, minmax(...,1fr))`, borda-esquerda/topo colorida, gradiente `180deg`, cantos 10–12px). São 16 abas com um único ritmo visual. A tese central do Hallmark é *variedade estrutural, não só visual* — duas telas não deveriam ser color-swaps da mesma template.
2. **Emoji como ícone (gate 60).** 📊 🔒 ✓ ✕ 📄 → ▸ ⌂ 🔗 espalhados. É o tell mais fácil de corrigir.
3. **Tokens não centralizados (disciplina de locked-tokens).** As cores são **hex literais repetidos** por todo o arquivo (`#0e1218`, `#12161d`, `#262b34`, `#9aa4b2`, `#BFFF80`…). O Hallmark exige que toda cor referencie um token nomeado. Hoje, mudar um tom = caçar dezenas de ocorrências.
4. **Excesso de pill-badges.** Pills uppercase com `letter-spacing` e `border-radius:20px` em tudo (status, tags, faixas, "foco"). Quando tudo é badge, nada se destaca.
5. **Estados de interação não auditados.** As `textarea` (aba Decisões) e os botões precisam dos 8 estados — sobretudo **foco-visível via `outline` (não `border`)**, com anel ≥3:1 e sem animar o anel.
6. **Contraste (gates 46–50).** Os cinzas fracos (`#6f7987`, `#7e8a99`, `#8b95a3`) em texto pequeno sobre fundo escuro provavelmente ficam abaixo do limiar APCA/WCAG. Vale medir.

## Plano faseado (grade na curva — é ferramenta interna densa)

**Fase 1 — Tokenizar (fundação, baixo risco).** Extrair um bloco `:root` com os tokens (`--bg, --card, --line, --ink, --dim, --green, --blue, --amber, --purple, --coral, --radius, --space-*`) e referenciar por nome. Ganho imediato de manutenção **e** alinha o painel com o `tokens.css` do site (fonte única de marca). É o pré-requisito de tudo.

**Fase 2 — Quebrar a mesmice por grupo (maior impacto).** Dar a cada grupo de abas um ritmo próprio, em vez de card-grid pra tudo:
- **Imersão** (cronograma, decisões, sociedade, comercial, parking) → linha do tempo / documento.
- **Análises** (Fable, Edital PI, Parcerias…) → editorial / leitura longa (já começou na aba Fable).
- **Referências** (nichos, input) → índice / tabela densa.

**Fase 3 — Trocar emoji por um set de ícones (SVG) + reduzir pills.** Vocês já têm SVGs de marca; criar um mini-set de ícones inline (documento, cadeado, seta, check) e substituir os emoji. Reservar pill só para status real.

**Fase 4 — Estados + contraste + mobile (os gates de usabilidade).** Auditar foco-visível/hover/disabled nos elementos interativos; corrigir os cinzas de baixo contraste; conferir 320/375/414px (o painel é usado no celular durante a imersão).

**Fase 5 — Polimento de motion.** Garantir `prefers-reduced-motion`, animar só `transform`/`opacity`, e cortar animação que não carrega informação.

**Prioridade honesta:** Fases 1, 2 e 4 valem o esforço (manutenção, diferenciação, usabilidade real). Fase 3 é cosmética-mas-rápida. Não aplicar regra editorial de marketing num dashboard — densidade e repetição controlada ali são eficiência, não pecado.

---

# Parte 2 — Análise do site atual (`www.netz.now/pt/`)

## O que o site é hoje (melhor do que a auditoria antiga sugeria)
O site **não está mais "vazio esperando conteúdo"**. A home `/pt/` tem: hero, régua de logos forte (Sicredi, Fundação Sicredi, CMPC, AB InBev, Saneamento Riograndense, Viex, Nous Group, Arezzo, BSS), 5 capacidades, cases reais (Saneamento/Corsan, Nous, BSS), bloco Sobre, um **Manifesto** com voz própria, formulário de contato (Nome/Empresa/E-mail/Desafio) + WhatsApp/e-mail, e é **trilíngue** (PT/EN/ES). OG tags e theme-color (#b5f476) presentes. É um Astro competente.

## O que a lente Hallmark aponta

**Copy / posicionamento**
- **H1 genérico:** *"Tecnologia para operações complexas do mundo real."* É on-distribution, vago, e não diz o que a NETZ faz de único. A própria síntese do Fable já tinha marcado esse H1 como genérico (tensão T8). Hallmark: copy específica e honesta.
- **5 capacidades genéricas** (Sites · IA/automação · Integrações · Estratégia · Squads). É o retrato de "quatro/cinco frentes genéricas" que o acervo critica — lê como qualquer agência. **Não reflete** nem a metodologia de "assistentes que conduzem por processos" (aba Edital PI) nem os nichos do consórcio (saúde/infra/coop). **A vitrine e a estratégia divergiram.**
- **Manifesto é o ponto forte:** *"Sempre fomos agentes de provocação → agora desenvolvemos agentes transformadores."* É distintivo e amarra na narrativa do micélio/agentes. Deveria subir, não ficar no fim.

**Estrutura (os fingerprints de IA)**
- **Nav N1** — wordmark + links inline (Home/Cases/Sobre/Contato) + botão à direita. É a "impressão digital de nav de IA" nº 1 do Hallmark. Trocar por um arranjo menos padrão (N5–N9).
- **Eyebrows numerados 01–05** nas capacidades + kickers uppercase ("CAPACIDADES", "CASES DE SUCESSO", "SOBRE A NETZ"). Hallmark deixa numeração/kicker **desligado por padrão**.
- **Sequência SaaS canônica** hero → logos → features → cases → sobre → manifesto → contato → footer. Funciona, mas é o ritmo que todo gerador entrega — candidato a `redesign` para um shape distinto.

**Técnico / agent-readiness (da auditoria + do fetch)**
- **Raiz vazia:** `netz.now` (sem `/pt/`) volta praticamente vazio, canonicalizando pra `/pt/`. A raiz deveria redirecionar (301) ou renderizar — hoje é buraco de SEO e de primeira impressão.
- **Prontidão para agentes:** faltam (conferir) `llms.txt`, `hreflang` (há /en/ /es/, mas a auditoria não achou hreflang), e Schema.org. **Ironia produtiva:** a NETZ *vende* "sites prontos para agentes" — o próprio site é o primeiro case a provar isso.

**Bandeira de confidencialidade (verificar)**
O site nomeia publicamente **"Empresa de Saneamento Riograndense"** e linka `/cases/corsan/`, enquanto o doc de priorização do consórcio manda o case de saneamento ser **sempre anonimizado**. Ou a regra do consórcio não se aplica a este case público específico, ou há um vazamento a corrigir. **Confirmar antes de qualquer material derivado.**

## Fixes priorizados

**Ganho rápido (baixo esforço, alto retorno):**
1. Consertar a raiz (`netz.now` → 301 pra `/pt/` ou render).
2. Adicionar `llms.txt`, `hreflang`, Schema.org — fecha a auditoria e vira prova viva do discurso "agent-ready".
3. Resolver a bandeira de confidencialidade do saneamento.

**Copy (médio esforço, alto impacto de posicionamento):**
4. Reescrever o H1 para algo específico e honesto (o que a NETZ faz que ninguém pensa igual — ancorar na metodologia de assistentes OU no nicho).
5. Reposicionar as 5 capacidades para um recorte mais afiado, alinhado à definição de nichos/metodologia que já organizamos no painel.
6. Subir o Manifesto e usar a linha "agentes de provocação → transformadores" como espinha.

**Estrutura (escopo de `redesign`):**
7. Sair do nav N1 e dos eyebrows numerados; variar o ritmo da página.

## Como executar com o Hallmark (já que é Claude Code + Astro)
- `hallmark audit https://www.netz.now/pt/` → punch list priorizada, sem editar.
- `hallmark study <um site que vocês admiram>` → extrair o DNA e travar num `design.md` que vira a fonte única de marca (site + painel + portal + entregas de agência).
- `hallmark redesign` na home, dentro dos limites do Astro, preservando conteúdo/IA/marca — trocando só a camada visual/estrutural.

---

## Síntese
O **painel** precisa de tokenização + quebra da mesmice por grupo + auditoria de estados/contraste — nessa ordem. O **site** já tem conteúdo real e cases fortes; os problemas são de **posicionamento genérico** (H1 e 5 capacidades que não dizem o nicho), **fingerprints de IA** (nav N1, eyebrows numerados) e **prontidão técnica** (raiz vazia, agent-readiness) — mais uma **bandeira de confidencialidade** a verificar. Os dois se beneficiam do mesmo movimento: um `design.md`/`tokens.css` único como fonte de marca, com o Hallmark rodando no fluxo.
