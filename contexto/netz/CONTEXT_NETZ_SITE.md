# CONTEXTO ABSOLUTO — SITE NETZ 2026

> Documento técnico-editorial consolidado em 14 de julho de 2026.
>
> Fonte de análise: código atual, configurações, testes, assets, histórico Git, `README.md`, `PRODUCT.md`, `DESIGN.md`, handoff, runbooks, especificações, planos de implementação e decisões registradas durante as revisões visuais deste projeto.
>
> Estado analisado: branch `agent/labz-cta-bubbles`, commit `766c75b`, derivada de `main` em `4e2a0a7`. A branch está publicada no GitHub e associada ao PR draft nº 2.

## Como ler este documento

Este arquivo diferencia três níveis de realidade:

- **Implementado:** existe no código atual e participa do site ou do pipeline.
- **Preparado/documentado:** há contrato, código de integração ou runbook, mas a operação externa ainda depende de infraestrutura/configuração fora deste repositório.
- **Planejado/pendente:** foi discutido ou especificado, porém não existe como rota ou funcionalidade final no código atual.

Nenhum segredo de `.env.deploy` foi lido ou reproduzido. São citados apenas nomes de variáveis e destinos já documentados no repositório.

---

# 1. VISÃO GERAL E CONCEITO (A Ideia)

## 1.1 Proposta de valor principal

A Netz é apresentada como uma parceira de tecnologia para empresas que enfrentam operações complexas e não podem depender de improviso. A proposta combina:

- tecnologia aplicada ao mundo real;
- inteligência artificial e agentes;
- automação e integração de processos;
- governança, segurança e rastreabilidade;
- estratégia e consultoria de inovação;
- squads, plataformas, sites e experiências digitais;
- capacidade de levar hipóteses da descoberta até uma implementação utilizável.

O posicionamento não é “vender IA” como tendência. O site procura traduzir IA e inovação em capacidade operacional: sistemas, fluxos, decisões, integrações, controle de risco e execução. A mensagem central do hero em português sintetiza essa direção:

> “Tecnologia para operações complexas do mundo real.”

O complemento atual reforça sistemas, automações, sites e IA aplicada como instrumentos para transformar desafios complexos em resultados confiáveis.

O objetivo comercial do site é gerar confiança suficiente para iniciar uma conversa. Essa confiança deve vir principalmente de:

- logos de organizações atendidas;
- cases e contextos de aplicação reais;
- clareza sobre as capacidades da Netz;
- linguagem de governança e maturidade institucional;
- qualidade da experiência e do sistema editorial;
- caminhos diretos para WhatsApp, e-mail e formulário.

## 1.2 Tese estratégica do site

O produto foi concebido como **proof-first**, e não manifesto-first. Isso significa que a marca pode abrir com uma frase forte, mas precisa apresentar prova rapidamente. A sequência inicial da home — hero, logos, capacidades e cases — é deliberada.

Como muitos resultados estão protegidos por NDA, o projeto decidiu não depender de grandes métricas. A prova pode ser construída por sinais qualitativos confiáveis:

- nome ou categoria do cliente;
- setor e contexto regulatório;
- complexidade do fluxo;
- explicação objetiva do desafio;
- descrição do que a Netz fez;
- capacidades mobilizadas;
- rastreabilidade, governança e prontidão para escala;
- imagens e artefatos de projeto aprovados para publicação.

Os cases não são tratados como decoração ou portfólio genérico. Eles são uma infraestrutura editorial-comercial: teaser curado na home, arquivo navegável e detalhe com narrativa executiva consistente.

## 1.3 Público-alvo

O público prioritário é B2B, com foco em empresas médias e grandes. Os perfis citados na documentação são:

- founders e lideranças executivas;
- times e lideranças de inovação;
- gestores de operações;
- lideranças jurídicas e de compliance;
- organizações com ambientes regulados;
- empresas que desejam aplicar IA, mas ainda não sabem por onde começar;
- empresas que precisam de transformação digital, integração, automação ou uma presença digital mais madura.

O visitante típico chega com uma mistura de urgência, ambição e cautela. Ele procura validar rapidamente se a Netz possui:

- maturidade estratégica;
- profundidade técnica;
- capacidade real de entrega;
- compreensão de governança e risco;
- experiência com organizações complexas;
- consistência para ir além de protótipos e demos.

Startups podem se beneficiar dos serviços, mas não são o centro do posicionamento atual. O discurso, a prova social e a direção visual são orientados principalmente a decisores de organizações com risco operacional e institucional real.

## 1.4 Tom de voz e posicionamento de marca

A personalidade consolidada é descrita por quatro atributos:

- **visionária**;
- **disruptiva**;
- **provocativa**;
- **segura**.

O equilíbrio desejado é “edge com confiança institucional”. A Netz pode desafiar o pensamento convencional, mas deve fazê-lo com elegância executiva, precisão e lastro. O texto deve soar:

- confiante, sem ser inflado;
- claro, sem ser simplista;
- sofisticado, sem ser rebuscado;
- técnico, sem excesso de jargão;
- ousado, sem irresponsabilidade;
- institucional, sem frieza corporativa;
- humano, relacional e orientado à parceria.

Frases que funcionam como guardrails de marca:

- “Tecnologia para empresas que não podem apostar no improviso.”
- “Inovação não é uma vitrine. É uma capacidade operacional.”
- “Provocamos o futuro com responsabilidade.”
- “Operações inteligentes começam com relações fortes.”
- “Sempre fomos agentes de provocação. Agora desenvolvemos agentes transformadores.”

### Anti-referências editoriais e visuais

A Netz não deve parecer:

- uma startup genérica de IA com promessas vagas;
- uma landing page SaaS roxa;
- um site neon/cyber especulativo;
- uma consultoria corporativa fria e sem personalidade;
- uma agência de marketing;
- um prestador local/amador;
- uma coleção de buzzwords sem prova;
- uma página inflada por cards repetitivos, títulos gigantes e espaços dramáticos sem função.

### Regras de copy

- Preferir verbos de execução e exemplos de uso.
- Tratar governança como parte da oferta, não como nota de rodapé.
- Sustentar afirmações fortes com prova próxima.
- Evitar “o futuro da IA” sem aplicação concreta.
- Evitar repetir a mesma ideia em hero, cards, galeria e manifesto.
- Manter textos curtos, escaneáveis e traduzíveis para inglês e espanhol.
- Não inventar métricas quando a publicação não estiver autorizada.

