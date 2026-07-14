# Revisão pós-imersão — o consultor volta à sala (13/jul/2026)

*Revisão da síntese transversal à luz do que a INVERNETZ produziu até aqui: acordos da Society, estrutura comercial, metodologia do Edital 02, reunião Sebrae-POA, parking lot e o estado do repositório. Três partes: o que mudou, o que segue aberto, e os novos direcionamentos — incluindo os riscos novos que os avanços criaram.*

---

## 1. O veredito honesto primeiro

A tese da síntese era: "máquina de preparação que ainda não virou empresa — excesso de preparação sem nenhum compromisso irreversível". **Essa tese começou a ser desmontada nesta imersão — pela primeira vez em dois anos de acervo.** Não por terem produzido mais análise (produziram, e boa), mas porque as três decisões de alavancagem saíram do papel *na ordem recomendada* e com elementos que nenhuma imersão anterior teve: números em reais, consequência com valor, definição de pronto escrita, e uma fonte primária externa (o gestor do Sebrae) corrigindo a estratégia de gabinete.

O risco agora mudou de natureza. Não é mais "vão sair só com conversa" — é **"assinaram mais compromissos do que 52 horas semanais comportam"**. A imersão venceu o padrão antigo (não decidir) e flertou com o padrão novo (decidir demais). Esta revisão é sobre proteger o que foi conquistado.

## 2. Scorecard — as 3 decisões de alavancagem

| Decisão (síntese) | Status | Evidência |
|---|---|---|
| **1. Sociedade e ritmo primeiro** | ✅ **Fechada — acima do pedido** | `netz-society-acordos.md`: 13h/semana/sócio; papéis; meta R$ 12 mil líq./sócio e R$ 695.952/ano; multa R$ 50/tarefa; cadência terça-a-terça; definição de pronto; fonte da verdade |
| **2. Um único produto-case** | 🟡 **80% — convergiu, mas com 3 buracos** | `metodologia-netz-assistentes.md`: o produto é a metodologia de assistentes; faltam **nicho, nome e voz de cliente pagante** — e as alternativas não foram "mortas por escrito" |
| **3. Uma rota de aquisição com dono** | 🟡 **Estruturada — sem donos nem primeira execução** | `comercial-estrutura.md`: 3 frentes, funis, pacotes — mas nenhuma frente tem dono nomeado e o "primeiro fruto exposto" (fio 5 do cronograma) ainda não aconteceu |

**Sobre a Decisão 1 — o que merece registro.** A sala fez exatamente o que a síntese pediu e foi além: a d6 abriu a semana (o cronograma nomeia: "direciona todas as outras"), a definição de pronto virou texto ("tem dono, prazo, executado, conferido, registrado, não depende de boa vontade"), e a consequência ganhou valor (R$ 50/tarefa) com o desenho certo — simulação de 2 semanas antes de valer, para não morrer de irrealismo. Dois pontos cegos da síntese também fecharam de tabela: o Sicredi foi confirmado como projeto NETZ (faturado direto, consórcio com Pulsar/Udanda — `checkin-invernetz.md`), e a "linha de receita inexistente" agora existe como meta. O relato do João sobre o custo pessoal do Sicredi ("entreguei muito mais do que estava disposto") é a validação empírica da tese da capacidade — e o melhor argumento para defender as 13h como teto, não como piso.

**Sobre a Decisão 2 — onde mora o risco de regressão.** A convergência é inteligente: nem o Mintzie-chatbot, nem o assistente de obra isolado, mas a **metodologia** ("assistentes que conduzem por processos e sistemas — integram quando dá, documentam-e-conduzem quando não"), com o corte base × personalizável e 3 pacotes cumulativos. Isso é exatamente "vender o método com o software dentro" — e o insight "não precisa integrar para entregar valor" transforma a limitação de caixa das PMEs em vantagem de produto. Mas o próprio documento admite os três buracos: **nicho de largada, nome do método, voz de um cliente pagante**. Sem eles, não há registro INPI (registra-se a expressão — e a expressão precisa de nome), não há Edital 02 (a regra do gestor: "genérico é tiro no pé") e não há preço. E a cláusula da síntese segue pendente: *o assistente de obra e as demais opções precisam ser formalmente arquivados ou datados por escrito* — hoje eles estão em limbo, que é onde ideias voltam a assombrar.

**Sobre a Decisão 3 — a estrutura veio, a execução não começou.** A matriz por frente é o melhor artefato comercial que a NETZ já produziu — em especial o insight da frente A ("a NETZ resolve o problema da *agência*, não do cliente dela") e a virada "site = infra/vitrine, não canal". Mas três coisas que o próprio material exige não existem ainda: **dono por frente** (a regra "todo lead tem dono" vale para as frentes também), **meta operacional ativada** (as ~2 reuniões de agência/semana), e o **primeiro fruto exposto ainda dentro da imersão** — que era o teste anti-retórica do cronograma. Há um relógio andando: **o Matchmaking do Instituto Caldeira fecha inscrições em 15/07 — depois de amanhã.** Custa zero e era o candidato declarado a primeiro fruto. Se ele passar em branco, é o padrão antigo piscando.

## 3. Avanços além do plano (crédito onde é devido)

**Sebrae saiu do papel para a fonte primária.** A reunião de POA (11/jul) fez o que nenhuma pesquisa faria: revelou a mecânica real do **Edital 02/PI** (metodologia própria, sem rodízio, valor-hora maior), os valores (R$ 211/h consultoria; instrutoria R$ 1.300→200/h decrescente) e — avanço concreto — **1 produto já cadastrado e aprovado na Únio** (o site). A disciplina de marcar "fonte primária prevalece sobre a estratégia" no README do contexto é maturidade de governança de informação.

**O Hermez ganhou o papel certo.** Interno primeiro, vertical depois "se fizer sentido", **nunca produto genérico** — é literalmente a recomendação do leque (C→A, B em parking lot), agora com um primeiro fluxo definido (Comercial), cadência (digest de terça 05:00 no Discord) e a regra "o Hermez aponta; o dono valida o pronto", que corrige o risco de terceirizar a disciplina inteira para a máquina.

**A infraestrutura andou sozinha.** Desde a v0.4: deploy estruturado (Dockerfile/Coolify, Basic Auth, modos public/internal em produção), `contexto/` como fonte única com regra de manutenção, `build-brain.sh` como pipeline do cérebro, e a narrativa absorvida a ponto de o cronograma declarar "o verbo da semana é **frutificar**". As duas entregas anteriores (síntese e narrativa) viraram linguagem operacional da casa — que é o melhor destino possível para um documento.

## 4. Riscos novos (criados pelos próprios avanços)

**R1 — A matemática da meta não fecha sem produtização.** R$ 695.952/ano = R$ 57.996/mês. A capacidade acordada é 4 × 13h = 52h/semana ≈ 225h/mês. Isso exige **R$ 258 de