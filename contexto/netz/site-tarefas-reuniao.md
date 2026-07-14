# Site NETZ — tarefas da reunião de 14/jul/2026

*Destilação da sessão de trabalho sobre o site (transcrição em `reuniao-site-transcricao.md`). É a lista de tarefas gerada percorrendo o site parte por parte — **separada** da auditoria técnica (`auditoria-tecnica-netz-now.md`), que é outra análise. Aqui = o que veio desta reunião.*

## Contexto e decisão
O **site foi escolhido como a iniciativa-âncora desta rodada** — é o mais fácil de dar como "pronto", gera uma vitória concreta e limpa o terreno para o Hermes entrar depois. Definição de pronto por iniciativa: **escolhida · dono · data · próximo passo**. Meta: sair da imersão com o site atualizado, **incorporando a nova oferta/serviço** definidos na imersão (caixinhas de serviço: mínimo / médio / grande — o design system já está pronto, então é complementar, não do zero).

**Workflow de edição:** João e Gui conectam o GitHub ao Claude (Cloud), cada um numa branch (branch-joão, branch-gui) → push → `diff` das duas → `merge` entre elas → `merge` na `main`.

**Regra honesta de números:** em case de site (visual) **não inventar número** — mock-up basta; número/dado só onde existe (ex.: o case de saneamento tem alguns). Futuro: o Hermes computa os números durante o projeto (pasta "números/resultados" que ele consulta).

## Tarefas por seção

**Header.** Ajustar o tamanho horizontal do header para ficar da mesma largura do conteúdo centralizado do site.

**Banner de entrada.** Aumentar a altura do banner para que a 1ª dobra mostre banner + a faixa de empresas + só um pouquinho da 2ª dobra (sensação de continuidade). Animar os dois glows do banner (verde à esquerda, cinza à direita) alternando suavemente. A animação de "pontos/conexões" fica só no detalhe, guardada para momentos especiais (o grupo achou "batida" para usar em tudo).

**Faixa de empresas (logos).** Tirar o "stop on hover" — deixar a faixa fluindo, sem interação. Resolver a travadinha no fim do loop (deixar seamless). Simplificar/diminuir a frase "empresas que fazem parte da nossa jornada" (fonte menor, menos destaque). *Nota:* são empresas **da jornada**, não clientes ativos — a frase existe para não dar a entender que são clientes.

**Capacidades (as 5).** Reescrever título e cópias para **1ª pessoa e tom imperativo/de fazer** (ex.: "Aplicamos tecnologia…", "Materializamos nosso trabalho em 5 capacidades…"). Padronizar as quebras de linha dos títulos (se um tem 2 linhas, todos com 2 — harmônico). Adicionar animações de entrada quando os blocos carregam (fade/lazy-load, sutil).

**Cases — preview na home.** Trocar o fundo de cor dos cards por uma imagem (a que já existe dentro do case), com blur, bem fraca, e o foco do mouse iluminando (overlay, para não roubar atenção do logo). Adicionar as tags (RAG · Automação · Governança) nos 3 cards da home, não só no destaque. Melhorar o respiro/quebra entre seções (evitar o "preto e vazio") — considerar seções-ponte com imagem animada (glassmorfismo). Os cards de case estão simplistas demais.

**Sobre a NETZ.** É o conteúdo mais fraco (blocos soltos sem conexão). Reescrever com **storytelling orientado a valor** (StoryBrand). Criar uma seção de **lastro**: tempo de existência (~10 anos), com quem já trabalhou, projetos em 2 continentes, várias frentes. Apresentar **pilares** (4–5: método · agilidade/adaptabilidade · processos bem definidos · rituais) como data-visualization (não boxes quadradinhos). Conectar ao **método NETZ** ("Conheça o método que nos trouxe até aqui"). Gancho do Sebrae: startups precisam comprovar que o resultado veio de **plano, não sorte** — usar a narrativa "não chegamos aqui por acaso". A página `/sobre` hoje repete os mesmos 2 blocos da home — melhorar a distribuição. Recomendado: uma **pesquisa de referências** de como concorrentes/referências fazem a página "sobre".

**Contato / CTA.** Botão de contato **fixo, presente 100% do tempo** (topo). CTAs em pontos-chave estratégicos (sem poluir) que levem a Forms / WhatsApp / e-mail. Compactar a seção de contato (espaçamento grande). Organizar o WhatsApp — hoje cai no telefone pessoal do João; providenciar número business/virtual. Animações verdes leves conectando no fundo.

**Página de Cases (grid + páginas individuais).** Ter mais cases. Imagem no card (logo em destaque + imagem de fundo; testar 2–3 versões). Ajustar o drop-down do filtro (está saindo do segmento; padronizar o componente **customizado** do site em vez do nativo; a fonte do filtro está maior que o título). Os filtros super-elaborados não têm cases suficientes para serem úteis. Nas páginas de case: caixinhas de **números/comprovação** só onde há dado (o de saneamento tem). Reescrever o "como atuamos" — está genérico e redundante (repete RAG/automação/governança); preferir **texto corrido / storytelling denso orientado a valor** (referência: cases da Accenture — "Ajudando a BBVA a se reinventar…"). Mostrar mais visual: **mock-ups (PC/Mac)** para projetos de site (o BSS tem plataforma e não mostra nada dela). Tudo orientado a **valor entregue**, não a etapas.

**Labs (botão).** O botão do Labs (tubo de ensaio com bolhas/animação) chama atenção demais e está colado — diminuir e dar respiro. Considerar transformá-lo num botãozinho (como o de contato) que leva a uma **seção do Labs na home** mais elaborada.

**Técnico / SEO / design system.** Rodar **PageSpeed Insights**; garantir os rankings técnicos (o que Google e agentes gostam — tecnicamente o site já referencia bem; falta conteúdo). O **design system já está pronto/completo** (boas práticas de indústria) — é a base sólida da qual o Claude gera. Padronizar componentes (ex.: o drop-down) para o site inteiro renderizar igual. Deixar pronta a **página do Labs referenciando o Mintzie**.

## Fora de escopo agora
O **portal de parcerias** está pronto, mas é da **frente comercial de venda de site**, não do site institucional — fica para um 2º passo.
