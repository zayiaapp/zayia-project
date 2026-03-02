# 📐 Arquitetura de Subscriptions - Fluxo Completo

## 🔄 Sincronização Admin ↔ User

```
ADMIN DASHBOARD
│
├─ SubscriptionsSection (CEO)
│  │
│  ├─ CREATE plano → Supabase (plans table)
│  │  └─ { name, price, features, stripe_product_id, ... }
│  │
│  ├─ UPDATE plano → Supabase
│  │  └─ price, features, status
│  │
│  ├─ DELETE plano → Supabase
│  │  └─ archive ou soft delete
│  │
│  └─ VIEW todos os planos
│     └─ SELECT * FROM plans WHERE status = 'active'
│
└─ Real-time via Supabase Realtime

        ↓ SINCRONIZAÇÃO ↓

USER DASHBOARD
│
├─ SubscriptionSection
│  │
│  └─ useEffect() → loadSubscriptionData()
│     │
│     ├─ fetchUserSubscription(userId)
│     │  └─ SELECT * FROM subscriptions
│     │     WHERE user_id = ? AND status = 'active'
│     │     JOIN plans
│     │
│     ├─ fetchUserInvoices(customerId)
│     │  └─ Stripe API → fetch invoices
│     │
│     └─ Real-time subscription para updates
│        └─ Mostrar novo plano se admin atualizou
```

---

## 📦 Estrutura de Dados - Supabase Schema

### Tabela: `plans`

```
plans
├─ id (UUID) PRIMARY KEY
├─ name (TEXT) - "ZAYIA Premium"
├─ price (DECIMAL) - 13.90
├─ description (TEXT) - "Acesso completo..."
├─ features (TEXT[]) - ['840 desafios', 'Medalhas', ...]
├─ stripe_product_id (TEXT) - "prod_xxxxx"
├─ stripe_price_id (TEXT) - "price_xxxxx"
├─ stripe_link (TEXT) - "https://buy.stripe.com/..."
├─ status (TEXT) - "active" | "inactive"
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

Índices:
- PRIMARY KEY (id)
- INDEX (status) para queries de planos ativos
```

### Tabela: `subscriptions`

```
subscriptions
├─ id (UUID) PRIMARY KEY
├─ user_id (UUID) FK → auth.users.id
├─ plan_id (UUID) FK → plans.id
├─ status (TEXT) - "active" | "cancelled" | "past_due" | "suspended"
├─ current_period_start (DATE)
├─ current_period_end (DATE)
├─ cancel_at_period_end (BOOLEAN)
├─ stripe_subscription_id (TEXT) - "sub_xxxxx"
├─ stripe_customer_id (TEXT) - "cus_xxxxx"
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)

Foreign Keys:
- user_id → auth.users(id) ON DELETE CASCADE
- plan_id → plans(id)

Índices:
- PRIMARY KEY (id)
- UNIQUE (stripe_subscription_id)
- INDEX (user_id, status)
- INDEX (status) para queries
```

### Tabela: `invoices`

```
invoices
├─ id (UUID) PRIMARY KEY
├─ subscription_id (UUID) FK → subscriptions.id
├─ stripe_invoice_id (TEXT) - "in_xxxxx"
├─ date (DATE)
├─ amount (DECIMAL)
├─ status (TEXT) - "paid" | "pending" | "failed"
├─ description (TEXT)
├─ invoice_url (TEXT)
└─ created_at (TIMESTAMP)

Foreign Keys:
- subscription_id → subscriptions(id) ON DELETE CASCADE

Índices:
- PRIMARY KEY (id)
- INDEX (subscription_id)
- INDEX (stripe_invoice_id) UNIQUE
```

---

## 🔗 Fluxo de Dados - User

### 1️⃣ Carregamento Inicial