---

# 2. STACK TECNOLÓGICA (A Engenharia)

## 2.1 Stack efetivamente utilizada

O projeto atual não usa WordPress, Elementor ou plugins WordPress. O arquivo legado em HTML foi apenas uma referência inicial. A implementação vigente é uma aplicação Astro estática.

### Runtime, framework e linguagem

- **Astro:** declarado como `^5.0.0`; instalado no ambiente analisado em `5.18.1`.
- **TypeScript:** declarado como `^5.7.0`; instalado em `5.9.3`.
- **JavaScript/ECMAScript modules:** scripts `.mjs`, scripts inline de interação e configuração com `"type": "module"`.
- **HTML e CSS:** componentes `.astro`, CSS global e estilos encapsulados por componente.
- **Node.js:** runtime de build, testes, deploy e webhook; o projeto não fixa uma versão por `.nvmrc` ou campo `engines`.

### Qualidade e testes

- **@astrojs/check:** `0.9.9` instalado, para diagnósticos e tipos Astro.
- **Vitest:** `2.1.9`, para testes unitários e de contrato.
- **Playwright:** `1.59.1`, para testes end-to-end em Chromium.
- **@types/node:** `25.9.1`.
- Configuração TypeScript estrita por `astro/tsconfigs/strict`.
- Alias de importação `@/* -> src/*`, embora a maior parte do código atual use imports relativos.

### Operação e integrações

- **basic-ftp:** `6.0.1`, para upload do build estático.
- **dotenv:** `17.4.2`, para carregar `.env.deploy` nos scripts operacionais.
- **Formspree:** integração do formulário via endpoint público configurável.
- **Strapi:** cliente e normalização próprios, sem SDK, consumidos durante o build.
- **Google Fonts:** fonte Sora carregada externamente.

Não há React, Vue, Svelte, Tailwind, biblioteca de componentes, gerenciador de estado, banco de dados ou servidor de aplicação dentro do site Astro.

## 2.2 Modelo de renderização e hospedagem

`astro.config.mjs` define:

```js
output: "static"
site: "https://www.netz.now"
```

Portanto:

- todas as páginas públicas são pré-renderizadas no build;
- o resultado é gravado em `dist/`;
- o servidor de produção precisa apenas servir arquivos estáticos;
- alterações editoriais vindas do Strapi exigem um novo build e deploy;
- não há SSR, funções serverless, API routes ou backend Astro em produção.

A toolbar de desenvolvimento do Astro está desativada.

## 2.3 Scripts principais

| Comando | Função |
|---|---|
| `npm run dev` | Servidor Astro em `127.0.0.1`. |
| `npm run build` | Gera o site estático em `dist/`. |
| `npm run preview` | Serve localmente o build estático. |
| `npm test` | Executa Vitest em modo interativo/padrão. |
| `npm run strapi:check` | Executa somente o contrato Strapi. |
| `npm run strapi:webhook` | Sobe o receptor de webhook que dispara deploy. |
| `npm run test:e2e` | Executa Playwright. |
| `npm run check` | Astro check + Vitest + Playwright. |
| `npm run deploy:check` | Valida apenas a configuração FTP. |
| `npm run deploy:dry` | Executa preflight e build, sem upload. |
| `npm run deploy` | Executa preflight, build e upload FTP. |

## 2.4 Arquitetura de diretórios

```text
site-netz/
├── Assets/                       # Materiais-fonte e identidade visual
│   └── 2026/ID/                  # Logos Netz e Labz originais
├── Logos clientes/               # Arquivos-fonte de logos de clientes
├── public/                       # Assets publicados sem transformação
│   ├── Assets/cases/             # Imagens raster dos cases
│   ├── Assets/placeholders/      # Placeholders SVG históricos
│   ├── brand/                    # Marca Netz normalizada
│   ├── logos-clientes/           # Logos normalizados para URLs públicas
│   ├── netz-og-preview-1200x630.png
│   └── site.webmanifest
├── scripts/
│   ├── deploy-ftp.mjs
│   ├── strapi-webhook-runner.mjs
│   └── lib/                      # Config, runner FTP e segurança do webhook
├── src/
│   ├── components/               # Componentes públicos reutilizáveis
│   │   └── dev/                  # Componentes do catálogo interno
│   ├── content/                  # Conteúdo local e cópias multilíngues
│   ├── layouts/                  # Layout público e layout de desenvolvimento
│   ├── lib/                      # Seletores, i18n e source layer
│   │   └── strapi/               # Cliente, queries, tipos, validação e normalização
│   ├── pages/                    # Rotas Astro
│   └── styles/global.css         # Tokens e regras globais
├── tests/
│   ├── *.test.ts                 # Unitários/contratos Vitest
│   └── e2e/site.spec.ts          # Comportamento de rotas e UI
├── docs/                         # Handoff, runbooks e notas
│   └── superpowers/              # Specs e planos históricos
├── PRODUCT.md                    # Estratégia de produto
├── DESIGN.md                     # Sistema visual e UX
├── README.md                     # Operação e colaboração
└── v11-razor-canvas - verde.html # Referência legada, não runtime atual
```

## 2.5 Componentes globais e responsabilidades

| Componente | Responsabilidade atual |
|---|---|
| `BaseLayout.astro` | Estrutura HTML, SEO, hreflang, fonte, Header, Footer e classes de overlay. |
| `Header.astro` | Navegação global, estado ativo, menu móvel e CTA animado Labz. |
| `Footer.astro` | Marca, manifesto curto, WhatsApp, e-mail e troca de idioma. |
| `Hero.astro` | Mensagem principal e CTAs para contato e cases. |
| `LogoStrip.astro` | Prova social em carrossel contínuo e pausável. |
| `ServicesGrid.astro` | Cinco capacidades em cards compactos com spotlight sequencial. |
| `CaseShowcase.astro` | Um case em destaque e cases secundários na home. |
| `CaseArchiveFilters.astro` | Filtros client-side do arquivo de cases. |
| `CaseArchiveCard.astro` | Card editorial para arquivo e relacionados. |
| `CaseDetail.astro` | Narrativa completa do case e seus artefatos. |
| `AboutIntro.astro` | Posicionamento institucional + card-manifesto. |
| `ContactPanel.astro` | Conversão por formulário, WhatsApp e e-mail. |
| `Button.astro` | CTA primário/secundário reutilizável. |
| `SectionHeader.astro` | Eyebrow, título e resumo semânticos. |

