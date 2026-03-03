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

export interface ChallengeCategory {
  id: string
  name: string
  label: string
  icon?: string
  color?: string
  description?: string
  area?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Challenge {
  id: string
  category_id: string
  title: string
  description?: string
  difficulty: 'facil' | 'dificil'
  points_easy: number
  points_hard: number
  duration_minutes?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  name: string
  description?: string
  icon_name?: string
  category?: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  requirement: number
  points: number
  color?: string
  is_active: boolean
  created_at: string
}

export interface Level {
  id: string
  level_number: number
  points_required: number
  name?: string
  description?: string
  color?: string
  created_at: string
}

export interface UserEarnedBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
}

export interface CommunityMessage {
  id: string
  user_id: string
  content: string
  deleted_by_admin?: string
  deleted_at?: string
  deletion_reason?: string
  created_at: string
  updated_at: string
  user_profile?: Profile
  reactions?: MessageReaction[]
}

export interface MessageReaction {
  id: string
  message_id: string
  emoji: string
  user_id: string
  created_at: string
}

export interface CommunityBan {
  id: string
  user_id: string
  ban_number: number
  ban_duration: 'active' | '1_day' | '7_days' | 'permanent'
  reason?: string
  banned_at: string
  expires_at?: string
  status: 'active' | 'expired'
  created_at: string
}

export interface MessageReport {
  id: string
  message_id: string
  reported_by?: string
  reason: 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other'
  description?: string
  status: 'pending' | 'resolved' | 'archived'
  created_at: string
  updated_at: string
}

export interface MonthlyRanking {
  id: string
  user_id: string
  month: number
  year: number
  position: number
  points: number
  badges_count: number
  completed_challenges: number
  favorite_category?: string
  created_at: string
  user_profile?: Profile
}

export interface PrizePayment {
  id: string
  user_id: string
  position: number
  month: number
  year: number
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  payment_method?: 'pix' | 'bank_transfer' | 'manual'
  payment_date?: string
  pix_key?: string
  bank_account?: string
  notes?: string
  created_at: string
  updated_at: string
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

