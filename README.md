# Bora? 🎉 Planejador de rolê

Site estático (`index.html`) + três funções serverless da Vercel em `api/`. Sem build e sem dependências.

O fluxo é uma timeline:

1. **Crie o rolê**: nome e **ponto de encontro**. O botão "Chamar a galera" gera um link que qualquer pessoa pode abrir e editar.
2. **Escolha os dias** no calendário.
3. **Monte o roteiro**: em cada dia, manhã/tarde/noite → ideias do que fazer → lugares sugeridos para comparar (endereço, preço, link, notas, estrelas, favorito). Uma ideia pode ser marcada como "Fechou!".
4. **Quem tá mais perto?**: compara o tempo até cada lugar de transporte público, a pé ou de carro, saindo do ponto de encontro (ou de onde você estiver).

## Link compartilhado (edição ao vivo)

Os eventos compartilhados ficam num Redis (Upstash). Cada navegador salva as mudanças e busca as dos outros a cada 4 segundos. Quando duas pessoas mexem ao mesmo tempo, as mudanças são juntadas: o que cada um adicionou entra, e se os dois editarem o mesmo campo vale a última gravação.

Para ligar na Vercel:

1. No projeto da Vercel: **Storage → Create Database → Upstash for Redis** (plano grátis) e conecte ao projeto. Isso cria as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
2. Faça um novo deploy.

Sem isso o app funciona normalmente, mas só salva no navegador de quem está usando.

## Chave do Google Maps

A comparação automática usa a [Routes API](https://developers.google.com/maps/documentation/routes) (`computeRouteMatrix`).

- **Recomendado:** na Vercel, adicione a variável `GOOGLE_MAPS_API_KEY` (Settings → Environment Variables). A chave fica só no servidor e todo mundo do link consegue calcular sem configurar nada.
- **Alternativa:** cada pessoa cola a própria chave em ⚙️ (fica salva só no navegador dela).

No Google Cloud, ative a **Routes API** para a chave e restrinja a chave a essa API. Sem chave, os botões "rota" e "abrir ↗" continuam abrindo o Google Maps.

## Rodar local

Abrir `index.html` direto funciona (sem compartilhamento). Para testar com as funções, use `vercel dev`.
