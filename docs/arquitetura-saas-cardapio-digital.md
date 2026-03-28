# Arquitetura: Cardápio Digital SaaS — Barraca do Tatto

> **Objetivo:** SaaS de cardápio digital inteligente com pedidos via WhatsApp, automação de fluxo completo com n8n e assistente IA para sugestões e atendimento automatizado.
> **Público-alvo:** Restaurantes, bares, lanchonetes, food trucks e quiosques que querem digitalizar o cardápio e receber pedidos via WhatsApp.
> **Stack:** Next.js 14 + NestJS + PostgreSQL + n8n + OpenAI + WhatsApp Business API

---

## 1. Arquitetura Geral

```
┌───────────────────────────────────────────────────────────────────┐
│                        CLIENTE FINAL                              │
│           (acessa via QR Code / link do cardápio)                 │
└───────────────────────┬───────────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼───────────────────────────────────────────┐
│                FRONTEND — Next.js 14 (App Router)                 │
│              (Vercel — SSR + Client Components)                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐     │
│  │ Cardápio     │  │ Dashboard    │  │ Landing Page        │     │
│  │ Público      │  │ Admin        │  │ (SaaS Marketing)    │     │
│  └──────────────┘  └──────────────┘  └─────────────────────┘     │
└───────────────────────┬───────────────────────────────────────────┘
                        │ REST API
┌───────────────────────▼───────────────────────────────────────────┐
│                  BACKEND — NestJS (porta 3001)                    │
│              (Railway / VPS — Docker container)                    │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────────┐  │
│  │  Guards  │  │  Pipes   │  │ Intercept │  │  WebSocket     │  │
│  │  (JWT)   │  │  (Valid) │  │  (Logger) │  │  (Real-time)   │  │
│  └──────────┘  └──────────┘  └───────────┘  └────────────────┘  │
│                                                                   │
│  Módulos: Auth │ Users │ Stores │ Categories │ Products │ Orders  │
│           Cart │ WhatsApp │ AI │ Analytics │ Plans │ Payments    │
└──────┬──────────────────┬──────────────────┬──────────────────────┘
       │ Prisma ORM       │ HTTP/Webhook     │ HTTP
┌──────▼──────────┐ ┌─────▼───────────┐ ┌───▼──────────────────┐
│   PostgreSQL    │ │      n8n         │ │  WhatsApp Business   │
│  (Supabase /    │ │  (Automações)    │ │  API (Cloud API)     │
│   Neon / VPS)   │ │                  │ │                      │
└─────────────────┘ └──────┬──────────┘ └──────────────────────┘
                           │
              ┌────────────▼───────────┐
              │      OpenAI API        │
              │  (GPT-4 / Embeddings)  │
              └────────────────────────┘
```

**Camadas:**
- **Frontend (Next.js 14)**: Cardápio público responsivo (mobile-first), painel admin para gestão de produtos/pedidos, landing page do SaaS
- **Backend (NestJS)**: API REST versionada, autenticação JWT, módulos de loja/produtos/pedidos/categorias, integração WhatsApp e OpenAI
- **Banco (PostgreSQL)**: Lojas multi-tenant, catálogo de produtos, pedidos, histórico de conversas WhatsApp, analytics
- **n8n (Automações)**: Notificação de novos pedidos no WhatsApp, confirmação automática, lembrete de carrinho abandonado, relatórios diários
- **OpenAI**: Chatbot inteligente no WhatsApp para sugestões de pratos, responder perguntas do cardápio, resumo de vendas para o dono
- **WhatsApp Business API**: Canal principal de pedidos — cliente monta pedido no cardápio e envia via WhatsApp formatado

---

## 2. Estrutura de Pastas — Frontend (Next.js)

