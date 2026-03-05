import React, { useState, useEffect } from 'react'
import { supabaseClient, type Profile } from '../../lib/supabase-client'
import { supabase } from '../../lib/supabase'
import { integrationsManager } from '../../lib/integrations-manager'
import {
  Plus,
  Search,
  Eye,
  Power,
  PowerOff,
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  Trophy,
  Target,
  Star,
  Crown,
  Shield,
  Award,
  Zap,
  Heart,
  Brain,
  Dumbbell,
  MessageCircle,
  Home,
  Smartphone,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Activity,
  Flame,
  Gem,
  Medal,
  Sparkles,
  Trash
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

// Tipos específicos para Guerreiras
interface Guerreira extends Profile {
  cpf?: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipcode: string
  }
  category_progress?: {
    autoestima: { completed: number, total: number, percentage: number }
    rotina: { completed: number, total: number, percentage: number }
    mindfulness: { completed: number, total: number, percentage: number }
    corpo_saude: { completed: number, total: number, percentage: number }
    relacionamentos: { completed: number, total: number, percentage: number }
    carreira: { completed: number, total: number, percentage: number }
    digital_detox: { completed: number, total: number, percentage: number }
  }
  badges_earned?: Array<{
    id: string
    name: string
    description: string
    icon: string
    rarity: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary'
    earned_at: string
    category: string
  }>
}

// Sistema de níveis (1-10) baseado no sistema existente
const levelSystem = [
  { level: 1, name: 'Iniciante', pointsRequired: 0, icon: User, color: 'from-gray-400 to-gray-600' },
  { level: 2, name: 'Exploradora', pointsRequired: 168, icon: Eye, color: 'from-green-400 to-green-600' },
  { level: 3, name: 'Aprendiz', pointsRequired: 336, icon: Target, color: 'from-blue-400 to-blue-600' },
  { level: 4, name: 'Praticante', pointsRequired: 504, icon: Zap, color: 'from-yellow-400 to-yellow-600' },
  { level: 5, name: 'Dedicada', pointsRequired: 672, icon: Shield, color: 'from-orange-400 to-orange-600' },
  { level: 6, name: 'Guerreira', pointsRequired: 840, icon: Award, color: 'from-red-400 to-red-600' },
  { level: 7, name: 'Sábia', pointsRequired: 1008, icon: Brain, color: 'from-purple-400 to-purple-600' },
  { level: 8, name: 'Inspiradora', pointsRequired: 1176, icon: Sparkles, color: 'from-pink-400 to-pink-600' },
  { level: 9, name: 'Mestra', pointsRequired: 1344, icon: Crown, color: 'from-indigo-400 to-indigo-600' },
  { level: 10, name: 'Lendária', pointsRequired: 1680, icon: Star, color: 'from-violet-400 to-violet-600' }
]

// Medalhas do sistema existente
const availableBadges = [
  { id: 'primeiro-passo', name: 'Primeiro Passo', description: 'Completou o 1º desafio', icon: '🌟', rarity: 'bronze', category: 'Início' },
  { id: 'primeira-semana', name: 'Primeira Semana', description: '7 dias seguidos', icon: '📅', rarity: 'bronze', category: 'Início' },
  { id: 'exploradora', name: 'Exploradora', description: 'Acessou todas as categorias', icon: '👁️', rarity: 'bronze', category: 'Início' },
  { id: 'desafiante', name: 'Desafiante', description: '50 desafios concluídos', icon: '🎯', rarity: 'silver', category: 'Progresso' },
  { id: 'constante', name: 'Constante', description: '200 desafios concluídos', icon: '🔥', rarity: 'gold', category: 'Progresso' },
  { id: 'executora', name: 'Executora', description: '500 desafios concluídos', icon: '⚡', rarity: 'diamond', category: 'Progresso' },
  { id: 'mestre-desafios', name: 'Mestre dos Desafios', description: '840 desafios (todos)', icon: '👑', rarity: 'legendary', category: 'Progresso' },
  { id: 'chama-acesa', name: 'Chama Acesa', description: '14 dias seguidos', icon: '🔥', rarity: 'silver', category: 'Streaks' },
  { id: 'resiliencia', name: 'Resiliência', description: '30 dias seguidos', icon: '🛡️', rarity: 'gold', category: 'Streaks' },
  { id: 'imparavel', name: 'Imparável', description: '60 dias seguidos', icon: '📈', rarity: 'diamond', category: 'Streaks' },
  { id: 'guerreira-ano', name: 'Guerreira do Ano', description: '365 dias seguidos', icon: '👑', rarity: 'legendary', category: 'Streaks' }
]

