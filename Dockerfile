# Mintzie — painel da imersão (Node puro, sem dependências externas)
FROM node:20-alpine

WORKDIR /app
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
# painel da imersão exige o modo internal (carrega o acervo interno).
# PROTEJA com BASIC_AUTH_USER / BASIC_AUTH_PASS (variáveis no Coolify).
ENV MINTZIE_MODE=internal

EXPOSE 3000
CMD ["node", "server.js"]