```
frontend/
├── app/
│   ├── (marketing)/                    # Landing page do SaaS
│   │   ├── page.tsx                   # Home — conversão
│   │   ├── precos/page.tsx            # Planos e preços
│   │   └── sobre/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── registro/page.tsx
│   │   └── esqueci-senha/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Layout admin com sidebar
│   │   ├── page.tsx                   # Dashboard — métricas
│   │   ├── cardapio/
│   │   │   ├── page.tsx              # Gerenciar categorias + produtos
│   │   │   └── [id]/page.tsx         # Editar produto
│   │   ├── pedidos/
│   │   │   ├── page.tsx              # Lista de pedidos
│   │   │   └── [id]/page.tsx         # Detalhe do pedido
│   │   ├── whatsapp/
│   │   │   └── page.tsx              # Config WhatsApp + QR Code
│   │   ├── analytics/
│   │   │   └── page.tsx              # Relatórios e gráficos
│   │   ├── configuracoes/
│   │   │   └── page.tsx              # Dados da loja, logo, horários
│   │   └── plano/
│   │       └── page.tsx              # Gerenciar assinatura
│   ├── [slug]/                        # Cardápio público da loja
│   │   ├── page.tsx                   # Cardápio com categorias/produtos
│   │   └── layout.tsx                 # Layout público (tema da loja)
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── page.tsx                       # Redirect → marketing ou dashboard
├── components/
│   ├── ui/                            # Button, Input, Modal, Badge, Toast
│   ├── cards/                         # ProductCard, OrderCard, StatsCard
│   ├── forms/                         # ProductForm, StoreForm, LoginForm
│   ├── cardapio/                      # MenuHeader, CategoryTabs, CartSidebar
│   ├── dashboard/                     # Sidebar, TopBar, OrdersTable
│   └── whatsapp/                      # WhatsAppButton, OrderMessage
├── lib/
│   ├── api.ts                         # Cliente HTTP (axios) apontando p/ NestJS
│   ├── auth.ts                        # NextAuth config
│   ├── whatsapp.ts                    # Formatação de mensagem WhatsApp
│   └── utils.ts                       # Formatadores (moeda, data, slug)
├── hooks/
│   ├── useProducts.ts
│   ├── useOrders.ts
│   ├── useCart.ts                     # Estado do carrinho (Zustand)
│   └── useStore.ts
├── stores/
│   └── cartStore.ts                   # Zustand — carrinho persistente
├── types/
│   ├── product.ts
│   ├── order.ts
│   ├── store.ts
│   └── index.ts
├── public/
│   ├── logo.svg
│   └── og-image.png
└── .env.local
```

---

## 3. Estrutura de Pastas — Backend (NestJS)

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── update-user.dto.ts
│   │
│   ├── stores/
│   │   ├── stores.module.ts
│   │   ├── stores.controller.ts
│   │   ├── stores.service.ts
│   │   └── dto/
│   │       ├── create-store.dto.ts
│   │       └── update-store.dto.ts
│   │
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   └── dto/
│   │       ├── create-category.dto.ts
│   │       └── update-category.dto.ts
│   │
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   │
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── dto/
│   │   │   ├── create-order.dto.ts
│   │   │   └── update-order-status.dto.ts
│   │   └── gateways/
│   │       └── orders.gateway.ts      # WebSocket p/ real-time
│   │
│   ├── whatsapp/
│   │   ├── whatsapp.module.ts
│   │   ├── whatsapp.controller.ts     # Webhook receptor
│   │   ├── whatsapp.service.ts        # Envio de mensagens
│   │   └── dto/
│   │       └── send-message.dto.ts
│   │
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.service.ts             # Integração OpenAI
│   │   └── prompts/
│   │       ├── suggest-dishes.ts      # Prompt: sugestão de pratos
│   │       └── chatbot.ts            # Prompt: atendimento WhatsApp
│   │
│   ├── analytics/
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts
│   │   └── analytics.service.ts
│   │
│   ├── payments/
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts     # Webhook Stripe/Pix
│   │   └── payments.service.ts
│   │
│   ├── prisma/
│   │   └── prisma.service.ts
│   │
│   └── common/
│       ├── decorators/
│       │   ├── roles.decorator.ts
│       │   └── current-user.decorator.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── pipes/
│           └── validation.pipe.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── test/
│   └── app.e2e-spec.ts
├── .env
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

---

## 4. Modelagem do Banco (Schema Prisma)