Há também um catálogo interno em `/dev/components` com registro, mocks, códigos estáveis, status de reutilização e navegação sincronizada ao scroll. Ele cobre os 13 componentes públicos listados acima e o `BaseLayout`.

## 2.6 Conteúdo e internacionalização

Idiomas suportados como requisito de arquitetura:

- `pt` — idioma padrão;
- `en`;
- `es`.

Arquivos centrais:

- `src/content/site.ts`: SEO, navegação, hero, cinco serviços, contato, manifesto e uma estrutura antiga de cases por idioma.
- `src/content/ui.ts`: labels, textos institucionais, filtros, formulário e microcopy por idioma.
- `src/content/cases.ts`: modelo editorial mais rico e fonte local efetiva dos cases.
- `src/lib/i18n.ts`: validação, normalização e criação de caminhos localizados.

Observação arquitetural: existem hoje **duas representações de cases**. `site.ts` ainda carrega `content.cases`, herdado do primeiro modelo, enquanto as páginas e o showcase usam `src/content/cases.ts` por meio de `loadCaseStudies()` e dos seletores em `src/lib/cases.ts`. Essa duplicidade é dívida técnica e pode causar divergência editorial.

## 2.7 Source layer e integração Strapi

A integração Strapi foi desenhada para manter o Astro estático e trocar apenas a origem editorial de **cases** e **logos**.

### Modos

`STRAPI_CONTENT_MODE` aceita:

- `local`: usa somente os dados versionados; é o fallback padrão para valor ausente ou inválido.
- `hybrid`: tenta o Strapi e volta ao conteúdo local se fetch ou validação falhar.
- `strict`: exige Strapi válido; qualquer falha interrompe o build/deploy.

### Fluxo dos cases

- O build consulta sempre a coleção raiz em locale `pt`.
- A query pede somente conteúdo publicado e popula logo, mídia hero, mídia de apoio e localizações.
- O normalizador exige que a entidade raiz seja `pt` e monta o objeto completo `pt/en/es` a partir das localizações.
- Campos obrigatórios são validados antes de gerar páginas.
- O conteúdo é ordenado para manter o case `featured` no início.
- O modelo suporta taxonomias, imagens, destaques, trabalho realizado, relações e campos de narrativa executiva.

### Fluxo dos logos

- Logos são buscados por locale, somente publicados, ordenados por `ordering`.
- A normalização produz `{ name, asset }` para o carrossel.
- Em `local` ou no fallback `hybrid`, nove logos locais são usados.

### Limite da integração

Este repositório não contém a aplicação Strapi, schema/configuração do CMS, banco de dados ou provisionamento de VPS. Ele contém o consumidor Astro, validações, webhook runner, testes e documentação operacional. Portanto, a integração está implementada no lado do site, mas a existência/estado do CMS externo deve ser validada separadamente.

## 2.8 Formulário e canais de contato

O `ContactPanel` implementa:

- POST para `PUBLIC_FORMSPREE_ENDPOINT`;
- campos nome, empresa, e-mail e desafio;
- nome/e-mail/desafio obrigatórios;
- honeypot `_gotcha`;
- envio assíncrono por `fetch` com `Accept: application/json`;
- estado “enviando”, sucesso e erro com `aria-live`;
- fallback explícito quando o endpoint não está configurado;
- WhatsApp como CTA primário;
- `mailto:help@netz.now` como CTA secundário no código atual.

O telefone de WhatsApp codificado é brasileiro (`+55 51 99731-3914`).

Importante: documentos históricos citam `meajuda@netz.now`, mocks antigos citam outros endereços e o código atual/testes exigem `help@netz.now`. Para qualquer expansão, considerar `help@netz.now` como a verdade operacional atual até decisão formal em contrário.

## 2.9 Deploy e automação editorial

### Deploy local

O fluxo atual:

1. carrega `.env.deploy`;
2. valida `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` e `FTP_REMOTE_DIR`;
3. executa `astro check`;
4. executa Vitest;
5. executa o build Astro com o executável Node atual;
6. confirma a existência de `dist/`;
7. conecta via `basic-ftp`;
8. garante o diretório remoto;
9. envia o conteúdo de `dist/`.

O runbook atualizado identifica a raiz pública correta como `/netz.now/` no host Turbo Cloud documentado. O `.env.deploy.example` e alguns testes ainda usam destinos antigos/genéricos; o runbook deve prevalecer operacionalmente. Credenciais reais permanecem fora do Git.

O upload não contém uma etapa explícita de exclusão de arquivos remotos obsoletos. Se uma rota deixar de existir, pode ser necessário limpar o arquivo correspondente no servidor.

### Webhook Strapi

- Endpoint local: `POST /strapi-webhook`.
- Assinatura: HMAC SHA-256 do body cru, via header `x-strapi-signature`.
- Comparação com `timingSafeEqual`.
- Um deploy por vez; requisições concorrentes recebem conflito.
- Um webhook válido executa o mesmo deploy FTP completo.
- O receptor não filtra o tipo de evento no payload: qualquer POST corretamente assinado dispara deploy.
- O runbook recomenda manter o processo com PM2, systemd ou supervisor e expô-lo por HTTPS/reverse proxy quando necessário.

## 2.10 Integrações externas presentes e ausentes

### Presentes

- Strapi REST API em build time.
- Formspree para leads.
- WhatsApp para conversa direta.
- E-mail por links `mailto:`.
- Google Fonts para Sora.
- FTP/Turbo Cloud para hospedagem.
- GitHub para versionamento, branches e PRs.

### Não encontradas no código atual

- Google Analytics ou GA4;
- Google Tag Manager;
- Meta Pixel;
- CRM (HubSpot, RD Station, Salesforce etc.);
- ferramenta de automação de marketing;
- consentimento de cookies;
- monitoramento de erro/apm;
- busca interna;
- newsletter;
- CMS para páginas institucionais, SEO ou navegação;
- API backend própria.

---

# 3. HISTÓRICO DE EXECUÇÃO E EVOLUÇÃO (A Jornada)

## 3.1 Linha do tempo consolidada

### 8 de maio de 2026 — fundação do projeto

- Bootstrap do planejamento do novo site Astro.
- Scaffold guiado por testes e contrato de conteúdo.
- Criação do modelo localizado `pt/en/es`.
- Implementação das primeiras rotas públicas Astro.
- Smoke tests de rotas e layout.
- Refinos semânticos, navegação ativa e localização.

