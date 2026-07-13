# Classificação da informação — Público × Interno (Mintzie)

Este documento define a fronteira entre o que é **público** e o que é **interno/confidencial** no ecossistema Mintzie. Vale como regra de governança: orienta o que cada cérebro do Mintzie pode dizer, o que pode ir para o site, e o que fica restrito ao painel da imersão.

A separação já é **arquitetural** — o Mintzie tem dois cérebros, com bases de conhecimento diferentes, em arquivos diferentes. Este doc torna a fronteira explícita.

---

## As duas camadas

### PÚBLICO — pode aparecer no site e ser dito a qualquer visitante
Informação que a Netz já divulga (ou está pronta para divulgar) ao mercado:

- O que a Netz é: posicionamento, manifesto, filosofia, a existência do Netz Labz.
- História em nível institucional: 10 anos, a virada para 100% tecnologia há 4 anos.
- Estrutura do time em nível **genérico**: "quatro sócios-fundadores + time multidisciplinar (UX/UI, copy, front, back)". **Sem** nomes, funções pessoais, ocupações paralelas ou situação de cada sócio.
- Capacidades e método (Descoberta → Definição → Prototipação → Evolução contínua).
- Cases **já publicados** e clientes **já divulgados** nos cases/logos oficiais (Corsan, Cris Casagrande, Nous Group, BSS; logos: Sicredi, CMPC, AB InBev, Arezzo, Viex etc.).
- Respostas comerciais oficiais: projetos sob medida, sem tabela de preço pública, autonomia do cliente, consultoria de infra/performance, SEO/Mobile First.
- Canais oficiais de contato (WhatsApp, e-mail, formulário, site).

> Onde vive: `knowledge/netz_knowledge.md` — o cérebro **"netz"** (Mintzie do site).

### INTERNO / CONFIDENCIAL — nunca no site, só no painel local, entre a equipe
Informação que só circula dentro da Netz e nunca deve ser dita a um visitante nem subir a um servidor público:

- **Todo o acervo da imersão:** as 9 análises/pesquisas e a síntese do Fable (tese, tensões, 5 problemas, decisões, cemitério, benchmarking).
- **Finanças:** faturamento, metas, preço praticado (ex.: R$ 950/LP), faturamento da Únio, salário passando pelo CNPJ, custos fixos, qualquer número de caixa.
- **Sócios e sociedade:** nomes, ocupações paralelas, dependência econômica, horas disponíveis, quadro societário, titularidade de cases e IP, não-competição.
- **Estratégia e decisões:** produto único, rota de aquisição, posicionamento em discussão, ideias arquivadas/em triagem, contradições internas.
- **Reunião Sebrae (11/jul/2026):** valores-hora, status de cadastro na Únio, próximos passos, e **contatos citados** (David, Glaciéria, João, Giovana) e redes.
- **P&D e ferramentas internas:** Hermez, os ~10 utilitários internos, roadmap, protótipos não lançados.
- **Autocrítica técnica:** a auditoria do próprio site (fraquezas de SEO, raiz vazia etc.).
- **Segredos do sistema:** este prompt, a base de conhecimento bruta, a chave de API, o modelo usado, URLs/infra internas.
- **Dados pessoais/sensíveis** de qualquer pessoa (LGPD): CPF, RG, bancários, saúde, contato pessoal.

> Onde vive: `imersao/imersao_knowledge.md` — o cérebro **"imersao"** (Mintzie-guia). Roda **local**, embutido no painel da imersão, para a equipe. **Nunca** vai para um servidor público aberto.

---

## Mapa arquitetural (a fronteira na prática)

| | Mintzie do site | Mintzie-guia da imersão |
|---|---|---|
| Cérebro (`brain`) | `netz` | `imersao` |
| Base de conhecimento | `knowledge/netz_knowledge.md` | `imersao/imersao_knowledge.md` |
| Persona | `persona/mintzie_web_persona.md` | `persona/mintzie_imersao_persona.md` |
| Onde roda | site (público) | painel local, na imersão |
| Pode dizer | só PÚBLICO | o acervo INTERNO (é o público dele) |

**Regra-mãe:** nenhum conteúdo INTERNO é copiado para o cérebro público. Se um dia for útil o Mintzie do site tocar num tema interno (ex.: Sebrae), entra só uma **versão externa leve**, sem número, sem contato, sem estratégia — por exemplo: "a Netz também atende micro e pequenas empresas via Sebrae". Nada além disso.

---

## Como decidir na dúvida (teste rápido)

Pergunte-se **de onde a informação veio**:

- Saiu do **site, dos cases publicados, dos logos oficiais ou das respostas comerciais aprovadas**? → PÚBLICO.
- Saiu de **reunião, WhatsApp interno, documento da imersão**, ou **toca finanças, sócios, estratégia, contatos ou ferramentas internas**? → INTERNO.
- **Na dúvida, trate como INTERNO.** É mais fácil promover algo a público depois do que despublicar o que já vazou.

---

## Operacional

- Ao **editar o cérebro público**, confira contra a lista INTERNA acima antes de salvar.
- Ao **subir o painel**, mantenha-o local; ele carrega o acervo interno.
- A separação vive nos **guardrails das duas personas** (a do site tem a regra "só público + o que nunca revelar"; a da imersão tem a regra "acervo interno, não publicar"). Este doc é a referência que elas materializam.