```prisma
// schema.prisma — Cardápio Digital SaaS

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════
// AUTH & USERS
// ═══════════════════════════════════════════

model User {
  id         String   @id @default(cuid())
  email      String   @unique
  name       String
  phone      String?
  password   String
  avatarUrl  String?
  role       Role     @default(OWNER)
  plan       Plan     @default(FREE)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  stores     Store[]
  sessions   Session[]

  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

enum Role {
  OWNER        // Dono do restaurante
  MANAGER      // Gerente
  STAFF        // Funcionário
  SUPER_ADMIN  // Admin do SaaS
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

// ═══════════════════════════════════════════
// LOJA / ESTABELECIMENTO
// ═══════════════════════════════════════════

model Store {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique    // URL amigável: /buteco-do-tattoo
  description    String?
  logoUrl        String?
  bannerUrl      String?
  phone          String              // WhatsApp do restaurante
  whatsappApiKey String?             // Token WhatsApp Business API
  address        String?
  city           String?
  state          String?
  openingHours   Json?               // { seg: "11:00-23:00", ... }
  themeColor     String   @default("#1e40af") // Cor tema do cardápio
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  ownerId    String
  owner      User       @relation(fields: [ownerId], references: [id])

  categories Category[]
  products   Product[]
  orders     Order[]
  analytics  AnalyticsEvent[]
  coupons    Coupon[]

  @@map("stores")
}

// ═══════════════════════════════════════════
// CARDÁPIO
// ═══════════════════════════════════════════

model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  storeId  String
  store    Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)

  products Product[]

  @@map("categories")
}

model Product {
  id           String   @id @default(cuid())
  name         String
  description  String?
  price        Decimal  @db.Decimal(10, 2)
  promoPrice   Decimal? @db.Decimal(10, 2) // Preço promocional
  imageUrl     String?
  isAvailable  Boolean  @default(true)
  isFeatured   Boolean  @default(false)    // Destaque no cardápio
  sortOrder    Int      @default(0)
  tags         String[] @default([])       // ["vegano", "sem glúten", "picante"]
  extras       Json?                       // [{ name: "Bacon", price: 5.00 }]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  categoryId String
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  storeId    String
  store      Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  orderItems OrderItem[]

  @@map("products")
}

// ═══════════════════════════════════════════
// PEDIDOS
// ═══════════════════════════════════════════

model Order {
  id              String      @id @default(cuid())
  orderNumber     Int                          // Número sequencial por loja
  customerName    String
  customerPhone   String                       // WhatsApp do cliente
  customerAddress String?                      // Se for delivery
  deliveryType    DeliveryType @default(PICKUP) // Retirada ou entrega
  status          OrderStatus  @default(PENDING)
  subtotal        Decimal     @db.Decimal(10, 2)
  deliveryFee     Decimal     @db.Decimal(10, 2) @default(0)
  discount        Decimal     @db.Decimal(10, 2) @default(0)
  total           Decimal     @db.Decimal(10, 2)
  notes           String?                      // Observações do cliente
  whatsappMsgId   String?                      // ID da msg no WhatsApp
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  storeId    String
  store      Store    @relation(fields: [storeId], references: [id])

  couponId   String?
  coupon     Coupon?  @relation(fields: [couponId], references: [id])

  items      OrderItem[]

  @@map("orders")
}

model OrderItem {
  id          String  @id @default(cuid())
  quantity    Int
  unitPrice   Decimal @db.Decimal(10, 2)
  extras      Json?                         // Extras selecionados
  notes       String?                       // "Sem cebola"

  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

enum OrderStatus {
  PENDING      // Aguardando confirmação
  CONFIRMED    // Confirmado pela loja
  PREPARING    // Em preparo
  READY        // Pronto para retirar/sair para entrega
  DELIVERING   // Saiu para entrega
  DELIVERED    // Entregue
  CANCELLED    // Cancelado
}

enum DeliveryType {
  PICKUP       // Retirada no local
  DELIVERY     // Entrega
  DINE_IN      // Consumo no local
}

// ═══════════════════════════════════════════
// CUPONS DE DESCONTO
// ═══════════════════════════════════════════

model Coupon {
  id            String    @id @default(cuid())
  code          String                        // "PROMO10"
  discountType  DiscountType @default(PERCENTAGE)
  discountValue Decimal   @db.Decimal(10, 2)  // 10 (= 10% ou R$10)
  minOrderValue Decimal?  @db.Decimal(10, 2)
  maxUses       Int?
  usedCount     Int       @default(0)
  expiresAt     DateTime?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())

  storeId  String
  store    Store   @relation(fields: [storeId], references: [id])

  orders   Order[]

  @@unique([storeId, code])
  @@map("coupons")
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

// ═══════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════

model AnalyticsEvent {
  id        String   @id @default(cuid())
  event     String                // "page_view", "product_click", "order_placed"
  metadata  Json?                 // Dados extras do evento
  sessionId String?               // ID da sessão do visitante
  createdAt DateTime @default(now())

  storeId   String
  store     Store    @relation(fields: [storeId], references: [id])

  @@index([storeId, event, createdAt])
  @@map("analytics_events")
}

// ═══════════════════════════════════════════
// CONVERSAS WHATSAPP
// ═══════════════════════════════════════════

model WhatsAppConversation {
  id            String   @id @default(cuid())
  customerPhone String
  customerName  String?
  storePhone    String
  lastMessage   String?
  lastMessageAt DateTime?
  isAiHandled   Boolean  @default(false)    // Se a IA está respondendo
  context       Json?                        // Contexto para a IA
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  messages WhatsAppMessage[]

  @@unique([customerPhone, storePhone])
  @@map("whatsapp_conversations")
}

model WhatsAppMessage {
  id             String   @id @default(cuid())
  direction      MessageDirection
  content        String
  messageType    String   @default("text") // text, image, audio, location
  whatsappMsgId  String?  @unique
  isFromAi       Boolean  @default(false)
  createdAt      DateTime @default(now())

  conversationId String
  conversation   WhatsAppConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@map("whatsapp_messages")
}

enum MessageDirection {
  INBOUND    // Cliente → Loja
  OUTBOUND   // Loja → Cliente
}
```

