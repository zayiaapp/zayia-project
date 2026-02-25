import { createClient } from '@supabase/supabase-js'

// Get Supabase config from integrations manager or environment variables
const getSupabaseConfig = () => {
  const integrationsConfig = localStorage.getItem('zayia_integrations')

  if (integrationsConfig) {
    try {
      const integrations = JSON.parse(integrationsConfig)
      const supabaseIntegration = integrations.find((i: Record<string, unknown>) => i.id === 'supabase')

      if (
        supabaseIntegration &&
        typeof supabaseIntegration === 'object' &&
        'config' in supabaseIntegration &&
        supabaseIntegration.config
      ) {
        const config = supabaseIntegration.config as Record<string, unknown>
        if (config.url && config.anon_key) {
          return {
            url: String(config.url),
            anonKey: String(config.anon_key),
            isConfigured: true
          }
        }
      }
    } catch (error) {
      console.log('Using environment variables for Supabase config')
    }
  }

  // Get from environment variables
  const envUrl = (import.meta.env as Record<string, unknown>).VITE_SUPABASE_URL as string
  const envKey = (import.meta.env as Record<string, unknown>).VITE_SUPABASE_ANON_KEY as string

  // Validate that we have real credentials (not placeholders)
  const isValidUrl = envUrl && !envUrl.includes('your-project') && !envUrl.includes('mock-project')
  const isValidKey = envKey && !envKey.includes('your-anon-key') && !envKey.includes('mock')

  if (isValidUrl && isValidKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true
    }
  }

  // If no valid config found, return disabled state (for mock/test)
  console.warn(
    '⚠️ Supabase not properly configured or using mock credentials. Using mock authentication only.'
  )
  return {
    url: null,
    anonKey: null,
    isConfigured: false
  }
}

const config = getSupabaseConfig()
const supabaseUrl = config.url || 'https://placeholder.supabase.co'
const supabaseAnonKey = config.anonKey || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = config.isConfigured

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