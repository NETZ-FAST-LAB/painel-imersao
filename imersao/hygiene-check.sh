#!/bin/bash
# Higiene & consistência do acervo NETZ — READ-ONLY (só diagnostica, não altera nada).
# Uso: bash imersao/hygiene-check.sh
cd "$(dirname "$0")/.."
fail=0
sec(){ echo; echo "[$1] $2"; }
ok(){ echo "  ✓ $1"; }
warn(){ echo "  ⚠ $1"; }
err(){ echo "  ✗ $1"; fail=1; }

sec 1 "Órfãos — docs de contexto sem linha no índice (README)"
o=0
for f in contexto/netz/*.md contexto/referencias-externas/*.md; do
  b=$(basename "$f"); [ "$b" = "README.md" ] && continue
  grep -q "$b" contexto/README.md || { err "órfão: $f"; o=$((o+1)); }
done
[ $o -eq 0 ] && ok "nenhum órfão"

sec 2 "Índice-fantasma — entradas do README apontando p/ arquivo inexistente"
g=0
for m in $(grep -oE '\*\*[a-z0-9-]+\.md\*\*' contexto/README.md | tr -d '*' | sort -u); do
  find contexto -name "$m" | grep -q . || { err "índice cita mas não existe: $m"; g=$((g+1)); }
done
[ $g -eq 0 ] && ok "nenhuma entrada quebrada"

sec 3 "Cérebro fresco — imersao_knowledge.md mais novo que os docs-fonte"
brain=imersao/imersao_knowledge.md
newest=$(ls -t contexto/netz/*.md contexto/referencias-externas/*.md contexto/README.md imersao/_intro.md 2>/dev/null | head -1)
if [ ! -f "$brain" ]; then err "cérebro não existe — rode build-brain.sh"
elif [ "$newest" -nt "$brain" ]; then err "cérebro DESATUALIZADO — rode build-brain.sh (mudou depois: $(basename "$newest"))"
else ok "fresco"; fi

sec 4 "Regressão de conceito — termos proibidos no acervo"
r=0
for pat in "patente do cliente" "ativos intangíveis desprotegidos" "sebrae-pi-observatorio"; do
  hits=$(grep -rl "$pat" contexto/ 2>/dev/null)
  [ -n "$hits" ] && { err "termo proibido '$pat' em: $(echo "$hits" | tr '\n' ' ')"; r=$((r+1)); }
done
[ $r -eq 0 ] && ok "nenhum termo proibido"

sec 5 "Datas — docs sem data aparente"
d=0
for f in contexto/netz/*.md; do
  grep -qiE "202[0-9]|jul/|/2026|última atualiza|data:" "$f" || { warn "sem data aparente: $(basename "$f")"; d=$((d+1)); }
done
[ $d -eq 0 ] && ok "todos com data"

sec 6 "Duplicatas potenciais — reconciliação manual (curadoria)"
warn "reanalise-pos-invernetz.md × revisao-pos-imersao-fable.md (2 análises Fable pós-imersão)"
warn "metodologia-netz-assistentes.md × priorizacao-e-roteiro-comercial.md (2 definições de produto)"

sec 7 "Intro — lembrete manual"
warn "conferir se imersao/_intro.md lista as abas atuais do painel (checagem manual)"

echo
if [ $fail -eq 0 ]; then echo "RESULTADO: sem erros bloqueantes (✗). Avisos (⚠) são curadoria."; else echo "RESULTADO: há inconsistências (✗) a resolver."; fi
exit 0