---

## 5. Fluxo de Funcionamento

### Jornada do Cliente Final

1. **Acesso ao Cardápio** → Cliente escaneia QR Code na mesa/balcão ou recebe link pelo WhatsApp
2. **Navega pelo Cardápio** → Vê categorias, produtos com fotos, preços e tags (vegano, sem glúten)
3. **Monta o Pedido** → Adiciona itens ao carrinho, escolhe extras, escreve observações
4. **Escolhe Entrega** → Retirada no local, delivery ou consumo na mesa
5. **Envia via WhatsApp** → Clica "Enviar Pedido" → abre WhatsApp com mensagem formatada
6. **Confirmação Automática** → n8n detecta a mensagem e registra o pedido no banco
7. **Acompanha Status** → Recebe atualizações pelo WhatsApp: "Seu pedido está sendo preparado! 🍳"
8. **IA no WhatsApp** → Pode perguntar "O que vocês recomendam?" e a IA sugere com base no cardápio

### Jornada do Dono da Loja

1. **Cadastro no SaaS** → Cria conta, registra dados da loja
2. **Configura Cardápio** → Adiciona categorias e produtos pelo dashboard
3. **Gera QR Code** → Sistema gera QR Code com link do cardápio
4. **Recebe Pedidos** → Notificação real-time no dashboard + WhatsApp
5. **Gerencia Status** → Atualiza status do pedido (preparando → pronto → entregue)
6. **Vê Analytics** → Dashboard com faturamento, pedidos/dia, produtos mais vendidos
7. **Recebe Resumo IA** → n8n envia resumo diário de vendas via WhatsApp

### Fluxo de Dados

```
Cliente → QR Code → Next.js (Cardápio) → Monta Carrinho (Zustand)
          ↓
     Clica "Enviar" → WhatsApp deeplink com msg formatada
          ↓
     Msg chega no WhatsApp da Loja
          ↓
     n8n (webhook) → Parseia mensagem → NestJS API → PostgreSQL
          ↓                                     ↓
     Resposta automática WhatsApp       WebSocket → Dashboard
          ↓
     OpenAI (se cliente pergunta algo via WhatsApp)
```

---

## 6. Endpoints da API

**Base URL:** `https://api.cardapio.digital/api/v1`

### Autenticação

| Método | Rota                | Descrição                  | Auth |
|--------|---------------------|----------------------------|------|
| POST   | /auth/register      | Cadastro do dono da loja   | ❌    |
| POST   | /auth/login         | Login (retorna JWT)        | ❌    |
| POST   | /auth/refresh       | Renovar access token       | 🔄    |
| GET    | /auth/me            | Dados do usuário logado    | ✅    |
| POST   | /auth/forgot-password | Solicitar reset de senha | ❌    |

### Lojas (Stores)

| Método | Rota                   | Descrição                    | Auth |
|--------|------------------------|------------------------------|------|
| POST   | /stores               | Criar loja                   | ✅    |
| GET    | /stores/me            | Minha loja                   | ✅    |
| PATCH  | /stores/:id           | Atualizar loja               | ✅    |
| GET    | /stores/:slug/public  | Dados públicos (cardápio)    | ❌    |
| POST   | /stores/:id/qrcode    | Gerar QR Code do cardápio    | ✅    |

