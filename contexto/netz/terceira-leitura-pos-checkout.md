# Terceira leitura — o consultor volta depois do check-out (15/jul/2026)

*A síntese pré-imersão diagnosticou uma "máquina de preparação que não virava empresa". A reanálise de 13/jul registrou a virada (sociedade fechada, rota refinada, produto elevado) e apontou 6 tensões novas (T1–T6). Esta terceira leitura incorpora o que veio depois: o check-out com compromissos por sócio (15/jul), a reunião do site (14/jul) e o novo site em Astro, a priorização de nichos do consórcio, o estudo de parcerias/certificações e o estado do repositório. Formato: placar das tensões → avanços → o que só se enxerga agora → direcionamentos para os dois primeiros ciclos de terça. Onde infiro além dos documentos, sinalizo.*

---

## 1. Placar — o que os últimos dois dias fizeram com as 6 tensões

**T1 (a meta não fecha por hora) — ganhou dono.** O Gui levantou no check-out exatamente o que a reanálise pediu: *decompor a meta financeira/precificação — quantos produtos/serviços por período para bater a meta*. A tensão saiu do não-dito para a lista de compromissos. Falta o entregável: a folha "meta por frente" (ver §4). Status: **encaminhada, não resolvida**.

**T2 (nicho de largada em aberto) — mudou de natureza, e para melhor.** A priorização do consórcio fez o que nenhum documento tinha feito: **decidiu por rubrica, com dado** (20 subsegmentos, 7 critérios ponderados, 3 ondas). O nº 1 é crédito cooperativo (4,80), com saneamento, ONA, Dimed e Unimed fechando a faixa A. Mas atenção à leitura fina no §3 — a priorização respondeu o nicho *do consórcio* (frente C), não o da *metodologia de assistentes* (Edital 02). São duas perguntas que agora parecem uma. Status: **meio-fechada, com risco de conflação**.

**T3 (três frentes = reexpansão) — os donos apareceram.** O check-out distribuiu por escrito o que a reanálise cobrava: Denis → agências + site + Hermez-tarefas; João → papel comercial (funis/frentes/produtos) + parcerias com consultorias + Sebrae; Stacke → pipeline de conteúdo + relacionamento agências + Blue; Gui → execução do site + dados/agentes + decomposição da meta. Pela primeira vez em dois anos de acervo, **cada frente tem um nome ao lado**. Status: **fechada no papel; o teste é a primeira terça**.

**T4 (Hermez sobrecarregado) — corrigiu na direção certa.** O compromisso do Denis é "aprimorar o Hermez como *gestor de tarefas* (cobrança no dia-a-dia)" — a ordem Tarefas → Comercial → Follow-up dos acordos bate com a recomendação "digest primeiro, comercial depois". Status: **alinhada**. O momento da verdade tem data: **a primeira terça 05:00 com o digest real no Discord**. Se ele rodar duas semanas seguidas com dados corretos, o Hermez frutificou; qualquer feature antes disso é o padrão antigo.

**T5 (a consequência é a visibilidade, não o R$ 50) — pendente de dados.** A simulação de 2 semanas está correndo. O check-out acrescentou o reforço certo: "não abrir exceções; ser exigente consigo primeiro". A revisão precisa ser **com números** (quantas tarefas escorregaram, de quem, por quê) — e se escorregarem concentradas num sócio por carga externa, a resposta é redistribuir (T1), não multar.

**T6 (a frente C paga a meta mas queima o sócio; o antídoto é a base reusável) — segue sem ser nomeada na sala.** Nenhum compromisso do check-out toca nela diretamente. Ela reaparece, porém, disfarçada de oportunidade — ver §3, ponto N1: a replicação do GPS é exatamente "base × personalizável" aplicado à frente C.

---

## 2. Avanços que merecem registro (além do placar)

**O check-out mudou o gênero do documento.** Dois anos de acervo são atas de *intenção*; o `checkout-invernetz-compromissos.md` é uma ata de *obrigação* — nome, escopo, horizonte (2 semanas/60 dias) e a expressão que a sala mesma escolheu: "skin in the game, escrito na pedra". É a primeira vez que o material da NETZ tem a forma do que a pesquisa chamava de consequência.

