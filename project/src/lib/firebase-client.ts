import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export interface FirebaseConfig {
  api_key: string
  auth_domain: string
  project_id: string
  storage_bucket: string
  messaging_sender_id: string
  app_id: string
  vapid_key: string
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
}

export class FirebaseClient {
  private app: any = null
  private messaging: any = null
  private config: FirebaseConfig | null = null

  initialize(config: FirebaseConfig) {
    try {
      this.config = config
      
      const firebaseConfig = {
        apiKey: config.api_key,
        authDomain: config.auth_domain,
        projectId: config.project_id,
        storageBucket: config.storage_bucket,
        messagingSenderId: config.messaging_sender_id,
        appId: config.app_id
      }

      this.app = initializeApp(firebaseConfig)
      this.messaging = getMessaging(this.app)
      
      return true
    } catch (error) {
      console.error('Error initializing Firebase:', error)
      return false
    }
  }

  async requestPermission(): Promise<string | null> {
    try {
      if (!this.messaging || !this.config) {
        throw new Error('Firebase not initialized')
      }

      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: this.config.vapid_key
        })
        
        if (token) {
          localStorage.setItem('fcm_token', token)
          return token
        }
      }
      
      return null
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return null
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      // Check permission
      if (Notification.permission !== 'granted') {
        console.log('Notifications not permitted')
        return false
      }

      // Send local notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/zayia-icon.png',
        tag: payload.tag || 'zayia-notification',
        requireInteraction: payload.requireInteraction || false
      })

      // Save to history
      this.saveNotificationToHistory(payload.title, payload.body)
      
      return true
    } catch (error) {
      console.error('Error sending notification:', error)
      return false
    }
  }

  private saveNotificationToHistory(title: string, body: string) {
    const history = JSON.parse(localStorage.getItem('notification_history') || '[]')
    history.unshift({
      id: Date.now().toString(),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'manual'
    })
    
    // Keep only last 50
    if (history.length > 50) {
      history.splice(50)
    }
    
    localStorage.setItem('notification_history', JSON.stringify(history))
  }

  setupForegroundListener(callback: (payload: any) => void) {
    if (!this.messaging) return

    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload)
      callback(payload)
    })
  }

  async testConnection(): Promise<{ success: boolean, message: string, details?: any }> {
    try {
      if (!this.config) {
        return {
          success: false,
          message: 'Firebase não configurado'
        }
      }

      // Test notification permission
      const permission = await Notification.requestPermission()
      
      if (permission !== 'granted') {
        return {
          success: false,
          message: 'Permissão de notificação negada'
        }
      }

      // Test token generation
      const token = await this.requestPermission()
      
      if (!token) {
        return {
          success: false,
          message: 'Erro ao gerar token FCM'
        }
      }

      // Send test notification
      await this.sendNotification({
        title: '🧪 Teste Firebase - ZAYIA',
        body: 'Firebase configurado com sucesso! Notificações funcionando.',
        requireInteraction: true
      })

      return {
        success: true,
        message: 'Firebase configurado! Notificação de teste enviada.',
        details: {
          messaging_enabled: true,
          token_generated: true,
          permission: permission,
          project_id: this.config.project_id
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro no Firebase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      }
    }
  }
}

export const firebaseClient = new FirebaseClient()