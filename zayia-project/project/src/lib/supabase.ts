import { createClient } from '@supabase/supabase-js'
import { integrationsManager } from './integrations-manager'

// Get Supabase config from integrations manager or environment variables
const getSupabaseConfig = () => {
  const config = integrationsManager.getSystemHealth()
  const integrationsConfig = localStorage.getItem('zayia_integrations')
  
  if (integrationsConfig) {
    try {
      const integrations = JSON.parse(integrationsConfig)
      const supabaseIntegration = integrations.find((i: any) => i.id === 'supabase')
      
      if (supabaseIntegration?.config?.url && supabaseIntegration?.config?.anon_key) {
        return {
          url: supabaseIntegration.config.url,
          anonKey: supabaseIntegration.config.anon_key
        }
      }
    } catch (error) {
      console.log('Using environment variables for Supabase config')
    }
  }
  
  return {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  }
}

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig()
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'user' | 'ceo'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'user' | 'ceo'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'user' | 'ceo'
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          content: string
          is_from_ai: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          content: string
          is_from_ai: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          content?: string
          is_from_ai?: boolean
          created_at?: string
        }
      }
    }
  }
}