Decisão estrutural: o HTML legado `v11-razor-canvas - verde.html` seria referência de conteúdo/assets, não base final do runtime.

### 9 de maio — densidade e identidade premium

- Refinamento geral do site e das páginas de case.
- Ajuste da escala do título do hero.
- Criação do README.
- Registro de uma revisão tipográfica: Sora foi mantida, pesos muito pesados foram reduzidos, tokens tipográficos foram formalizados e a direção passou de “landing dramática” para densidade executiva.

### 11 de maio — hero, header e social preview

- Especificação para fazer o background do hero subir atrás da navegação flutuante apenas na home.
- Preservação do espaçamento superior e da prova social no primeiro ritmo de leitura.
- Design e plano de uma rota de preview OG (`/pt/preview/og/`).

Estado atual: o asset OG final existe e é usado em metatags; a rota dedicada de preview planejada não existe mais/no código atual.

### 15–16 de maio — cases como sistema editorial

- Cases deixaram de ser apenas cards simples e viraram um modelo editorial estruturado.
- Definição das taxonomias de segmento, tamanho, tipo de entrega e tecnologia.
- Arquivo de cases redesenhado como biblioteca compacta, com filtros laterais e grid.
- Template de detalhe padronizado: contexto, atuação, capacidades e resultado.
- Remoção de repetição narrativa entre hero, galeria e breakdown.
- Inclusão de mídia e placeholders preparados para evolução futura.

### 16 de maio — catálogo de componentes

- Contrato e registro para todos os componentes Astro públicos.
- Mocks controlados e previews isolados.
- Rota permanente `/dev/components`.
- Códigos estáveis e status como “Reutilizável”, “Em extração” ou “Específico”.
- Navegação lateral sincronizada com scroll.

### 18–20 de maio — consolidação e revisão editorial

- Snapshot do estado do trabalho.
- Documento de revisão de copy consolida público, tom, guardrails e decisões irreversíveis sem revisão explícita.
- Design amplo do workflow editorial com Strapi, incluindo papéis, infraestrutura, localização, publicação, segurança e migração.

### 22 de maio — assinatura de e-mail

- Especificação e plano para assinatura HTML compatível com Roundcube.
- A especificação aparece como aprovada visualmente e pendente de revisão do usuário.
- Os arquivos/testes da assinatura foram removidos do repositório em 13 de julho durante a limpeza para colaboração; não fazem parte do site atual.

### 26 de maio — formulário Formspree

- Especificação e plano do formulário.
- Implementação posterior no `ContactPanel` com estados localizados, honeypot e fallback de configuração.

### 16 de junho — handoff e redesenho do case detail

- Criação do handoff técnico do projeto.
- Case detail foi condensado e redesenhado.
- Inclusão dos assets fotográficos de Corsan.
- Revisão de contatos e cases relacionados.
- Expansão da cobertura de testes de detalhe.

### 18–23 de junho — deploy FTP

- Design do fluxo local de publicação na Turbo Cloud.
- Validação segura de variáveis FTP.
- Runner de build e upload.
- Modos check, dry-run e deploy real.
- Correção para executar Astro pelo Node atual e evitar incompatibilidade local do módulo nativo do Rollup.
- Investigação revelou que uploads para um caminho remoto antigo não atualizavam o domínio.
- Runbook consolidou `/netz.now/` como raiz pública correta.
- Correção operacional de permissões `755` em diretórios de assets que impediam navegação FTP.

### 23–24 de junho — Strapi fase 1

- Design fechado da fase 1 para cases e logos.
- Introdução dos modos `local`, `hybrid` e `strict`.
- Cliente REST próprio e queries.
- Normalização/validação progressivamente endurecida.
- Regra de entidade raiz portuguesa e localizações `en/es`.
- Validação de taxonomias, mídia, métricas e coleções.
- Cases e logos passaram a entrar nas páginas pela source layer assíncrona.
- Webhook assinado passou a disparar o pipeline de deploy.
- Runbook de VPS documentado.

### 13 de julho — preparação para colaboração

- Merge do PR nº 1 em `main`.
- Remoção de screenshots, relatórios e artefatos pesados de auditoria do Git.
- Inclusão dos planos/runbooks relevantes.
- Ajustes de configuração Playwright e cards de case.
- Remoção de testes/artefatos da assinatura de e-mail.

### 14 de julho — lapidação visual da home e Labz

A partir de comentários feitos diretamente na visualização da homepage:

- o CTA duplicado de contato no header foi reconsiderado;
- o botão destacado virou um CTA de marca para a futura área Labz;
- dois SVGs `Logo-LABZ` foram avaliados, e o logo-base foi incorporado inline;
- foi criada interação de hover/focus com scan, pulsos sequenciais no símbolo e animação contínua;
- bolhas em lime, bone e variações translúcidas passaram a “efervescer” no fundo sem comprometer a leitura do logo;
- foi incluído fallback completo para `prefers-reduced-motion`;
- o CTA aparece também quando o menu móvel é aberto;
- os logos dos cards secundários de cases foram ampliados;
- o logo branco/quebrado no carrossel foi substituído pelo logo vetorial da Corsan;
- a branch foi enviada ao GitHub no PR draft nº 2;
- o site foi publicado e as rotas `/` e `/pt/` foram verificadas com resposta HTTP 200.

## 3.2 Problemas técnicos resolvidos

- Migração de uma página HTML monolítica para componentes e rotas Astro.
- Estrutura multilíngue tratada desde o início, em vez de tradução posterior.
- Redução da escala visual excessiva do hero e da tipografia.
- Header sobre o background da home sem afetar páginas internas.
- Normalização de nomes/caminhos de assets para reduzir problemas entre Windows e macOS case-insensitive.
- Sistema de cases transformado em contrato editorial reutilizável.
- Filtros responsivos e client-side no arquivo de cases.
- Case detail destilado para reduzir repetição e densidade desnecessária.
- Logos reais e imagens de cases substituindo placeholders onde aprovados.
- Formulário com feedback inline e fallback seguro.
- Deploy que valida antes de publicar.
- Correção do caminho remoto real de produção.
- Correção de permissões FTP em diretórios de assets.
- Workaround para resolução do executável Node/Rollup no build local.
- Validação rígida de respostas Strapi antes de gerar o site.
- Fallback controlado durante a migração CMS.
- Serialização do deploy disparado por webhook.
- CTA do header diferenciado do item “Contato”.
- Legibilidade dos logos secundários e do carrossel.
- Microinteração Labz acessível e coerente com a identidade Netz.