  // CHALLENGES
  async getChallenges(): Promise<Challenge[]> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching challenges:', error)
      return []
    }
  }

  async getChallengesByCategory(categoryId: string): Promise<Challenge[]> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching challenges by category:', error)
      return []
    }
  }

  async getChallengeById(id: string): Promise<Challenge | null> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data || null
    } catch (error) {
      console.error('Error fetching challenge:', error)
      return null
    }
  }

  async getChallengeCategories(): Promise<ChallengeCategory[]> {
    try {
      const { data, error } = await supabase
        .from('challenge_categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching challenge categories:', error)
      return []
    }
  }

  // BADGES
  async getBadges(): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching badges:', error)
      return []
    }
  }

  async getBadgeById(id: string): Promise<Badge | null> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data || null
    } catch (error) {
      console.error('Error fetching badge:', error)
      return null
    }
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('user_earned_badges')
        .select('badges (*)')
        .eq('user_id', userId)

      if (error) throw error

      // Extract badges from the joined data
      const badges = data?.map((item: any) => item.badges).filter(Boolean) || []
      return badges
    } catch (error) {
      console.error('Error fetching user badges:', error)
      return []
    }
  }

  async awardBadge(userId: string, badgeName: string): Promise<boolean> {
    try {
      // Call RPC function to award badge
      const { data, error } = await supabase
        .rpc('award_badge', {
          user_id_param: userId,
          badge_name_param: badgeName
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error awarding badge:', error)
      return false
    }
  }

  // LEVELS
  async getLevels(): Promise<Level[]> {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('level_number', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching levels:', error)
      return []
    }
  }

  async getLevelByPoints(points: number): Promise<Level | null> {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .lte('points_required', points)
        .order('points_required', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return data || null
    } catch (error) {
      console.error('Error fetching level:', error)
      return null
    }
  }

  // COMMUNITY MESSAGES
  async postMessage(userId: string, content: string): Promise<CommunityMessage | null> {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .insert({
          user_id: userId,
          content
        })
        .select('*')
        .single()

      if (error) throw error
      return data || null
    } catch (error) {
      console.error('Error posting message:', error)
      return null
    }
  }

  async getMessages(limit: number = 20, offset: number = 0): Promise<CommunityMessage[]> {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select(`id, user_id, content, deleted_by_admin, deleted_at, deletion_reason, created_at, updated_at, user_profile:user_id(id, full_name, avatar_url, email)`, { count: 'exact' })
        // Load ALL messages including deleted ones (soft delete will show placeholder)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      // Type cast - reactions are loaded separately when needed
      return (data as unknown as CommunityMessage[]) || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  async deleteMessage(messageId: string, userId: string, userRole: 'user' | 'ceo', reason?: string): Promise<boolean> {
    try {
      // Application-level validation: only CEOs can delete messages
      if (userRole !== 'ceo') {
        console.error('❌ Unauthorized: only admins can delete messages')
        return false
      }

      console.log(`🗑️ Deleting message ${messageId}`)

      // Soft delete: mark as deleted without removing data
      const { error } = await supabase
        .from('community_messages')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by_admin: userId,
          deletion_reason: reason || 'Deletada pelo administrador'
        })
        .eq('id', messageId)

      if (error) {
        console.error('❌ Delete error:', error.message)
        return false
      }

      console.log('✅ Message marked as deleted')
      return true
    } catch (error) {
      console.error('Error deleting message:', error)
      return false
    }
  }

  // MESSAGE REACTIONS
  async addReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          emoji
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding reaction:', error)
      return false
    }
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing reaction:', error)
      return false
    }
  }

  // MESSAGE REPORTS
  async reportMessage(messageId: string, userId: string, reason: string, description: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('message_reports')
        .insert({
          message_id: messageId,
          reported_by: userId,
          reason,
          description
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error reporting message:', error)
      return false
    }
  }

  // BAN SYSTEM
  async getUserBanStatus(userId: string): Promise<CommunityBan | null> {
    try {
      const { data, error } = await supabase
        .from('community_bans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error fetching ban status:', error)
      return null
    }
  }

  async banUser(userId: string, duration: '1_day' | '7_days' | 'permanent', reason: string): Promise<boolean> {
    try {
      console.log(`🔨 Banning user ${userId} for ${duration}`)

      const { data: existingBans } = await supabase
        .from('community_bans')
        .select('ban_number')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      const banNumber = (existingBans?.[0]?.ban_number || 0) + 1

      const { error } = await supabase
        .from('community_bans')
        .insert({
          user_id: userId,
          ban_number: banNumber,
          ban_duration: duration,
          reason
        })

      if (error) {
        console.error('Error banning user:', error)
        return false
      }

      console.log('✅ User banned')
      return true
    } catch (error) {
      console.error('Error banning user:', error)
      return false
    }
  }

  async unbanUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_bans')
        .update({ status: 'expired' })
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error unbanning user:', error)
      return false
    }
  }

  // RANKINGS
  async getMonthlyRanking(month: number, year: number, limit: number = 100): Promise<MonthlyRanking[]> {
    try {
      const { data, error } = await supabase
        .from('monthly_rankings')
        .select('*, user_profile:profiles(id, full_name, avatar_url, points)')
        .eq('month', month)
        .eq('year', year)
        .order('position', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching rankings:', error)
      return []
    }
  }

  async getUserRankingPosition(userId: string, month: number, year: number): Promise<MonthlyRanking | null> {
    try {
      const { data, error } = await supabase
        .from('monthly_rankings')
        .select('*')
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error fetching user ranking:', error)
      return null
    }
  }

  // PRIZE PAYMENTS
  async getUserPrizePayments(userId: string): Promise<PrizePayment[]> {
    try {
      const { data, error } = await supabase
        .from('prize_payments')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching prize payments:', error)
      return []
    }
  }

  async updatePaymentStatus(paymentId: string, status: 'pending' | 'paid' | 'cancelled', method?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('prize_payments')
        .update({
          status,
          payment_method: method,
          payment_date: status === 'paid' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating payment status:', error)
      return false
    }
  }

  // REAL-TIME LISTENERS
  onMessagesChange(callback: (change: any) => void) {
    console.log('🔌 Setting up real-time listener for community_messages')

    const channelName = `public:community_messages:${Date.now()}`

    const subscription = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: true },
          presence: { key: 'user' }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_messages'
        },
        (payload) => {
          console.log('📱 Real-time message change received:', payload.eventType)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log('🔗 Listener connection status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time listener ACTIVE and receiving events')
        }
      })

    return () => {
      console.log('🔓 Unsubscribing from community_messages listener')
      subscription.unsubscribe()
    }
  }

  onReactionsChange(callback: (change: any) => void) {
    const subscription = supabase
      .channel('message_reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  onUserBanChange(userId: string, callback: (change: any) => void) {
    const subscription = supabase
      .channel(`ban_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_bans',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  onRankingChange(month: number, year: number, callback: (change: any) => void) {
    const subscription = supabase
      .channel(`ranking_${month}_${year}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monthly_rankings',
          filter: `month=eq.${month},year=eq.${year}`
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  onPointsChange(userId: string, callback: (change: any) => void) {
    const subscription = supabase
      .channel(`points_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  // TEST CONNECTION
  async testConnection(): Promise<{ success: boolean, message: string, details?: any }> {
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
          tables: ['profiles', 'questions', 'whatsapp_groups', 'user_progress', 'challenges', 'badges', 'levels'],
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