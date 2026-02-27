import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import {
  Trophy,
  Crown,
  Medal,
  Award,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Star,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import {
  RankingUser,
  defaultRankingConfig,
  formatCurrency,
  getPrizeMedal,
  getPrizeAmount
} from '../../../lib/ranking-data-mock'

export function RankingSection() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<RankingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [showPrizeNotif, setShowPrizeNotif] = useState(false)
  const [config] = useState(defaultRankingConfig)

  // Encontrar índice da usuária atual no ranking
  const currentUserIndex = users.findIndex(u => u.id === profile?.id || u.isCurrentUser)

  useEffect(() => {
    loadRanking()

    // Atualizar ranking a cada 30 segundos
    const interval = setInterval(() => {
      updateRanking()
    }, 30000)

    // ✅ Listener para atualizar ranking quando pontos mudam (em tempo real)
    const handlePointsUpdated = () => {
      console.log('📈 Ranking atualizado - pontos mudaram')
      updateRanking()
    }

    window.addEventListener('pointsUpdated', handlePointsUpdated)

    return () => {
      clearInterval(interval)
      window.removeEventListener('pointsUpdated', handlePointsUpdated)
    }
  }, [profile?.points])

  const loadRanking = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    updateRanking()
    setLoading(false)
  }

  const updateRanking = () => {
    const now = new Date()

    // 1. Dados dos outros usuários (mock - não mudar)
    const otherUsers: RankingUser[] = [
      {
        id: '1',
        name: 'Ana Silva',
        email: 'ana@exemplo.com',
        points: 5000,
        avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 7,
        streak: 67,
        completed_today: 4,
        badges_count: 15,
        completed_challenges: 45,
        firstChallengeTime: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        last_activity: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        weekly_growth: 12,
        monthly_growth: 45,
        favorite_category: 'autoestima',
        total_sessions: 30,
        join_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        position: 1,
        previousPosition: 1,
        positionChange: 'same',
        recent_badges: [],
        zone: 'prize',
        isPrizeWinner: true,
        prizePosition: 1,
        prizeAmount: 500,
        prizeStatus: 'pending'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        points: 4200,
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 6,
        streak: 50,
        completed_today: 3,
        badges_count: 12,
        completed_challenges: 40,
        firstChallengeTime: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        last_activity: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        weekly_growth: 8,
        monthly_growth: 35,
        favorite_category: 'mindfulness',
        total_sessions: 28,
        join_date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        position: 2,
        previousPosition: 2,
        positionChange: 'same',
        recent_badges: [],
        zone: 'prize',
        isPrizeWinner: true,
        prizePosition: 2,
        prizeAmount: 300,
        prizeStatus: 'pending'
      },
      {
        id: '3',
        name: 'Julia Costa',
        email: 'julia@exemplo.com',
        points: 3800,
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 5,
        streak: 45,
        completed_today: 2,
        badges_count: 10,
        completed_challenges: 35,
        firstChallengeTime: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        last_activity: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        weekly_growth: 5,
        monthly_growth: 28,
        favorite_category: 'corpo_saude',
        total_sessions: 25,
        join_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        position: 3,
        previousPosition: 3,
        positionChange: 'same',
        recent_badges: [],
        zone: 'prize',
        isPrizeWinner: true,
        prizePosition: 3,
        prizeAmount: 100,
        prizeStatus: 'pending'
      },
      {
        id: '4',
        name: 'Carolina Dias',
        email: 'carolina@exemplo.com',
        points: 3200,
        avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 5,
        streak: 30,
        completed_today: 2,
        badges_count: 8,
        completed_challenges: 30,
        firstChallengeTime: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
        last_activity: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        weekly_growth: 3,
        monthly_growth: 20,
        favorite_category: 'relacionamentos',
        total_sessions: 20,
        join_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        position: 4,
        previousPosition: 4,
        positionChange: 'same',
        recent_badges: [],
        zone: 'attention'
      },
      {
        id: '6',
        name: 'Beatriz Lima',
        email: 'beatriz@exemplo.com',
        points: 2100,
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 3,
        streak: 20,
        completed_today: 1,
        badges_count: 5,
        completed_challenges: 20,
        firstChallengeTime: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        last_activity: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        weekly_growth: 1,
        monthly_growth: 15,
        favorite_category: 'carreira',
        total_sessions: 15,
        join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        position: 5,
        previousPosition: 5,
        positionChange: 'same',
        recent_badges: [],
        zone: 'neutral'
      },
      {
        id: '7',
        name: 'Fernanda Oliveira',
        email: 'fernanda@exemplo.com',
        points: 1800,
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 3,
        streak: 15,
        completed_today: 1,
        badges_count: 4,
        completed_challenges: 15,
        firstChallengeTime: new Date(now.getTime() - 9 * 60 * 60 * 1000).toISOString(),
        last_activity: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        weekly_growth: 0,
        monthly_growth: 10,
        favorite_category: 'digital_detox',
        total_sessions: 12,
        join_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        position: 6,
        previousPosition: 6,
        positionChange: 'same',
        recent_badges: [],
        zone: 'neutral'
      }
    ]

    // 2. ✅ NOVO: Pegar dados REAIS do usuário logado
    const userPoints = profile?.points || parseInt(localStorage.getItem('user_points') || '0', 10)
    const currentUserData: RankingUser = {
      id: profile?.id || 'current-user',
      name: profile?.full_name || 'Você',
      email: profile?.email || 'user@zayia.com',
      points: userPoints,
      avatar_url: profile?.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      level: profile?.level || 1,
      streak: profile?.streak || 0,
      completed_today: 0,
      badges_count: 0,
      completed_challenges: profile?.completed_challenges || 0,
      firstChallengeTime: now.toISOString(),
      last_activity: now.toISOString(),
      weekly_growth: 0,
      monthly_growth: 0,
      favorite_category: 'autoestima',
      total_sessions: 0,
      join_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      position: 0,
      previousPosition: 0,
      positionChange: 'same',
      recent_badges: [],
      isCurrentUser: true
    }

    // 3. Combinar: outros usuários + usuário atual
    const allUsers = [...otherUsers, currentUserData]

    // 4. Ordenar por pontos (descendente) e calcular posições
    const sortedUsers: RankingUser[] = allUsers
      .sort((a, b) => b.points - a.points)
      .map((user, index) => {
        const previousPos = user.position || index + 1
        const newPos = index + 1
        const change: 'up' | 'down' | 'same' = previousPos > newPos ? 'up' : previousPos < newPos ? 'down' : 'same'
        return {
          ...user,
          previousPosition: previousPos,
          position: newPos,
          positionChange: change
        }
      })

    // 5. Encontrar índice do usuário atual
    const userIndex = sortedUsers.findIndex(u => u.id === currentUserData.id)

    // 6. Atualizar state
    setUsers(sortedUsers)
    setLastUpdate(new Date())

    // 7. Log para debug
    console.log('📈 Ranking atualizado:', {
      userName: currentUserData.name,
      userPoints: currentUserData.points,
      position: userIndex !== -1 ? userIndex + 1 : 'N/A',
      totalUsers: sortedUsers.length,
      allRanking: sortedUsers.map(u => `${u.position}. ${u.name} (${u.points} pts)`).join(' | ')
    })

    // 8. Mostrar notificação se em top 3
    if (userIndex !== -1 && sortedUsers[userIndex].position <= 3) {
      setShowPrizeNotif(true)
      setTimeout(() => setShowPrizeNotif(false), 5000)
    }
  }

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
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do Ranking */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-zayia-orchid to-zayia-amethyst rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Ranking ZAYIA 🏆
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Sua posição entre as guerreiras da transformação
        </p>
      </div>

      {/* NOTIFICAÇÃO DE PRÊMIO */}
      {showPrizeNotif && users[currentUserIndex] && users[currentUserIndex].position <= 3 && (
        <div className={`zayia-card p-4 text-center border-2 ${
          users[currentUserIndex].position === 1
            ? 'bg-yellow-50 border-yellow-400'
            : users[currentUserIndex].position === 2
            ? 'bg-gray-100 border-gray-400'
            : 'bg-orange-50 border-orange-400'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
            <span className="text-lg font-bold text-purple-700">Parabéns! 🎉</span>
          </div>
          <p className="text-sm font-semibold text-zayia-deep-violet mb-1">
            Você está em {users[currentUserIndex].position}º lugar!
          </p>
          <p className="text-sm font-bold text-green-600">
            Prêmio garantido: {formatCurrency(getPrizeAmount(users[currentUserIndex].position, config))}
          </p>
        </div>
      )}

      {/* Sua Posição (Destaque com PRÊMIOS) */}
      {users[currentUserIndex] && (
        <div className={`zayia-card p-6 bg-gradient-to-r border-2 ${
          users[currentUserIndex].position <= 3
            ? 'from-yellow-50 to-orange-50 border-yellow-400'
            : 'from-zayia-lilac/30 to-zayia-lavender/30 border-zayia-soft-purple'
        }`}>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-sm font-medium text-zayia-deep-violet">SUA POSIÇÃO</span>
              {users[currentUserIndex].position <= 3 && (
                <span className="text-2xl">{getPrizeMedal(users[currentUserIndex].position)}</span>
              )}
            </div>
            <div className="text-3xl font-bold text-zayia-soft-purple">#{users[currentUserIndex].position}</div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img
                src={users[currentUserIndex].avatar_url}
                alt={users[currentUserIndex].name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                }}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-zayia-deep-violet">{users[currentUserIndex].name}</h3>
              <p className="text-sm text-zayia-violet-gray mt-2">
                {users[currentUserIndex].points.toLocaleString()} pontos • Nível {users[currentUserIndex].level}
              </p>
            </div>
          </div>

          {/* PRÊMIO */}
          {users[currentUserIndex].position <= 3 && (
            <div className="bg-white/80 p-3 rounded-lg border-2 border-green-400 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-green-700">Prêmio Garantido</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(getPrizeAmount(users[currentUserIndex].position, config))}
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          )}

          {/* Mudança de Posição */}
          {(() => {
            const change = getPositionChange(users[currentUserIndex])
            if (change.type !== 'same') {
              return (
                <div className={`p-2 rounded-lg text-center ${
                  change.type === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <div className="flex items-center justify-center gap-1 text-sm font-bold">
                    {change.type === 'up' ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Subiu {change.value} posições!
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Desceu {change.value} posições
                      </>
                    )}
                  </div>
                </div>
              )
            }
            return null
          })()}
        </div>
      )}

      {/* Top 3 */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Top 3 Guerreiras
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {users.slice(0, 3).map((user, index) => (
            <div key={user.id} className="text-center">
              <div className="relative mb-3">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className={`w-16 h-16 rounded-full mx-auto border-4 ${
                    index === 0 ? 'border-yellow-400' :
                    index === 1 ? 'border-gray-400' :
                    'border-orange-400'
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                  }}
                />
                <div className="absolute -top-2 -right-2">
                  {getPositionIcon(user.position)}
                </div>
              </div>
              <div className="text-sm font-bold text-zayia-deep-violet truncate">
                {user.name.split(' ')[0]}
              </div>
              <div className="text-xs text-zayia-violet-gray">
                {user.points.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista Completa */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zayia-deep-violet">
            Ranking Completo
          </h3>
          <button
            onClick={updateRanking}
            className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {users.map((user) => {
            const positionChange = getPositionChange(user)
            
            return (
              <div 
                key={user.id} 
                className={`p-4 rounded-xl border transition-all ${
                  user.isCurrentUser 
                    ? 'bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30 border-zayia-soft-purple' 
                    : 'bg-white border-zayia-lilac/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Posição */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.position <= 3 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                        : 'bg-zayia-lilac/30 text-zayia-deep-violet'
                    }`}>
                      {user.position <= 3 ? getPositionIcon(user.position) : `#${user.position}`}
                    </div>
                    
                    {/* Indicador de mudança */}
                    {positionChange.type !== 'same' && (
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                        positionChange.type === 'up' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {positionChange.type === 'up' ? (
                          <ChevronUp className="w-2 h-2 text-white" />
                        ) : (
                          <ChevronDown className="w-2 h-2 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Foto */}
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-zayia-lilac/40"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                    }}
                  />

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-zayia-deep-violet truncate">
                        {user.name}
                      </h4>
                      {user.isCurrentUser && (
                        <span className="px-2 py-1 bg-zayia-soft-purple text-white text-xs rounded-full">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zayia-violet-gray mt-1">
                      {user.points.toLocaleString()} pontos • Nível {user.level}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Última Atualização */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-zayia-violet-gray">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  )
}