### Categorias

| Método | Rota                              | Descrição               | Auth |
|--------|-----------------------------------|-------------------------|------|
| GET    | /stores/:storeId/categories       | Listar categorias       | ❌*  |
| POST   | /stores/:storeId/categories       | Criar categoria         | ✅    |
| PATCH  | /stores/:storeId/categories/:id   | Atualizar categoria     | ✅    |
| DELETE | /stores/:storeId/categories/:id   | Remover categoria       | ✅    |
| PATCH  | /stores/:storeId/categories/sort  | Reordenar categorias    | ✅    |

### Produtos

| Método | Rota                              | Descrição                  | Auth |
|--------|-----------------------------------|----------------------------|------|
| GET    | /stores/:storeId/products         | Listar produtos            | ❌*  |
| POST   | /stores/:storeId/products         | Criar produto              | ✅    |
| GET    | /stores/:storeId/products/:id     | Detalhe do produto         | ❌*  |
| PATCH  | /stores/:storeId/products/:id     | Atualizar produto          | ✅    |
| DELETE | /stores/:storeId/products/:id     | Remover produto            | ✅    |
| PATCH  | /stores/:storeId/products/:id/toggle | Ativar/desativar produto | ✅    |

> *❌ = público quando acessado pelo slug da loja*

### Pedidos

| Método | Rota                             | Descrição                     | Auth |
|--------|----------------------------------|-------------------------------|------|
| GET    | /stores/:storeId/orders          | Listar pedidos (paginado)     | ✅    |
| POST   | /stores/:storeId/orders          | Criar pedido (via WhatsApp)   | ❌*  |
| GET    | /stores/:storeId/orders/:id      | Detalhe do pedido             | ✅    |
| PATCH  | /stores/:storeId/orders/:id/status | Atualizar status do pedido  | ✅    |
| GET    | /stores/:storeId/orders/stats    | Estatísticas de pedidos       | ✅    |

### WhatsApp

| Método | Rota                          | Descrição                      | Auth |
|--------|-------------------------------|--------------------------------|------|
| POST   | /whatsapp/webhook             | Receber mensagens (n8n/Meta)   | 🔑*  |
| POST   | /whatsapp/send                | Enviar mensagem                | ✅    |
| GET    | /whatsapp/conversations       | Listar conversas               | ✅    |
| GET    | /whatsapp/conversations/:id   | Histórico da conversa          | ✅    |

> *🔑 = autenticação via webhook secret*

### IA

| Método | Rota                   | Descrição                          | Auth |
|--------|------------------------|------------------------------------|------|
| POST   | /ai/suggest            | Sugestões de pratos para cliente   | ❌*  |
| POST   | /ai/chat               | Responder pergunta do WhatsApp     | 🔑    |
| POST   | /ai/daily-summary      | Gerar resumo diário de vendas      | ✅    |

### Cupons

| Método | Rota                              | Descrição              | Auth |
|--------|-----------------------------------|------------------------|------|
| GET    | /stores/:storeId/coupons          | Listar cupons          | ✅    |
| POST   | /stores/:storeId/coupons          | Criar cupom            | ✅    |
| POST   | /stores/:storeId/coupons/validate | Validar cupom (público)| ❌    |
| DELETE | /stores/:storeId/coupons/:id      | Remover cupom          | ✅    |

### Analytics

| Método | Rota                               | Descrição                  | Auth |
|--------|-------------------------------------|----------------------------|------|
| GET    | /stores/:storeId/analytics/overview | Métricas gerais            | ✅    |
| GET    | /stores/:storeId/analytics/top-products | Produtos mais vendidos | ✅    |
| GET    | /stores/:storeId/analytics/revenue  | Faturamento por período    | ✅    |
| POST   | /stores/:storeId/analytics/event    | Registrar evento (público) | ❌    |

### Pagamentos / Assinatura SaaS

| Método | Rota                      | Descrição                       | Auth |
|--------|---------------------------|---------------------------------|------|
| POST   | /payments/checkout        | Criar sessão de checkout Stripe | ✅    |
| POST   | /payments/webhook         | Webhook Stripe                  | 🔑    |
| GET    | /payments/subscription    | Status da assinatura            | ✅    |
| POST   | /payments/cancel          | Cancelar assinatura             | ✅    |

---

## 7. Integrações n8n

