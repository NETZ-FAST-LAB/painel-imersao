# Hermes — O Leque Completo

> **O que é isto:** um mapa de possibilidades do Hermes agent, nos três ângulos que importam (cérebro interno, produto vendável, dinâmica de onboarding), para a mesa da imersão. O objetivo é abrir o leque *antes* de decidir — não recomendar um caminho.
> **Base factual:** o que o Denis descreveu no #estratégia — Hermes é agente de memória persistente/evolutiva na VPS, multiagente, interface própria (kanban/to-dos), integrações (Telegram/Discord/Slack/terminal), múltiplos LLMs, guarda "skills". Ele quer ensinar o Hermes como quem faz onboarding de uma pessoa nova, ao vivo na imersão.
> **Como cada item é marcado:**
> `[barato]` = dá para testar em horas/dias, baixo risco — bom candidato a fazer na própria imersão.
> `[médio]` = semanas de trabalho, precisa de dono e escopo.
> `[aposta]` = mês+ de investimento, muda o jogo se der certo, mas é onde mora o risco de virar mais um protótipo sem fim.
> **Aviso:** abrir o leque não é decidir percorrê-lo todo. O gargalo de vocês é execução. Um Hermes que faz UMA coisa bem, terminado, vale mais que dez ramos abertos. Leiam isto como cardápio, não como lista de tarefas.

---

## Ângulo A — Hermes como cérebro operacional interno
### A hipótese: o Hermes ataca diretamente o "temos tudo, mas demoramos"

Este é o ângulo mais alinhado ao gargalo real da NETZ. Se o problema é execução e continuidade, um agente que *segura a memória e o ritmo* do time é remédio direto — desde que ele opere processos, não só armazene informação.

**A.1 — Memória institucional viva** `[barato]`
O Hermes como o lugar onde nada se perde entre reuniões. Hoje o conhecimento de vocês está espalhado (Discord, transcrições, cabeças). O Hermes poderia ser a fonte única: decisões tomadas, por que foram tomadas, o que ficou pendente. O teste barato: alimentar ele com as 26 transcrições + o acervo de decisões e perguntar "o que decidimos sobre X?". Se responder bem, já virou útil no primeiro dia.

**A.2 — Guardião do WIP limit** `[médio]`
Conecta com o framework do Problema 1 da pesquisa. O Hermes como o agente que *vê* quantas iniciativas estão ativas por sócio e cutuca quando algo está "envelhecendo". Não é só kanban passivo — é um kanban que fala: "Gui, o Rito Derma está parado há 12 dias, e você abriu duas coisas novas". O ritmo que falta ao time vira função de máquina, não de força de vontade.

**A.3 — Operador de processos repetíveis** `[médio]`
Aqui o Hermes deixa de ser memória e vira mão de obra. Candidatos: gerar o relatório de progresso da residência tech (que o João já faz manualmente), transformar transcrição de reunião em ata com decisões e donos, montar o primeiro rascunho de proposta comercial a partir de um briefing. Cada processo que o Hermes assume é uma hora/semana que volta para o time.

**A.4 — O "onboarding" como o Denis propôs** `[barato]`
A ideia dele — ensinar o Hermes como quem integra uma pessoa nova — é, na prática, a definição do papel dele. O valor não está só no resultado, está no *processo de ensinar*: ao explicar ao Hermes como a NETZ funciona, vocês são forçados a explicitar processos que hoje são tácitos. É um exercício de clareza organizacional disfarçado de configuração técnica. (Mais sobre como conduzir isso no Ângulo C.)

**A.5 — Hub de integrações do time** `[médio]`
O Hermes como cola entre as ferramentas que vocês já usam. Ele já é aberto a Telegram/Discord/Slack. Imaginável: avisa no Discord quando um card muda de status, responde no Telegram uma pergunta sobre um projeto, puxa um dado do Notion. Vira o sistema nervoso central em vez de mais um app para checar.