## 3.3 Estado de testes na análise atual

Na execução realizada para este documento:

- `astro check`: **55 arquivos, 0 erros, 0 warnings, 0 hints**;
- Vitest: **6 arquivos, 52 testes passando**;
- Playwright não iniciou porque o sandbox desta sessão bloqueou a abertura de `127.0.0.1:4321` com `EPERM`.

Essa falha de E2E é ambiental, anterior à execução dos cenários, e não uma falha de asserção do site. A última documentação de handoff registrava 37 testes Playwright passando em uma versão anterior. Antes de um próximo merge, o E2E deve ser repetido em um ambiente que permita abrir a porta local.

Os contratos atuais cobrem:

- conteúdo e três locales;
- assets públicos e segurança de paths;
- redirecionamento da raiz;
- cases, filtros, mídia e confidencialidade;
- catálogo de componentes;
- formulário Formspree;
- config e comportamento do deploy;
- cliente, queries, normalização e fallback Strapi;
- assinatura do webhook;
- rotas, SEO, navegação, layout, responsividade e interação em E2E.

## 3.4 Implementado hoje

- Site Astro estático completo em três idiomas.
- Home, cases, detalhes, sobre e contato.
- Header/footer globais e navegação ativa.
- Carrossel de nove clientes.
- Cinco capacidades.
- Três cases publicados: Corsan/Empresa de Saneamento Riograndense, Nous Group e BSS.
- Filtros de cases.
- Template rico de case detail.
- Formulário Formspree configurável.
- WhatsApp e e-mail direto.
- Metatags essenciais, Open Graph, Twitter Card e hreflang.
- Manifesto web/PWA básico e favicons.
- Catálogo interno de componentes.
- Source layer local/hybrid/strict.
- Cliente e validação Strapi para cases/logos.
- Deploy FTP check/dry/real.
- Webhook Strapi assinado.
- CTA Labz animado no header.

## 3.5 Pendências, lacunas e TODOs reais

Não há comentários `TODO` ou `FIXME` relevantes no runtime atual. As pendências são principalmente arquiteturais, editoriais e operacionais:

### Alta prioridade

- **Criar as páginas Labz:** o header já aponta para `/{locale}/labz/`, mas nenhuma rota existe. Hoje o CTA leva a 404 após deploy.
- **Confirmar/configurar Formspree em produção:** sem `PUBLIC_FORMSPREE_ENDPOINT`, o formulário mostra o fallback e não envia.
- **Validar a infraestrutura Strapi real:** o consumidor existe, mas o CMS/VPS não está neste repositório e o checklist do runbook permanece não marcado.
- **Unificar o modelo de cases:** remover ou adaptar a representação duplicada em `site.ts`.
- **Resolver divergências de configuração FTP:** `.env.deploy.example` e testes mostram caminhos antigos, enquanto o runbook define `/netz.now/`.
- **Reexecutar Playwright fora do sandbox e registrar o resultado da branch atual.**

### SEO e produção

- Adicionar `sitemap.xml` automático.
- Adicionar `robots.txt`.
- Avaliar JSON-LD/Schema.org para Organization, WebSite e casos.
- Adicionar `hreflang="x-default"` e preferir URLs absolutas nos alternates.
- Revisar se canonical deve preservar query string; atualmente preserva.
- Revisar privacidade/consentimento antes de incluir analytics.
- Definir analytics e eventos de conversão se houver objetivo mensurável.

### Conteúdo e UX

- Expandir o número e a profundidade dos cases aprovados.
- Confirmar métricas reais antes de substituir sinais/valores descritivos.
- Revisar consistência editorial de português, inglês e espanhol; o português está mais desenvolvido.
- Atualizar o conteúdo histórico ainda chamado “placeholder” nos `alt` de mídia, embora imagens raster reais já sejam usadas.
- Definir destino e narrativa da nova área Labz.
- Rever o e-mail oficial e alinhar todos os documentos/mocks.
- Decidir se `/dev/components` deve continuar público no build de produção ou ser protegido/excluído.
- Remover copy não utilizada em `ui.home.manifesto` e `proofSummary`, ou conectá-la à interface.

### Operação

- Fixar versão Node (`.nvmrc`, `.tool-versions` ou `engines`) para builds reproduzíveis.
- Avaliar FTPS/SFTP; a configuração documentada usa FTP sem TLS.
- Definir estratégia de limpeza de arquivos remotos obsoletos.
- Adicionar observabilidade/logs persistentes para deploy e webhook.
- Filtrar explicitamente eventos aceitos do Strapi antes de disparar deploy.
- Documentar rollback executável, não apenas conceitual.

### Itens históricos fora do escopo atual

- Rota de preview OG planejada, mas ausente.
- Assinatura HTML Roundcube especificada, mas removida do estado atual.
- CMS de páginas institucionais, menus ou SEO: não faz parte da fase 1 Strapi.

---

# 4. MAPEAMENTO DE CONTEÚDO E ESTRUTURA ATUAL (O Mapa)

## 4.1 Mapa de rotas

| Rota | Idiomas | Função |
|---|---|---|
| `/` | neutra | Página HTML mínima com canonical e redirecionamento para `/pt/`. |
| `/[lang]/` | pt/en/es | Home institucional proof-first. |
| `/[lang]/cases/` | pt/en/es | Biblioteca/arquivo de cases com filtros. |
| `/[lang]/cases/[slug]/` | pt/en/es | Narrativa detalhada de cada case publicado. |
| `/[lang]/sobre/` | pt/en/es | Posicionamento, manifesto, método e capacidades. |
| `/[lang]/contato/` | pt/en/es | Conversão por formulário, WhatsApp e e-mail. |
| `/dev/components/` | sem locale | Catálogo interno de componentes e mocks. |
| `/[lang]/labz/` | pretendida | **Não existe ainda**; é apenas o destino do CTA do header. |

Os slugs de cases atuais são:

- `corsan`;
- `nous-group`;
- `bss`.

No modo Strapi, os slugs publicados válidos definem os paths gerados durante o build.

## 4.2 Estrutura detalhada da home

### 1. Header flutuante

Conteúdo:

- logo Netz;
- links Home, Cases, Sobre e Contato;
- indicação do link ativo;
- CTA visual Labz no lado direito;
- menu expansível no mobile.

O CTA Labz não usa texto visual. Ele usa o SVG inline para permitir animação das paths. Em hover/foco:

- a superfície sobe 1 px e ganha sinal lime;
- um scan atravessa o botão;
- partes do logo pulsam em sequência num loop suave;
- oito bolhas sobem com tamanhos, durações, delays e desvios diferentes;
- uma proteção radial escura fica atrás do logo para manter contraste;
- movimento é desativado para usuários com preferência reduzida.

### 2. Hero

Português atual:

- eyebrow: “TECNOLOGIA PARA AMBIENTES COMPLEXOS”;
- título: “Tecnologia para operações complexas do mundo real.”;
- resumo sobre sistemas, automações, sites e IA aplicada;
- CTA primário “Fale com a Netz” → contato;
- CTA secundário “Ver cases” → arquivo de cases.

Visual:

- fundo graphite/black com dois gradientes radiais;
- grade técnica de 56 px mascarada radialmente;
- texto central, compacto e responsivo;
- header sobreposto ao mesmo ambiente visual.

### 3. Faixa de clientes

Label: “EMPRESAS QUE FAZEM PARTE DA NOSSA JORNADA”.

Logos locais atuais:

- Sicredi;
- Fundação Sicredi;
- CMPC;
- AB InBev;
- Corsan;
- Viex.cc;
- Nous Group;
- Arezzo;
- BSS.

O array é duplicado para criar loop contínuo. A animação dura 32 segundos, pausa em hover e vira scroll horizontal estático com reduced motion. Os logos são monocromatizados/clareados por filtro CSS e seus nomes permanecem disponíveis semanticamente.

### 4. Capacidades

Cabeçalho em português:

- “Capacidades”;
- “Tecnologia aplicada com governança e agilidade.”;
- explicação sobre operações inteligentes, integradas e confiáveis.

Cinco cards atuais em português:

1. Sites e experiências digitais.
2. IA aplicada e automação.
3. Integrações robustas.
4. Estratégia e inovação.
5. Squads e implementação.

Em inglês e espanhol, a taxonomia ainda segue mais de perto o modelo estratégico original: IA/agentes, automação/integração, governança, inovação e squads/plataformas. Isso é uma divergência conceitual entre locales a revisar.

Motion: um spotlight atmosférico atravessa os cards como uma onda coordenada. O efeito é interno, discreto, baseado em transform/opacity e desligado com reduced motion.

### 5. Cases de sucesso

Cabeçalho:

- “CASES DE SUCESSO”;
- “Soluções validadas em contextos reais”;
- resumo sobre validação, redução de fricções e eficiência operacional.

Composição:

- um case em destaque à esquerda: Empresa de Saneamento Riograndense/Corsan;
- dois cards compactos à direita: Nous Group e BSS;
- logos secundários ampliados na última revisão;
- links para os detalhes localizados;
- efeito de spotlight responsivo à posição do ponteiro, contido na superfície.

O case destaque usa a marca-gota da Netz em sua faixa interna, uma decisão protegida por teste.

### 6. Sobre/manifesto resumido

Em português:

- eyebrow: “Sobre a Netz”;
- título: “Operações inteligentes começam com relações fortes.”;
- resumo que conecta tecnologia, estratégia, relações de longo prazo e resultados;
- card “Manifesto”;
- “Sempre fomos agentes de provocação”;
- “Agora desenvolvemos agentes transformadores”;
- mensagem sobre tecnologia aplicada construída em rede, com confiança, parceria e direção.

### 7. Contato

Em português:

- título: “Vamos entender o seu desafio?”;
- convite para explicar a empresa e o que se espera da Netz;
- frase secundária sobre WhatsApp/e-mail;
- botões WhatsApp e `help@netz.now`;
- formulário com nome, empresa, e-mail e desafio;
- feedback de envio e instrução de fallback.

### 8. Footer

- logo Netz;
- texto sobre redes fortes e operações inteligentes;
- WhatsApp;
- e-mail;
- links PT, EN e ES.

## 4.3 Página de cases

Função: funcionar como biblioteca de prova, não como landing promocional.

Estrutura:

- título de página semântico;
- resumo editorial;
- sidebar sticky com filtros;
- grid de três colunas em desktop, duas em largura intermediária e uma em telas menores;
- primeiro case destacado dentro da mesma família visual;
- mensagem acessível para resultado vazio;
- filtros aplicados no cliente, sem nova navegação ou request.

Filtros:

- segmento;
- tamanho;
- tipo de entrega;
- tecnologia;
- opção “Todos” e ação “Limpar filtros”.

Taxonomias locais incluem infraestrutura/utilidades, consultoria, serviços, enterprise, mid-market, growing, inteligência/experiência digital/plataforma, RAG, agentes, governança, UI/UX, web dev, plataformas e automação.

## 4.4 Detalhes de case

O template segue uma narrativa única e compacta:

1. retorno ao arquivo;
2. contexto/cliente;
3. eyebrow e título;
4. resumo executivo;
5. mídia principal quando disponível;
6. visão do projeto/desafio;
7. frame, frentes e entregas;
8. como a Netz atuou;
9. capacidades;
10. sinais/números do projeto;
11. resultado/impacto;
12. citação;
13. mídia de apoio;
14. ponte de governança;
15. até dois cases relacionados;
16. painel de contato.

### Case Corsan / Empresa de Saneamento Riograndense

- Destaque e primeiro do arquivo.
- Contexto público anonimizado dentro da narrativa: “Empresa de saneamento do Sul do Brasil” / setor regulado, embora o nome da entidade seja usado em outros lugares.
- Tema: IA aplicada a documentos/análises jurídicas.
- Desafio: alto volume documental com necessidade de controle, segurança e governança.
- Atuação: mapeamento do fluxo, critérios de classificação, solução de IA, triagem e guardrails.
- Capacidades: IA aplicada, governança, automação e RAG.
- Resultado narrativo: rastreabilidade, redução de esforço e base mais segura para escala.
- Possui mídia raster hero e support.
- Métricas numéricas sensíveis são tratadas com cautela/NDA no modelo local.

### Case Nous Group

- Tema: posicionamento/presença digital.
- Desafio: traduzir uma proposta consultiva densa em experiência clara e confiável.
- Atuação: arquitetura de informação, hierarquia visual/copy e base web evolutiva.
- Capacidades: UI/UX, desenvolvimento web e clareza/consultoria estratégica.
- Resultado: comunicação mais madura, leitura mais rápida e suporte comercial.
- Mídias raster existem no repositório e o modelo suporta hero/support.

