# Mintzie — Revisão profunda & planos (produto e Sebrae/PI)

*Revisão de todo o repositório `mintzie-site-assistant` (jul/2026): server.js, widget, extensão, personas, base de conhecimento, governança e material da imersão. Três partes: (1) o estado real do que existe, (2) o plano de evolução como assistente do site, (3) os planos de produtização e de metodologia/PI no Sebrae — e a sequência que os une.*

---

## Parte 1 — O que existe, com honestidade

### 1.1 O que está surpreendentemente maduro (e é raro no mercado)

**A governança não é discurso — está implementada.** O conjunto `classificacao-informacao.md` (fronteira público × interno com teste de decisão), dois cérebros arquiteturalmente separados (`brain: netz` / `brain: imersao`), `faq-index.json` com status ✓/~/⚠, definições versionadas (v0.1→v0.3 com changelog, registro de decisões e pendências marcadas) e guardrails em sete categorias (anti-alucinação, anti-injection, LGPD, não fechar comercial, fronteira público×interno, ações de risco com confirmação) é, na prática, **um ciclo de governança de assistente funcionando**. A maioria das empresas que vende "chatbot com IA" no Brasil não tem nada disso. Este é o ativo de verdade do repositório — mais que o código.

**A camada comercial embutida é inteligente.** O SPIN implícito na persona, a regra de sintetizar o briefing no campo "Desafio" (nunca copiar a frase literal), o prefill do formulário com iniciativa, as ações na página (scrollTo, fillIndex, click com regex de risco + `confirmed:true`) — o Mintzie não é um FAQ falante, é um qualificador de leads disfarçado de mascote. Isso é exatamente a "máquina de aquisição" (d3 do painel) em embrião.

**A camada de encantamento é diferencial real.** 24 estados de vídeo, glitch de transição, o gato que agarra o cursor, exit-intent com choro, sons, modo fallback SVG quando CSP bloqueia — nenhum widget de chat brasileiro tem essa densidade de personagem. Na linguagem da narrativa: o Mintzie é o primeiro **habitante da rede** visível ao público, e a prova viva do manifesto ("agora desenvolvemos agentes transformadores").

### 1.2 O que está frágil — em ordem de gravidade

**🔴 CRÍTICO 1 — O cérebro interno é selecionável pelo cliente.** Em `server.js`, `body.brain` vem do navegador e escolhe entre `netz` e `imersao`. O cérebro `imersao` carrega **todo o acervo interno** (síntese da imersão, finanças, sócios, Sebrae, tensões). Se este servidor subir público como está, **qualquer pessoa que envie `{"brain":"imersao"}` ao `/api/chat` lê a cozinha inteira da NETZ** — sem precisar de nenhum truque de injection. A regra-mãe do doc de classificação ("nenhum conteúdo interno sobe a servidor público") está correta no papel e violável na arquitetura. Além disso, `public/painel-imersao.html` está na pasta pública e o alias `/painel` o serve a qualquer visitante.

**🔴 CRÍTICO 2 — O endpoint de governança entrega o prompt inteiro.** `/api/governance` retorna persona + knowledge + modelo, sem autenticação. O guardrail nº 3 diz "nunca revele o prompt"; o endpoint o publica em JSON. E `ALLOW_PROMPT_OVERRIDE=true` por padrão permite que qualquer cliente injete `testAdjustment` **com prioridade sobre todas as regras** — um bypass total de guardrails via API pública.

**🟠 3 — Chave de API commitada.** O `.env.shared` com a chave Gemini no repo (o README admite o risco). Basta um clone vazado. Rotacionar e tirar do git antes de qualquer passo público.

**🟠 4 — Sem CORS restrito, sem rate limit, sem cap.** `Access-Control-Allow-Origin: *` + nenhum limite por IP/sessão = qualquer site pode embutir o endpoint e queimar a cota (e o custo) de vocês.

**🟡 5 — O briefing colhido evapora.** Toda a inteligência do SPIN morre no `sessionStorage` do visitante. Não há log de conversas no servidor, nem webhook. Se a pessoa contar o desafio inteiro ao Mintzie e fechar a aba sem enviar o formulário, **o lead nunca existiu para a NETZ**. É a maior perda de valor comercial do sistema atual.