// Categorias do sistema
const categories = [
  { id: 'autoestima', name: 'Autoestima & Autocuidado', icon: Heart, color: 'text-pink-500', totalChallenges: 120 },
  { id: 'rotina', name: 'Rotina & Organização', icon: Home, color: 'text-green-500', totalChallenges: 120 },
  { id: 'mindfulness', name: 'Mindfulness & Emoções', icon: Brain, color: 'text-purple-500', totalChallenges: 120 },
  { id: 'corpo_saude', name: 'Corpo & Saúde', icon: Dumbbell, color: 'text-emerald-500', totalChallenges: 120 },
  { id: 'relacionamentos', name: 'Relacionamentos & Comunicação', icon: MessageCircle, color: 'text-rose-500', totalChallenges: 120 },
  { id: 'carreira', name: 'Carreira e Desenvolvimento', icon: Briefcase, color: 'text-blue-500', totalChallenges: 120 },
  { id: 'digital_detox', name: 'Digital Detox', icon: Smartphone, color: 'text-red-500', totalChallenges: 120 }
]

export function GuerreirasSection() {
  const [guerreiras, setGuerreiras] = useState<Guerreira[]>([])
  const [filteredGuerreiras, setFilteredGuerreiras] = useState<Guerreira[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null)
  const [showToggleModal, setShowToggleModal] = useState<{ guerreira: Guerreira, action: 'activate' | 'deactivate' } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  // Dados do formulário de nova guerreira
  const [newGuerreira, setNewGuerreira] = useState({
    full_name: '',
    email: '',
    cpf: '',
    birth_date: '',
    phone: '',
    profession: '',
    education: '',
    bio: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipcode: ''
    }
  })

  // Carregar guerreiras ao montar componente
  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initLoad = async () => {
      setLoading(true)
      try {
        if (integrationsManager.isSupabaseConfigured()) {
          const profiles = await supabaseClient.getProfiles()

          // Filtrar apenas usuárias COM subscription ativa
          const filtered = profiles
            .filter(p =>
              p.role === 'user' &&
              p.subscription_status === 'active'
            )

          const guerreirasData = await Promise.all(
            filtered.map(enrichGuerreiraData)
          )

          setGuerreiras(guerreirasData)

          // Setup real-time listener
          unsubscribe = setupRealtimeListener(guerreirasData)
        } else {
          setGuerreiras([])
          setError('Nenhuma guerreira encontrada')
        }
      } catch (error) {
        console.error('Error loading guerreiras:', error)
        setGuerreiras([])
        setError(`Erro ao carregar guerreiras: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    initLoad()

    // Cleanup ao desmontar
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Filtrar guerreiras por busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGuerreiras(guerreiras)
    } else {
      const filtered = guerreiras.filter(guerreira =>
        guerreira.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guerreira.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredGuerreiras(filtered)
    }
  }, [guerreiras, searchTerm])

  // Carregar dados das guerreiras

  // Setup real-time listener para sincronizar novas usuárias
  const setupRealtimeListener = (initialGuerreiras: Guerreira[]) => {
    try {
      const channel = supabase
        .channel('public:profiles:changes')
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'profiles'
          },
          async (payload: any) => {
            console.log('🔄 Real-time update received:', payload.eventType, payload.new?.email)

            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const newProfile = payload.new as Profile

              // Verificar se é usuária com subscription ativa
              if (
                newProfile.role === 'user' &&
                newProfile.subscription_status === 'active'
              ) {
                // Enriquecer dados ANTES do setState
                enrichGuerreiraData(newProfile).then(enriched => {
                  setGuerreiras(prev => {
                    // Verificar se já existe na lista
                    const exists = prev.some(g => g.id === newProfile.id)

                    if (!exists) {
                      // Nova usuária! Adicionar à lista
                      console.log('✨ Nova guerreira adicionada:', newProfile.full_name)
                      return [...prev, enriched]
                    } else {
                      // Usuária já existe - atualizar dados
                      console.log('🔄 Guerreira atualizada:', newProfile.full_name)
                      return prev.map(g =>
                        g.id === newProfile.id ? enriched : g
                      )
                    }
                  })
                })
              } else if (newProfile.subscription_status === 'cancelled') {
                // Subscription foi cancelada - remover da lista
                console.log('❌ Subscription cancelada:', newProfile.full_name)
                setGuerreiras(prev => prev.filter(g => g.id !== newProfile.id))
              }
            } else if (payload.eventType === 'DELETE') {
              // Usuária deletada
              const deletedId = payload.old?.id
              console.log('❌ Guerreira removida:', deletedId)
              setGuerreiras(prev => prev.filter(g => g.id !== deletedId))
            }
          }
        )
        .subscribe((status: string) => {
          console.log('📡 Real-time subscription status:', status)
        })

      // Retornar função para desinscrever
      return () => {
        console.log('🛑 Desinscrever do real-time listener')
        channel.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up real-time listener:', error)
      return () => {}
    }
  }

  // Enriquecer dados da guerreira com informações calculadas
  const enrichGuerreiraData = async (profile: Profile): Promise<Guerreira> => {
    const points = profile.points || 0
    const level = calculateLevel(points)
    const badges = generateBadgesForProfile(profile)
    const categoryProgress = await supabaseClient.getCategoryProgressForUser(profile.id)

    return {
      ...profile,
      level,
      badges_earned: badges,
      category_progress: categoryProgress as any
      // CPF and address come from Supabase, not generated
    }
  }

  // Calcular nível baseado nos pontos
  const calculateLevel = (points: number): number => {
    for (let i = levelSystem.length - 1; i >= 0; i--) {
      if (points >= levelSystem[i].pointsRequired) {
        return levelSystem[i].level
      }
    }
    return 1
  }

  // Gerar medalhas baseadas no progresso
  const generateBadgesForProfile = (profile: Profile) => {
    const badges = []
    const completedChallenges = profile.completed_challenges || 0
    const streak = profile.streak || 0

    // Medalhas baseadas em desafios completados
    if (completedChallenges >= 1) badges.push({ ...availableBadges[0], earned_at: profile.created_at })
    if (streak >= 7) badges.push({ ...availableBadges[1], earned_at: profile.created_at })
    if (completedChallenges >= 50) badges.push({ ...availableBadges[3], earned_at: profile.created_at })
    if (completedChallenges >= 200) badges.push({ ...availableBadges[4], earned_at: profile.created_at })
    if (streak >= 14) badges.push({ ...availableBadges[7], earned_at: profile.created_at })
    if (streak >= 30) badges.push({ ...availableBadges[8], earned_at: profile.created_at })

    return badges
  }

  // Get real category progress from Supabase (via enrichGuerreiraData)
  // No longer generating random progress - all data comes from database


  // Adicionar nova guerreira
  const handleAddGuerreira = async () => {
    if (!newGuerreira.full_name.trim() || !newGuerreira.email.trim()) {
      alert('Nome e email são obrigatórios!')
      return
    }

    setLoading(true)
    try {
      const guerreiraData: Partial<Profile> = {
        email: newGuerreira.email,
        full_name: newGuerreira.full_name,
        role: 'user',
        phone: newGuerreira.phone || undefined,
        birth_date: newGuerreira.birth_date || undefined,
        profession: newGuerreira.profession || undefined,
        education: newGuerreira.education || undefined,
        bio: newGuerreira.bio || undefined,
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
      }

      let createdGuerreira: Guerreira | null = null

      if (integrationsManager.isSupabaseConfigured()) {
        const created = await supabaseClient.createProfile(guerreiraData as any)
        if (created) {
          createdGuerreira = await enrichGuerreiraData(created)
        }
      } else {
        // Fallback para mock data
        const mockGuerreira: Profile = {
          id: `guerreira-${Date.now()}`,
          ...guerreiraData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile

        createdGuerreira = await enrichGuerreiraData(mockGuerreira)
      }

      if (createdGuerreira) {
        // Adicionar CPF e endereço específicos
        createdGuerreira.cpf = newGuerreira.cpf
        createdGuerreira.address = newGuerreira.address

        setGuerreiras(prev => [createdGuerreira!, ...prev])
        resetForm()
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding guerreira:', error)
      alert('Erro ao cadastrar guerreira. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Resetar formulário
  const resetForm = () => {
    setNewGuerreira({
      full_name: '',
      email: '',
      cpf: '',
      birth_date: '',
      phone: '',
      profession: '',
      education: '',
      bio: '',
      address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipcode: ''
      }
    })
  }

  // Toggle status da guerreira
  const handleToggleStatus = async (guerreira: Guerreira, newStatus: 'active' | 'cancelled') => {
    try {
      if (integrationsManager.isSupabaseConfigured()) {
        const updated = await supabaseClient.updateProfile(guerreira.id, {
          subscription_status: newStatus,
          updated_at: new Date().toISOString()
        })
        if (updated) {
          setGuerreiras(prev => prev.map(g =>
            g.id === guerreira.id ? { ...g, subscription_status: newStatus } : g
          ))
        }
      } else {
        // Fallback para mock data
        setGuerreiras(prev => prev.map(g =>
          g.id === guerreira.id ? { ...g, subscription_status: newStatus } : g
        ))
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
    setShowToggleModal(null)
  }

  const handleDelete = async (userId: string, userName: string) => {
    // Confirm dialog
    const confirmed = window.confirm(
      `Tem certeza que quer DELETAR ${userName}?\n\nEssa ação NÃO pode ser desfeita!`
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const result = await supabaseClient.deleteProfile(userId)

      if (result.success) {
        // Remove da lista
        setGuerreiras(guerreiras.filter(g => g.id !== userId))
        // Alert de sucesso
        alert(`${userName} foi deletada do sistema`)
      } else {
        alert('Erro ao deletar usuária')
      }
    } catch (error) {
      console.error('Error deleting profile:', error)
      alert('Erro ao deletar usuária')
    } finally {
      setIsDeleting(false)
    }
  }

  // Obter informações do nível
  const getLevelInfo = (level: number) => {
    return levelSystem.find(l => l.level === level) || levelSystem[0]
  }

  // Obter cor da raridade das medalhas
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'text-orange-600 bg-orange-100'
      case 'silver': return 'text-gray-600 bg-gray-100'
      case 'gold': return 'text-yellow-600 bg-yellow-100'
      case 'diamond': return 'text-blue-600 bg-blue-100'
      case 'legendary': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-red-600 rounded-xl">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zayia-deep-violet">⚔️ Guerreiras ZAYIA</h2>
            <p className="text-zayia-violet-gray">Gerencie as guerreiras da transformação pessoal</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="zayia-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Guerreira
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="zayia-card p-6 text-center">
          <Users className="w-8 h-8 text-zayia-deep-violet mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{guerreiras.length}</div>
          <div className="text-sm text-zayia-violet-gray">Total de Guerreiras</div>
        </div>
        <div className="zayia-card p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">
            {guerreiras.filter(g => g.subscription_status === 'active').length}
          </div>
          <div className="text-sm text-zayia-violet-gray">Ativas</div>
        </div>
        <div className="zayia-card p-6 text-center">
          <Trophy className="w-8 h-8 text-zayia-soft-purple mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">
            {Math.round(guerreiras.reduce((acc, g) => acc + (g.level || 1), 0) / Math.max(guerreiras.length, 1))}
          </div>
          <div className="text-sm text-zayia-violet-gray">Nível Médio</div>
        </div>
        <div className="zayia-card p-6 text-center">
          <Star className="w-8 h-8 text-zayia-lavender mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">
            {guerreiras.reduce((acc, g) => acc + (g.badges_earned?.length || 0), 0)}
          </div>
          <div className="text-sm text-zayia-violet-gray">Total de Medalhas</div>
        </div>
      </div>

      {/* Campo de Busca */}
      <div className="zayia-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zayia-violet-gray" />
          <input
            type="text"
            placeholder="Buscar guerreira por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 zayia-input rounded-xl border-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Lista de Guerreiras */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-semibold text-zayia-deep-violet mb-6">
          Guerreiras ({filteredGuerreiras.length})
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredGuerreiras.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-zayia-violet-gray mx-auto mb-4" />
            <p className="text-zayia-violet-gray">
              {searchTerm ? 'Nenhuma guerreira encontrada' : 'Nenhuma guerreira cadastrada ainda'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGuerreiras.map((guerreira) => {
              const levelInfo = getLevelInfo(guerreira.level || 1)
              const LevelIcon = levelInfo.icon
              
              return (
                <div key={guerreira.id} className="p-4 border border-zayia-lilac/30 rounded-xl hover:border-zayia-soft-purple transition-all duration-300">
                  <div className="flex items-center gap-4">
                    {/* Avatar e Nome */}
                    <img
                      src={guerreira.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'}
                      alt={guerreira.full_name || 'Guerreira'}
                      className="w-16 h-16 rounded-full border-2 border-zayia-lilac/40"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-zayia-deep-violet truncate">
                        {guerreira.full_name || 'Guerreira'}
                      </h4>
                      <p className="text-sm text-zayia-violet-gray">{guerreira.email}</p>
                      <p className="text-xs text-zayia-violet-gray">{guerreira.profession || 'Profissão não informada'}</p>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        guerreira.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {guerreira.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    {/* Nível */}
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${levelInfo.color} flex items-center justify-center mb-2`}>
                        <LevelIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-bold text-zayia-deep-violet">Nível {guerreira.level || 1}</div>
                      <div className="text-xs text-zayia-violet-gray">{levelInfo.name}</div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDetailsModal(guerreira.id)}
                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                        title="Ver Detalhes Completos"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => setShowToggleModal({
                          guerreira,
                          action: guerreira.subscription_status === 'active' ? 'deactivate' : 'activate'
                        })}
                        className={`p-3 rounded-xl transition-colors ${
                          guerreira.subscription_status === 'active'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title={guerreira.subscription_status === 'active' ? 'Desativar Acesso' : 'Ativar Acesso'}
                      >
                        {guerreira.subscription_status === 'active' ? (
                          <PowerOff className="w-5 h-5" />
                        ) : (
                          <Power className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(guerreira.id, guerreira.full_name || 'Guerreira')}
                        disabled={isDeleting}
                        className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Excluir Guerreira"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-zayia-deep-violet">⚔️ Cadastrar Nova Guerreira</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulário */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-zayia-deep-violet">Dados Pessoais</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={newGuerreira.full_name}
                        onChange={(e) => setNewGuerreira(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="Ana Silva Santos"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newGuerreira.email}
                        onChange={(e) => setNewGuerreira(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="ana@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                      <input
                        type="text"
                        value={newGuerreira.cpf}
                        onChange={(e) => setNewGuerreira(prev => ({ ...prev, cpf: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="123.456.789-01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                      <input
                        type="date"
                        value={newGuerreira.birth_date}
                        onChange={(e) => setNewGuerreira(prev => ({ ...prev, birth_date: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={newGuerreira.phone}
                        onChange={(e) => setNewGuerreira(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profissão</label>
                      <input
                        type="text"
                        value={newGuerreira.profession}
                        onChange={(e) => setNewGuerreira(prev => ({ ...prev, profession: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="Designer, Psicóloga, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Educação</label>
                    <input
                      type="text"
                      value={newGuerreira.education}
                      onChange={(e) => setNewGuerreira(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                      placeholder="Superior Completo, Pós-graduação, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio/Descrição</label>
                    <textarea
                      value={newGuerreira.bio}
                      onChange={(e) => setNewGuerreira(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Conte um pouco sobre essa guerreira..."
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <h4 className="text-lg font-semibold text-zayia-deep-violet mb-4">Endereço</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                        <input
                          type="text"
                          value={newGuerreira.address.street}
                          onChange={(e) => setNewGuerreira(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, street: e.target.value }
                          }))}
                          className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="Rua das Flores"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                        <input
                          type="text"
                          value={newGuerreira.address.number}
                          onChange={(e) => setNewGuerreira(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, number: e.target.value }
                          }))}
                          className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                        <input
                          type="text"
                          value={newGuerreira.address.neighborhood}
                          onChange={(e) => setNewGuerreira(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, neighborhood: e.target.value }
                          }))}
                          className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="Vila Madalena"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                        <input
                          type="text"
                          value={newGuerreira.address.city}
                          onChange={(e) => setNewGuerreira(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, city: e.target.value }
                          }))}
                          className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="São Paulo"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select
                          value={newGuerreira.address.state}
                          onChange={(e) => setNewGuerreira(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, state: e.target.value }
                          }))}
                          className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        >
                          <option value="">Selecione o estado</option>
                          <option value="SP">São Paulo</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="PR">Paraná</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="BA">Bahia</option>
                          <option value="GO">Goiás</option>
                          <option value="PE">Pernambuco</option>
                          <option value="CE">Ceará</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                        <input
                          type="text"
                          value={newGuerreira.address.zipcode}
                          onChange={(e) => setNewGuerreira(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, zipcode: e.target.value }
                          }))}
                          className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="01234-567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-zayia-deep-violet">Preview da Guerreira</h4>
                  
                  <div className="zayia-card p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h5 className="text-lg font-bold text-zayia-deep-violet">
                        {newGuerreira.full_name || 'Nome da Guerreira'}
                      </h5>
                      <p className="text-sm text-zayia-violet-gray">
                        {newGuerreira.email || 'email@exemplo.com'}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      {newGuerreira.profession && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-zayia-soft-purple" />
                          <span>{newGuerreira.profession}</span>
                        </div>
                      )}
                      {newGuerreira.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-zayia-soft-purple" />
                          <span>{newGuerreira.phone}</span>
                        </div>
                      )}
                      {(newGuerreira.address.city || newGuerreira.address.state) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-zayia-soft-purple" />
                          <span>{newGuerreira.address.city}, {newGuerreira.address.state}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-zayia-lilac/30">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-zayia-deep-violet">1</div>
                          <div className="text-xs text-zayia-violet-gray">Nível Inicial</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-zayia-soft-purple">0</div>
                          <div className="text-xs text-zayia-violet-gray">Pontos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-zayia-lavender">0</div>
                          <div className="text-xs text-zayia-violet-gray">Medalhas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-zayia-lilac/30">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddGuerreira}
                  disabled={!newGuerreira.full_name.trim() || !newGuerreira.email.trim() || loading}
                  className="flex-1 zayia-button py-3 px-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5" />}
                  {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Perfil Simplificado */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-purple-500/30 overflow-hidden">
            {(() => {
              const guerreira = guerreiras.find(g => g.id === showDetailsModal)
              if (!guerreira) return null

              return (
                <>
                  {/* HEADER */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 border-b border-purple-500/20 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-purple-300">Perfil da Guerreira</h2>
                    <button
                      onClick={() => setShowDetailsModal(null)}
                      className="text-gray-400 hover:text-gray-300 transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* CONTEÚDO */}
                  <div className="p-6 space-y-6">
                    {/* Avatar e Nome */}
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold mx-auto">
                        {guerreira.full_name?.[0] || 'G'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-purple-300">
                          {guerreira.full_name}
                        </h3>
                        <p className="text-gray-400">{guerreira.email}</p>
                      </div>
                    </div>

                    {/* Dados Essenciais */}
                    <div className="space-y-4 border-t border-purple-500/20 pt-6">
                      {/* Nível e Pontos */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-900/20 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Nível</p>
                          <p className="text-2xl font-bold text-purple-300">
                            {guerreira.level || 1}
                          </p>
                        </div>
                        <div className="bg-purple-900/20 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Pontos</p>
                          <p className="text-2xl font-bold text-purple-300">
                            {guerreira.points || 0}
                          </p>
                        </div>
                      </div>

                      {/* Endereço */}
                      {guerreira.address && (
                        <div className="bg-purple-900/10 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <p className="text-sm text-gray-400 font-semibold">Endereço</p>
                          </div>
                          <div className="text-gray-300 text-sm space-y-1">
                            <p>{guerreira.address.street}, {guerreira.address.number}</p>
                            <p>{guerreira.address.neighborhood}, {guerreira.address.city}</p>
                            <p>{guerreira.address.state}, {guerreira.address.zipcode}</p>
                          </div>
                        </div>
                      )}

                      {!guerreira.address && (
                        <div className="bg-purple-900/10 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-400 font-semibold">Endereço</p>
                          </div>
                          <p className="text-gray-500 text-sm">Não informado</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="bg-slate-800/50 border-t border-purple-500/20 p-6">
                    <button
                      onClick={() => setShowDetailsModal(null)}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                    >
                      Fechar
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Toggle Status */}
      {showToggleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  showToggleModal.action === 'activate' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {showToggleModal.action === 'activate' ? (
                    <Power className="w-8 h-8 text-green-600" />
                  ) : (
                    <PowerOff className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {showToggleModal.action === 'activate' ? 'Ativar' : 'Desativar'} Guerreira?
                </h3>
                <p className="text-gray-600 text-sm">
                  {showToggleModal.action === 'activate' 
                    ? `Tem certeza que deseja ativar o acesso de ${showToggleModal.guerreira.full_name}?`
                    : `Tem certeza que deseja desativar o acesso de ${showToggleModal.guerreira.full_name}?`
                  }
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowToggleModal(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleToggleStatus(
                    showToggleModal.guerreira, 
                    showToggleModal.action === 'activate' ? 'active' : 'cancelled'
                  )}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                    showToggleModal.action === 'activate'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {showToggleModal.action === 'activate' ? 'Sim, Ativar' : 'Sim, Desativar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}