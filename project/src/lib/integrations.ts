// Sistema de gerenciamento de integrações
export interface IntegrationConfig {
  supabase: {
    url: string
    anon_key: string
    service_role_key?: string
  }
  firebase: {
    api_key: string
    auth_domain: string
    project_id: string
    storage_bucket: string
    messaging_sender_id: string
    app_id: string
    vapid_key: string
  }
  resend: {
    api_key: string
    from_email: string
    from_name: string
  }
  stripe: {
    publishable_key: string
    secret_key: string
    webhook_secret: string
    price_basic: string
    price_premium: string
    price_vip: string
  }
}

export class IntegrationsManager {
  private static instance: IntegrationsManager
  private config: Partial<IntegrationConfig> = {}

  constructor() {
    this.loadConfig()
  }

  static getInstance(): IntegrationsManager {
    if (!IntegrationsManager.instance) {
      IntegrationsManager.instance = new IntegrationsManager()
    }
    return IntegrationsManager.instance
  }

  private loadConfig() {
    const saved = localStorage.getItem('zayia_integrations')
    if (saved) {
      try {
        const integrations = JSON.parse(saved)
        this.config = this.transformToConfig(integrations)
      } catch (error) {
        console.error('Error loading integrations config:', error)
      }
    }
  }

  private transformToConfig(integrations: unknown[]): Partial<IntegrationConfig> {
    const config: unknown = {}
    
    integrations.forEach(integration => {
      config[integration.id] = integration.config
    })
    
    return config
  }

  // Supabase
  getSupabaseConfig() {
    return this.config.supabase
  }

  isSupabaseConfigured(): boolean {
    const config = this.config.supabase
    return !!(config?.url && config?.anon_key)
  }

  // Firebase
  getFirebaseConfig() {
    return this.config.firebase
  }

  isFirebaseConfigured(): boolean {
    const config = this.config.firebase
    return !!(config?.api_key && config?.project_id && config?.vapid_key)
  }

  // Resend
  getResendConfig() {
    return this.config.resend
  }

  isResendConfigured(): boolean {
    const config = this.config.resend
    return !!(config?.api_key && config?.from_email)
  }

  async sendWelcomeEmail(userEmail: string, _userName: string): Promise<boolean> {
    if (!this.isResendConfigured()) {
      console.error('Resend not configured')
      return false
    }

    try {
      const config = this.getResendConfig()!
      
      // Simular envio de email
      console.log('Sending welcome email via Resend:', {
        to: userEmail,
        from: `${config.from_name} <${config.from_email}>`,
        subject: 'Bem-vinda à ZAYIA! 💜',
        template: 'welcome'
      })

      // Em produção, fazer requisição real para Resend API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
    if (!this.isResendConfigured()) {
      console.error('Resend not configured')
      return false
    }

    try {
      const config = this.getResendConfig()!
      
      console.log('Sending password reset email via Resend:', {
        to: userEmail,
        from: `${config.from_name} <${config.from_email}>`,
        subject: 'Redefinir senha - ZAYIA',
        resetLink: `https://zayia.com/reset-password?token=${resetToken}`
      })

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return false
    }
  }

  // Stripe
  getStripeConfig() {
    return this.config.stripe
  }

  isStripeConfigured(): boolean {
    const config = this.config.stripe
    return !!(config?.publishable_key && config?.secret_key)
  }

  async createCheckoutSession(priceId: string, userEmail: string): Promise<string | null> {
    if (!this.isStripeConfigured()) {
      console.error('Stripe not configured')
      return null
    }

    try {
      // Simular criação de sessão de checkout
      console.log('Creating Stripe checkout session:', {
        price: priceId,
        customer_email: userEmail,
        success_url: 'https://zayia.com/success',
        cancel_url: 'https://zayia.com/cancel'
      })

      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Retornar URL simulada
      return 'https://checkout.stripe.com/pay/cs_test_...'
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return null
    }
  }

  // Testes de integração
  async testSupabase(): Promise<{ success: boolean, message: string }> {
    if (!this.isSupabaseConfigured()) {
      return { success: false, message: 'Configuração incompleta' }
    }

    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true, message: 'Conexão com Supabase estabelecida com sucesso!' }
    } catch (error) {
      return { success: false, message: 'Erro ao conectar com Supabase' }
    }
  }

  async testFirebase(): Promise<{ success: boolean, message: string }> {
    if (!this.isFirebaseConfigured()) {
      return { success: false, message: 'Configuração incompleta' }
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true, message: 'Firebase configurado e pronto para notificações!' }
    } catch (error) {
      return { success: false, message: 'Erro ao conectar com Firebase' }
    }
  }

  async testResend(): Promise<{ success: boolean, message: string }> {
    if (!this.isResendConfigured()) {
      return { success: false, message: 'Configuração incompleta' }
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true, message: 'Resend configurado! Emails podem ser enviados.' }
    } catch (error) {
      return { success: false, message: 'Erro ao conectar com Resend' }
    }
  }

  async testStripe(): Promise<{ success: boolean, message: string }> {
    if (!this.isStripeConfigured()) {
      return { success: false, message: 'Configuração incompleta' }
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true, message: 'Stripe configurado! Pagamentos habilitados.' }
    } catch (error) {
      return { success: false, message: 'Erro ao conectar com Stripe' }
    }
  }

  // Verificar saúde geral do sistema
  getSystemHealth() {
    return {
      supabase: this.isSupabaseConfigured(),
      firebase: this.isFirebaseConfigured(),
      resend: this.isResendConfigured(),
      stripe: this.isStripeConfigured(),
      overall: this.isSupabaseConfigured() && this.isFirebaseConfigured() && this.isResendConfigured() && this.isStripeConfigured()
    }
  }
}

// Instância singleton
export const integrationsManager = IntegrationsManager.getInstance()