> **Leitura do Ângulo A:** este é o ângulo com melhor razão valor/risco para a NETZ *agora*. A.1 e A.4 são baratos e atacam o gargalo real. O risco é sobre-engenheirar (A.5 pode virar um buraco sem fim de integrações). Se o Hermes só fizesse A.1 + A.2 bem-feitos, já teria justificado a VPS.

---

## Ângulo B — Hermes como produto/serviço vendável
### A hipótese: o que vocês construíram para vocês, outros pagariam para ter

Este é o ângulo do "ferramenta interna → produto" (caso Tweet Hunter, que o próprio Gui colou no Discord). É sedutor e legítimo — mas é também onde mora o "build trap" da pesquisa: construir demais antes de validar que alguém paga.

**B.1 — Hermes como "cérebro digital" white-label** `[aposta]`
Vender o Hermes inteiro para outras empresas: cada cliente ganha seu próprio agente de memória persistente, treinado na cultura e nos processos dele. Conecta com a ideia do "útero de assistentes de cultura" que já está no cemitério. É a maior aposta do leque — e a mais próxima do que a Wonderful (US$2bi) faz. O risco: é um produto de infraestrutura complexo, com suporte pesado, num mercado onde gigantes estão entrando. A pergunta da pesquisa vale aqui em dobro: "por que a nossa, e não a deles?".

**B.2 — Agente vertical de nicho** `[médio]`
Em vez de vender o Hermes genérico, usar o Hermes como *motor* para construir um agente especializado num nicho — o "niche of one" da pesquisa. O assistente de relatórios de obra (que já é MVP validado com o Rafa) é o candidato pronto: o Hermes vira a espinha, e vocês empacotam "assistente de obra" como produto. Muito menos arriscado que B.1 porque o nicho é estreito e a dor é conhecida.

**B.3 — "Onboarding de agente" como serviço** `[médio]`
Transformar a *dinâmica* que o Denis quer fazer num serviço. Se ensinar o Hermes a operar a NETZ funciona, vocês aprendem a fazer isso para clientes: "nós implantamos e treinamos o agente interno da sua empresa". Vende-se o método (a implantação + treinamento), não o software. Isso é o modelo de serviço produtizado, que a pesquisa mostra ter margem melhor — e aproveita que vocês são os "locais" no Brasil.

**B.4 — Micro-ferramentas geradas pelo Hermes** `[barato]`
O Hermes guarda "skills". Cada skill pode virar uma micro-ferramenta pública — uma isca de lead (conecta com o Problema 5 da pesquisa: ferramentas convertem mais que e-books). Ex.: um "audita seu site" (que já está no cemitério como ideia comercial) rodando como uma skill do Hermes, exposta numa página. Barato de testar, e alimenta o funil comercial.

**B.5 — Hermes como diferencial de venda, não produto** `[barato]`
O ângulo mais sutil: o Hermes não é o que se vende, é a *prova* de que a NETZ sabe fazer. "Nós construímos nosso próprio agente de IA com memória persistente" é uma credencial que fecha contrato de consultoria. Aqui o Hermes vale como portfólio vivo, não como SKU.

> **Leitura do Ângulo B:** o instinto natural é mirar B.1 (o grande produto), e é justamente o que a pesquisa alerta para evitar sem validação. Os ramos de menor risco — B.2 (agente vertical sobre o MVP de obra que já existe) e B.4/B.5 (skills como isca / Hermes como credencial) — dão retorno comercial sem a aposta pesada. Validar antes de construir: uma landing "assistente de obra" com preço (método Buffer) custa uma tarde e diz mais que meses de build.

---

## Ângulo C — A dinâmica de onboarding na imersão
### A hipótese: o processo de ensinar o Hermes é, ele mesmo, o entregável

Esta é a proposta concreta que o Denis já colocou na mesa. O insight que vale destacar: o maior valor da dinâmica talvez não seja o Hermes ficar pronto — é o que vocês descobrem sobre a própria NETZ ao tentar ensiná-lo.

