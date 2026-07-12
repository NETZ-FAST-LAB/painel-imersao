#!/bin/bash
# Duplo-clique para baixar TODOS os vídeos novos do Mintzie de uma vez.
# Eles caem em _downloads/ com o nome do estado. Depois o Claude converte pra cinza.

cd "$(dirname "$0")" || exit 1
mkdir -p _downloads
BASE="https://d8j0ntlcm91z4.cloudfront.net/user_3EgO4tndVEaaZiMNjhWkp1yQoFU"

FILES=(
"happy|hf_20260703_211855_5c1fce60-fd90-4f65-91ad-ea12ca644d85.mp4"
"pointing|hf_20260703_211857_db991da6-e3f9-44f1-86fe-65f289339f4b.mp4"
"confused|hf_20260703_211909_2a821fbe-fe8a-4612-b80e-78802993a640.mp4"
"celebrating|hf_20260703_211912_ca89fc49-e391-4e17-991b-09ce4e52525c.mp4"
"laughing|hf_20260704_010747_10d76d65-b37e-4c15-b4e0-3649cb30cfb3.mp4"
"surprised|hf_20260704_010749_a6f9d461-d440-4cbb-bcd8-59f65f50d62a.mp4"
"grooming|hf_20260704_010801_96e514f8-ba0e-4c11-b8c5-ae3237c348fe.mp4"
"stretching|hf_20260704_010804_b2907d17-8036-4b38-9f37-b7de5c76fcb5.mp4"
"sleeping|hf_20260704_011835_9730a02a-c6a4-4762-bb2a-ed99e9d07a3e.mp4"
"coffee|hf_20260704_011841_f5a55401-a8e7-4231-96b2-4e7fdc4b961a.mp4"
"spin|hf_20260704_011854_46db4579-d97c-4380-9073-0b575f61320e.mp4"
"knock|hf_20260704_011858_6cd50f1f-d8b0-4a96-b56c-06d965ffdeb6.mp4"
"reading|hf_20260704_140658_9ca566e6-f220-41a1-aab4-47c33fbbd2cf.mp4"
"welcomeback|hf_20260704_140712_2b1e1d42-2f43-4be8-b6b5-3747f68ef326.mp4"
"loaf|hf_20260704_140715_e4c8c0d8-a254-4f91-a272-4acc67491927.mp4"
"blep|hf_20260704_140718_ed30eb31-fb2e-4bdd-a03d-21bb7ca4ad9a.mp4"
"scroll|hf_20260704_212653_d09778f7-98bf-41e7-915d-56650481f76c.mp4"
"exit|hf_20260704_212656_84c5904b-26c0-44cd-ac32-78370de26cb5.mp4"
)

ok=0; fail=0
for entry in "${FILES[@]}"; do
  name="${entry%%|*}"; file="${entry##*|}"
  printf "Baixando %-14s ... " "$name"
  if curl -fsSL -o "_downloads/$name.mp4" "$BASE/$file"; then
    echo "ok"; ok=$((ok+1))
  else
    echo "FALHOU"; fail=$((fail+1))
  fi
done

echo
echo "Concluido: $ok baixados, $fail falharam."
echo "Arquivos em: $(pwd)/_downloads/"
echo "Agora volte no chat e diga 'baixei' que o Claude converte tudo pra cinza."
echo
read -n 1 -s -r -p "Pressione qualquer tecla para fechar."
