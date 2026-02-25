import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabaseClient, type Profile as SupabaseProfile } from '../lib/supabase-client'
import { integrationsManager } from '../lib/integrations-manager'
import { isSupabaseConfigured } from '../lib/supabase'

interface Profile extends Partial<SupabaseProfile> {
  // Extends SupabaseProfile with additional UI-only fields
  id: string
  email: string
  full_name: string
  role: 'user' | 'ceo'
  created_at: string
  updated_at: string
  interests?: string[]
  goals?: string[]
}

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
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

// Mock users database expandido
let mockUsers = [
  {
    id: 'ceo-123',
    email: 'ceo@zayia.com',
    password: 'zayia2024',
    profile: {
      id: 'ceo-123',
      email: 'ceo@zayia.com',
      full_name: 'CEO ZAYIA',
      role: 'ceo' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  },
  {
    id: 'user-demo',
    email: 'user@zayia.com',
    password: 'demo2024',
    profile: {
      id: 'user-demo',
      email: 'user@zayia.com',
      full_name: 'Maria Silva',
      role: 'user' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      phone: '(11) 99999-9999',
      birth_date: '1990-05-15',
      location: 'São Paulo, SP',
      profession: 'Designer',
      education: 'Superior Completo',
      bio: 'Apaixonada por design e crescimento pessoal. Sempre em busca de novos desafios e oportunidades de aprendizado.',
      interests: ['Design', 'Meditação', 'Leitura', 'Yoga', 'Viagem'],
      goals: ['Melhorar autoestima', 'Desenvolver liderança', 'Equilibrar vida pessoal e profissional'],
      streak: 12,
      total_sessions: 45,
      points: 2850,
      level: 8,
      completed_challenges: 23,
      subscription_plan: 'premium',
      subscription_status: 'active',
      notifications_enabled: true,
      community_access: true,
      mentor_status: 'mentee'
    }
  },
  {
    id: 'user-ana',
    email: 'ana@exemplo.com',
    password: 'demo123',
    profile: {
      id: 'user-ana',
      email: 'ana@exemplo.com',
      full_name: 'Ana Costa',
      role: 'user' as const,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      phone: '(21) 98888-8888',
      birth_date: '1985-08-22',
      location: 'Rio de Janeiro, RJ',
      profession: 'Psicóloga',
      education: 'Pós-graduação',
      bio: 'Psicóloga especializada em terapia cognitivo-comportamental. Amo ajudar pessoas a descobrirem seu potencial.',
      interests: ['Psicologia', 'Mindfulness', 'Corrida', 'Culinária'],
      goals: ['Abrir consultório próprio', 'Especializar em terapia de casais', 'Manter equilíbrio vida-trabalho'],
      streak: 25,
      total_sessions: 78,
      points: 4200,
      level: 12,
      completed_challenges: 45,
      subscription_plan: 'vip',
      subscription_status: 'active',
      notifications_enabled: true,
      community_access: true,
      mentor_status: 'mentor'
    }
  },
  {
    id: 'user-julia',
    email: 'julia@exemplo.com',
    password: 'demo123',
    profile: {
      id: 'user-julia',
      email: 'julia@exemplo.com',
      full_name: 'Julia Santos',
      role: 'user' as const,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      phone: '(31) 97777-7777',
      birth_date: '1992-03-10',
      location: 'Belo Horizonte, MG',
      profession: 'Engenheira',
      education: 'Superior Completo',
      bio: 'Engenheira de software em transição de carreira. Buscando mais propósito e realização pessoal.',
      interests: ['Tecnologia', 'Yoga', 'Fotografia', 'Viagem'],
      goals: ['Mudar de carreira', 'Desenvolver soft skills', 'Encontrar propósito'],
      streak: 8,
      total_sessions: 32,
      points: 1850,
      level: 6,
      completed_challenges: 18,
      subscription_plan: 'basic',
      subscription_status: 'active',
      notifications_enabled: true,
      community_access: true,
      mentor_status: 'mentee'
    }
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (localStorage)
    const savedUser = localStorage.getItem('zayia_user')
    const savedProfile = localStorage.getItem('zayia_profile')
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser))
      setProfile(JSON.parse(savedProfile))
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)

    try {
      // Only try Supabase if it's properly configured
      if (isSupabaseConfigured && integrationsManager.isSupabaseConfigured()) {
        try {
          // Use Promise.race to add a timeout to Supabase calls
          const profiles = await Promise.race<SupabaseProfile[]>([
            supabaseClient.getProfiles(),
            new Promise<SupabaseProfile[]>((_, reject) =>
              setTimeout(() => reject(new Error('Supabase connection timeout')), 5000)
            )
          ])

          const userProfile = profiles.find((p: SupabaseProfile) => p.email === email)

          if (userProfile) {
            const user = { id: userProfile.id, email: userProfile.email }

            setUser(user)
            setProfile(userProfile)

            // Save to localStorage
            localStorage.setItem('zayia_user', JSON.stringify(user))
            localStorage.setItem('zayia_profile', JSON.stringify(userProfile))
            localStorage.setItem('last_login_time', new Date().toISOString())

            // Send welcome email if configured
            if (integrationsManager.isResendConfigured()) {
              integrationsManager.sendWelcomeEmail(email, userProfile.full_name || 'Usuária')
            }

            setLoading(false)
            return { error: null }
          }
        } catch (supabaseError) {
          console.log('Supabase unavailable, falling back to mock authentication:', supabaseError)
          // Continue to fallback authentication below
        }
      }

      // Fallback to mock authentication
      const mockUser = mockUsers.find(u => u.email === email && u.password === password)

      if (mockUser) {
        const user = { id: mockUser.id, email: mockUser.email }
        const profile = mockUser.profile

        setUser(user)
        setProfile(profile)

        // Save to localStorage
        localStorage.setItem('zayia_user', JSON.stringify(user))
        localStorage.setItem('zayia_profile', JSON.stringify(profile))
        localStorage.setItem('last_login_time', new Date().toISOString())

        setLoading(false)
        return { error: null }
      } else {
        setLoading(false)
        return { error: { message: 'Email ou senha incorretos' } }
      }
    } catch (error) {
      console.error('Error during sign in:', error)
      setLoading(false)
      return { error: { message: 'Erro interno. Tente novamente.' } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)

    try {
      // Only try Supabase if it's properly configured
      if (isSupabaseConfigured && integrationsManager.isSupabaseConfigured()) {
        try {
          // Use Promise.race to add a timeout to Supabase calls
          const newProfile = await Promise.race<any>([
            supabaseClient.createProfile({
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
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Supabase connection timeout')), 5000)
            )
          ])

          if (newProfile) {
            const user = { id: newProfile.id, email: newProfile.email }

            setUser(user)
            setProfile(newProfile)

            // Save to localStorage
            localStorage.setItem('zayia_user', JSON.stringify(user))
            localStorage.setItem('zayia_profile', JSON.stringify(newProfile))
            localStorage.setItem('last_login_time', new Date().toISOString())

            // Send welcome email if configured
            if (integrationsManager.isResendConfigured()) {
              integrationsManager.sendWelcomeEmail(email, fullName)
            }

            setLoading(false)
            return { error: null }
          } else {
            setLoading(false)
            return { error: { message: 'Erro ao criar conta. Tente novamente.' } }
          }
        } catch (supabaseError) {
          console.log('Supabase unavailable, falling back to mock signup:', supabaseError)
          // Continue to fallback registration below
        }
      }

      // Fallback to mock user creation
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        setLoading(false)
        return { error: { message: 'Este email já está cadastrado' } }
      }

      // Create new mock user
      const newUserId = 'user-' + Date.now()
      const newUser = {
        id: newUserId,
        email,
        password,
        profile: {
          id: newUserId,
          email,
          full_name: fullName,
          role: 'user' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          streak: 0,
          total_sessions: 0,
          points: 0,
          level: 1,
          completed_challenges: 0,
          subscription_plan: 'basic' as const,
          subscription_status: 'active' as const,
          notifications_enabled: true,
          community_access: true,
          mentor_status: 'none' as const
        }
      }

      mockUsers.push(newUser)

      const user = { id: newUser.id, email: newUser.email }
      const profile = newUser.profile

      setUser(user)
      setProfile(profile)

      // Save to localStorage
      localStorage.setItem('zayia_user', JSON.stringify(user))
      localStorage.setItem('zayia_profile', JSON.stringify(profile))
      localStorage.setItem('last_login_time', new Date().toISOString())

      setLoading(false)
      return { error: null }
    } catch (error) {
      console.error('Error during sign up:', error)
      setLoading(false)
      return { error: { message: 'Erro ao criar conta. Tente novamente.' } }
    }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem('zayia_user')
    localStorage.removeItem('zayia_profile')
  }

  const quickCEOLogin = async () => {
    setLoading(true)
    
    const ceoUser = mockUsers[0] // CEO is first user
    const user = { id: ceoUser.id, email: ceoUser.email }
    const profile = ceoUser.profile
    
    setUser(user)
    setProfile(profile)
    
    // Save to localStorage
    localStorage.setItem('zayia_user', JSON.stringify(user))
    localStorage.setItem('zayia_profile', JSON.stringify(profile))
    localStorage.setItem('last_login_time', new Date().toISOString())
    
    setLoading(false)
  }

  const quickUserLogin = async () => {
    setLoading(true)
    
    const demoUser = mockUsers[1] // Demo user is second
    const user = { id: demoUser.id, email: demoUser.email }
    const profile = demoUser.profile
    
    setUser(user)
    setProfile(profile)
    
    // Save to localStorage
    localStorage.setItem('zayia_user', JSON.stringify(user))
    localStorage.setItem('zayia_profile', JSON.stringify(profile))
    localStorage.setItem('last_login_time', new Date().toISOString())
    
    setLoading(false)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (profile) {
      try {
        if (integrationsManager.isSupabaseConfigured()) {
          // Update in Supabase
          const updatedProfile = await supabaseClient.updateProfile(profile.id, updates)
          if (updatedProfile) {
            setProfile(updatedProfile)
            localStorage.setItem('zayia_profile', JSON.stringify(updatedProfile))
          }
        } else {
          // Fallback to local update
          const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
          setProfile(updatedProfile)
          localStorage.setItem('zayia_profile', JSON.stringify(updatedProfile))
          
          // Update in mock database
          const userIndex = mockUsers.findIndex(u => u.id === profile.id)
          if (userIndex !== -1) {
            mockUsers[userIndex].profile = updatedProfile
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }
  }

  const deleteUser = async (userId: string) => {
  // Remover do array mock
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1)
  }
  
  // Se for o usuário atual, fazer logout
  if (user?.id === userId) {
    await signOut()
  }
  
  return true
}


  const value = {
    user,
    profile,
    loading,
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