**C.1 — Onboarding como exercício de explicitação** `[barato]`
Para ensinar o Hermes "como a NETZ funciona", vocês precisam responder: quais são nossos processos? quem faz o quê? como uma proposta vira projeto? Muitas dessas respostas hoje são tácitas ou inconsistentes entre os sócios. A dinâmica força o alinhamento. O entregável real é um documento de "como a NETZ opera" que hoje não existe — o Hermes é só a desculpa para escrevê-lo.

**C.2 — O teste do processo único** `[barato]`
Em vez de ensinar tudo, escolher UM processo real e levá-lo do zero ao funcionando durante a imersão. Candidato ideal: algo que dói e é repetível (ata de reunião, relatório da residência, rascunho de proposta). Ao fim dos 3 dias, o Hermes faz *uma* coisa de verdade. Isso é o oposto do protótipo sem fim — é o WIP limit aplicado ao próprio Hermes.

**C.3 — Cada sócio ensina sua área** `[barato]`
Uma dinâmica de formato: cada um "onboarda" o Hermes na sua frente — Gui ensina o fluxo de site/WordPress, Denis a infra, João a arquitetura de conteúdo, Stacke o comercial. No fim, vocês têm um mapa das quatro áreas *e* um Hermes que viu todas. Também expõe onde o conhecimento está concentrado numa cabeça só (risco de ônibus).

**C.4 — Definir o "quando o Hermes está pronto"** `[barato]`
O contraponto necessário. A dinâmica precisa de uma linha de chegada, ou vira brincadeira infinita de configurar. Antes de começar, definir: "o Hermes está pronto quando faz X sem ajuda". Sem isso, a dinâmica tem o mesmo destino dos outros protótipos. Esta é a decisão mais importante do Ângulo C — e a mais fácil de esquecer.

**C.5 — A dinâmica como decisão de papel** `[barato]`
Usar a própria dinâmica para responder a pergunta-âncora do painel: "infra interna, produto, ou os dois?". Ao tentar ensinar o Hermes, vocês vão sentir na prática se ele é mais útil como cérebro interno (Ângulo A) ou se tem cara de produto (Ângulo B). A experiência responde a pergunta melhor que a discussão teórica.

> **Leitura do Ângulo C:** aqui está o segredo que amarra tudo — a dinâmica do Denis é barata, ataca o gargalo (força explicitação e alinhamento) e ainda serve de instrumento de decisão para os outros dois ângulos. Se eu tivesse que apontar o maior valor do Hermes na imersão, não seria o software: seria C.1 + C.4 — vocês saírem com clareza de processos e uma definição de "pronto". O Hermes é o cavalo de Troia da organização que falta.

---

## Síntese: como ler este leque sem se afogar nele

Três padrões que atravessam os ângulos:

**O Hermes é melhor pergunta do que resposta.** Os ramos mais valiosos (A.1, A.4, C.1) não são sobre o que o Hermes *faz*, mas sobre o que ele *força vocês a organizar*. Um time que não termina as coisas ganha mais de um agente que impõe memória e ritmo do que de mais um produto para construir.

**O maior risco não é técnico, é o build trap.** O ângulo B (produto) é o mais empolgante e o mais perigoso — B.1 é exatamente o tipo de aposta grande que a pesquisa alerta para não fazer sem validação. Se o produto tentar, comece por B.2 (agente vertical sobre o MVP de obra que já existe) ou valide com uma landing antes de escrever código.

**A dinâmica do Denis é o melhor ponto de partida — se tiver linha de chegada.** C.2 + C.4 (um processo único, com definição de "pronto") transformam a imersão num teste real em vez de mais uma sessão de possibilidades. É o antídoto contra o próprio risco deste documento.

Se eu comprimisse o leque inteiro numa sequência para a mesa: **usar a dinâmica do Denis (C) para levar UM processo interno (A.3) do zero ao funcionando, com "pronto" definido, e deixar a decisão produto (B) explicitamente para depois — como parking lot datado, não como frente aberta agora.** Um Hermes que faz uma coisa bem, terminado no domingo, prova mais do que qualquer roadmap.

