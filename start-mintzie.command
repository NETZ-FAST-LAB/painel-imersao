#!/bin/bash
# Duplo-clique para (re)ativar o Mintzie em localhost:3000.
# Mata qualquer servidor preso na porta 3000, sobe o node e abre a página inicial (hub).

cd "$(dirname "$0")" || exit 1

echo "Encerrando qualquer servidor antigo na porta 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null

# abre o navegador na página inicial (hub) assim que o servidor subir — dela você chega em tudo
( sleep 1.8; open "http://localhost:3000/inicio" ) &

# uso da equipe: modo INTERNAL (painel, governança e cérebro da imersão liberados — só local!)
export MINTZIE_MODE=internal

echo "Subindo o Mintzie (modo INTERNAL — uso local da equipe)..."
echo "  Início (hub) .... http://localhost:3000/inicio"
echo "  Painel imersão .. http://localhost:3000/painel"
echo "  Governança ...... http://localhost:3000/governanca"
echo "  Site (público) .. http://localhost:3000/site"
echo "(deixe esta janela aberta enquanto usa; feche com Ctrl+C)"
echo
node server.js
