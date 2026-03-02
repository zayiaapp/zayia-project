export interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  stripe_product_id?: string
  stripe_price_id?: string
  stripe_link?: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  plan?: Plan
  status: 'active' | 'cancelled' | 'past_due' | 'suspended'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  stripe_subscription_id?: string
  stripe_customer_id?: string
  created_at?: string
  updated_at?: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoice_url: string
  stripe_invoice_id?: string
  created_at?: string
}
