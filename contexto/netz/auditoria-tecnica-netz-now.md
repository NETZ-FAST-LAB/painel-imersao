# Auditoria Técnica — netz.now

> **Escopo:** SEO, prontidão para agentes de IA (agent-ready) e performance.
> **Método e limite honesto:** analisei o HTML real das páginas `/pt/`, `/pt/cases/` e da raiz `/`, puxadas em jul/2026. O que está em **Verificado** eu observei diretamente na resposta do site. O que está em **A medir** exige ferramentas com acesso de rede que não tenho neste ambiente (PageSpeed Insights, Lighthouse, Search Console, curl de headers) — não vou afirmar o que não medi. Onde eu digo "provável", é inferência a confirmar, não fato.
> **Vocês vendem isto.** A ironia produtiva desta auditoria: a NETZ oferece "sites prontos para agentes" e IA com governança. O próprio site é o primeiro case — e precisa passar no exame que vocês aplicariam num cliente.

---

## Resumo executivo

O site está num bom patamar de posicionamento e metadados, mas tem um problema técnico de raiz que pode custar caro em descoberta, e uma lacuna de conteúdo (cases) que é comercial antes de ser técnica. Três achados em ordem de gravidade:

1. **A raiz do domínio (`netz.now/`) volta praticamente vazia** — só título e canonical, sem conteúdo. Isso é o achado mais sério para SEO e agentes.
2. **A camada de metadados sociais é boa**, mas faltam elementos de descoberta multilíngue (hreflang) e, provavelmente, dados estruturados (Schema.org).
3. **Performance e agent-readiness não são mensuráveis daqui** — mas há sinais indiretos de que o site depende de renderização no cliente, o que afeta os dois.

---

## 1. SEO

### Verificado (observei no HTML)

**O que está bom:**

A página `/pt/` tem uma base de metadados sólida: `canonical` autorreferente correto, `meta-description` clara e vendedora ("A Netz ajuda empresas a aplicar IA, automação, governança e tecnologia com estratégia, segurança e capacidade real de execução"), e um bloco Open Graph completo — `og:title`, `og:description`, `og:image` (1200x630, a dimensão correta), `og:locale`, `og:site_name`, `og:type`, `og:url`. O Twitter Card está como `summary_large_image`, também completo. Isso significa que, quando alguém compartilha o link no WhatsApp, LinkedIn ou Slack, o preview vai renderizar bonito. Muita empresa erra isso; vocês acertaram.

A estrutura de headings da home é semanticamente correta: um `H1` único e forte ("Tecnologia para operações complexas do mundo real"), seguido de `H2`s por seção (Capacidades, Cases, Sobre, Manifesto, Contato). Hierarquia limpa, do jeito que buscador gosta.

**O que é problema:**

**A raiz `netz.now/` retorna vazia** — apenas `title: Netz` e o canonical apontando para `/pt/`, sem nenhum conteúdo de corpo. Só a versão `/pt/` entrega o HTML real. Isto tem duas leituras possíveis, e ambas pedem ação:
- Se for um *redirect* de `/` para `/pt/`, precisa ser um redirect 301 (permanente) limpo, para consolidar autoridade de SEO no destino. Um redirect via JavaScript ou um 302 (temporário) desperdiça sinal.
- Se for *renderização no cliente* (a página monta o conteúdo via JS depois de carregar), então o primeiro HTML que o Google e os agentes recebem é uma casca vazia. Buscadores modernos até executam JS, mas com atraso e sem garantia — e agentes de IA, em geral, **não executam**.

**Falta `hreflang`.** Vocês têm três idiomas (PT/EN/ES) com links no rodapé, mas não vi as tags `hreflang` que dizem ao Google "esta é a versão PT, aquela é a EN, aquela a ES, são a mesma página em idiomas diferentes". Sem isso, corre-se o risco de o Google tratar as três como conteúdo concorrente/duplicado, ou servir a versão errada para cada região. Para quem tem ambição internacional, é uma correção de alto retorno e baixo esforço.

### A medir (vocês precisam rodar)

- **Indexação real:** no Google Search Console, quantas páginas estão de fato indexadas? A raiz vazia pode estar mantendo páginas fora do índice. Este é o teste que confirma se o problema #1 é teórico ou já está custando tráfego.
- **`robots.txt` e `sitemap.xml`:** não consegui acessá-los daqui. Confiram se existem, se o sitemap lista as três versões de idioma, e se o robots referencia o sitemap. Para um site novo, o sitemap acelera muito a descoberta.
- **Dados estruturados (Schema.org):** não detectei JSON-LD no HTML que puxei. Um site de consultoria se beneficia de schema `Organization` (com logo, redes, contato) e `WebSite`. Nos cases, schema `Article` ou `CreativeWork`. Isso alimenta rich results no Google e dá contexto a agentes. Confirmem no Rich Results Test do Google.

---

## 2. Prontidão para agentes de IA (agent-ready)

Este é o eixo onde vocês têm mais a ganhar em coerência — porque é literalmente uma capacidade que vocês vendem (o "Is Your Site Agent-Ready" que o Denis já trouxe para o grupo).

### Verificado / inferido

**O problema da raiz vazia é ainda pior para agentes do que para SEO.** Um agente de IA (o crawler do ChatGPT, do Claude, do Perplexity, ou um agente autônomo navegando) tipicamente lê o HTML que chega e **não espera o JavaScript renderizar**. Se a primeira coisa que ele encontra em `netz.now/` é uma casca vazia, ele pode simplesmente concluir que não há conteúdo — e ir embora. A boa notícia é que a `/pt/` entrega conteúdo limpo e semântico, então o problema é concentrado na porta de entrada, não no site todo. Mas a porta de entrada é o que mais gente (e mais agente) tenta primeiro.