**O site virou o laboratório do novo jeito de trabalhar.** A reunião de 14/jul não produziu só uma lista de tarefas — produziu um **método de colaboração** (cada um numa branch → diff → merge → no ar), uma regra editorial honesta ("não inventar número; mock-up basta; dado só onde existe") e a decisão de âncora com definição de pronto. O rebuild em Astro com design system pronto, testes e o painel de tarefas por seção é a iniciativa-âncora com mais chance de "pronto" real da história da casa. Vale notar o simbolismo: a empresa que "tinha estrutura esperando conteúdo" está agora produzindo o conteúdo (copies em 1ª pessoa, storytelling de cases à la Accenture, seção de lastro).

**A priorização é a primeira decisão comercial da NETZ tomada por dado, não por entusiasmo.** A rubrica é transparente e recalculável, o ranking força trade-off, e o achado do **cooperativismo como canal transversal** (OCB/Sescoop/OCERGS alimentando crédito, Unimed e energia ao mesmo tempo) é genuinamente estratégico — transforma três segmentos desconexos num único go-to-market do Sul.

**A infraestrutura de conhecimento fechou o ciclo.** `contexto/` como fonte única com regra de manutenção, `build-brain.sh`, painel com deep-link por aba, transcrição → destilação → cérebro em 24h. A "máquina de preparação" do diagnóstico original não foi desligada — foi **convertida em sistema operacional da empresa**. É o melhor desfecho possível para aquele padrão: a mesma competência, agora a serviço da execução.

**Miudezas que contam:** produto aprovado na Únio aguardando demanda; deploy estruturado (Coolify, Basic Auth, modos public/internal); o DEPLOY.md já incorpora a rotação da chave e o `git rm --cached .env.shared` (os dois avisos da v0.4).

---

## 3. O que só se enxerga agora — quatro pontos novos

**N1 — A priorização respondeu, sem querer, a pergunta que a metodologia deixou aberta.** [inferência sinalizada] O doc da metodologia admite: "falta escolher o nicho de largada". A reanálise sugeriu obra (case do Rafa). A priorização aponta crédito cooperativo (4,80). O que ninguém escreveu ainda: **o GPS de carreira do Sicredi É a metodologia de assistentes aplicada** — um assistente que conduz pessoas por um processo (carreira) sobre vários sistemas, com base reusável e camada personalizada. Logo, o POC pago mais quente da metodologia não é obra nem um setor novo: é **replicar o GPS numa segunda cooperativa** (singular/central Sicredi ou Unicred, warm intro, ficha 5.1 pronta, pitch escrito). Isso une num movimento só: o nicho da metodologia (T2), a receita da frente C (T1), o antídoto base×personalizável (T6) e o primeiro one-pager da Onda 1. Obra/Rafa não morre — vira sonda secundária barata (uma conversa de preço, não um build). Recomendo levar essa fusão à terça como decisão explícita: *"o nicho de largada da metodologia é crédito cooperativo, e a prova é a replicação do GPS"*. Se a sala discordar, ótimo — mas que discorde de uma proposta nomeada, não deixe as duas perguntas soltas.

**N2 — Nenhum compromisso do check-out é uma conversa de dinheiro com cliente.** Releiam a lista: Hermez, copy, conteúdo, site, portal, agenda — tudo construção interna ou preparação de canal. As exceções parciais são as ≥2 reuniões com agências do Denis (contato externo real, frente A) e o teste da Blue. Mas a frente C — a que paga a meta — não tem um único compromisso com data, e o ponto cego que três relatórios seguidos apontaram (**a voz do cliente pagante**) segue sem dono. A "fase de validação" da própria priorização (entrevistas com 1–2 contatos por segmento) ficou sem responsável. Correção barata: transformar em compromisso de ciclo 1 — **um café reativado (VX/Pulsar/Almaria) + uma conversa de replicação do GPS + a pergunta de preço ao Rafa**. Três conversas, zero build.

**N3 — A reexpansão agora chega vestida de estratégia.** Em 48h entraram no acervo: o estudo de certificações enterprise (Salesforce/Microsoft/Anthropic, roadmap 12–18 meses), a ideia de plugins de Chrome como produto, case×blog, fábrica de canais no parking lot. Tudo bom material — e nenhum cabe no trimestre de 52h/semana cuja prioridade nº 1 é *aquisição de clientes*. O padrão antigo não vai voltar como dez protótipos; vai voltar como cinco documentos estratégicos "importantes". Regra de contenção sugerida: **o que não carrega a meta deste trimestre ganha data de revisão (out/2026), não atenção** — inclusive o estudo de certificações (a exceção defensável: registrar-se nos diretórios de parceiros da camada de IA custa horas, não semanas — mas mesmo isso disputa as 52h). Mesma regra para o portal: **"pronto" agora significa a Blue passando 1 job real por ele — nenhuma feature nova até lá.**

