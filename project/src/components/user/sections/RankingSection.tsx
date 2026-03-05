import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient, RankingUser, defaultRankingConfig, LEVELS } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
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
// Ranking data agora vem de Supabase via supabaseClient.getUserRankingByPoints()
// Tipos: RankingUser agora definido em supabase-client.ts
import { Badge } from '../../../lib/supabase-client'

// Helper functions (previously from ranking-data-mock)
const getPrizeMedal = (position: number): string => {
  switch (position) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return ''
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getPrizeAmount = (position: number): number => {
  switch (position) {
    case 1: return 500
    case 2: return 300
    case 3: return 150
    default: return 0
  }
}

export function RankingSection() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<RankingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [showPrizeNotif, setShowPrizeNotif] = useState(false)
  const [config] = useState(defaultRankingConfig)

  // Encontrar índice da usuária atual no ranking
  const currentUserIndex = users.findIndex(u => u.id === profile?.id || u.isCurrentUser)

  const calculateLevelFromPoints = (points: number): number => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].pointsRequired) return i
    }
    return 0
  }

  const loadRealRanking = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, points, streak, avatar_url, completed_challenges, created_at')
        .eq('role', 'user')
        .order('points', { ascending: false })
        .limit(50)

      if (error) throw error

      const now = new Date()
      const rankingUsers: RankingUser[] = (data || []).map((p, index) => ({
        id: p.id,
        name: p.full_name || 'Guerreira',
        email: p.email || '',
        points: p.points || 0,
        avatar_url: p.avatar_url || '',
        level: calculateLevelFromPoints(p.points || 0),
        streak: p.streak || 0,
        completed_today: 0,
        badges_count: 0,
        completed_challenges: p.completed_challenges || 0,
        firstChallengeTime: now.toISOString(),
        last_activity: now.toISOString(),
        weekly_growth: 0,
        monthly_growth: 0,
        favorite_category: '',
        total_sessions: 0,
        join_date: p.created_at || now.toISOString(),
        position: index + 1,
        previousPosition: index + 1,
        positionChange: 'same' as const,
        recent_badges: [],
        zone: index < 3 ? ('prize' as const) : ('neutral' as const),
        isPrizeWinner: index < 3,
        prizePosition: index < 3 ? (index + 1) as 1 | 2 | 3 : undefined,
        prizeAmount: index === 0 ? 500 : index === 1 ? 300 : index === 2 ? 100 : undefined,
        prizeStatus: index < 3 ? ('pending' as const) : undefined,
        isCurrentUser: p.id === profile?.id
      }))

      setUsers(rankingUsers)
      setLastUpdate(new Date())

      const currentIdx = rankingUsers.findIndex(u => u.isCurrentUser)
      if (currentIdx !== -1 && rankingUsers[currentIdx].position <= 3) {
        setShowPrizeNotif(true)
        setTimeout(() => setShowPrizeNotif(false), 5000)
      }
    } catch (error) {
      console.error('Error loading ranking:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!profile?.id) return

    loadRealRanking()

    const interval = setInterval(loadRealRanking, 30000)

    const rankingSubscription = supabase
      .channel('ranking-profiles')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, loadRealRanking)
      .subscribe()

    return () => {
      clearInterval(interval)
      rankingSubscription.unsubscribe()
    }
  }, [profile?.id])

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
            Prêmio garantido: {formatCurrency(getPrizeAmount(users[currentUserIndex].position))}
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
                    {formatCurrency(getPrizeAmount(users[currentUserIndex].position))}
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
            onClick={loadRealRanking}
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