### Case BSS

- Tema: site e plataforma para evolução comercial.
- Desafio: substituir presença desarticulada por uma base digital consistente e evolutiva.
- Atuação: espinha dorsal da navegação, conexão entre copy/interface/técnica e preparação para iterações.
- Capacidades: web, plataformas e automação.
- Resultado: superfície mais clara para apresentação de valor, relacionamento e crescimento.
- Mídias raster existem no repositório e o modelo suporta hero/support.

## 4.5 Página Sobre

Estrutura:

- introdução institucional com `h1`;
- card-manifesto;
- seção “Como pensamos” com quatro etapas;
- repetição das cinco capacidades;
- painel de contato.

Método atual:

1. Descoberta — escuta, contexto e fluxos reais.
2. Definição — caminhos viáveis, prioridades e direção.
3. Prototipação — aprendizado rápido e redução de risco.
4. Evolução contínua — sistemas vivos apoiados por tecnologia, escuta e análise.

## 4.6 Página Contato

Usa o mesmo `ContactPanel` da home e dos cases, mas promove o título a `h1`. É uma rota curta e deliberadamente direta. Não há página de agradecimento: sucesso e erro aparecem inline.

## 4.7 Catálogo interno de componentes

`/dev/components` serve como inventário visual do design system em código. Ele contém:

- hero de desenvolvimento;
- navegação por grupos;
- previews com conteúdo mockado;
- metadados de origem e status;
- tracking de seção ativa por viewport;
- layout responsivo.

É útil para revisão e reutilização, mas atualmente é gerado como rota pública. Se houver preocupação com exposição interna, precisa ser removido do build de produção ou protegido por outra camada.

## 4.8 Assets e identidade

- Marca principal Netz em SVG e PNG.
- Gota/marca isolada para cases.
- Dois SVGs Labz, sendo `Logo-LABZ.svg` o usado no header e `Logo-LABZ-glow.svg` uma alternativa não usada no runtime.
- Logos de clientes em SVG, PNG e WebP.
- Imagens fotográficas `hero` e `support` para os três cases.
- Placeholders SVG preservados para referência/fallback editorial.
- Imagem social 1200 × 630.
- Arquivo legado HTML e fontes de identidade mantidos fora da árvore pública principal.

---

# 5. REGRAS DE NEGÓCIO E DIRETRIZES TÉCNICAS

## 5.1 SEO implementado

O `BaseLayout` implementa:

- `<title>` por página;
- meta description;
- canonical;
- Open Graph: type, site name, title, description, URL, imagem e locale;
- Twitter Card `summary_large_image`;
- imagem social absoluta baseada na origem pública;
- `hreflang` para pt, en e es;
- atributo `lang` no HTML;
- favicon SVG/PNG, shortcut icon e apple touch icon;
- theme color;
- web manifest.

`PUBLIC_SITE_ORIGIN` pode sobrescrever a origem. Sem ela, o layout considera headers encaminhados ou a URL da request. A raiz possui canonical para `/pt/` e redirecionamento customizado, evitando o markup de redirect estático padrão do Astro.

### Lacunas de SEO

- não existe integração `@astrojs/sitemap`;
- não existe `robots.txt`;
- não existe JSON-LD;
- não existe `x-default`;
- alternates são relativos no markup atual;
- não há estratégia de paginação, pois só existem três cases;
- não há automação de preview/validação social;
- não há SEO editorial vindo do Strapi na fase 1;
- canonical inclui query string, o que deve ser revisto conforme estratégia de campanhas.

## 5.2 Performance

Pontos positivos:

- saída 100% estática;
- JavaScript restrito a menu, formulário, filtros, spotlight e catálogo;
- assets públicos servidos diretamente;
- imagens do carrossel usam `loading="lazy"`;
- animações preferem transform e opacity;
- `will-change` é usado de forma localizada;
- CSS majoritariamente encapsulado nos componentes;
- sem framework client-side hidratado.

Pontos a observar:

- imagens raster de cases têm aproximadamente 1–2 MB cada e podem demandar compressão/WebP/AVIF e `srcset`;
- Google Fonts é uma dependência externa e pode causar atraso/privacidade; considerar self-host;
- não há uso do componente de imagem do Astro para otimização automática;
- SVG Labz é inserido inline via `?raw`, apropriado para animação, mas deve continuar sendo tratado como asset confiável do repositório;
- animações do carrossel, spotlight e Labz devem continuar com escopo controlado.

## 5.3 Acessibilidade

Diretriz: WCAG AA pragmático como parte da qualidade executiva.

Implementado:

- um `h1` por página principal;
- headings configuráveis nos componentes;
- foco visível global em lime;
- navegação móvel com botão e `aria-expanded`;
- `aria-current` em navegação e idiomas;
- alt text para logos e mídias;
- labels reais no formulário;
- status de formulário com `aria-live`;
- honeypot fora do fluxo visual;
- CTAs com altura mínima próxima de 44 px;
- `prefers-reduced-motion` global e específico;
- bolhas decorativas `aria-hidden`;
- CTA Labz com rótulo localizado mesmo sem texto visual;
- duplicatas do carrossel ocultadas semanticamente.

Cuidados futuros:

- testar contraste após qualquer aumento de transparência/glow;
- manter o logo Labz legível sobre as bolhas;
- validar o menu e os filtros inteiramente por teclado;
- não depender apenas de cor para estado;
- preservar o conteúdo essencial quando motion for desligado;
- revisar a ordem de foco no menu móvel expandido.

## 5.4 Design system interno

### Norte criativo

**Executive Laboratory**: laboratório executivo, preciso, atmosférico, técnico e confiável.

### Paleta principal

| Token | Valor | Uso |
|---|---|---|
| `--void-black` | `#0A0A0A` | Canvas e hero. |
| `--graphite-surface` | `#1E1E1E` | Cards e superfícies. |
| `--graphite-raised` | `#252525` | Superfícies elevadas. |
| `--graphite-border` | `#333333` | Estrutura padrão. |
| `--graphite-border-light` | `#444444` | Bordas de maior contraste. |
| `--executive-grey` | `#808080` | Texto auxiliar. |
| `--body-muted` | `#AAAAAA` | Corpo de texto. |
| `--bone-white` | `#DADACA` | Títulos e alta ênfase; evita branco puro. |
| `--signal-lime` | `#BFFF80` | CTA, ação e prova. |
| `--signal-lime-soft` | `#D4FFAA` | Eyebrows e ênfase mais suave. |
| `--flash-lime` | `#85FF0A` | Hover de ações primárias. |

