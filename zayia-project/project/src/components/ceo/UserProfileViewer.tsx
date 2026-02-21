import React, { useState, useEffect } from 'react'
import { 
  X, 
  User, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Download,
  CheckCircle,
  Circle,
  PlayCircle,
  Star,
  TrendingUp,
  Heart,
  HelpCircle,
  Award,
  Activity,
  BarChart3,
  Shield,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Zap,
  Gift
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface UserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  phone?: string
  birth_date?: string
  location?: string
  profession?: string
  education?: string
  bio?: string
  created_at: string
  last_access: string
  
  // Progresso e gamificação
  level: number
  points: number
  streak: number
  total_sessions: number
  completed_challenges: number
  
  // Plano personalizado
  custom_plan: {
    id: string
    created_at: string
    total_days: number
    completed_days: number
    current_day: number
    progress_percentage: number
    days: Array<{
      day: number
      title: string
      description: string
      status: 'completed' | 'pending' | 'in_progress'
      completed_at?: string
      activities: Array<{
        id: string
        title: string
        type: 'meditation' | 'exercise' | 'journaling' | 'reading' | 'reflection'
        duration: number
        completed: boolean
      }>
    }>
  }
  
  // Sistema de medalhas
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    rarity: 'bronze' | 'silver' | 'gold' | 'diamond'
    earned_at: string
    category: string
  }>
  
  available_badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    rarity: 'bronze' | 'silver' | 'gold' | 'diamond'
    progress: number
    target: number
    category: string
  }>
  
  // Histórico SOS
  sos_history: Array<{
    id: string
    timestamp: string
    context?: string
    resolved: boolean
    response_time: number
    support_agent?: string
  }>
  
  // Dados de suporte
  support_data: {
    tickets: Array<{
      id: string
      subject: string
      status: 'open' | 'closed' | 'pending'
      created_at: string
      resolved_at?: string
      priority: 'low' | 'medium' | 'high' | 'urgent'
      messages_count: number
    }>
    ratings: Array<{
      id: string
      rating: number
      comment?: string
      created_at: string
      category: 'app' | 'support' | 'content'
    }>
    total_messages: number
    avg_response_time: number
  }
}

interface UserProfileViewerProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