### Automação 1: Pedido via WhatsApp → Sistema

- **Trigger:** Webhook do WhatsApp Business API (mensagem recebida)
- **Fluxo:**
  1. n8n recebe mensagem via webhook
  2. Parseia texto para identificar se é pedido ou pergunta
  3. Se **pedido** → Extrai itens, quantidades e endereço → `POST /api/v1/stores/:id/orders`
  4. Se **pergunta** → Envia para OpenAI com contexto do cardápio → Responde no WhatsApp
  5. Após registrar pedido → Envia confirmação com nº do pedido no WhatsApp
- **Resultado:** Pedido registrado no sistema + confirmação automática ao cliente

### Automação 2: Atualização de Status → Notificação WhatsApp

- **Trigger:** Webhook do NestJS quando status do pedido muda
- **Fluxo:**
  1. Backend emite webhook para n8n com `{ orderId, newStatus, customerPhone }`
  2. n8n formata mensagem amigável com emoji por status:
     - CONFIRMED → "✅ Pedido #42 confirmado! Estamos preparando."
     - PREPARING → "👨‍🍳 Seu pedido #42 está sendo preparado!"
     - READY → "🎉 Pedido #42 pronto! Venha buscar."
     - DELIVERING → "🛵 Pedido #42 saiu para entrega!"
  3. Envia via WhatsApp Business API
- **Resultado:** Cliente recebe atualização em tempo real no WhatsApp

### Automação 3: Resumo Diário de Vendas (IA)

- **Trigger:** Cron job — todos os dias às 22h
- **Fluxo:**
  1. n8n chama `GET /api/v1/stores/:id/orders/stats?period=today`
  2. Envia os dados para OpenAI: "Gere um resumo executivo de vendas do dia"
  3. OpenAI retorna resumo formatado
  4. n8n envia o resumo no WhatsApp do dono do restaurante
- **Resultado:** Dono recebe resumo inteligente tipo:
  > "📊 Resumo do dia — Buteco do Tatto
  > 💰 Faturamento: R$ 1.847,00 (+12% vs ontem)
  > 📦 32 pedidos (28 delivery, 4 retirada)
  > 🏆 Top 3: X-Bacon (12), Açaí 500ml (8), Cerveja Brahma (7)
  > ⏰ Horário pico: 19h-21h"

### Automação 4: Carrinho Abandonado

- **Trigger:** Cron job — a cada 2 horas
- **Fluxo:**
  1. n8n consulta analytics events: `product_click` sem `order_placed` correlacionado
  2. Se o cliente forneceu WhatsApp antes → Envia lembrete:
     - "Ei! 👋 Vi que você estava montando um pedido no Buteco do Tatto. Ainda quer pedir? 🍔"
  3. Se tiver cupom ativo → Inclui: "Use o cupom VOLTE10 e ganhe 10% off!"
- **Resultado:** Recupera vendas com lembretes amigáveis

### Automação 5: Novo Cadastro → Onboarding

- **Trigger:** Webhook do NestJS após registro de novo dono
- **Fluxo:**
  1. Envia e-mail de boas-vindas (Resend/SendGrid)
  2. Após 24h sem criar cardápio → Envia WhatsApp: "Precisa de ajuda para configurar seu cardápio? 📱"
  3. Após 48h sem pedidos → Dica: "Já compartilhou seu QR Code? Imprima e coloque nas mesas! 📸"
- **Resultado:** Onboarding guiado que aumenta ativação

---

## 8. Funcionalidades Extras

### Para escalar:

- [ ] **Multi-idioma** — Cardápio em PT/EN/ES para turistas
- [ ] **Integração com iFood/Rappi** — Sincronizar cardápio com marketplaces
- [ ] **Cardápio por QR Code na mesa** — Cada mesa com QR diferente (identifica a mesa no pedido)
- [ ] **Sistema de avaliação** — Cliente avalia pedido após entrega (1-5 estrelas)
- [ ] **Programa de fidelidade** — A cada 10 pedidos, ganha desconto
- [ ] **Impressão de comanda** — Integração com impressora térmica (ESC/POS)
- [ ] **App mobile nativo** — React Native para donos (notificações push)
- [ ] **Marketplace de cardápios** — Templates de cardápio por nicho (pizzaria, japonês, bar)

### Para monetizar:

- [ ] **Plano Free** — 1 loja, até 20 produtos, logo do SaaS no cardápio, analytics básico
- [ ] **Plano Pro** — R$ 49,90/mês — Produtos ilimitados, IA no WhatsApp, sem logo, QR codes customizados, cupons
- [ ] **Plano Enterprise** — R$ 149,90/mês — Multi-lojas, API customizada, relatórios avançados, integrações iFood/Rappi, suporte prioritário
- [ ] **Taxa por transação** — 1-2% sobre pedidos processados (modelo adicional)
- [ ] **Add-ons** — Domínio customizado (R$19/mês), Impressora integrada (R$29/mês)

---

## 9. Segurança e Performance

### Segurança:

- **JWT com refresh token** — Access token (15min) + Refresh token (7 dias)
- **Rate limiting no NestJS** — ThrottlerModule: 100 req/min por IP
- **Validação de inputs** — class-validator em todos os DTOs
- **Sanitização** — XSS protection nos campos de texto do cardápio
- **CORS restrito** — Apenas domínio do frontend e domínios dos cardápios
- **Webhook validation** — Assinatura HMAC-SHA256 nos webhooks do WhatsApp
- **Variáveis sensíveis** — Apenas em `.env`, nunca no código
- **Multi-tenant isolation** — Dono só acessa dados da própria loja (guard + Prisma middleware)
- **Upload seguro** — Validação de tipo e tamanho de imagem (max 5MB, apenas JPG/PNG/WebP)
- **Criptografia de senha** — bcrypt com 12 rounds

### Performance:

- **Cache com Redis** — Cardápio público cacheado por 5min (invalidar ao editar produto)
- **Paginação** — Todas as listagens: `?page=1&limit=20&sort=createdAt:desc`
- **Índices PostgreSQL** — `storeId + createdAt` em orders, `storeId + slug` em stores, `event + createdAt` em analytics
- **ISR no Next.js** — Páginas de cardápio público com revalidação a cada 60s
- **Lazy loading de imagens** — Next.js `<Image>` com placeholder blur
- **CDN para assets** — Cloudflare R2 para fotos de produtos (edge caching)
- **WebSocket controlado** — Connection pooling, desconectar inativos após 5min
- **Compressão** — Gzip/Brotli habilitado no NestJS

---

## 10. Sugestão de Deploy

| Serviço          | Plataforma        | Custo estimado/mês |
|------------------|-------------------|---------------------|
| Frontend         | Vercel            | $0–20 (free tier)   |
| Backend          | Railway           | $5–20               |
| Banco de dados   | Supabase          | $0–25               |
| Redis            | Upstash           | $0–10               |
| n8n              | Railway / VPS     | $5–10               |
| Storage (imagens)| Cloudflare R2     | $0–5                |
| WhatsApp API     | Meta Cloud API    | $0 (grátis até 1000 conversas/mês) |
| Domínio          | Cloudflare        | ~$10/ano            |
| SSL              | Let's Encrypt     | Gratuito            |

**Total estimado: R$ 50–350/mês** (dependendo do volume de lojas)

### Ambientes recomendados:

- **Development** — Docker local (`docker-compose up -d`) com PostgreSQL + Redis + n8n
- **Staging** — Branch `staging` deploiado na Vercel (preview) + Railway (staging env)
- **Production** — Deploy automático via GitHub Actions:
  - Push em `main` → Vercel build frontend → Railway build backend
  - Prisma migrate deploy automático
  - Health check pós-deploy

### Estimativa de custos por escala:

| Escala            | Lojas | Pedidos/mês | Custo/mês  |
|-------------------|-------|-------------|------------|
| Early Stage       | 1-10  | ~500        | R$ 50-100  |
| Growth            | 10-50 | ~5.000      | R$ 150-300 |
| Scale             | 50+   | ~50.000     | R$ 500+    |

---

## Próximos Passos

1. **Configurar repositório** com monorepo (frontend + backend)
2. **Rodar `npx create-next-app`** para o frontend
3. **Rodar `nest new`** para o backend
4. **Copiar o schema.prisma** e rodar `npx prisma migrate dev`
5. **Subir `docker-compose up -d`** para banco + Redis + n8n
6. **Implementar módulos na ordem:** Auth → Stores → Categories → Products → Orders → WhatsApp → AI
7. **Configurar WhatsApp Business API** na Meta
8. **Criar workflows n8n** para as 5 automações
9. **Deploy staging** para testes
10. **Launch** 🚀