Regra central: lime é cor de comando/sinal, não decoração dominante.

### Tipografia

- Família: Sora, com fallbacks Helvetica Neue, Arial e sans-serif.
- Pesos carregados: 400, 500, 600 e 700.
- Hero: `clamp(2.18rem, 3.05vw, 2.85rem)`, peso 700.
- Hero mobile: `clamp(1.86rem, 7.94vw, 2.14rem)`.
- Títulos de seção: `clamp(1.38rem, 2.12vw, 2.05rem)`.
- Labels: `0.64rem`, uppercase, tracking `0.08em`, peso 600.
- Corpo: 1rem/1.6; corpo pequeno `0.86rem`.

Evitar reintroduzir peso 800 e escalas gigantes. Há alguns valores 800/750 remanescentes no `ContactPanel`, que são inconsistentes com os tokens documentados e merecem normalização futura.

### Layout, spacing e formas

- Container: `min(1120px, calc(100vw - 40px))`.
- Seção: `clamp(56px, 7vw, 96px)`.
- Seção compacta: `clamp(36px, 5vw, 64px)`.
- Página: `clamp(76px, 9vw, 112px)`.
- Card padding: `clamp(0.9rem, 1.7vw, 1.25rem)`.
- Raios: 6, 10 e 16 px.
- Bordas: normalmente 1 px graphite/translúcido.
- Navegação: flutuante/sticky, 64 px desktop e 62 px mobile.
- Superfícies: graphite quente, sem glassmorphism ostensivo.

### Padrões recorrentes

- Eyebrow curto em lime acima do título.
- Títulos bone-white e corpo muted.
- Cards compactos, sem nesting excessivo.
- Prova social cedo.
- Duas colunas em desktop, uma coluna em mobile.
- Listas horizontais/scroll quando empilhar destruiria o ritmo.
- Um destaque principal acompanhado por itens compactos.
- Motion atmosférico sempre recortado à superfície do componente.

## 5.5 Regras de motion

- Movimento deve comunicar fluxo, progresso, foco ou resposta.
- Preferir `transform` e `opacity`.
- Evitar bounce, elastic e easings teatrais.
- Loops precisam ser longos, sutis e raros.
- Efeitos pertencentes a um card devem ficar clipados dentro dele.
- Todo efeito precisa responder a `prefers-reduced-motion`.
- Não animar tantos elementos a ponto de criar uma interface inquieta.

Assinaturas atuais:

- carrossel contínuo de logos;
- spotlight em onda pelas capacidades;
- spotlight por ponteiro nos cases;
- CTA Labz com scan, pulsos de paths e bolhas ascendentes.

## 5.6 Regras do sistema de cases

- Um case publicado precisa ter slug, cliente, logo, taxonomias e conteúdo localizado.
- Deve haver ao menos uma tecnologia.
- Deve haver pelo menos dois itens de atuação e dois sinais/métricas.
- `archiveSummary` deve permanecer curto; testes atuais exigem no máximo 132 caracteres.
- O case `featured` aparece primeiro.
- A narrativa deve seguir: contexto → atuação → capacidades → resultado.
- Não repetir o mesmo resumo/desafio/resultado em várias superfícies.
- NDA deve ser respeitado; contexto e nome público podem diferir.
- Relações entre cases são definidas por slugs.
- Mídia pode ser nula; o layout deve continuar íntegro.

## 5.7 Regras editoriais Strapi

- Fase 1 cobre apenas `Case` e `ClientLogo`.
- O locale raiz dos cases é português.
- Inglês e espanhol são localizações da mesma entidade editorial.
- Apenas conteúdo publicado entra na query.
- Conteúdo inválido não deve chegar silenciosamente à produção em modo `strict`.
- `hybrid` é mecanismo de migração/resiliência, não substituto para corrigir dados inválidos.
- Assets remotos precisam fornecer URL e alt quando aplicável.
- Um publish deve disparar validação, build e deploy completos.

## 5.8 Regras de segurança e configuração

- Nunca versionar `.env`, `.env.deploy` ou senhas.
- A exceção versionada é apenas `.env.deploy.example`.
- Token Strapi deve ser enviado por `Authorization: Bearer` somente quando configurado.
- Webhook exige assinatura HMAC.
- Diretório FTP remoto não pode ser vazio ou raiz `/`.
- Build e testes devem passar antes do upload.
- `dist/`, `node_modules/`, `.astro`, worktrees, caches, logs e artefatos de teste não entram no Git.
- Assets públicos devem usar paths seguros e existir fisicamente; isso é protegido por teste.

## 5.9 Regras para expansão do site por outro modelo de IA

Qualquer evolução deve:

1. Ler `PRODUCT.md`, `DESIGN.md` e este documento antes de alterar arquitetura ou UI.
2. Preservar pt/en/es como requisito de rota e conteúdo.
3. Manter prova cedo e hero proporcional.
4. Evitar hype genérico, métricas inventadas e repetição de copy.
5. Reutilizar os componentes e tokens existentes antes de criar novos padrões.
6. Atualizar conteúdo em `src/content/`, não hardcodar textos públicos no componente, salvo fallbacks técnicos.
7. Avaliar se o conteúdo deve continuar local ou entrar no boundary Strapi.
8. Preservar acessibilidade e reduced motion.
9. Otimizar assets antes de adicionar novas imagens pesadas.
10. Rodar Astro check, Vitest, Playwright e build.
11. Atualizar documentação quando uma decisão de produto, design ou operação mudar.
12. Não considerar a rota Labz pronta apenas porque o CTA já existe.

## 5.10 Fonte de verdade recomendada

Para decisões futuras, usar esta ordem de precedência:

1. código e testes da branch ativa;
2. `CONTEXT_NETZ_SITE.md`;
3. `PRODUCT.md` para posicionamento e regras de produto;
4. `DESIGN.md` para sistema visual e UX;
5. `README.md` e runbooks para operação;
6. handoff e notas de copy/typeset;
7. specs e planos históricos, lembrando que alguns descrevem intenção anterior e podem estar superados pelo código atual.

Quando documentação e runtime divergirem, registrar a diferença e decidir conscientemente antes de “corrigir” o código. Exemplos atuais: e-mail de contato, destino FTP, taxonomia das capacidades por idioma, rota Labz e estado real da infraestrutura Strapi.