```
User abre SubscriptionSection
    ↓
useEffect() dispara → loadSubscriptionData()
    ↓
fetchUserSubscription(user.id)
    ↓
SELECT * FROM subscriptions
WHERE user_id = ? AND status = 'active'
JOIN plans ON plan_id = plans.id
    ↓
Retorna:
{
  id: 'sub_123',
  user_id: 'user_1',
  plan_id: 'plan_1',
  plan: {
    id: 'plan_1',
    name: 'ZAYIA Premium',
    price: 13.90,
    features: [...]
  },
  status: 'active',
  current_period_start: '2026-02-14',
  current_period_end: '2026-03-14',
  ...
}
    ↓
Renderiza Card com dados REAIS ✅
```

### 2️⃣ Gerenciar Assinatura (Stripe)

```
User clica "Gerenciar Assinatura"
    ↓
handleManageSubscription()
    ↓
POST /api/stripe/create-portal-session
{
  customerId: subscription.stripe_customer_id
}
    ↓
Backend cria sessão personalizada
Stripe.billingPortal.sessions.create({
  customer: 'cus_xxxxx',
  return_url: '...'
})
    ↓
Retorna { url: 'https://billing.stripe.com/...' }
    ↓
window.open(url, '_blank')
    ↓
User vê portal Stripe PERSONALIZADO ✅
- Gerenciar método de pagamento
- Cancelar assinatura
- Ver histórico
- Update billing info
```

### 3️⃣ Histórico de Faturas (Stripe)

```
Se subscription.status === 'active'
    ↓
fetchUserInvoices(subscription.stripe_customer_id)
    ↓
GET /api/stripe/invoices?customer_id=cus_xxxxx
    ↓
Backend busca da Stripe API:
stripe.invoices.list({
  customer: 'cus_xxxxx',
  limit: 12
})
    ↓
Retorna array de invoices:
[
  {
    id: 'in_xxxxx',
    date: '2026-02-14',
    amount: 13.90,
    status: 'paid',
    ...
  },
  ...
]
    ↓
Renderiza tabela de faturas ✅
```

---

## 🔄 Fluxo Admin - Criar/Atualizar Plano

### Admin cria novo plano

```
Admin em CEODashboard
    ↓
Clica "Novo Plano"
    ↓
Abre modal de criação
    ├─ Nome: "ZAYIA Premium Plus"
    ├─ Preço: R$ 19.90
    ├─ Features: [...]
    ├─ Stripe Product ID: "prod_xxxxx"
    └─ Stripe Price ID: "price_xxxxx"
    ↓
Clica "Salvar"
    ↓
INSERT INTO plans (name, price, features, ...)
VALUES (...)
    ↓
Supabase Realtime notifica listeners
    ↓
SubscriptionSection.tsx recebe atualização
    ↓
Novo plano aparece para user em tempo real ✅
```

### Admin atualiza preço

```
Admin clica "Editar" no plano "ZAYIA Premium"
    ↓
Muda preço: 13.90 → 14.90
    ↓
Clica "Salvar"
    ↓
UPDATE plans SET price = 14.90 WHERE id = ?
    ↓
Supabase Realtime notifica
    ↓
User vê automaticamente: "R$ 14.90" ✅
```

---

## 🛡️ Segurança - RLS (Row Level Security)

```sql
-- Tabela: plans
-- Todos podem ler planos ativos
CREATE POLICY "Plans public read"
ON plans FOR SELECT
USING (status = 'active');

-- Apenas admins podem escrever
CREATE POLICY "Admin plans write"
ON plans FOR ALL
USING (auth.jwt() ->> 'role' = 'ceo');

-- Tabela: subscriptions
-- Users veem apenas sua própria assinatura
CREATE POLICY "Users own subscription"
ON subscriptions FOR SELECT
USING (user_id = auth.uid());

-- Apenas sistema pode escrever subscriptions
-- (Stripe webhooks, admin)
CREATE POLICY "System subscriptions write"
ON subscriptions FOR ALL
USING (auth.jwt() ->> 'role' = 'service' OR auth.jwt() ->> 'role' = 'ceo');

-- Tabela: invoices
-- Users veem apenas faturas da sua assinatura
CREATE POLICY "Users own invoices"
ON invoices FOR SELECT
USING (
  subscription_id IN (
    SELECT id FROM subscriptions
    WHERE user_id = auth.uid()
  )
);
```

