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
  Flame,
  Target,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import {
  RankingUser,
  generateMockRankingUsers,
  calculateRankingPosition,
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

  // Índice da usuária atual no ranking (simulado como 5º lugar)
  const currentUserIndex = 4

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
  }, [])

  const loadRanking = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const mockUsers = generateMockRankingUsers()
    const rankedUsers = calculateRankingPosition(mockUsers)
    // Marcar usuária atual
    rankedUsers[currentUserIndex].isCurrentUser = true
    setUsers(rankedUsers)
    setLoading(false)

    // Mostrar notificação se em top 3
    if (rankedUsers[currentUserIndex].position <= 3) {
      setShowPrizeNotif(true)
      setTimeout(() => setShowPrizeNotif(false), 5000)
    }
  }

  const updateRanking = () => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => {
        if (Math.random() < 0.2) {
          const pointsChange = Math.floor(Math.random() * 50) + 10
          return {
            ...user,
            points: Math.max(0, user.points + pointsChange),
            completed_today: Math.min(4, user.completed_today + 1)
          }
        }
        return user
      })

      // Reordenar com desempate
      return calculateRankingPosition(updatedUsers).map((user, _index) => ({
        ...user,
        isCurrentUser: user.id === prevUsers[currentUserIndex].id
      }))
    })

    setLastUpdate(new Date())
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
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-zayia-soft-purple">{users[currentUserIndex].points.toLocaleString()}</div>
                  <div className="text-xs text-zayia-violet-gray">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zayia-lavender">{users[currentUserIndex].level}</div>
                  <div className="text-xs text-zayia-violet-gray">Nível</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zayia-orchid">{users[currentUserIndex].completed_today}/4</div>
                  <div className="text-xs text-zayia-violet-gray">Hoje</div>
                </div>
              </div>
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
                    <div className="flex items-center gap-3 text-xs text-zayia-violet-gray">
                      <span>Nível {user.level}</span>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>{user.streak} dias</span>
                      </div>
                    </div>
                  </div>

                  {/* Pontos */}
                  <div className="text-right">
                    <div className="font-bold text-zayia-soft-purple">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-zayia-violet-gray">pontos</div>
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

      {/* Estatísticas Pessoais */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
          Suas Estatísticas
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-zayia-lilac/20 rounded-xl">
            <Target className="w-6 h-6 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-lg font-bold text-zayia-deep-violet">{profile?.completed_challenges || 0}</div>
            <div className="text-xs text-zayia-violet-gray">Desafios</div>
          </div>
          <div className="text-center p-3 bg-zayia-lilac/20 rounded-xl">
            <Trophy className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-lg font-bold text-zayia-deep-violet">12</div>
            <div className="text-xs text-zayia-violet-gray">Medalhas</div>
          </div>
          <div className="text-center p-3 bg-zayia-lilac/20 rounded-xl">
            <Flame className="w-6 h-6 text-zayia-lavender mx-auto mb-2" />
            <div className="text-lg font-bold text-zayia-deep-violet">{profile?.streak || 0}</div>
            <div className="text-xs text-zayia-violet-gray">Sequência</div>
          </div>
        </div>
      </div>
    </div>
  )
}