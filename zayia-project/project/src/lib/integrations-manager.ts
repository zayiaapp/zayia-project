import { supabaseClient } from './supabase-client'
import { firebaseClient } from './firebase-client'
import { resendClient } from './resend-client'
import { stripeClient } from './stripe-client'

export interface IntegrationConfig {
  supabase?: {
    url: string
    anon_key: string
    service_role_key?: string
  }
  firebase?: {
    api_key: string
    auth_domain: string
    project_id: string
    storage_bucket: string
    messaging_sender_id: string
    app_id: string
    vapid_key: string
  }
  resend?: {
    api_key: string
    from_email: string
    from_name: string
  }
  stripe?: {
    publishable_key: string
    secret_key: string
    webhook_secret?: string
    price_basic?: string
    price_premium?: string
    price_vip?: string
  }
}

export class IntegrationsManager {
  private static instance: IntegrationsManager
  private config: IntegrationConfig = {}

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
        this.initializeClients()
      } catch (error) {
        console.error('Error loading integrations config:', error)
      }
    }
  }

  private transformToConfig(integrations: any[]): IntegrationConfig {
    const config: any = {}
    
    integrations.forEach(integration => {
      if (integration.config && Object.keys(integration.config).length > 0) {
        config[integration.id] = integration.config
      }
    })
    
    return config
  }

  private initializeClients() {
    // Initialize Firebase if configured
    if (this.config.firebase) {
      firebaseClient.initialize(this.config.firebase)
    }

    // Initialize Resend if configured
    if (this.config.resend) {
      resendClient.initialize(this.config.resend)
    }

    // Initialize Stripe if configured
    if (this.config.stripe) {
      stripeClient.initialize(this.config.stripe)
    }
  }

  updateConfig(integrationId: string, config: any) {
    this.config[integrationId as keyof IntegrationConfig] = config
    this.initializeClients()
  }

  // SUPABASE METHODS
  isSupabaseConfigured(): boolean {
    return !!(this.config.supabase?.url && this.config.supabase?.anon_key)
  }

  async testSupabase(): Promise<{ success: boolean, message: string, details?: any }> {
    if (!this.isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não configurado' }
    }

    return await supabaseClient.testConnection()
  }

  // FIREBASE METHODS
  isFirebaseConfigured(): boolean {
    const config = this.config.firebase
    return !!(config?.api_key && config?.project_id && config?.vapid_key)
  }

  async testFirebase(): Promise<{ success: boolean, message: string, details?: any }> {
    if (!this.isFirebaseConfigured()) {
      return { success: false, message: 'Firebase não configurado' }
    }

    return await firebaseClient.testConnection()
  }

  // RESEND METHODS
  isResendConfigured(): boolean {
    const config = this.config.resend
    return !!(config?.api_key && config?.from_email)
  }

  async testResend(testEmail: string): Promise<{ success: boolean, message: string, details?: any }> {
    if (!this.isResendConfigured()) {
      return { success: false, message: 'Resend não configurado' }
    }

    return await resendClient.testConnection(testEmail)
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    if (!this.isResendConfigured()) return false

    try {
      const template = resendClient.generateWelcomeEmail(userName)
      const result = await resendClient.sendEmail(userEmail, template)
      return result.success
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  // STRIPE METHODS
  isStripeConfigured(): boolean {
    const config = this.config.stripe
    return !!(config?.publishable_key && config?.secret_key)
  }

  async testStripe(): Promise<{ success: boolean, message: string, details?: any }> {
    if (!this.isStripeConfigured()) {
      return { success: false, message: 'Stripe não configurado' }
    }

    return await stripeClient.testConnection()
  }

  async createCheckoutSession(priceId: string, customerEmail: string): Promise<string | null> {
    if (!this.isStripeConfigured()) return null

    try {
      const result = await stripeClient.createCheckoutSession(priceId, customerEmail)
      return result.success ? result.session?.url || null : null
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return null
    }
  }

  // SYSTEM HEALTH
  getSystemHealth() {
    return {
      supabase: this.isSupabaseConfigured(),
      firebase: this.isFirebaseConfigured(),
      resend: this.isResendConfigured(),
      stripe: this.isStripeConfigured(),
      overall: this.isSupabaseConfigured() && this.isFirebaseConfigured() && this.isResendConfigured() && this.isStripeConfigured()
    }
  }

  // NOTIFICATION METHODS
  async sendNotification(payload: { title: string, body: string, icon?: string }): Promise<boolean> {
    if (!this.isFirebaseConfigured()) return false

    return await firebaseClient.sendNotification(payload)
  }

  async requestNotificationPermission(): Promise<string | null> {
    if (!this.isFirebaseConfigured()) return null

    return await firebaseClient.requestPermission()
  }
}

export const integrationsManager = IntegrationsManager.getInstance()