---

## 📡 Real-time Updates (Supabase Realtime)

```typescript
// Em SubscriptionSection.tsx:

useEffect(() => {
  loadSubscriptionData()

  // Listener para mudanças na subscription do user
  const subscriptionChannel = supabase
    .channel('subscriptions')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${profile?.id}`
      },
      (payload) => {
        console.log('Subscription updated:', payload)
        loadSubscriptionData() // Recarregar dados
      }
    )
    .subscribe()

  // Listener para mudanças nos planos (atualização de preço, etc)
  const plansChannel = supabase
    .channel('plans')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'plans'
      },
      (payload) => {
        console.log('Plans updated:', payload)
        loadSubscriptionData() // Recarregar dados
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscriptionChannel)
    supabase.removeChannel(plansChannel)
  }
}, [profile?.id])
```

---

## 🔐 Integração Stripe - Webhook

```typescript
// Backend - Webhook do Stripe:

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.created':
      // User assinou → Criar em subscriptions
      break

    case 'customer.subscription.updated':
      // Assinatura atualizada → UPDATE subscriptions
      break

    case 'customer.subscription.deleted':
      // User cancelou → UPDATE status = 'cancelled'
      break

    case 'invoice.payment_succeeded':
      // Fatura paga → INSERT em invoices
      break

    case 'invoice.payment_failed':
      // Fatura falhou → UPDATE status = 'failed'
      break
  }
}
```

---

## 📊 Estados Possíveis da Assinatura

```
✅ ACTIVE
├─ User tem assinatura válida
├─ Acesso a todos os recursos
└─ Próxima cobrança programada

⏸️ PAST_DUE
├─ Pagamento atrasado
├─ Acesso ainda ativo (por enquanto)
├─ Mostrar aviso: "Pagamento vencido"
└─ Stripe enviará notificações

🔒 SUSPENDED
├─ Violação de termos
├─ Conta suspensa
└─ Nenhum acesso aos recursos

❌ CANCELLED
├─ User cancelou
├─ Acesso mantido até current_period_end
├─ Depois do período: acesso bloqueado
└─ Mostrar opção para reassinar
```

---

## 🎯 Performance - Queries Otimizadas

```sql
-- Query otimizada para carregar subscription + plan
SELECT
  s.*,
  json_build_object(
    'id', p.id,
    'name', p.name,
    'price', p.price,
    'features', p.features
  ) as plan
FROM subscriptions s
LEFT JOIN plans p ON s.plan_id = p.id
WHERE s.user_id = $1 AND s.status = 'active'
LIMIT 1;

-- Índice para essa query:
CREATE INDEX idx_subscriptions_user_status
ON subscriptions(user_id, status);
```

---

## 🚀 Deployment Checklist

```
Frontend:
✅ src/types/subscription.ts
✅ src/components/user/sections/SubscriptionSection.tsx
✅ src/lib/stripe-portal.ts
⏳ src/contexts/AuthContext.tsx (atualizar)

Backend (Node/Express/etc):
⏳ /api/stripe/create-portal-session
⏳ /api/stripe/invoices
⏳ /webhooks/stripe (para eventos)

Database (Supabase):
⏳ CREATE TABLE plans
⏳ CREATE TABLE subscriptions
⏳ CREATE TABLE invoices
⏳ CREATE RLS POLICIES
⏳ CREATE INDEXES

Configuration:
⏳ STRIPE_SECRET_KEY env var
⏳ STRIPE_WEBHOOK_SECRET env var
⏳ Supabase connection strings

Testing:
⏳ Load subscription data
⏳ Open Stripe portal
⏳ Fetch invoices
⏳ Real-time updates
⏳ Error handling
```

---

**Próximo:** Começar Fase 2 (Supabase Integration)

— Dex, sempre construindo 🔨
