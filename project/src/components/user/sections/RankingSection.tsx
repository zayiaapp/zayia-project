import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Star,
  Flame,
  Target
} from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'

interface RankingUser {
  id: string
  position: number
  previousPosition: number
  name: string
  avatar_url: string
  points: number
  level: number
  streak: number
  isCurrentUser?: boolean
}

export function RankingSection() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<RankingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Gerar dados mock do ranking
  const generateMockRanking = (): RankingUser[] => {
    const mockUsers: RankingUser[] = []
    const names = [
      'Ana Silva', 'Maria Santos', 'Julia Costa', 'Beatriz Oliveira', 'Camila Souza',
      'Fernanda Lima', 'Gabriela Alves', 'Helena Rodrigues', 'Isabella Ferreira', 'Larissa Martins',
      'Letícia Pereira', 'Mariana Carvalho', 'Natália Ribeiro', 'Patrícia Gomes', 'Rafaela Barbosa',
      'Sabrina Dias', 'Tatiana Moreira', 'Vanessa Castro', 'Yasmin Araújo', 'Adriana Nascimento'
    ]

    for (let i = 0; i < 20; i++) {
      const points = Math.max(0, Math.floor(Math.random() * 5000) + (20 - i) * 100)
      const level = Math.min(20, Math.floor(points / 200) + 1)
      const streak = Math.floor(Math.random() * 50)
      
      mockUsers.push({
        id: `user-${i + 1}`,
        position: i + 1,
        previousPosition: i + 1 + Math.floor(Math.random() * 6) - 3,
        name: names[i] || `Usuária ${i + 1}`,
        avatar_url: `https://images.pexels.com/photos/${3756679 + (i * 123) % 1000}/pexels-photo-${3756679 + (i * 123) % 1000}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
        points,
        level,
        streak,
        isCurrentUser: i === 4 // Simular que usuária atual está na 5ª posição
      })
    }

    return mockUsers
  }

  useEffect(() => {
    loadRanking()
    
    // Atualizar ranking a cada 30 segundos
    const interval = setInterval(() => {
      updateRanking()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadRanking = async () => {
    setLoading(true)
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUsers(generateMockRanking())
    setLoading(false)
  }

  const updateRanking = () => {
    setUsers(prevUsers => {
      // Simular pequenas mudanças no ranking
      const updatedUsers = prevUsers.map(user => {
        if (Math.random() < 0.3) { // 30% chance de mudança
          const pointsChange = Math.floor(Math.random() * 50) - 10
          return {
            ...user,
            points: Math.max(0, user.points + pointsChange)
          }
        }
        return user
      })

      // Reordenar por pontos
      return updatedUsers
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          previousPosition: user.position,
          position: index + 1
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

  const currentUser = users.find(user => user.isCurrentUser)

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

      {/* Sua Posição (Destaque) */}
      {currentUser && (
        <div className="zayia-card p-6 bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30 border-2 border-zayia-soft-purple">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-zayia-deep-violet mb-1">SUA POSIÇÃO</div>
            <div className="text-3xl font-bold text-zayia-soft-purple">#{currentUser.position}</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                }}
              />
              {getPositionIcon(currentUser.position) && (
                <div className="absolute -top-2 -right-2">
                  {getPositionIcon(currentUser.position)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-zayia-deep-violet">{currentUser.name}</h3>
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div className="text-center">
                  <div className="font-bold text-zayia-soft-purple">{currentUser.points.toLocaleString()}</div>
                  <div className="text-xs text-zayia-violet-gray">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zayia-lavender">{currentUser.level}</div>
                  <div className="text-xs text-zayia-violet-gray">Nível</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-zayia-orchid">{currentUser.streak}</div>
                  <div className="text-xs text-zayia-violet-gray">Sequência</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mudança de Posição */}
          {(() => {
            const change = getPositionChange(currentUser)
            if (change.type !== 'same') {
              return (
                <div className={`mt-4 p-2 rounded-lg text-center ${
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