import React, { useState, useEffect } from 'react'
import {
  Trophy,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Crown,
  Medal,
  Star,
  Zap,
  Target,
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
  Minus,
  Award,
  Flame,
  Shield,
  Sparkles,
  Heart,
  Brain,
  Dumbbell,
  MessageCircle,
  Briefcase,
  Home,
  Smartphone,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock3
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import {
  RankingUser,
  RankingStats,
  generateMockRankingUsers,
  calculateRankingPosition,
  defaultRankingConfig,
  formatCurrency,
  getPrizeMedal,
  getZoneColor,
  getDaysLeftInMonth
} from '../../lib/ranking-data-mock'

const categories = [
  { id: 'autoestima', name: 'Autoestima', icon: Heart, color: 'text-pink-500' },
  { id: 'rotina', name: 'Rotina', icon: Home, color: 'text-green-500' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Brain, color: 'text-purple-500' },
  { id: 'corpo_saude', name: 'Corpo & Saúde', icon: Dumbbell, color: 'text-emerald-500' },
  { id: 'relacionamentos', name: 'Relacionamentos', icon: MessageCircle, color: 'text-rose-500' },
  { id: 'carreira', name: 'Carreira', icon: Briefcase, color: 'text-blue-500' },
  { id: 'digital_detox', name: 'Digital Detox', icon: Smartphone, color: 'text-red-500' }
]

export function RankingSection() {
  const [users, setUsers] = useState<RankingUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<RankingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [showUserDetail, setShowUserDetail] = useState<string | null>(null)
  const [config] = useState(defaultRankingConfig)

  const usersPerPage = 20

  // Carregar dados iniciais
  useEffect(() => {
    const mockUsers = generateMockRankingUsers()
    const rankedUsers = calculateRankingPosition(mockUsers)
    setUsers(rankedUsers)
    setFilteredUsers(rankedUsers)
  }, [])

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      simulateRealTimeUpdate()
    }, 30000)

    return () => clearInterval(interval)
  }, [isAutoRefresh, users])

  // Filtrar usuárias
  useEffect(() => {
    let filtered = [...users]

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por categoria favorita
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(user => user.favorite_category === selectedCategory)
    }

    // Filtro por período (simular atividade)
    if (selectedPeriod !== 'all') {
      const now = new Date()
      const cutoff = new Date()
      
      switch (selectedPeriod) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(user => new Date(user.last_activity) >= cutoff)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, searchTerm, selectedCategory, selectedPeriod])

  // Simular atualização em tempo real
  const simulateRealTimeUpdate = () => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => {
        // 20% de chance de uma usuária ganhar pontos
        if (Math.random() < 0.2) {
          const pointsGained = Math.floor(Math.random() * 100) + 10
          return {
            ...user,
            points: user.points + pointsGained,
            last_activity: new Date().toISOString(),
            completed_challenges: user.completed_challenges + Math.floor(Math.random() * 3) + 1
          }
        }
        return user
      })

      // Reordenar e atualizar posições
      const sortedUsers = updatedUsers
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          previousPosition: user.position,
          position: index + 1
        }))

      return sortedUsers
    })
    
    setLastUpdate(new Date())
  }

  // Calcular estatísticas
  const getStats = (): RankingStats => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    return {
      total_users: users.length,
      active_today: users.filter(user => user.last_activity.startsWith(today)).length,
      average_points: Math.floor(users.reduce((sum, user) => sum + user.points, 0) / users.length),
      top_performer_growth: Math.max(...users.map(user => user.weekly_growth)),
      total_points_distributed: users.reduce((sum, user) => sum + user.points, 0),
      new_users_this_week: users.filter(user => {
        const joinDate = new Date(user.join_date)
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return joinDate >= weekAgo
      }).length
    }
  }

  const stats = getStats()
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const getPositionChange = (user: RankingUser) => {
    const change = user.previousPosition - user.position
    if (change > 0) return { type: 'up', value: change }
    if (change < 0) return { type: 'down', value: Math.abs(change) }
    return { type: 'same', value: 0 }
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (position === 3) return <Award className="w-5 h-5 text-orange-500" />
    return <span className="text-sm font-bold text-zayia-violet-gray">#{position}</span>
  }

  const getLevelIcon = (level: number) => {
    if (level >= 15) return <Crown className="w-4 h-4 text-purple-500" />
    if (level >= 10) return <Star className="w-4 h-4 text-yellow-500" />
    if (level >= 5) return <Zap className="w-4 h-4 text-blue-500" />
    return <Target className="w-4 h-4 text-gray-500" />
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return <Heart className="w-4 h-4 text-gray-400" />

    const Icon = category.icon
    return <Icon className={`w-4 h-4 ${category.color}`} />
  }

  const handleManualRefresh = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const mockUsers = generateMockRankingUsers()
    const rankedUsers = calculateRankingPosition(mockUsers)
    setUsers(rankedUsers)
    setFilteredUsers(rankedUsers)
    setLastUpdate(new Date())
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="zayia-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              🏆 Ranking de Usuárias (com Prêmios)
            </h2>
            <p className="text-zayia-violet-gray text-sm">
              {getDaysLeftInMonth()} dias restantes | Top 3 ganha prêmios · Desempate por 1º desafio de hoje
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-zayia-violet-gray">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
        </div>

        {/* Estatísticas Gerais com Prêmios */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Users className="w-6 h-6 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">{users.length}</div>
            <div className="text-xs text-zayia-violet-gray">Total Usuárias</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Zap className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">{users.filter(u => u.completed_today > 0).length}</div>
            <div className="text-xs text-zayia-violet-gray">Ativas Hoje</div>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-xl border-2 border-yellow-300">
            <DollarSign className="w-6 h-6 text-yellow-700 mx-auto mb-2" />
            <div className="text-xl font-bold text-yellow-700">
              {formatCurrency(config.first_place_prize + config.second_place_prize + config.third_place_prize)}
            </div>
            <div className="text-xs text-yellow-600">Prêmios este mês</div>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-xl border-2 border-blue-300">
            <Clock3 className="w-6 h-6 text-blue-700 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-700">{getDaysLeftInMonth()}</div>
            <div className="text-xs text-blue-600">Dias restantes</div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="zayia-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="zayia-input w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Filtro por Período */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
          >
            <option value="all">Todos os Tempos</option>
            <option value="today">Ativas Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
          </select>

          {/* Filtro por Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Toggle Auto-refresh */}
          <label className="flex items-center gap-2 px-4 py-3 bg-zayia-lilac/20 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isAutoRefresh}
              onChange={(e) => setIsAutoRefresh(e.target.checked)}
              className="rounded border-zayia-lilac"
            />
            <span className="text-sm font-medium text-zayia-deep-violet">Auto-refresh</span>
          </label>
        </div>

        {/* Resultados da busca */}
        <div className="mt-4 flex items-center justify-between text-sm text-zayia-violet-gray">
          <span>
            Mostrando {filteredUsers.length} de {users.length} usuárias
            {searchTerm && ` para "${searchTerm}"`}
          </span>
          <span>
            Página {currentPage} de {totalPages}
          </span>
        </div>
      </div>

      {/* Top 3 Destaque com PRÊMIOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.slice(0, 3).map((user, index) => {
          const medalColor = [
            'from-yellow-400 to-orange-500 border-yellow-300',
            'from-gray-300 to-gray-400 border-gray-300',
            'from-orange-400 to-red-500 border-orange-300'
          ][index]

          const bgColor = [
            'from-yellow-50 to-orange-50',
            'from-gray-50 to-slate-50',
            'from-orange-50 to-red-50'
          ][index]

          const prizeAmount = [config.first_place_prize, config.second_place_prize, config.third_place_prize][index]

          return (
            <div
              key={user.id}
              className={`zayia-card p-6 text-center cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br ${bgColor} border-2 ${medalColor}`}
              onClick={() => setShowUserDetail(user.id)}
            >
              <div className="relative mb-4">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                  }}
                />
                <div className="absolute -top-2 -right-2 text-3xl">
                  {getPrizeMedal(user.position)}
                </div>
              </div>

              <h3 className="text-lg font-bold text-zayia-deep-violet mb-1">{user.name}</h3>
              <p className="text-sm text-zayia-violet-gray mb-3">{user.email}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Pontos:</span>
                  <span className="font-bold text-zayia-soft-purple">{user.points.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hoje:</span>
                  <span className="font-bold text-zayia-lavender">{user.completed_today}/4 desafios</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>1º Desafio:</span>
                  <span className="text-xs text-zayia-violet-gray">
                    {new Date(user.firstChallengeTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* PRÊMIO */}
              <div className="bg-white/60 p-3 rounded-lg border-2 border-green-400 mb-3">
                <div className="text-green-600 font-bold text-sm">Prêmio</div>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(prizeAmount)}</div>
                <div className="text-xs text-green-600">Status: {user.prizeStatus || 'Pendente'}</div>
              </div>

              <button className="w-full bg-zayia-lilac text-zayia-deep-violet px-3 py-2 rounded-lg font-medium hover:bg-zayia-lavender transition text-sm">
                Gerenciar Prêmio →
              </button>
            </div>
          )
        })}
      </div>

      {/* Lista Principal do Ranking com ZONAS */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-zayia-deep-violet">
            Ranking Completo (com Zonas de Prêmio)
          </h3>
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded">
              <span className="text-lg">🥇</span>
              <span className="text-yellow-800">Prêmio</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded">
              <span className="text-lg">⚠️</span>
              <span className="text-blue-800">Atenção</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
              <span className="text-lg">➖</span>
              <span className="text-gray-800">Neutra</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-zayia-violet-gray">Atualizando ranking...</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedUsers.map((user) => {
                const positionChange = getPositionChange(user)
                const category = categories.find(c => c.id === user.favorite_category)
                const zoneClass = user.zone === 'prize'
                  ? 'bg-yellow-50 border-yellow-300 hover:border-yellow-400'
                  : user.zone === 'attention'
                  ? 'bg-blue-50 border-blue-300 hover:border-blue-400'
                  : 'bg-white border-gray-200 hover:border-gray-300'

                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${zoneClass}`}
                    onClick={() => setShowUserDetail(user.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Posição e Avatar */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                            user.position <= 3 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                              : 'bg-zayia-lilac/30 text-zayia-deep-violet'
                          }`}>
                            {user.position <= 3 ? getPositionIcon(user.position) : `#${user.position}`}
                          </div>
                          
                          {/* Indicador de mudança */}
                          {positionChange.type !== 'same' && (
                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                              positionChange.type === 'up' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {positionChange.type === 'up' ? (
                                <ChevronUp className="w-3 h-3 text-white" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-12 h-12 rounded-full border-2 border-zayia-lilac/40"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                          }}
                        />
                      </div>

                      {/* Informações da Usuária + DESEMPATE */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-zayia-deep-violet truncate">{user.name}</h4>
                          {user.zone === 'prize' && <span className="text-lg">🥇</span>}
                          {user.zone === 'attention' && <span className="text-lg">⚠️</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zayia-violet-gray">
                          <span>{user.email}</span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="w-3 h-3" />
                            {new Date(user.firstChallengeTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="font-medium">
                            {user.completed_today}/4
                          </span>
                        </div>
                      </div>

                      {/* Estatísticas compactas */}
                      <div className="hidden md:flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-zayia-deep-violet">{user.points.toLocaleString()}</div>
                          <div className="text-xs text-zayia-violet-gray">pts</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-zayia-lavender">{user.badges_count}</div>
                          <div className="text-xs text-zayia-violet-gray">badges</div>
                        </div>
                        <div>
                          {user.zone === 'prize' && (
                            <div className="text-center px-2 py-1 bg-yellow-100 rounded">
                              <div className="text-sm font-bold text-yellow-800">{formatCurrency(user.prizeAmount || 0)}</div>
                              <div className="text-xs text-yellow-600">Prêmio</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medalhas Recentes (Mobile) */}
                    {user.recent_badges.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zayia-lilac/30 md:hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zayia-violet-gray">Medalhas recentes:</span>
                          <div className="flex gap-1">
                            {user.recent_badges.slice(0, 3).map((badge, idx) => (
                              <span key={idx} className="text-sm" title={badge.name}>
                                {badge.icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-zayia-lilac/20 text-zayia-deep-violet disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zayia-lilac/40 transition-colors"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-zayia-sunset text-white'
                              : 'bg-zayia-lilac/20 text-zayia-deep-violet hover:bg-zayia-lilac/40'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-zayia-lilac/20 text-zayia-deep-violet disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zayia-lilac/40 transition-colors"
                  >
                    Próxima →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Insights e Tendências */}
      <div className="grid grid-cols-1 gap-6">
        {/* Maiores Crescimentos */}
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
            📈 Maiores Crescimentos da Semana
          </h3>
          <div className="space-y-3">
            {users
              .filter(user => user.weekly_growth > 0)
              .sort((a, b) => b.weekly_growth - a.weekly_growth)
              .slice(0, 5)
              .map((user, index) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">#{index + 1}</div>
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-green-800">{user.name}</div>
                    <div className="text-sm text-green-600">Posição #{user.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{user.weekly_growth}%</div>
                    <div className="text-xs text-green-500">esta semana</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes da Usuária */}
      {showUserDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const user = users.find(u => u.id === showUserDetail)
              if (!user) return null

              const positionChange = getPositionChange(user)
              const category = categories.find(c => c.id === user.favorite_category)

              return (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-zayia-deep-violet">Detalhes da Usuária</h3>
                    <button
                      onClick={() => setShowUserDetail(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Header da Usuária */}
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-24 h-24 rounded-full border-4 border-zayia-lilac/40"
                        />
                        <div className="absolute -top-2 -right-2">
                          {getPositionIcon(user.position)}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-zayia-deep-violet mb-1">{user.name}</h4>
                      <p className="text-zayia-violet-gray mb-2">{user.email}</p>
                      
                      {positionChange.type !== 'same' && (
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                          positionChange.type === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {positionChange.type === 'up' ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Subiu {positionChange.value} posições
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Desceu {positionChange.value} posições
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Estatísticas Detalhadas */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
                        <div className="text-2xl font-bold text-zayia-deep-violet">{user.points.toLocaleString()}</div>
                        <div className="text-sm text-zayia-violet-gray">Pontos Totais</div>
                      </div>
                      <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
                        <div className="text-2xl font-bold text-zayia-soft-purple">{user.level}</div>
                        <div className="text-sm text-zayia-violet-gray">Nível Atual</div>
                      </div>
                      <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
                        <div className="text-2xl font-bold text-zayia-lavender">{user.streak}</div>
                        <div className="text-sm text-zayia-violet-gray">Dias Seguidos</div>
                      </div>
                      <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
                        <div className="text-2xl font-bold text-zayia-orchid">{user.badges_count}</div>
                        <div className="text-sm text-zayia-violet-gray">Medalhas</div>
                      </div>
                    </div>

                    {/* Crescimento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zayia-lilac/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-zayia-deep-violet">Crescimento Semanal</span>
                          <span className={`font-bold ${user.weekly_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {user.weekly_growth >= 0 ? '+' : ''}{user.weekly_growth}%
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${user.weekly_growth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(user.weekly_growth) * 2)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-zayia-lilac/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-zayia-deep-violet">Crescimento Mensal</span>
                          <span className={`font-bold ${user.monthly_growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {user.monthly_growth >= 0 ? '+' : ''}{user.monthly_growth}%
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${user.monthly_growth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(user.monthly_growth) * 1.5)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Medalhas Recentes */}
                    {user.recent_badges.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-zayia-deep-violet mb-3">Medalhas Recentes</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {user.recent_badges.map((badge) => (
                            <div key={badge.id} className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-center">
                              <div className="text-2xl mb-1">{badge.icon}</div>
                              <div className="font-medium text-yellow-800 text-sm">{badge.name}</div>
                              <div className="text-xs text-yellow-600">
                                {new Date(badge.earned_at).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informações Adicionais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zayia-violet-gray">Categoria Favorita:</span>
                        <div className="flex items-center gap-2 mt-1">
                          {getCategoryIcon(user.favorite_category)}
                          <span className="font-medium text-zayia-deep-violet">{category?.name || 'Geral'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-zayia-violet-gray">Última Atividade:</span>
                        <div className="font-medium text-zayia-deep-violet mt-1">
                          {new Date(user.last_activity).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <span className="text-zayia-violet-gray">Membro desde:</span>
                        <div className="font-medium text-zayia-deep-violet mt-1">
                          {new Date(user.join_date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <span className="text-zayia-violet-gray">Total de Sessões:</span>
                        <div className="font-medium text-zayia-deep-violet mt-1">
                          {user.total_sessions} sessões
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Indicador de Tempo Real */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-zayia-violet-gray bg-zayia-lilac/20 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Sistema de ranking em tempo real ativo
          {isAutoRefresh && <span>• Auto-refresh ativado</span>}
        </div>
      </div>
    </div>
  )
}