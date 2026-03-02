# 🔐 Stripe Customer Portal Setup

## Visão Geral

Este documento descreve como configurar e usar o Stripe Customer Portal para permitir que usuários gerenciem suas assinaturas.

## Arquitetura Atual (Desenvolvimento)

```
User clicks "Gerenciar Assinatura"
    ↓
SubscriptionSection.tsx → handleManageSubscription()
    ↓
calls createStripePortalSession(customerId)
    ↓
stripe-service.ts → Returns mock URL
    ↓
window.open(url, '_blank')
    ↓
Opens Stripe portal (test environment)
```

## 🔧 Para Desenvolvimento (Agora)

### Arquivos Envolvidos

1. **`src/lib/stripe-service.ts`**
   - Centralized service for Stripe interactions
   - Currently returns mock URL for development
   - Easy to swap for real backend call later

2. **`src/components/user/sections/SubscriptionSection.tsx`**
   - Imports `createStripePortalSession` from stripe-service
   - Calls the function when user clicks "Gerenciar Assinatura"
   - Handles loading and error states

3. **`.env.local`** (Opcional para desenvolvimento)
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_seu_test_key
   ```

### Testar em Desenvolvimento

```bash
npm run dev
```

1. Navigate to User Dashboard → Assinatura tab
2. Click "Gerenciar Assinatura"
3. Should open Stripe test portal in new tab

## 🚀 Para Produção (Com Backend)

### Passo 1: Criar Backend Endpoint

**Exemplo com Express.js:**

Create `backend/src/routes/stripe.ts`:

```typescript
import express from 'express'
import Stripe from 'stripe'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10'
})

/**
 * POST /api/stripe/create-portal-session
 * Creates a Stripe Customer Portal session
 */
router.post('/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/assinatura`
    })

    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)

    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return res
        .status(400)
        .json({ error: `Stripe customer not found: ${error.message}` })
    }

    res.status(500).json({ error: 'Failed to create portal session' })
  }
})

export default router
```

### Passo 2: Registrar Rota no Server

```typescript
// In your main server file
import stripeRoutes from './routes/stripe'

app.use('/api/stripe', stripeRoutes)
```

### Passo 3: Configurar Variáveis de Ambiente

**Backend `.env`:**
```env
STRIPE_SECRET_KEY=sk_live_seu_secret_key_aqui
FRONTEND_URL=https://seu-app.com
```

**Frontend `.env.local`:**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_seu_public_key_aqui
```

### Passo 4: Ativar Endpoint no stripe-service.ts

Edit `src/lib/stripe-service.ts`:

```typescript
// Uncomment the real API call section
const response = await fetch('/api/stripe/create-portal-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ customerId })
})

if (!response.ok) {
  const errorData = await response.json()
  throw new Error(errorData.error || 'Failed to create portal session')
}

const { url } = await response.json()
return url
```

## 🔑 Obter Chaves Stripe

1. Go to https://dashboard.stripe.com
2. Sign in to your account
3. Go to: Developers → API Keys
4. You'll see:
   - **Publishable Key** (starts with `pk_live_` or `pk_test_`)
   - **Secret Key** (starts with `sk_live_` or `sk_test_`)

⚠️ **SECURITY:**
- Secret Key: NEVER commit to git, use environment variables
- Public Key: Safe to expose in frontend

## 📋 Stripe Customer Portal Features

Once user opens the portal, they can:

✅ Update billing email
✅ Change payment method
✅ View and download invoices
✅ Update billing address
✅ Cancel subscription
✅ View subscription details
✅ Change subscription frequency (if enabled)
✅ View usage and charges

## 🧪 Test Mode

Before going live:

1. Use `sk_test_` and `pk_test_` keys
2. Use test card numbers: `4242 4242 4242 4242`
3. Any future expiry date (e.g., 12/25)
4. Any 3-digit CVC

## 🔗 Webhooks (Optional)

To sync Stripe events with your database:

```typescript
// Handle webhook events
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  switch (event.type) {
    case 'customer.subscription.created':
      // Handle new subscription
      break
    case 'customer.subscription.updated':
      // Handle subscription update
      break
    case 'customer.subscription.deleted':
      // Handle cancellation
      break
    case 'invoice.payment_succeeded':
      // Handle successful payment
      break
  }

  res.json({ received: true })
})
```

## 📊 Monitoring

Monitor portal usage:

1. Stripe Dashboard → Billing Portal
2. View metrics:
   - Sessions created
   - Features used
   - Cancellation rate
   - Most accessed features

## ❓ Troubleshooting

### Problem: "Customer Stripe not found"

**Solution:** Ensure `customerId` matches a real Stripe customer

```typescript
// Create customer if doesn't exist
const customer = await stripe.customers.create({
  email: user.email,
  metadata: { userId: user.id }
})
```

### Problem: Portal opens blank page

**Solution:** Check if:
- Stripe Account is active
- Keys are correct
- Customer ID is valid
- Browser allows popups

### Problem: "Access Denied" error

**Solution:**
- Verify Stripe Account permissions
- Check if IP is whitelisted (if applicable)
- Ensure webhook endpoint is accessible

## 📚 Resources

- [Stripe Billing Portal Docs](https://stripe.com/docs/billing/quickstart)
- [Customer Portal API Reference](https://stripe.com/docs/api/billing_portal/sessions)
- [Test Keys & Mode](https://stripe.com/docs/keys)
- [Webhook Events](https://stripe.com/docs/api/events)

## ✅ Implementation Checklist

Development:
- [x] Stripe SDK installed (`npm install stripe`)
- [x] `stripe-service.ts` created (mock mode)
- [x] `SubscriptionSection.tsx` updated to use service
- [ ] Tested button click in dev mode

Production:
- [ ] Backend endpoint created
- [ ] Environment variables configured
- [ ] Real Stripe account created
- [ ] Live keys obtained
- [ ] `stripe-service.ts` updated to call real endpoint
- [ ] Tested with test keys
- [ ] Tested with live keys (small amount)
- [ ] Monitored via Stripe Dashboard
- [ ] Set up webhooks (optional)
- [ ] Customer support ready

---

**Status:** ✅ Development Ready | ⏳ Production Ready (Pending Backend)

— Dex, sempre construindo 🔨