**A honestidade final:** este documento abre possibilidades porque você pediu o leque completo. Mas abrir dez ramos e perseguir dez ramos são coisas opostas. O valor do Hermes vai se materializar no dia em que ele *terminar* de fazer uma coisa — e isso é uma decisão de foco, não de imaginação. O leque está aberto; a parte que destrava é escolher um ramo e ir até o fim.

---

# Parte 2 — Cases, benchmarks e o que o mercado ensina

> Esta parte amplia a análise com pesquisa de mercado (jul/2026): casos reais, números e padrões de quem já construiu agentes de memória, virou ferramenta interna em produto, ou vende implantação de agentes. O objetivo é ancorar o leque acima em evidência, não em intuição.

## O que a arquitetura de memória ensina (e por que isso importa pro Hermes)

O Hermes se descreve como "agente de memória persistente" — e acontece que memória de agente virou uma disciplina de engenharia madura em 2026, com padrões e armadilhas documentados. Três achados que mudam como vocês devem pensar o Hermes:

**O dado que justifica o Hermes existir.** Pesquisa da Microsoft e Salesforce encontrou que a performance de IA cai 39% em média quando se passa de interação de turno único para múltiplos turnos sem gestão de memória adequada. Ou seja: o problema que o Hermes resolve é real e mensurável — um agente sem memória persistente é dramaticamente pior. Isso valida a intuição do Denis de investir nisso.

**O dado que assusta — e que é a maior lição para a NETZ.** Um estudo do MIT (NANDA, 2025) sobre implementações corporativas de IA generativa encontrou que 95% dos pilotos entregaram zero ROI mensurável. E a causa atribuída não foi qualidade do modelo — foi *falta de prontidão de contexto*: as empresas não tinham organizado seus dados e processos antes de jogar IA em cima. Isto é o alerta central para o Hermes: sem os processos da NETZ minimamente organizados, o Hermes será mais um dos 95%. O que conecta diretamente com o Ângulo C — a dinâmica de onboarding não é preparação para o valor, ela *é* o valor.

**A armadilha técnica que quase todo time comete.** As fontes descrevem um padrão de fracasso quase universal: o time sobe um banco vetorial, começa a "jogar tudo dentro", e seis meses depois descobre que o agente recupera memórias irrelevantes porque nunca decidiu o que ele deveria lembrar. A recomendação consolidada: **definir escopo primeiro, armazenamento depois.** Para o Hermes, isso significa que a pergunta certa na imersão não é "o que o Hermes pode guardar?" mas "o que ele precisa lembrar para fazer UMA coisa bem?". A metáfora que aparece nas fontes é boa: o Hermes é o *caderno* do time (escrito pelo próprio agente durante o uso), não a *biblioteca* (documentos estáticos) — misturar os dois degrada a recuperação.

Um detalhe que vale para a decisão "construir vs. usar": já existe um ecossistema maduro de camadas de memória (Mem0 com ~48 mil estrelas no GitHub e US$24M levantados; Zep; Cognee, que cresceu 500x em volume em 2025). Se o Denis construiu o Hermes do zero, vale saber que há peças prontas — a pergunta é se o diferencial da NETZ está em *construir a memória* ou em *aplicá-la a um problema específico*. Quase certamente é o segundo.

## Cases: quando ferramenta interna vira produto (Ângulo B com números)

O caso que já circula entre vocês — Tweet Hunter (interno → US$41k/mês → adquirido) — não é anomalia. Os dados de 2026 mostram o padrão, mas com uma condição crítica que muda a estratégia do Hermes:

**A boa notícia do timing.** Um solo maker hoje opera com a produção de um time muito maior. O micro-SaaS mediano lucrativo faz ~US$4,2 mil de MRR (suficiente para se sustentar sem capital externo), e o top 1% passa de US$50 mil de MRR — frequentemente operado por times de 1 a 3 pessoas. Times que usam IA têm mais chance de estar no break-even ou lucrativos (61% vs. 54% sem IA). A NETZ tem o perfil exato desse operador.

