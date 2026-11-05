# Calendário de Eventos

App simples (um único `index.html`, sem build) para organizar os dias de um evento:

- **Calendário**: clique nos dias que farão parte do evento.
- **Árvore por dia**: manhã / tarde / noite (um ou mais) → opções do que fazer → sugestões de locais para comparar (endereço, preço, link, notas, estrelas, favorito) e marcar a opção decidida.
- **Calculadora de rota** (Google Maps): a partir de um ponto de saída, compara o tempo até cada local de transporte público, a pé ou de carro e destaca o mais perto. Cada local também tem links para abrir mapa e rota no Google Maps.
- Vários eventos, dados salvos no navegador (localStorage) e **exportar/importar** JSON para compartilhar com o pessoal.

## Chave do Google Maps

A comparação automática usa a [Routes API](https://developers.google.com/maps/documentation/routes) (`computeRouteMatrix`).

1. No Google Cloud, crie uma chave e ative a **Routes API**.
2. Restrinja a chave por *referenciador HTTP* ao domínio do site (ex.: `https://seu-projeto.vercel.app/*`) e à Routes API.
3. No app, clique em ⚙️ e cole a chave. Ela fica salva só no navegador de quem usa.

Sem chave, os botões "rota" e "abrir ↗" continuam funcionando (abrem o Google Maps).

## Rodar / publicar

- Local: abra `index.html` no navegador.
- Vercel: importe o repositório em https://vercel.com/new (Framework: *Other*, sem build). Cada push na `main` publica sozinho.