**N4 — Fonte da verdade tripla.** Os acordos declaram Notion = operação oficial; a prática dos últimos dias mostra tudo vivendo em GitHub + Discord + painel. São três lugares e a regra "se não subiu, o Hermez não vê" só vale para o GitHub. Não é grave, mas é o tipo de fricção que corrói cadência — decidir na primeira terça onde mora a tarefa (uma resposta possível e honesta: o kanban do Hermez é a operação; o Notion sai da frase).

---

## 4. Direcionamentos — os dois primeiros ciclos de terça

**Ciclo 1 (terça 21/jul).** O digest das 05:00 chega ao Discord com os dados da primeira semana — é o evento mais importante do mês; se falhar, conserta-se o digest antes de qualquer outra coisa do Hermez. Na reunião: (1) decidir N1 — o nicho de largada da metodologia (proposta: crédito cooperativo via replicação do GPS; obra como sonda); (2) apresentar a **meta decomposta por frente** (Gui) — formato sugerido: frente C = R$ X via N projetos de ticket médio Y; frente A = R$ Z via M sites/mês; frente B = R$ ~0 + K cases/atestados; conferir se a soma bate R$ 57.996 e realocar horas se não bater; (3) nomear as três conversas de dinheiro do N2, cada uma com dono e dia; (4) resolver a fonte da verdade (N4). Entregáveis da semana que já têm dono e não mudam: site no ar com as tarefas de 14/jul, ≥2 reuniões de agência, primeiro one-pager (só o de crédito cooperativo — os outros quatro esperam).

**Ciclo 2 (terça 28/jul).** Revisão dos 14 dias **com dados**: as 13h couberam? quantas tarefas escorregaram e por quê? a multa entra em vigor ou ajusta? (T5). Status das três conversas de dinheiro — se nenhuma aconteceu, este é o único item da pauta, porque será o padrão antigo de volta com crachá novo. Se aconteceram: primeira proposta de POC/replicação na rua, e o nome do método + INPI protocolado no embalo (sem nome não há registro; sem registro não há Edital 02).

**O que explicitamente não entra nos ciclos 1–2:** features novas no portal e no Hermez além do digest; os 4 one-pagers restantes; certificações enterprise; plugins de Chrome; fábrica de canais; design system além do que o site precisa. Tudo datado para revisão de outubro — escrito, para não assombrar.

---

## 5. Fecho

Em dez dias, a NETZ atravessou três estados: preparava sem decidir (pré-imersão), decidiu com número e consequência (INVERNETZ), e agora — o check-out mostra — **começou a se obrigar por escrito**. O sistema operacional está montado: donos, cadência, digest, fonte única, site-laboratório. O que este terceiro olhar enxerga é a última peça que falta, a mesma dos dois relatórios anteriores, agora reduzida a três conversas que cabem numa semana: um café com um parceiro da frente C, uma proposta de replicar o GPS numa cooperativa, uma pergunta de preço ao Rafa. A empresa já provou que sabe se organizar para trabalhar. Os próximos quatorze dias provam se ela se organiza para **cobrar** — no sentido de emitir uma cobrança. O primeiro cogumelo da nova era não é o site nem o digest: é um "sim, quanto custa?" dito por alguém de fora.

---

*Rastreabilidade: checkout-invernetz-compromissos.md (compromissos por sócio, novas ideias, leituras de fundo); netz-society-acordos.md (13h, meta, consequência, cadência, Hermez); priorizacao-e-roteiro-comercial.md (rubrica, ranking, ondas, fichas, cooperativismo como canal); metodologia-netz-assistentes.md e sebrae-edital-pi-metodologia.md (nicho em aberto, régua do diferencial, valores-hora); site-tarefas-reuniao.md (site-âncora, workflow de branches, regra dos números, portal "pronto"); comercial-estrutura.md (frentes A/B/C, funis); estrategia-parcerias-certificacoes-netz.md (estudo enterprise — a datar); parking-lot-society.md; reanalise-pos-invernetz.md (T1–T6, base de comparação). Estado do repositório: site-netz-2026-astro, DEPLOY.md, build-brain.sh, v0.4.*
