export interface StripeConfig {
  publishable_key: string
  secret_key: string
  webhook_secret?: string
  price_basic?: string
  price_premium?: string
  price_vip?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
}

export interface CheckoutSession {
  id: string
  url: string
  customer_email?: string
  amount_total: number
  currency: string
  status: string
}

export class StripeClient {
  private config: StripeConfig | null = null

  initialize(config: StripeConfig) {
    this.config = config
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<{ success: boolean, product?: unknown, error?: string }> {
    try {
      if (!this.config) {
        throw new Error('Stripe not configured')
      }

      const response = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secret_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          name: product.name,
          description: product.description || '',
          type: 'service'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Erro ao criar produto')
      }

      const productData = await response.json()

      // Create price for the product
      const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secret_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          product: productData.id,
          unit_amount: (product.price * 100).toString(), // Convert to cents
          currency: product.currency,
          'recurring[interval]': product.interval
        })
      })

      if (!priceResponse.ok) {
        const errorData = await priceResponse.json()
        throw new Error(errorData.error?.message || 'Erro ao criar preço')
      }

      const priceData = await priceResponse.json()

      return {
        success: true,
        product: {
          ...productData,
          price: priceData
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  async createCheckoutSession(priceId: string, customerEmail: string): Promise<{ success: boolean, session?: CheckoutSession, error?: string }> {
    try {
      if (!this.config) {
        throw new Error('Stripe not configured')
      }

      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secret_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          mode: 'subscription',
          customer_email: customerEmail,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cancel`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Erro ao criar sessão de checkout')
      }

      const sessionData = await response.json()

      return {
        success: true,
        session: {
          id: sessionData.id,
          url: sessionData.url,
          customer_email: sessionData.customer_email,
          amount_total: sessionData.amount_total,
          currency: sessionData.currency,
          status: sessionData.status
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  async getProducts(): Promise<{ success: boolean, products?: unknown[], error?: string }> {
    try {
      if (!this.config) {
        throw new Error('Stripe not configured')
      }

      const response = await fetch('https://api.stripe.com/v1/products?active=true', {
        headers: {
          'Authorization': `Bearer ${this.config.secret_key}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Erro ao buscar produtos')
      }

      const data = await response.json()

      return {
        success: true,
        products: data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  async testConnection(): Promise<{ success: boolean, message: string, details?: unknown }> {
    try {
      if (!this.config) {
        return {
          success: false,
          message: 'Stripe não configurado'
        }
      }

      // Test by creating a test product
      const testProduct = await this.createProduct({
        name: 'ZAYIA Teste',
        description: 'Produto de teste para validar integração',
        price: 29.90,
        currency: 'brl',
        interval: 'month'
      })

      if (testProduct.success) {
        // Clean up test product
        await fetch(`https://api.stripe.com/v1/products/${testProduct.product.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.secret_key}`
          }
        })

        return {
          success: true,
          message: 'Stripe configurado! Pagamentos habilitados.',
          details: {
            test_product_created: true,
            api_accessible: true,
            webhook_configured: !!this.config.webhook_secret
          }
        }
      } else {
        return {
          success: false,
          message: testProduct.error || 'Erro ao testar Stripe'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro no Stripe: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      }
    }
  }
}

export const stripeClient = new StripeClient()