// Mock data para demonstração
const mockUserProfile: UserProfile = {
  id: 'user-demo',
  full_name: 'Maria Silva Santos',
  email: 'maria.silva@email.com',
  avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  phone: '(11) 99999-9999',
  birth_date: '1990-05-15',
  location: 'São Paulo, SP',
  profession: 'Designer UX/UI',
  education: 'Superior Completo - Design',
  bio: 'Apaixonada por design e crescimento pessoal. Sempre em busca de novos desafios.',
  created_at: '2024-01-10T08:30:00Z',
  last_access: '2024-01-15T14:22:00Z',
  
  level: 12,
  points: 4850,
  streak: 25,
  total_sessions: 78,
  completed_challenges: 156,
  
  custom_plan: {
    id: 'plan-001',
    created_at: '2024-01-10T08:30:00Z',
    total_days: 7,
    completed_days: 5,
    current_day: 6,
    progress_percentage: 71.4,
    days: [
      {
        day: 1,
        title: 'Autoconhecimento',
        description: 'Descobrindo quem você realmente é',
        status: 'completed',
        completed_at: '2024-01-10T20:15:00Z',
        activities: [
          { id: 'a1', title: 'Meditação matinal', type: 'meditation', duration: 10, completed: true },
          { id: 'a2', title: 'Diário de gratidão', type: 'journaling', duration: 15, completed: true },
          { id: 'a3', title: 'Reflexão sobre valores', type: 'reflection', duration: 20, completed: true }
        ]
      },
      {
        day: 2,
        title: 'Confiança Interior',
        description: 'Fortalecendo sua autoestima',
        status: 'completed',
        completed_at: '2024-01-11T19:30:00Z',
        activities: [
          { id: 'b1', title: 'Afirmações positivas', type: 'reflection', duration: 10, completed: true },
          { id: 'b2', title: 'Exercício de respiração', type: 'meditation', duration: 15, completed: true },
          { id: 'b3', title: 'Lista de conquistas', type: 'journaling', duration: 25, completed: true }
        ]
      },
      {
        day: 3,
        title: 'Energia Vital',
        description: 'Conectando corpo e mente',
        status: 'completed',
        completed_at: '2024-01-12T18:45:00Z',
        activities: [
          { id: 'c1', title: 'Yoga matinal', type: 'exercise', duration: 30, completed: true },
          { id: 'c2', title: 'Caminhada consciente', type: 'exercise', duration: 20, completed: true },
          { id: 'c3', title: 'Meditação noturna', type: 'meditation', duration: 15, completed: true }
        ]
      },
      {
        day: 4,
        title: 'Relacionamentos',
        description: 'Melhorando conexões pessoais',
        status: 'completed',
        completed_at: '2024-01-13T21:10:00Z',
        activities: [
          { id: 'd1', title: 'Conversa significativa', type: 'reflection', duration: 30, completed: true },
          { id: 'd2', title: 'Carta de gratidão', type: 'journaling', duration: 20, completed: true },
          { id: 'd3', title: 'Meditação loving-kindness', type: 'meditation', duration: 15, completed: true }
        ]
      },
      {
        day: 5,
        title: 'Propósito de Vida',
        description: 'Descobrindo sua missão',
        status: 'completed',
        completed_at: '2024-01-14T17:20:00Z',
        activities: [
          { id: 'e1', title: 'Visualização de futuro', type: 'reflection', duration: 25, completed: true },
          { id: 'e2', title: 'Mapa de sonhos', type: 'journaling', duration: 35, completed: true },
          { id: 'e3', title: 'Leitura inspiracional', type: 'reading', duration: 30, completed: true }
        ]
      },
      {
        day: 6,
        title: 'Abundância',
        description: 'Atraindo prosperidade',
        status: 'in_progress',
        activities: [
          { id: 'f1', title: 'Meditação da abundância', type: 'meditation', duration: 20, completed: true },
          { id: 'f2', title: 'Planejamento financeiro', type: 'reflection', duration: 30, completed: false },
          { id: 'f3', title: 'Gratidão pela prosperidade', type: 'journaling', duration: 15, completed: false }
        ]
      },
      {
        day: 7,
        title: 'Integração',
        description: 'Consolidando aprendizados',
        status: 'pending',
        activities: [
          { id: 'g1', title: 'Revisão da jornada', type: 'reflection', duration: 30, completed: false },
          { id: 'g2', title: 'Plano de continuidade', type: 'journaling', duration: 25, completed: false },
          { id: 'g3', title: 'Celebração pessoal', type: 'reflection', duration: 15, completed: false }
        ]
      }
    ]
  },
  
  badges: [
    {
      id: 'badge-1',
      name: 'Primeira Semana',
      description: '7 dias consecutivos completando desafios',
      icon: '🌟',
      rarity: 'bronze',
      earned_at: '2024-01-17T10:30:00Z',
      category: 'Consistência'
    },
    {
      id: 'badge-2',
      name: 'Meditadora',
      description: '50 sessões de meditação completadas',
      icon: '🧘‍♀️',
      rarity: 'silver',
      earned_at: '2024-01-20T15:45:00Z',
      category: 'Mindfulness'
    },
    {
      id: 'badge-3',
      name: 'Inspiradora',
      description: 'Ajudou 10 pessoas na comunidade',
      icon: '✨',
      rarity: 'gold',
      earned_at: '2024-01-25T09:20:00Z',
      category: 'Comunidade'
    }
  ],
  
  available_badges: [
    {
      id: 'badge-4',
      name: 'Guerreira',
      description: 'Complete 100 desafios físicos',
      icon: '⚔️',
      rarity: 'silver',
      progress: 67,
      target: 100,
      category: 'Fitness'
    },
    {
      id: 'badge-5',
      name: 'Sábia',
      description: 'Leia 50 artigos de desenvolvimento',
      icon: '🦉',
      rarity: 'gold',
      progress: 23,
      target: 50,
      category: 'Conhecimento'
    }
  ],
  
  sos_history: [
    {
      id: 'sos-1',
      timestamp: '2024-01-12T22:30:00Z',
      context: 'Ansiedade antes de apresentação importante',
      resolved: true,
      response_time: 180,
      support_agent: 'ZAYIA IA'
    },
    {
      id: 'sos-2',
      timestamp: '2024-01-18T14:15:00Z',
      context: 'Conflito familiar',
      resolved: true,
      response_time: 120,
      support_agent: 'ZAYIA IA'
    },
    {
      id: 'sos-3',
      timestamp: '2024-01-22T19:45:00Z',
      context: 'Baixa autoestima após feedback negativo',
      resolved: true,
      response_time: 95,
      support_agent: 'ZAYIA IA'
    }
  ],
  
  support_data: {
    tickets: [
      {
        id: 'ticket-1',
        subject: 'Problema com sincronização de dados',
        status: 'closed',
        created_at: '2024-01-15T10:30:00Z',
        resolved_at: '2024-01-15T16:45:00Z',
        priority: 'medium',
        messages_count: 4
      },
      {
        id: 'ticket-2',
        subject: 'Sugestão de nova funcionalidade',
        status: 'open',
        created_at: '2024-01-20T09:15:00Z',
        priority: 'low',
        messages_count: 2
      }
    ],
    ratings: [
      {
        id: 'rating-1',
        rating: 5,
        comment: 'App incrível! Mudou minha vida completamente.',
        created_at: '2024-01-18T20:30:00Z',
        category: 'app'
      },
      {
        id: 'rating-2',
        rating: 4,
        comment: 'Suporte muito atencioso e rápido.',
        created_at: '2024-01-15T17:00:00Z',
        category: 'support'
      }
    ],
    total_messages: 12,
    avg_response_time: 2.5
  }
}

