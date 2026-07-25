# 🌴 Buteco do Tatto — Cardápio Digital

Sistema de cardápio digital, comanda e painel administrativo para a barraca de praia
**Buteco do Tatto** (Praia de Stella Mares, Salvador — BA).

## Páginas

| Arquivo | Descrição |
|---|---|
| [`index.html`](index.html) | Entrada do site — redireciona direto para o cardápio |
| [`cardapio.html`](cardapio.html) | Cardápio do cliente (layout estilo iFood) — busca, carrinho e envio do pedido |
| [`comanda.html`](comanda.html) | Comanda digital para o atendimento |
| [`dashboard.html`](dashboard.html) | Painel administrativo (pedidos, estoque, relatórios) |

## Como rodar (demo)

É um site estático — basta abrir `index.html` no navegador, ou servir a pasta:

```bash
# Qualquer servidor estático serve. Exemplo com Python:
python -m http.server 8080
# depois acesse http://localhost:8080
```

Os dados (pedidos, produtos, tema) são guardados no `localStorage` do navegador e
sincronizam entre abas abertas no mesmo dispositivo.

## Login do painel (demo)

Usuário e senha: `admin` / `admin` — **apenas para demonstração**.
A autenticação é feita no cliente; não use dados reais até existir um backend.

## Roadmap

O esqueleto de um backend SaaS está em [`prisma/`](prisma/schema.prisma),
[`docker-compose.yml`](docker-compose.yml) e [`docs/`](docs/) — ainda não implementado.