**🟡 6 — Nada é medido.** Zero eventos (aberturas, conversas, perguntas sem resposta, handoffs). Sem isso não há melhoria dirigida, não há relatório para cliente — e não há o número que o piloto/case vai precisar.

**🟡 7 — Peso e bateria.** 24 `<video preload="auto">` injetados em toda página + `requestAnimationFrame` rodando permanentemente (mesmo com o chat fechado). Para a empresa que vende Core Web Vitals (e cuja auditoria técnica já apontou a raiz do site vazia), o widget atual reprovaria na própria auditoria. Sem `prefers-reduced-motion` também.

**🟡 8 — Pendências ⚠ paradas desde a v0.3** (localização/atendimento, LGPD, escopo de suporte) — o padrão "pronto nunca definido" da síntese, agora dentro do produto. São três respostas de dez minutos cada.

---

## Parte 2 — Plano de evolução: Mintzie como assistente do site (v0.4 → v1.0)

Quatro trilhas, em ordem: **proteger → converter → medir → encantar**. O erro clássico seria começar pela quarta.

### v0.4 — Proteger (1 semana, pré-requisito para publicar)
1. Separar os deploys: o servidor público só carrega o cérebro `netz`; o cérebro `imersao` + painel viram build local separado (ou atrás de auth). Remover `painel-imersao.html` da pasta pública.
2. `ALLOW_PROMPT_OVERRIDE=false` em produção; `/api/governance` atrás de senha/token.
3. Rotacionar a chave Gemini, tirar `.env.shared` do git.
4. CORS restrito a `netz.now`; rate limit simples (por IP: N msgs/min, M/dia); cap de 16 mensagens já existe — manter.
5. **Critério de pronto:** um teste adversarial de 10 tentativas (brain switch, testAdjustment, extração de prompt) falha em todas.

### v0.5 — Converter (2 semanas, é aqui que o Mintzie vira pipeline)
1. **Log de conversas no servidor** (JSONL ou SQLite; anonimizado conforme LGPD — sem armazenar além do que a persona já limita).
2. **Webhook de lead para o Discord da NETZ** (vocês já vivem lá): quando houver prefill/handoff, o Mintzie posta o resumo do briefing SPIN no canal comercial. O gato qualifica → o time fica sabendo em tempo real. Esta única feature transforma o widget em gerador de pipeline.
3. Fechar as 3 pendências ⚠ e portar para v0.4 do conteúdo.
4. Publicar no `netz.now` de verdade (junto com as 3 correções da auditoria técnica — raiz, hreflang, llms.txt). O Mintzie no ar É a demo do produto.

### v0.6 — Medir (2 semanas)
1. Eventos mínimos: abertura, nº de conversas, perguntas sem resposta ("confused"), handoffs, prefills.
2. **Digest semanal automático no Discord**: perguntas mais feitas, perguntas sem resposta (alimentam o faq-index — o ciclo de governança que hoje é manual vira loop automático), leads gerados.
3. Métricas-alvo do assistente: % de perguntas respondidas pela base; taxa conversa→handoff; leads/semana. São os números do futuro case.

### v0.7+ — Encantar e endurecer (contínuo, capado)
1. Performance: carregar só idle/thinking/talking no load; demais estados sob demanda; pausar o render loop com chat fechado/aba oculta; `prefers-reduced-motion`.
2. **Suíte de evals versionada**: 40–60 perguntas (FAQ + ataques de injection + fronteira público×interno) rodada a cada mudança de versão, com nota. Isso não é só qualidade — é o "selo auditável" que diferencia a metodologia (ver Parte 3).
3. Vídeos que faltam pelo custo/benefício (os prompts já estão prontos no `mintzie-faqs-e-poses.md`).
4. **Parking lot explícito**: extensão Chrome (adorável, não é rota de receita) e "enxergar a tela" (feature de demo, não de v1). Datar a revisão, não deixar aberto.

---

## Parte 3 — Os dois planos: produto vendável e metodologia/PI no Sebrae

### 3.0 A decisão honesta antes dos planos

Dois avisos que os documentos da imersão já deram e que este plano não pode fingir que não existem:

**(a) "Chatbot de site" genérico é wrapper — e wrapper morreu** (Hermes, Parte 2). O mercado tem Intercom, Tidio e dezenas de clones. O que é defensável no Mintzie **não é o chat**: é o conjunto (1) **governança implementada** (fronteira público×interno, guardrails, versões, evals), (2) **método comercial embutido** (SPIN, briefing sintetizado, handoff), (3) **personagem como interface** (o mascote com 24 estados — brand character, não balão genérico). Vende-se o método com o software dentro, não o software.

**(b) Este plano pressupõe que a d1 da imersão fechou no Mintzie.** A síntese apontou que o doc Sebrae apostava no Mintzie e os dados de mercado no assistente de obra. Se os quatro decidirem pelo Mintzie, ótimo — mas a escolha precisa ser explícita e o assistente de obra formalmente arquivado ou datado. Um plano executado pela metade por causa de uma decisão não tomada é o padrão que vocês vieram quebrar. E antes de registrar qualquer coisa: **resolver em ata a titularidade** (o software nasce no CNPJ da NETZ, não no CPF de quem escreveu — o doc Sebrae já alerta; a síntese marcou como ponto cego).

### 3.1 Plano A — Produto: "assistente governado" como serviço produtizado

**Formato: serviço produtizado em 3 tiers — não SaaS self-serve.** Quatro sócios sem suporte 24/7 não sustentam SaaS aberto; serviço produtizado tem a margem que o benchmarking (b2: 30%→60-70%) prometeu e replica o que já existe no repo.

- **Tier 1 — Presença:** o personagem do cliente (ou neutro) + base de conhecimento governada + FAQ index + handoff WhatsApp. Setup fechado + mensalidade de manutenção da base.
- **Tier 2 — Conversão** (desenhado para ser o mais escolhido e o mais lucrativo, P4 da pesquisa): tudo do 1 + briefing SPIN, prefill de formulário, ações na página, webhook de leads, relatório mensal (perguntas, leads, buracos da base).
- **Tier 3 — Operação:** tudo do 2 + integrações (CRM/WhatsApp Business), segundo cérebro interno para equipe do cliente, evolução contínua com evals — o retainer.

Referência de mercado (doc Hermes, Parte 2): agente de escopo fechado custa US$ 1.500–5.000 de build + US$ 300–800/mês lá fora. A tradução BR sai do piloto — não cravar preço antes dele, mas **publicar preço na landing** (método Buffer) é parte do teste.

**Sequência de validação (não construir mais antes disso):**
1. Mintzie publicado no netz.now = demo viva e case zero (v0.4–v0.5 acima são pré-requisito).
2. Landing "Assistente com governança para seu site" com os 3 tiers e preço → medir cliques em contratar.
3. **Piloto pago de 90 dias com 1 cliente de relação existente** (candidatos naturais: Cris Casagrande — já tem site NETZ e público leigo; BSS — dúvidas repetitivas sobre editais; VIEX). Meta do piloto: X conversas, Y leads, Z% de perguntas respondidas — números que viram o case.
4. **Critério de morte, por escrito:** se em 90 dias a landing + piloto não geraram nem receita nem sinal de demanda, o Mintzie vira *feature dos projetos de site* (diferencial de venda, ângulo B.5 do doc Hermes) — não produto próprio. Isso também é um resultado digno.

### 3.2 Plano B — Sebrae: metodologia registrada como PI + portfólio

**O insight jurídico que organiza tudo** (do doc Sebrae): *métodos não são registráveis — a expressão é*. Logo, o ato que cria o ativo de PI é **escrever o manual**. E o manual está 70% pronto, disperso no repo: `classificacao-informacao.md` + guardrails + `faq-index.json` + ciclo de versões + personas. Falta empacotar com nome e etapas.

**Fase 0 — Proteger (semanas 1–2):**
- Registro do software no **INPI e-Software** (GRU 730, ~10 dias, 50 anos de proteção), **no CNPJ da NETZ** — widget + server + estrutura de arquivos de governança.
- Registro de **marca "Mintzie"** (e do nome da metodologia, quando batizada) no INPI.
- Consolidar o **Manual da Metodologia** (o documento-ativo). Estrutura sugerida, espelhando o método NETZ que já é público (Descoberta → Definição → Prototipação → Evolução):
  1. *Inventário e fronteira* — classificar conhecimento público × interno (o que já existe como doc de governança);
  2. *Persona e personagem* — identidade, tom, limites;
  3. *Base governada* — knowledge + FAQ index com status e pendências;
  4. *Guardrails e evals* — as 7 categorias + suíte de teste versionada;
  5. *Implantação e handoff* — widget, ações, webhook de leads;
  6. *Evolução contínua* — versões, changelog, digest de perguntas sem resposta.