**A má notícia que redefine o Ângulo B — e é o achado mais importante desta pesquisa.** Os "thin wrappers" (produtos que só põem uma interface sobre a API de um modelo) morreram. A TechCrunch reportou em março/2026 que investidores basicamente pararam de financiá-los, porque quando o provedor do modelo lança a mesma feature nativamente, o valor do wrapper evapora. OpenAI, Google e Anthropic absorveram sistematicamente os casos de uso mais populares de wrapper. **Mas** uma categoria diferente prospera: os agentes verticais de nicho — produtos que resolvem problemas específicos de indústrias específicas com workflow próprio, dados proprietários e conhecimento de domínio embutido.

Isto tem uma consequência direta para o Hermes: **o Hermes genérico "cérebro digital para empresas" (ramo B.1) é perigosamente perto de um wrapper.** O Hermes como motor de um agente vertical (ramo B.2) é o que o mercado premia. A diferença não é sutil — é a diferença entre o que morre e o que cresce.

**Os "fossos" (moats) que tornam um agente vertical defensável.** As fontes listam quatro, e você precisa de ao menos dois: fosso de dados (dados proprietários que melhoram o produto e que concorrentes não têm), fosso de workflow (embutido num processo multi-etapas com integrações, difícil de arrancar), fosso regulatório (lida com compliance/certificação), e conhecimento de domínio embutido. Para a NETZ, o candidato óbvio é o assistente de obra: o fosso de domínio (entender relatórios de obra) e de workflow (integrar ao dia a dia do Rafa) já existem no MVP validado.

**O número que valida o assistente de obra especificamente.** A construção civil aparece nas fontes como um dos mercados-alvo de agente vertical mais promissores: estimadores de obra gastam 40-80 horas preparando um único orçamento comercial, e o segmento de software de estimativa é de US$4 bilhões. O modelo de receita citado: US$500-2.000/mês por empreiteira. Isso não é o assistente de relatório que vocês têm, mas mostra que o setor paga por ferramenta que economiza tempo de gente cara — e que o "nicho de um" da construção tem dor e orçamento.

## Cases: o mercado de implantação de agentes (Ângulo B.3 com números)

O ramo "onboarding de agente como serviço" tem um mercado real e precificável em 2026. Os números dão base para a NETZ desenhar uma oferta:

**As faixas de preço de mercado.** Um agente de propósito único e escopo fechado (ex.: qualificador de leads, bot de suporte tier 1) custa US$1.500-5.000 para construir, mais US$300-800/mês para operar. Workflows multi-agente (3+ agentes) custam US$5.000-25.000 de build mais US$1.000-3.000/mês. No modelo de desenvolvimento custom, consultorias e boutiques cobram a partir de €20 mil. Isso posiciona a NETZ: vocês podem oferecer implantação de agente vertical numa faixa de PME brasileira, bem abaixo das boutiques enterprise, usando o Hermes como base.

**O que separa quem entrega de quem só vende slide.** Um achado que é quase um manual de posicionamento para a NETZ: a maioria das agências que anunciam "serviços de IA" vende *estratégia* (decks). Um grupo menor entrega *sistemas rodando*. E um grupo ainda menor entrega sistemas que rodam dentro do software que a empresa já usa. As fontes são diretas: o modelo virou commodity; o trabalho caro, lento e arriscado é tudo em volta — integração com sistemas de registro, permissionamento, checkpoints de revisão humana, testes de regressão. "Uma firma de estratégia não faz esse trabalho. Uma consultoria de implementação faz." A NETZ é (ou pode ser) do segundo tipo — e é aí que está a margem.