**O HTML de `/pt/` é semanticamente amigável a agentes** — headings claros, texto real (não imagens de texto), links descritivos. Isso é metade do trabalho de agent-readiness já feito.

### A medir / implementar

- **`llms.txt`:** o padrão emergente para dizer a modelos de IA o que é o site, em texto limpo. Para uma empresa que *vende* prontidão para agentes, ter um `llms.txt` exemplar em `netz.now/llms.txt` não é só boa prática — é demonstração de produto. Hoje, quase nenhuma consultoria brasileira tem. É diferenciação barata.
- **Resolver a renderização da raiz:** garantir que o conteúdo essencial chegue no HTML inicial (server-side rendering ou pré-renderização), pelo menos na página de entrada. Isto conserta SEO e agent-readiness de uma vez.
- **Rodar o próprio teste de agent-readiness** que vocês conhecem (checar llms.txt, MCP endpoints, agent skills, padrões de dados estruturados) no site de vocês, e usar o resultado como o primeiro item do portfólio dessa capacidade.

---

## 3. Performance

### Honestidade primeiro

**Não consigo medir performance real deste ambiente** — não tenho como rodar Lighthouse, medir Core Web Vitals (LCP, INP, CLS), nem cronometrar o carregamento. Qualquer número que eu desse aqui seria inventado, e isso não te ajuda. O que posso fazer é apontar os sinais indiretos e dizer exatamente o que medir.

### Sinais indiretos (a confirmar)

- **Se o site é client-side rendered** (o que a raiz vazia sugere), o provável gargalo é o LCP — o tempo até o conteúdo principal aparecer — porque o navegador precisa baixar e executar JS antes de mostrar qualquer coisa. Vale medir com prioridade.
- **Mix de formatos de imagem nos logos de clientes:** vi `.svg` (ótimo, leve e escalável), mas também `.png` (logo CMPC, Saneamento, Viex) e `.webp` (Fundação Sicredi). Os PNGs de logo são candidatos a virar SVG ou WebP otimizado — logos em PNG costumam ser pesados sem necessidade. É um ganho fácil de bytes.
- **A `og:image` de 1200x630** precisa estar comprimida; imagens de preview grandes e não otimizadas são um peso comum.

### A medir (a lista concreta)

- **PageSpeed Insights** (roda Lighthouse + dados de campo do Chrome) em `/pt/` e numa página de case. É a fonte de verdade para Core Web Vitals, mobile e desktop.
- **WebPageTest** para ver a cascata de carregamento — o que bloqueia o render, o peso do JS, o tempo até interativo.
- **Teste em 4G/mobile real**, não só no desktop do escritório. A maioria dos decisores de empresa grande vai abrir o primeiro link no celular.

---

## Prioridiade: o que fazer, em ordem

Ordenado por (impacto ÷ esforço), do maior retorno ao menor:

**1. Diagnosticar e resolver a raiz vazia.** É a correção de maior alavancagem — conserta SEO e agent-readiness ao mesmo tempo, e é a porta de entrada do domínio. Primeiro passo é só descobrir *por que* está vazia (redirect? CSR?). Provavelmente é rápido.

**2. Adicionar `hreflang` entre PT/EN/ES.** Baixo esforço, protege as três versões de canibalização e melhora o alcance internacional. Vocês já têm as três páginas; falta só declarar a relação.

**3. Publicar um `llms.txt` exemplar.** Baixo esforço, e vira demonstração viva de uma capacidade que vocês vendem. Marketing e técnica no mesmo movimento.

**4. Adicionar dados estruturados (JSON-LD):** `Organization` + `WebSite` na home, `Article`/`CreativeWork` nos cases. Alimenta rich results e dá contexto a agentes.

**5. Otimizar imagens** (logos PNG → SVG/WebP, comprimir a OG image). Ganho de performance de esforço baixo.

**6. Rodar PageSpeed/Lighthouse** e tratar o que aparecer no LCP/INP/CLS. Esforço variável, mas sem medir vocês estão no escuro.

---

## A observação que atravessa tudo

A auditoria técnica reencontra o mesmo padrão que a gente vem discutindo a imersão inteira, agora na infraestrutura: **o site tem estrutura sofisticada esperando conteúdo que ainda não chegou.** A página de cases tem um sistema de filtros de nível enterprise (segmento, tamanho, tipo de entrega, tecnologia) por trás de três cases. A meta-description dela até confessa: "uma base inicial de cases públicos e um modelo pronto para aprofundar". É o gargalo de empacotamento, encarnado em HTML. O scaffolding está pronto; o material que o preenche é que falta — e isso não é um problema de código, é o mesmo problema de execução que o WIP limit e a esteira de cases (da pesquisa dos cinco problemas) endereçam. A melhor coisa que pode acontecer com este site não é mais uma feature técnica — é o case do Sicredi entrar no ar.

---

*Auditoria gerada em jul/2026 a partir do HTML real das páginas públicas. Itens marcados "Verificado" foram observados diretamente; itens "A medir" exigem ferramentas de rede (PageSpeed, Search Console, testes de agent-readiness) que devem ser rodadas sobre o site para confirmação. As recomendações são ponto de partida técnico, não veredicto de auditoria formal.*
