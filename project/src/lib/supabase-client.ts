import { supabase } from './supabase'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'ceo'
  avatar_url?: string
  phone?: string
  birth_date?: string
  location?: string
  profession?: string
  education?: string
  bio?: string
  streak?: number
  total_sessions?: number
  points?: number
  level?: number
  completed_challenges?: number
  subscription_plan?: 'basic' | 'premium' | 'vip'
  subscription_status?: 'active' | 'cancelled' | 'expired'
  notifications_enabled?: boolean
  community_access?: boolean
  mentor_status?: 'none' | 'mentee' | 'mentor'
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  user_id: string
  question: string
  context?: string
  is_sos: boolean
  status: 'pending' | 'answered' | 'resolved'
  ai_response?: string
  response_time_seconds?: number
  satisfaction_rating?: number
  created_at: string
  resolved_at?: string
  user_profile?: Profile
}

export interface QuizzQuestion {
  id: string
  question: string
  alternatives: Array<{
    id: string
    text: string
    is_correct: boolean
  }>
  category: string
  difficulty: 'facil' | 'medio' | 'dificil'
  points: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WhatsAppGroup {
  id: string
  name: string
  description?: string
  link: string
  rules?: string
  welcome_message?: string
  member_count?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  challenge_id: string
  challenge_category: string
  challenge_difficulty: 'facil' | 'dificil'
  points_earned: number
  duration_minutes: number
  completed_at: string
  created_at: string
}

export class SupabaseClient {
  // PROFILES
  async getProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching profiles:', error)
      return []
    }
  }

  async getProfile(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }

  async deleteProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting profile:', error)
      return false
    }
  }

  // QUESTIONS & SOS
  async getQuestions(): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          user_profile:profiles(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching questions:', error)
      return []
    }
  }

  async getSOSQuestions(): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          user_profile:profiles(*)
        `)
        .eq('is_sos', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching SOS questions:', error)
      return []
    }
  }

  async createQuestion(question: Omit<Question, 'id' | 'created_at' | 'user_profile'>): Promise<Question | null> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select(`
          *,
          user_profile:profiles(*)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating question:', error)
      return null
    }
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          user_profile:profiles(*)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating question:', error)
      return null
    }
  }

  // QUIZZ QUESTIONS
  async getQuizzQuestions(): Promise<QuizzQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('quizz_questions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching quizz questions:', error)
      return []
    }
  }

  async getActiveQuizzQuestions(): Promise<QuizzQuestion[]> {
    try {
      const { data, error } = await supabase
        .from('quizz_questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active quizz questions:', error)
      return []
    }
  }

  async createQuizzQuestion(question: Omit<QuizzQuestion, 'id' | 'created_at' | 'updated_at'>): Promise<QuizzQuestion | null> {
    try {
      const { data, error } = await supabase
        .from('quizz_questions')
        .insert(question)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating quizz question:', error)
      return null
    }
  }

  async updateQuizzQuestion(id: string, updates: Partial<QuizzQuestion>): Promise<QuizzQuestion | null> {
    try {
      const { data, error } = await supabase
        .from('quizz_questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating quizz question:', error)
      return null
    }
  }

  async deleteQuizzQuestion(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quizz_questions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting quizz question:', error)
      return false
    }
  }

  // WHATSAPP GROUPS
  async getWhatsAppGroups(): Promise<WhatsAppGroup[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.log('Supabase not available, returning empty array')
      return []
    }
  }

  async getActiveWhatsAppGroups(): Promise<WhatsAppGroup[]> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active WhatsApp groups:', error)
      return []
    }
  }

  async createWhatsAppGroup(group: Omit<WhatsAppGroup, 'id' | 'created_at' | 'updated_at'>): Promise<WhatsAppGroup | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .insert(group)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating WhatsApp group:', error)
      return null
    }
  }

  async updateWhatsAppGroup(id: string, updates: Partial<WhatsAppGroup>): Promise<WhatsAppGroup | null> {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating WhatsApp group:', error)
      return null
    }
  }

  async deleteWhatsAppGroup(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('whatsapp_groups')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting WhatsApp group:', error)
      return false
    }
  }

  // USER PROGRESS
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return []
    }
  }

  async createUserProgress(progress: Omit<UserProgress, 'id' | 'created_at'>): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .insert(progress)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user progress:', error)
      return null
    }
  }

  // ANALYTICS
  async getAnalytics() {
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Active users (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', sevenDaysAgo.toISOString())

      // Total questions
      const { count: totalQuestions } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })

      // SOS questions
      const { count: sosQuestions } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_sos', true)

      // Total progress entries
      const { count: totalProgress } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalQuestions: totalQuestions || 0,
        sosQuestions: sosQuestions || 0,
        totalProgress: totalProgress || 0
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalQuestions: 0,
        sosQuestions: 0,
        totalProgress: 0
      }
    }
  }

  // TEST CONNECTION
  async testConnection(): Promise<{ success: boolean, message: string, details?: unknown }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (error) throw error

      const analytics = await this.getAnalytics()

      return {
        success: true,
        message: 'Conexão estabelecida! Banco de dados acessível.',
        details: {
          tables: ['profiles', 'questions', 'whatsapp_groups', 'user_progress'],
          rls_enabled: true,
          analytics
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      }
    }
  }
}

export const supabaseClient = new SupabaseClient()