**O dado que arma o discurso de venda.** ROI médio de agentes bem escopados: 171% (média americana 192%), com payback de 8 meses para workflows de alto volume e regras claras. Mas — e este "mas" é a faca de dois gumes — o Gartner estima que 40% dos projetos de agentes serão cancelados até 2027, e a causa é sempre a mesma: perseguir demos chamativas sem fazer a "arqueologia de processo" antes. As três características de quem atinge 192% de ROI: começar com um workflow definido e mensurável, escopar apertado antes de construir, e orçar o custo total de 3 anos. Isso é, literalmente, o argumento para a disciplina que a NETZ precisa — e que o Hermes pode encarnar.

## O valor escondido do Ângulo C: documentar processo é o produto

A pesquisa deu lastro forte à intuição de que a *dinâmica de onboarding* vale mais que o software. Os números sobre documentação de processo são contundentes:

Empresas perdem 20-30% da receita anual com processos ineficientes, principalmente porque conhecimento fica preso na cabeça de indivíduos. Documentação bem-feita corta o tempo de onboarding em até 60%. Uma indústria estimou que o conhecimento capturado valeu US$1 milhão em perdas de produção evitadas. E o padrão de implementação bem-sucedida é sempre o mesmo: **não documente tudo de uma vez** — comece com 1 processo crítico, frequente e propenso a erro.

Há também um teste de validação elegante que a NETZ pode usar na dinâmica, direto das fontes: peça a alguém que nunca fez a tarefa para segui-la só pela documentação, e resista a intervir a menos que trave. Se a pessoa (ou o Hermes) completa a tarefa, a documentação funciona. "Você vai se surpreender com o que esqueceu; passos óbvios para você confundem quem chega." Isto é exatamente o exercício do ramo C.1 — e agora com método.

O ponto que amarra: para a NETZ, cujo gargalo confesso é "temos tudo mas demoramos", o maior valor do Hermes talvez não seja a IA. É que ensiná-lo força a organização a explicitar o que hoje é tácito e inconsistente — e essa explicitação é, ela mesma, um combate direto à lentidão. A memória do agente e a memória da empresa se constroem no mesmo ato.

## Síntese da Parte 2: o que a evidência recomenda

Cruzando os casos e benchmarks com o leque da Parte 1, a evidência aponta três coisas com mais força do que a intuição sozinha permitia:

Primeiro, **o Ângulo A (interno) ganha reforço do dado mais duro que existe:** 95% dos pilotos de IA falham por falta de prontidão de contexto, não de modelo. O Hermes só vira útil se os processos da NETZ estiverem minimamente organizados — e organizá-los é o Ângulo C. A e C são, na prática, o mesmo movimento.

Segundo, **o Ângulo B tem uma bifurcação de vida ou morte:** o Hermes genérico (B.1) é quase um wrapper, e wrappers morreram. O Hermes como motor de agente vertical (B.2, com o assistente de obra como candidato pronto) é o que o mercado premia — e a construção civil tem números que confirmam dor e orçamento. Se o produto for perseguido, é por aí.

Terceiro, **a dinâmica do Denis (C) tem lastro de mercado:** o serviço de implantação de agentes é real e precificável (US$1,5-5k build + mensalidade), mas 40% dos projetos morrem por pular a "arqueologia de processo". A NETZ pode transformar a própria disciplina de escopo — que hoje falta — no diferencial que vende. O que falta a vocês internamente é exatamente o que o mercado mais valoriza entregar.

A recomendação da Parte 1 sai reforçada, não alterada: usar a dinâmica (C) para levar um processo interno (A) ao fim com "pronto" definido, tratar o produto (B) como parking lot datado — e, se um dia ativá-lo, mirar o agente vertical de obra, nunca o cérebro genérico.

---

*Documento de exploração gerado para a imersão NETZ (jul/2026), a partir do que o Denis descreveu sobre o Hermes no #estratégia e de pesquisa de mercado. As possibilidades e a marcação de esforço são interpretação para orientar a discussão; os números e casos são de fontes externas e devem ser conferidos antes de virar compromisso. Nenhum caminho aqui se materializa sem uma decisão de foco na imersão.*