export function UserProfileViewer({ userId, isOpen, onClose }: UserProfileViewerProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile()
    }
  }, [isOpen, userId])

  const loadUserProfile = async () => {
    setLoading(true)
    // Simular carregamento da API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProfile(mockUserProfile)
    setLoading(false)
  }

  const exportToPDF = () => {
    // Implementar exportação para PDF
    console.log('Exportando perfil para PDF...')
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'text-orange-600 bg-orange-100'
      case 'silver': return 'text-gray-600 bg-gray-100'
      case 'gold': return 'text-yellow-600 bg-yellow-100'
      case 'diamond': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-gray-600 bg-gray-100'
      case 'open': return 'text-red-600 bg-red-100'
      case 'closed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'plan', label: 'Plano Personalizado', icon: Target },
    { id: 'badges', label: 'Sistema de Medalhas', icon: Trophy },
    { id: 'sos', label: 'Histórico SOS', icon: AlertTriangle },
    { id: 'support', label: 'Dados de Suporte', icon: MessageSquare }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zayia-sunset rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zayia-deep-violet">
                Perfil Completo da Usuária
              </h2>
              <p className="text-zayia-violet-gray">
                Visão 360° da jornada e progresso
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-zayia-lilac text-zayia-deep-violet rounded-xl hover:bg-zayia-lavender transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-zayia-violet-gray">Carregando perfil da usuária...</p>
            </div>
          </div>
        ) : profile ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-zayia-lilac/30 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-zayia-soft-purple text-zayia-deep-violet'
                        : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Informações Pessoais */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <div className="zayia-card p-6 text-center">
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-zayia-lilac/40"
                        />
                        <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">
                          {profile.full_name}
                        </h3>
                        <p className="text-zayia-violet-gray mb-4">{profile.email}</p>
                        
                        <div className="space-y-2 text-sm">
                          {profile.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-zayia-soft-purple" />
                              <span>{profile.phone}</span>
                            </div>
                          )}
                          {profile.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-zayia-soft-purple" />
                              <span>{profile.location}</span>
                            </div>
                          )}
                          {profile.profession && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-zayia-soft-purple" />
                              <span>{profile.profession}</span>
                            </div>
                          )}
                          {profile.education && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-zayia-soft-purple" />
                              <span>{profile.education}</span>
                            </div>
                          )}
                        </div>
                        
                        {profile.bio && (
                          <div className="mt-4 p-3 bg-zayia-lilac/20 rounded-lg">
                            <p className="text-sm text-zayia-deep-violet">{profile.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      {/* Estatísticas Principais */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="zayia-card p-4 text-center">
                          <div className="text-2xl font-bold text-zayia-deep-violet">{profile.level}</div>
                          <div className="text-sm text-zayia-violet-gray">Nível</div>
                        </div>
                        <div className="zayia-card p-4 text-center">
                          <div className="text-2xl font-bold text-zayia-soft-purple">{profile.points.toLocaleString()}</div>
                          <div className="text-sm text-zayia-violet-gray">Pontos</div>
                        </div>
                        <div className="zayia-card p-4 text-center">
                          <div className="text-2xl font-bold text-zayia-lavender">{profile.streak}</div>
                          <div className="text-sm text-zayia-violet-gray">Sequência</div>
                        </div>
                        <div className="zayia-card p-4 text-center">
                          <div className="text-2xl font-bold text-zayia-orchid">{profile.total_sessions}</div>
                          <div className="text-sm text-zayia-violet-gray">Sessões</div>
                        </div>
                      </div>

                      {/* Datas Importantes */}
                      <div className="zayia-card p-6">
                        <h4 className="text-lg font-semibold text-zayia-deep-violet mb-4">Informações de Acesso</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-zayia-soft-purple" />
                            <div>
                              <div className="text-sm text-zayia-violet-gray">Data de Cadastro</div>
                              <div className="font-medium text-zayia-deep-violet">
                                {formatDate(profile.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-zayia-lavender" />
                            <div>
                              <div className="text-sm text-zayia-violet-gray">Último Acesso</div>
                              <div className="font-medium text-zayia-deep-violet">
                                {formatDate(profile.last_access)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resumo de Atividades */}
                      <div className="zayia-card p-6">
                        <h4 className="text-lg font-semibold text-zayia-deep-violet mb-4">Resumo de Atividades</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-zayia-lilac/20 rounded-lg">
                            <Target className="w-6 h-6 text-zayia-deep-violet mx-auto mb-2" />
                            <div className="text-lg font-bold text-zayia-deep-violet">{profile.completed_challenges}</div>
                            <div className="text-xs text-zayia-violet-gray">Desafios Completos</div>
                          </div>
                          <div className="text-center p-3 bg-zayia-lilac/20 rounded-lg">
                            <Trophy className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
                            <div className="text-lg font-bold text-zayia-deep-violet">{profile.badges.length}</div>
                            <div className="text-xs text-zayia-violet-gray">Medalhas Conquistadas</div>
                          </div>
                          <div className="text-center p-3 bg-zayia-lilac/20 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-zayia-lavender mx-auto mb-2" />
                            <div className="text-lg font-bold text-zayia-deep-violet">{profile.sos_history.length}</div>
                            <div className="text-xs text-zayia-violet-gray">Usos do SOS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Plano Personalizado Tab */}
              {activeTab === 'plan' && (
                <div className="space-y-6">
                  {/* Header do Plano */}
                  <div className="zayia-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-zayia-deep-violet">
                        Plano Personalizado de 7 Dias
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-zayia-soft-purple">
                          {profile.custom_plan.progress_percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-zayia-violet-gray">Progresso Geral</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
                        <span>Progresso: {profile.custom_plan.completed_days} de {profile.custom_plan.total_days} dias</span>
                        <span>Criado em: {formatDate(profile.custom_plan.created_at)}</span>
                      </div>
                      <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${profile.custom_plan.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Dias do Plano */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {profile.custom_plan.days.map((day) => (
                      <div key={day.day} className="zayia-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              day.status === 'completed' ? 'bg-green-100 text-green-600' :
                              day.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {day.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                               day.status === 'in_progress' ? <PlayCircle className="w-5 h-5" /> :
                               <Circle className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-zayia-deep-violet">
                                Dia {day.day}: {day.title}
                              </h4>
                              <p className="text-sm text-zayia-violet-gray">{day.description}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(day.status)}`}>
                            {day.status === 'completed' ? 'Concluído' :
                             day.status === 'in_progress' ? 'Em Andamento' :
                             'Pendente'}
                          </span>
                        </div>

                        {day.completed_at && (
                          <div className="mb-4 text-sm text-zayia-violet-gray">
                            Concluído em: {formatDate(day.completed_at)}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h5 className="font-medium text-zayia-deep-violet">Atividades:</h5>
                          {day.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-2 bg-zayia-lilac/10 rounded-lg">
                              <div className="flex items-center gap-2">
                                {activity.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-sm">{activity.title}</span>
                              </div>
                              <span className="text-xs text-zayia-violet-gray">
                                {activity.duration} min
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sistema de Medalhas Tab */}
              {activeTab === 'badges' && (
                <div className="space-y-6">
                  {/* Medalhas Conquistadas */}
                  <div className="zayia-card p-6">
                    <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">
                      Medalhas Conquistadas ({profile.badges.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.badges.map((badge) => (
                        <div key={badge.id} className="p-4 border-2 border-zayia-lilac/30 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50">
                          <div className="text-center mb-3">
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <h4 className="font-semibold text-zayia-deep-violet">{badge.name}</h4>
                            <p className="text-sm text-zayia-violet-gray">{badge.description}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                              {badge.rarity.toUpperCase()}
                            </span>
                            <span className="text-xs text-zayia-violet-gray">
                              {formatDate(badge.earned_at)}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-zayia-violet-gray text-center">
                            {badge.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medalhas Disponíveis */}
                  <div className="zayia-card p-6">
                    <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">
                      Próximas Medalhas ({profile.available_badges.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.available_badges.map((badge) => (
                        <div key={badge.id} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                          <div className="flex items-start gap-4">
                            <div className="text-3xl opacity-50">{badge.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-700">{badge.name}</h4>
                              <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progresso: {badge.progress}/{badge.target}</span>
                                  <span>{Math.round((badge.progress / badge.target) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-2 rounded-full"
                                    style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                                  {badge.rarity.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-500">{badge.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Histórico SOS Tab */}
              {activeTab === 'sos' && (
                <div className="space-y-6">
                  <div className="zayia-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-zayia-deep-violet">
                        Histórico de Uso do SOS ({profile.sos_history.length} ocorrências)
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-zayia-soft-purple">
                            {Math.round(profile.sos_history.reduce((acc, sos) => acc + sos.response_time, 0) / profile.sos_history.length)}s
                          </div>
                          <div className="text-xs text-zayia-violet-gray">Tempo Médio de Resposta</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {profile.sos_history.filter(sos => sos.resolved).length}
                          </div>
                          <div className="text-xs text-zayia-violet-gray">Casos Resolvidos</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {profile.sos_history.map((sos) => (
                        <div key={sos.id} className="p-4 border border-zayia-lilac/30 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                sos.resolved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                <Heart className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium text-zayia-deep-violet">
                                  {formatDate(sos.timestamp)}
                                </div>
                                <div className="text-sm text-zayia-violet-gray">
                                  Atendido por: {sos.support_agent}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                sos.resolved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                {sos.resolved ? 'Resolvido' : 'Pendente'}
                              </span>
                              <div className="text-xs text-zayia-violet-gray mt-1">
                                Resposta em {sos.response_time}s
                              </div>
                            </div>
                          </div>
                          
                          {sos.context && (
                            <div className="p-3 bg-zayia-lilac/10 rounded-lg">
                              <div className="text-sm font-medium text-zayia-deep-violet mb-1">Contexto:</div>
                              <div className="text-sm text-zayia-violet-gray">{sos.context}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dados de Suporte Tab */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  {/* Estatísticas de Suporte */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="zayia-card p-4 text-center">
                      <MessageSquare className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
                      <div className="text-2xl font-bold text-zayia-deep-violet">{profile.support_data.total_messages}</div>
                      <div className="text-sm text-zayia-violet-gray">Total de Mensagens</div>
                    </div>
                    <div className="zayia-card p-4 text-center">
                      <Clock className="w-8 h-8 text-zayia-lavender mx-auto mb-2" />
                      <div className="text-2xl font-bold text-zayia-deep-violet">{profile.support_data.avg_response_time}h</div>
                      <div className="text-sm text-zayia-violet-gray">Tempo Médio de Resposta</div>
                    </div>
                    <div className="zayia-card p-4 text-center">
                      <Star className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
                      <div className="text-2xl font-bold text-zayia-deep-violet">
                        {(profile.support_data.ratings.reduce((acc, r) => acc + r.rating, 0) / profile.support_data.ratings.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-zayia-violet-gray">Avaliação Média</div>
                    </div>
                  </div>

                  {/* Tickets de Suporte */}
                  <div className="zayia-card p-6">
                    <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">
                      Tickets de Suporte ({profile.support_data.tickets.length})
                    </h3>
                    <div className="space-y-4">
                      {profile.support_data.tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 border border-zayia-lilac/30 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-zayia-deep-violet">{ticket.subject}</h4>
                              <div className="text-sm text-zayia-violet-gray">
                                Criado em: {formatDate(ticket.created_at)}
                              </div>
                              {ticket.resolved_at && (
                                <div className="text-sm text-zayia-violet-gray">
                                  Resolvido em: {formatDate(ticket.resolved_at)}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status === 'open' ? 'Aberto' : 
                                 ticket.status === 'closed' ? 'Fechado' : 'Pendente'}
                              </span>
                              <div className="text-xs text-zayia-violet-gray mt-1">
                                {ticket.messages_count} mensagens
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              Prioridade: {ticket.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avaliações */}
                  <div className="zayia-card p-6">
                    <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">
                      Avaliações Deixadas ({profile.support_data.ratings.length})
                    </h3>
                    <div className="space-y-4">
                      {profile.support_data.ratings.map((rating) => (
                        <div key={rating.id} className="p-4 border border-zayia-lilac/30 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold text-zayia-deep-violet">
                                {rating.rating}/5
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 bg-zayia-lilac/20 text-zayia-deep-violet rounded text-xs">
                                {rating.category.toUpperCase()}
                              </span>
                              <div className="text-xs text-zayia-violet-gray mt-1">
                                {formatDate(rating.created_at)}
                              </div>
                            </div>
                          </div>
                          {rating.comment && (
                            <div className="p-3 bg-zayia-lilac/10 rounded-lg">
                              <p className="text-sm text-zayia-deep-violet">{rating.comment}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-zayia-violet-gray mx-auto mb-4" />
              <p className="text-zayia-violet-gray">Erro ao carregar perfil da usuária</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}