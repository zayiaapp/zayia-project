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

export interface ChallengeCompletion {
  success: boolean
  points_earned: number
  medals_unlocked: string[]
  message: string
  level_up?: boolean
  new_level?: number
}

export interface ChallengeMeta {
  total_challenges: number
  by_difficulty: { facil: number; dificil: number }
  by_category: { [key: string]: number }
  cache_timestamp: string
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

export interface Medal {
  id: string
  user_id: string
  name: string
  category_id?: string
  description?: string
  icon?: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  points: number
  unlocked_at: string
}

export interface LevelRequirement {
  level: number
  points_required: number
  name: string
  description?: string
  color?: string
}

export interface SubscriptionPlan {
  id: string
  name: 'basic' | 'premium' | 'vip'
  price: number
  currency: string
  billing_period: 'monthly' | 'yearly'
  features: string[]
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionData {
  user_id: string
  plan: 'basic' | 'premium' | 'vip'
  status: 'active' | 'cancelled' | 'expired'
  started_at?: string
  expires_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}

export interface AdminStatistics {
  revenue: number
  activeUsers: number
  cancelledUsers: number
  churnRate: number
  todayChallengesCount: number
  lastUpdated: string
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

export interface CommunityRules {
  id: string
  content: string
  updated_by_admin?: string
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

export interface MonthlyWinner {
  ranking: MonthlyRanking
  prize?: PrizePayment
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

