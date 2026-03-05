import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabaseClient, type Profile } from '../lib/supabase-client'
import { supabase } from '../lib/supabase'
import { integrationsManager } from '../lib/integrations-manager'

interface User {
  id: string
  email: string
}

interface TrialExpiredState {
  isExpired: boolean
  trialDays: number | null
  expiresAt: Date | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  trialExpired: TrialExpiredState | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  quickCEOLogin: () => Promise<void>
  quickUserLogin: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  deleteUser: (userId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Demo credentials (only used if VITE_DEMO_MODE=true)
const DEMO_CREDENTIALS = {
  ceo: { email: 'ceo@zayia.com', password: 'zayia2024' },
  user: { email: 'user@zayia.com', password: 'demo2024' }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [trialExpired, setTrialExpired] = useState<TrialExpiredState | null>(null)

  /**
   * On app load, restore session from Supabase Auth
   * This ensures user stays logged in across page refreshes
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true)

        // Get current session from Supabase Auth
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Error restoring session:', sessionError)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Session exists, load profile from database
          const userData: User = {
            id: session.user.id,
            email: session.user.email || ''
          }
          setUser(userData)

          // Fetch profile from Supabase
          try {
            const userProfile = await supabaseClient.getProfile(session.user.id)

            if (userProfile) {
              // Check if trial has expired
              const trialStatus = supabaseClient.checkTrialExpiry(userProfile)

              // If trial expired, show modal but keep session alive
              if (trialStatus.isExpired && userProfile.subscription_status === 'trial') {
                setTrialExpired({
                  isExpired: true,
                  trialDays: userProfile.trial_days || 0,
                  expiresAt: trialStatus.expiresAt
                })
                // Still set user/profile but with trial warning
              } else {
                setTrialExpired(null)
              }

              setProfile(userProfile)
              localStorage.setItem('zayia_user', JSON.stringify(userData))
              localStorage.setItem('zayia_profile', JSON.stringify(userProfile))
              console.log('✅ Session restored for:', userData.email)
            } else {
              console.warn('Profile not found for authenticated user:', session.user.id)
            }
          } catch (profileError) {
            console.error('Error loading profile:', profileError)
          }
        } else {
          // No session, clear localStorage
          localStorage.removeItem('zayia_user')
          localStorage.removeItem('zayia_profile')
        }

        setLoading(false)
      } catch (error) {
        console.error('Error in session restore:', error)
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  // ✅ Pontos sincronizados via Supabase realtime (listener abaixo)
  // localStorage removido como source of truth — Supabase é a fonte canônica

  // ✅ Task 2.6: Real-time listener for points + ranking updates
  useEffect(() => {
    if (!user?.id) return

    const handlePointsChanged = (change: any) => {
      console.log('🔄 Real-time points update from Supabase:', change)

      const updatedData = change.new

      // Update profile state with new points and level
      setProfile(prev => {
        if (!prev) return prev
        return {
          ...prev,
          points: updatedData.points || prev.points,
          level: updatedData.level || prev.level
        }
      })

      // Update localStorage for persistence
      if (updatedData.points) {
        localStorage.setItem('user_points', updatedData.points.toString())
      }

      // Dispatch event for UI components to update (dashboard, ranking, etc)
      window.dispatchEvent(new CustomEvent('pointsUpdated'))

      // Log level up celebration
      if (updatedData.level && updatedData.level > (profile?.level || 0)) {
        console.log('🎉 Level up! New level:', updatedData.level)
        window.dispatchEvent(new CustomEvent('levelUp', { detail: { level: updatedData.level } }))
      }
    }

    // Subscribe to real-time changes on user's points and level
    const unsubscribe = supabaseClient.onPointsChange(user.id, handlePointsChanged)

    // Cleanup on unmount or when user changes
    return () => {
      unsubscribe()
    }
  }, [user?.id, profile?.level])

  /**
   * Sign in with email and password using Supabase Auth
   */
  const signIn = async (email: string, password: string) => {
    setLoading(true)

    try {
      // Use Supabase Auth native
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error.message)
        setLoading(false)
        return { error: { message: error.message || 'Email ou senha incorretos' } }
      }

      if (data.session?.user) {
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email || ''
        }

        // Fetch profile from database
        try {
          const userProfile = await supabaseClient.getProfile(data.session.user.id)

          if (userProfile) {
            // Check if trial has expired
            const trialStatus = supabaseClient.checkTrialExpiry(userProfile)

            // If trial expired, block access and show modal
            if (trialStatus.isExpired && userProfile.subscription_status === 'trial') {
              setTrialExpired({
                isExpired: true,
                trialDays: userProfile.trial_days || 0,
                expiresAt: trialStatus.expiresAt
              })
              setLoading(false)
              return { error: { message: 'Seu período de trial expirou' } }
            }

            setUser(userData)
            setProfile(userProfile)
            setTrialExpired(null) // Clear trial expired state on successful login
            localStorage.setItem('zayia_user', JSON.stringify(userData))
            localStorage.setItem('zayia_profile', JSON.stringify(userProfile))
            localStorage.setItem('last_login_time', new Date().toISOString())

            // Send welcome email if configured (non-blocking)
            if (integrationsManager.isResendConfigured()) {
              try {
                await Promise.race([
                  integrationsManager.sendWelcomeEmail(userData.email, userProfile.full_name || 'Usuária'),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 5000))
                ])
              } catch (emailError) {
                console.warn('Welcome email failed (non-blocking):', emailError)
                // Continue anyway - email is not critical
              }
            }

            console.log('✅ Sign in successful:', userData.email)
            setLoading(false)
            return { error: null }
          } else {
            setLoading(false)
            return { error: { message: 'Perfil não encontrado. Contacte suporte.' } }
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError)
          setLoading(false)
          return { error: { message: 'Erro ao carregar perfil. Tente novamente.' } }
        }
      } else {
        setLoading(false)
        return { error: { message: 'Erro ao fazer login. Tente novamente.' } }
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error)
      setLoading(false)
      return { error: { message: 'Erro interno. Tente novamente.' } }
    }
  }

  /**
   * Sign up with email, password, and full name using Supabase Auth
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)

    try {
      // Use Supabase Auth native
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        console.error('Sign up error:', error.message)
        setLoading(false)
        return { error: { message: error.message || 'Erro ao criar conta' } }
      }

      if (data.user) {
        try {
          // Create profile in database with user's ID (critical for RLS policies)
          const newProfile = await supabaseClient.createProfile({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'user',
            avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            streak: 0,
            total_sessions: 0,
            points: 0,
            level: 1,
            completed_challenges: 0,
            subscription_plan: 'basic',
            subscription_status: 'active',
            notifications_enabled: true,
            community_access: true,
            mentor_status: 'none'
          })

          if (newProfile) {
            const userData: User = { id: data.user.id, email }
            setUser(userData)
            setProfile(newProfile)
            localStorage.setItem('zayia_user', JSON.stringify(userData))
            localStorage.setItem('zayia_profile', JSON.stringify(newProfile))
            localStorage.setItem('last_login_time', new Date().toISOString())

            // Send verification email + welcome email (non-blocking)
            if (integrationsManager.isResendConfigured()) {
              try {
                await Promise.race([
                  integrationsManager.sendWelcomeEmail(email, fullName),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 5000))
                ])
              } catch (emailError) {
                console.warn('Welcome email failed (non-blocking):', emailError)
                // Continue anyway - email is not critical for signup
              }
            }

            console.log('✅ Sign up successful. Verification email sent to:', email)
            setLoading(false)
            return { error: null }
          } else {
            setLoading(false)
            return { error: { message: 'Erro ao criar perfil. Tente novamente.' } }
          }
        } catch (profileError) {
          console.error('Error creating profile:', profileError)
          setLoading(false)
          return { error: { message: 'Erro ao criar perfil. Tente novamente.' } }
        }
      } else {
        setLoading(false)
        return { error: { message: 'Erro ao criar conta. Tente novamente.' } }
      }
    } catch (error) {
      console.error('Unexpected error during sign up:', error)
      setLoading(false)
      return { error: { message: 'Erro interno. Tente novamente.' } }
    }
  }

  /**
   * Sign out using Supabase Auth
   */
  const signOut = async () => {
    try {
      // 1. Encerra sessão no Supabase Auth
      await supabase.auth.signOut()
    } catch (err) {
      console.error('❌ Erro no signOut Supabase:', err)
      // Continua mesmo com erro — limpeza local é crítica
    } finally {
      // 2. Limpa TODAS as keys do localStorage relacionadas ao usuário
      const keysToRemove = [
        'user_points',
        'user_points_history',
        'zayia_user',
        'zayia_profile',
        'zayia_integrations',
      ]
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // 3. Limpa keys dinâmicas (padrão: zayia_user_challenges_*, earned_badges_*, user_streak*)
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        if (
          key.startsWith('zayia_user_challenges_') ||
          key.startsWith('earned_badges_') ||
          key.startsWith('user_streak')
        ) {
          localStorage.removeItem(key)
        }
      })

      // 4. Limpa estado React
      setUser(null)
      setProfile(null)
      setTrialExpired(null)

      console.log('✅ Logout completo — localStorage limpo')
    }
  }

  /**
   * Quick CEO login (demo only)
   * Only enabled if VITE_DEMO_MODE=true
   */
  const quickCEOLogin = async () => {
    // Guard: only allow in demo mode
    if (import.meta.env.VITE_DEMO_MODE !== 'true') {
      console.warn('⚠️ quickCEOLogin disabled in production')
      return
    }

    setLoading(true)
    try {
      const { email, password } = DEMO_CREDENTIALS.ceo
      const result = await signIn(email, password)
      if (result.error) {
        console.error('Quick CEO login failed:', result.error)
      } else {
        console.log('✅ Quick CEO login successful')
      }
    } catch (error) {
      console.error('Error in quickCEOLogin:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Quick user login (demo only)
   * Only enabled if VITE_DEMO_MODE=true
   */
  const quickUserLogin = async () => {
    // Guard: only allow in demo mode
    if (import.meta.env.VITE_DEMO_MODE !== 'true') {
      console.warn('⚠️ quickUserLogin disabled in production')
      return
    }

    setLoading(true)
    try {
      const { email, password } = DEMO_CREDENTIALS.user
      const result = await signIn(email, password)
      if (result.error) {
        console.error('Quick user login failed:', result.error)
      } else {
        console.log('✅ Quick user login successful')
      }
    } catch (error) {
      console.error('Error in quickUserLogin:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update user profile
   */
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return

    try {
      const dataToUpdate = {
        ...updates,
        updated_at: new Date().toISOString()
      } as Partial<Profile>

      // Update in Supabase
      const updatedProfile = await supabaseClient.updateProfile(profile.id, dataToUpdate as any)
      if (updatedProfile) {
        setProfile(updatedProfile)
        localStorage.setItem('zayia_profile', JSON.stringify(updatedProfile))
        console.log('✅ Profile updated in Supabase')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  /**
   * Delete user account
   */
  const deleteUser = async (userId: string) => {
    try {
      // TODO: Implement actual user deletion in Supabase
      // For now, just logout if it's the current user
      if (user?.id === userId) {
        await signOut()
      }
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }


  const value = {
    user,
    profile,
    loading,
    trialExpired,
    signIn,
    signUp,
    signOut,
    quickCEOLogin,
    quickUserLogin,
    updateProfile,
    deleteUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}