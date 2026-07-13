#!/bin/bash
# Regenera o cérebro do Mintzie-guia (imersao/imersao_knowledge.md) a partir de contexto/.
#
# contexto/ é a FONTE ÚNICA — é de lá que o Hermez e o Mintzie bebem.
# Fluxo: adicione/edite um .md em contexto/  ->  rode este script  ->  commit + push  ->  redeploy.
#
# Montagem = imersao/_intro.md  +  contexto/README.md (índice)  +  todos os docs de contexto/ (íntegra).
# Transcrições (*transcricao*) ficam em contexto/ (para o painel e o Hermez) mas NÃO entram no cérebro
# do Mintzie — são longas demais e pesariam cada resposta.

set -e
cd "$(dirname "$0")/.."          # raiz do projeto (mintzie-site-assistant)
OUT="imersao/imersao_knowledge.md"
SEP="=================================================================="

cat imersao/_intro.md > "$OUT"
{ echo; echo "---"; echo; } >> "$OUT"
cat contexto/README.md >> "$OUT"

n=0
for f in contexto/netz/*.md contexto/referencias-externas/*.md; do
  case "$(basename "$f")" in
    *transcricao*|checkin-*) continue ;;   # transcrições brutas ficam no contexto, fora do cérebro (longas; já destiladas em acordos/cronograma)
    README.md) continue ;;
  esac
  { echo; echo; echo "$SEP"; echo "DOCUMENTO-FONTE: $(basename "$f")"; echo "$SEP"; echo; cat "$f"; } >> "$OUT"
  n=$((n+1))
done

echo "OK  ->  $OUT"
echo "    $n documentos-fonte | $(wc -w < "$OUT" | tr -d ' ') palavras"
echo "    (lembre: reinicie o servidor / redeploy para o Mintzie recarregar)"