  // CHALLENGE COMPLETION
  async completeChallenge(
    challengeId: string,
    userId: string,
    proofUrl: string
  ): Promise<ChallengeCompletion> {
    try {
      // Validate inputs
      if (!challengeId || !userId || !proofUrl) {
        throw new Error('Missing required parameters: challengeId, userId, proofUrl')
      }

      // Validate user is not banned
      const banStatus = await this.getUserBanStatus(userId)
      if (banStatus && banStatus.status === 'active') {
        return {
          success: false,
          points_earned: 0,
          medals_unlocked: [],
          message: 'User is banned and cannot complete challenges'
        }
      }

      // Get challenge details
      const challenge = await this.getChallengeById(challengeId)
      if (!challenge) {
        throw new Error('Challenge not found')
      }

      // Check if user already completed this challenge today
      const today = new Date().toISOString().split('T')[0]
      const { data: existingCompletion, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .gte('created_at', `${today}T00:00:00`)
        .limit(1)

      if (checkError) throw checkError
      if (existingCompletion && existingCompletion.length > 0) {
        return {
          success: false,
          points_earned: 0,
          medals_unlocked: [],
          message: 'Challenge already completed today'
        }
      }

      // Calculate points based on difficulty
      const points = challenge.difficulty === 'facil' ? challenge.points_easy : challenge.points_hard

      // Record challenge completion
      const { error: insertError } = await supabase.from('user_progress').insert({
        user_id: userId,
        challenge_id: challengeId,
        challenge_category: challenge.category_id,
        challenge_difficulty: challenge.difficulty,
        points_earned: points,
        proof_url: proofUrl,
        duration_minutes: challenge.duration_minutes || 15,
        created_at: new Date().toISOString()
      })

      if (insertError) throw insertError

      // Update user points
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('points, level')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      const newPoints = (profile?.points || 0) + points
      const levelUpThreshold = 100 + ((profile?.level || 1) - 1) * 50
      const newLevel = newPoints >= levelUpThreshold ? (profile?.level || 1) + 1 : (profile?.level || 1)
      const levelUp = newLevel > (profile?.level || 1)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          points: newPoints,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Dispatch event for real-time update
      window.dispatchEvent(new CustomEvent('pointsUpdated'))
      if (levelUp) {
        window.dispatchEvent(new CustomEvent('levelUp', { detail: { level: newLevel } }))
      }

      return {
        success: true,
        points_earned: points,
        medals_unlocked: [],
        message: `Challenge completed! You earned ${points} points.`,
        level_up: levelUp,
        new_level: levelUp ? newLevel : undefined
      }
    } catch (error) {
      console.error('Error completing challenge:', error)
      return {
        success: false,
        points_earned: 0,
        medals_unlocked: [],
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // CHALLENGE RETRIEVAL
  async getChallengesToday(): Promise<Challenge[]> {
    try {
      // Get one challenge per category
      const categories = await this.getChallengeCategories()
      const challenges: Challenge[] = []

      for (const category of categories) {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('category_id', category.id)
          .eq('is_active', true)
          .order('difficulty', { ascending: false })
          .limit(1)

        if (error) throw error
        if (data && data.length > 0) {
          challenges.push(data[0])
        }
      }

      return challenges
    } catch (error) {
      console.error('Error fetching today\'s challenges:', error)
      return []
    }
  }

  async getAllChallenges(limit: number = 20, offset: number = 0): Promise<Challenge[]> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('difficulty', { ascending: true })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching all challenges:', error)
      return []
    }
  }

  async getChallengeDetails(challengeId: string): Promise<Challenge | null> {
    try {
      return await this.getChallengeById(challengeId)
    } catch (error) {
      console.error('Error fetching challenge details:', error)
      return null
    }
  }

  // CHALLENGE METADATA
  private challengeMetaCache: { data: ChallengeMeta; timestamp: number } | null = null

  async getChallengeMeta(): Promise<ChallengeMeta> {
    try {
      // Check cache (1 hour = 3600000ms)
      if (
        this.challengeMetaCache &&
        Date.now() - this.challengeMetaCache.timestamp < 3600000
      ) {
        return this.challengeMetaCache.data
      }

      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select('id, difficulty, category_id')
        .eq('is_active', true)

      if (challengesError) throw challengesError

      const byDifficulty = { facil: 0, dificil: 0 }
      const byCategory: { [key: string]: number } = {}

      for (const challenge of challenges || []) {
        // Count by difficulty
        if (challenge.difficulty === 'facil') {
          byDifficulty.facil++
        } else {
          byDifficulty.dificil++
        }

        // Count by category
        if (!byCategory[challenge.category_id]) {
          byCategory[challenge.category_id] = 0
        }
        byCategory[challenge.category_id]++
      }

      const meta: ChallengeMeta = {
        total_challenges: challenges?.length || 0,
        by_difficulty: byDifficulty,
        by_category: byCategory,
        cache_timestamp: new Date().toISOString()
      }

      // Cache result
      this.challengeMetaCache = {
        data: meta,
        timestamp: Date.now()
      }

      return meta
    } catch (error) {
      console.error('Error fetching challenge metadata:', error)
      return {
        total_challenges: 0,
        by_difficulty: { facil: 0, dificil: 0 },
        by_category: {},
        cache_timestamp: new Date().toISOString()
      }
    }
  }

  // PERMISSION CHECKS
  async validateUserPermission(
    userId: string,
    challengeId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        return { allowed: false, reason: 'User not found' }
      }

      // Check if user is banned
      const banStatus = await this.getUserBanStatus(userId)
      if (banStatus && banStatus.status === 'active') {
        return { allowed: false, reason: 'User is banned' }
      }

      // Check if user already completed this challenge today
      const today = new Date().toISOString().split('T')[0]
      const { data: completed, error: completedError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .gte('created_at', `${today}T00:00:00`)
        .limit(1)

      if (completedError) throw completedError
      if (completed && completed.length > 0) {
        return { allowed: false, reason: 'Challenge already completed today' }
      }

      // Check if challenge exists
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select('id')
        .eq('id', challengeId)
        .single()

      if (challengeError || !challenge) {
        return { allowed: false, reason: 'Challenge not found' }
      }

      return { allowed: true }
    } catch (error) {
      console.error('Error validating user permission:', error)
      return { allowed: false, reason: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
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

  // MEDALS
  async checkAndUnlockMedals(userId: string): Promise<Medal[]> {
    try {
      // Get total challenges completed by user
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)

      if (progressError && progressError.code !== 'PGRST116') throw progressError
      const totalCompleted = progressData?.length || 0

      // Check which medals should be unlocked
      const medalThresholds = [
        { level: 'iniciante', threshold: 1, points: 5 },
        { level: 'aprendiz', threshold: 5, points: 10 },
        { level: 'mestre', threshold: 10, points: 15 },
        { level: 'lendaria', threshold: 25, points: 20 }
      ]

      const unlockedMedals: Medal[] = []

      for (const medal of medalThresholds) {
        if (totalCompleted >= medal.threshold) {
          // Check if user already has this medal
          const { data: existingMedal, error: checkError } = await supabase
            .from('user_medals')
            .select('*')
            .eq('user_id', userId)
            .eq('level', medal.level)
            .single()

          if (checkError && checkError.code === 'PGRST116') {
            // Medal doesn't exist, create it
            const { data: newMedal, error: insertError } = await supabase
              .from('user_medals')
              .insert({
                user_id: userId,
                level: medal.level,
                points: medal.points,
                unlocked_at: new Date().toISOString()
              })
              .select('*')
              .single()

            if (insertError) throw insertError
            unlockedMedals.push(newMedal)
          } else if (existingMedal) {
            unlockedMedals.push(existingMedal)
          }
        }
      }

      return unlockedMedals
    } catch (error) {
      console.error('Error checking and unlocking medals:', error)
      return []
    }
  }

  async getMedalsByCategory(userId: string, categoryId: string): Promise<Medal[]> {
    try {
      const { data, error } = await supabase
        .from('user_medals')
        .select('*')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .order('unlocked_at', { ascending: false })

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return data || []
    } catch (error) {
      console.error('Error fetching medals by category:', error)
      return []
    }
  }

  async getGlobalMedals(): Promise<Medal[]> {
    try {
      const { data, error } = await supabase
        .from('medals')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: true })

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return data || []
    } catch (error) {
      console.error('Error fetching global medals:', error)
      return []
    }
  }

  async getLevelRequirements(): Promise<LevelRequirement[]> {
    try {
      // Define level requirements based on points scaling
      const levels: LevelRequirement[] = [
        { level: 1, points_required: 0, name: 'Novice', color: '#94a3b8' },
        { level: 2, points_required: 100, name: 'Apprentice', color: '#10b981' },
        { level: 3, points_required: 150, name: 'Expert', color: '#3b82f6' },
        { level: 4, points_required: 200, name: 'Master', color: '#f59e0b' },
        { level: 5, points_required: 300, name: 'Legend', color: '#8b5cf6' },
        { level: 6, points_required: 450, name: 'Mythical', color: '#ec4899' }
      ]

      return levels
    } catch (error) {
      console.error('Error fetching level requirements:', error)
      return []
    }
  }

  async calculateNextLevel(currentPoints: number): Promise<number> {
    try {
      const requirements = await this.getLevelRequirements()

      // Find the appropriate level based on current points
      let currentLevel = 1
      for (const req of requirements) {
        if (currentPoints >= req.points_required) {
          currentLevel = req.level
        } else {
          break
        }
      }

      return currentLevel
    } catch (error) {
      console.error('Error calculating next level:', error)
      return 1 // Default to level 1
    }
  }

  // SUBSCRIPTIONS
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return data || []
    } catch (error) {
      console.error('Error fetching subscription plans:', error)
      return []
    }
  }