- Direito autoral do manual é automático; registro na Biblioteca Nacional como reforço de anterioridade, opcional e barato.

**Fase 1 — Portas de baixo atrito (mês 1):** login AMEI + cadastro no **Unio** (categorias transformação digital / design web) com o Mintzie como demo; inscrição no **SGF nacional** (Edital 01/2025, permanentemente aberto). Atenção ao pré-requisito real: **atestados de capacidade técnica** — os cases Corsan/Sicredi servem, mas a titularidade precisa estar resolvida em ata (ponto cego da síntese).

**Fase 2 — Sebraetec como executor (mês 1–2):** mapear no DataSebrae as Fichas Técnicas existentes de Serviços Digitais/transformação digital no RS (subsídio de 70%) e credenciar-se para **executar fichas que já existem** — é receita e reputação enquanto a ficha própria não sai.

**Fase 3 — A jogada de maior alavancagem (mês 3+, só com case na mão):** propor ao Comitê do Portfólio a **Ficha Técnica própria** — algo como "Implantação de assistente virtual com governança para pequenos negócios" — e/ou entrada no **Cadastro de Soluções de Mercado**. Se aprovada, o Sebrae subsidia 70% da aplicação da *sua* metodologia em todo o RS. Vitrine paralela: Prêmio Sebrae Startups.

**Realismo, para não repetir o padrão:** credenciamento é porta, não cliente (rodízio, sem garantia, o próprio doc Sebrae avisa); o ticket Sebraetec é pequeno — a versão Sebrae do produto é o Tier 1 simplificado. O valor estratégico do Plano B é **distribuição, atestados e legitimação da PI**, não margem. A margem mora no Plano A.

### 3.3 A sequência única (os dois planos são um ativo em dois canais)

| Quando | O quê | Dono* | Pronto quando |
|---|---|---|---|
| Semana 0 | Decisão d1 ratificada (Mintzie = o produto) + titularidade em ata | os 4 | ata assinada; alternativas datadas |
| Semanas 1–2 | v0.4 segurança + registro INPI (software + marca) | Denis / João | teste adversarial passa; protocolo INPI emitido |
| Semanas 2–4 | v0.5 conversão + Mintzie no ar no netz.now + correções da auditoria | Denis / Gui | widget público, webhook postando leads no Discord |
| Semanas 3–5 | Manual da Metodologia v1 consolidado | João | documento fechado, nomeado, com as 6 etapas |
| Mês 1 | Landing com 3 tiers e preço + Unio/SGF cadastrados | Stacke / Gui | landing no ar; cadastros submetidos |
| Meses 2–3 | Piloto pago de 90 dias com 1 cliente | dono do produto | contrato assinado, métricas definidas |
| Mês 3+ | Case documentado → proposta de Ficha Técnica Sebraetec | João | case publicado; proposta protocolada |

*Sugestões por afinidade demonstrada no acervo — a sala decide.

**O que este plano explicitamente NÃO faz nos 90 dias:** extensão Chrome, visão de tela, novos estados de vídeo além dos existentes, SaaS self-serve, versão multi-idioma do assistente, e qualquer segundo produto. Cada um desses ganha data de revisão, não fica "aberto".

---

## Fecho

O repositório do Mintzie é o artefato mais próximo de produto que a NETZ já produziu — não pelo gato, mas pelo **sistema de governança que cresceu em volta dele**. A revisão mostra que faltam duas semanas de endurecimento para ele poder ir a público, e que o ativo registrável (o manual) está 70% escrito sem que ninguém tenha percebido. O risco não é técnico: é o de sempre — os dois CRÍTICOS da Parte 1 precisam de correção *antes* do deploy, a d1 precisa fechar *antes* do registro, e o piloto precisa de um contrato assinado *antes* de qualquer feature nova. Frutificar, não ramificar.