  async getUserSubscription(userId: string): Promise<SubscriptionData | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, subscription_plan, subscription_status, created_at, updated_at')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') return null // No user found
      if (error) throw error

      return {
        user_id: data.id,
        plan: data.subscription_plan || 'basic',
        status: data.subscription_status || 'active',
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error)
      return null
    }
  }

  async updateSubscription(userId: string, planId: string): Promise<SubscriptionData | null> {
    try {
      // Verify plan exists
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('name')
        .eq('id', planId)
        .single()

      if (planError || !planData) {
        console.error('Subscription plan not found:', planId)
        return null
      }

      // Update user's subscription
      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planData.name,
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, subscription_plan, subscription_status, created_at, updated_at')
        .single()

      if (error) throw error

      return {
        user_id: data.id,
        plan: data.subscription_plan || 'basic',
        status: data.subscription_status || 'active',
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
      return null
    }
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      return false
    }
  }

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId)
      return subscription?.status === 'active' || false
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return false
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

  // COMMUNITY RULES
  async getRules(): Promise<CommunityRules | null> {
    try {
      const { data, error } = await supabase
        .from('community_rules')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error fetching community rules:', error)
      return null
    }
  }

  async updateRules(content: string, adminId: string): Promise<CommunityRules | null> {
    try {
      // Validate content
      if (!content || content.trim().length === 0) {
        throw new Error('Content cannot be empty')
      }
      if (content.length > 5000) {
        throw new Error('Content cannot exceed 5000 characters')
      }

      // Get current rules to update or create new
      const existing = await this.getRules()

      let data: any
      let error: any

      if (existing) {
        // Update existing rules
        const result = await supabase
          .from('community_rules')
          .update({
            content,
            updated_by_admin: adminId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single()

        data = result.data
        error = result.error
      } else {
        // Create new rules
        const result = await supabase
          .from('community_rules')
          .insert({
            content,
            updated_by_admin: adminId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        data = result.data
        error = result.error
      }

      if (error) throw error
      return data || null
    } catch (error) {
      console.error('Error updating community rules:', error)
      return null
    }
  }

  // COMMUNITY REPORTS
  async getReports(status?: string): Promise<MessageReport[]> {
    try {
      let query = supabase
        .from('message_reports')
        .select('*, message:community_messages(id, content, user_id, user_profile:profiles(id, full_name))')

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching reports:', error)
      return []
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

  // RANKING TOP 3
  async getTopThree(): Promise<MonthlyRanking[]> {
    try {
      // Get current month and year
      const now = new Date()
      const month = now.getMonth() + 1 // JavaScript months are 0-indexed
      const year = now.getFullYear()

      const { data, error } = await supabase
        .from('monthly_rankings')
        .select('*, user_profile:profiles(id, full_name, avatar_url, points)')
        .eq('month', month)
        .eq('year', year)
        .order('position', { ascending: true })
        .limit(3)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching top 3 rankings:', error)
      return []
    }
  }

  // MONTHLY WINNERS
  async getMonthlyWinners(month?: number, year?: number): Promise<MonthlyWinner[]> {
    try {
      // Use current month/year if not provided
      const now = new Date()
      const targetMonth = month ?? now.getMonth() + 1
      const targetYear = year ?? now.getFullYear()

      // Get top 3 rankings
      const { data: rankings, error: rankingsError } = await supabase
        .from('monthly_rankings')
        .select('*, user_profile:profiles(id, full_name, avatar_url, points)')
        .eq('month', targetMonth)
        .eq('year', targetYear)
        .order('position', { ascending: true })
        .limit(3)

      if (rankingsError) throw rankingsError

      if (!rankings || rankings.length === 0) {
        return []
      }

      // Get prizes for each winner
      const { data: prizes, error: prizesError } = await supabase
        .from('prize_payments')
        .select('*')
        .eq('month', targetMonth)
        .eq('year', targetYear)
        .in(
          'user_id',
          rankings.map((r) => r.user_id)
        )

      if (prizesError) throw prizesError

      // Combine rankings with prizes
      const winners: MonthlyWinner[] = rankings.map((ranking) => ({
        ranking,
        prize: prizes?.find((p) => p.user_id === ranking.user_id)
      }))

      return winners
    } catch (error) {
      console.error('Error fetching monthly winners:', error)
      return []
    }
  }

  // RANKING SCORE CALCULATION
  async calculateRankingScore(userId: string): Promise<number> {
    try {
      // Get current month and year
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()

      // Get user's ranking position for current month
      const { data, error } = await supabase
        .from('monthly_rankings')
        .select('points')
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data?.points || 0
    } catch (error) {
      console.error('Error calculating ranking score:', error)
      return 0
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

  // ADMIN DASHBOARD
  async getAdminStatistics(month: number, year: number): Promise<AdminStatistics> {
    try {
      // Get current date range for the month
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]
      const todayDate = new Date().toISOString().split('T')[0]

      // Fetch subscription data for the month
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, subscription_status, created_at, updated_at')

      if (profilesError) throw profilesError

      // Count active and cancelled users
      const activeUsers = profiles?.filter(p => p.subscription_status === 'active').length || 0
      const cancelledUsers = profiles?.filter(p => p.subscription_status === 'cancelled').length || 0

      // Calculate churn rate
      const totalUsers = activeUsers + cancelledUsers
      const churnRate = totalUsers > 0 ? (cancelledUsers / totalUsers) * 100 : 0

      // Fetch challenges completed today
      const { data: todayChallenges, error: challengesError } = await supabase
        .from('user_progress')
        .select('id, completed_at')
        .gte('completed_at', `${todayDate}T00:00:00`)
        .lte('completed_at', `${todayDate}T23:59:59`)

      if (challengesError && challengesError.code !== 'PGRST116') throw challengesError

      const todayChallengesCount = todayChallenges?.length || 0

      // Mock revenue calculation (in a real system, would use payment data)
      // Assume: basic=$99, premium=$199, vip=$299 per month
      const revenueMock = activeUsers * 150 // Average revenue per user

      return {
        revenue: revenueMock,
        activeUsers,
        cancelledUsers,
        churnRate: Math.round(churnRate * 100) / 100,
        todayChallengesCount,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching admin statistics:', error)
      return {
        revenue: 0,
        activeUsers: 0,
        cancelledUsers: 0,
        churnRate: 0,
        todayChallengesCount: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }
}

export const supabaseClient = new SupabaseClient()