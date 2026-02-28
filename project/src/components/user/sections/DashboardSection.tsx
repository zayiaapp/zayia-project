import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import {
  Target,
  Flame,
  Award,
  Crown,
  Gift
} from 'lucide-react'
import { getGreeting } from '../../../lib/utils'
import { getEarnedBadges } from '../../../lib/badges-storage'
import { BADGES, LEVELS } from '../../../lib/badges-data-mock'
import { getDailyCompletedCount, getFormattedToday, getDateKey } from '../../../lib/challenges-storage'

export function DashboardSection() {
  const { profile } = useAuth()
  const greeting = getGreeting()

  // ✅ State para Medalhas e Desafios Diários
  const [recentMedalsEarned, setRecentMedalsEarned] = useState<string[]>([])
  const [dailyChallengesCompleted, setDailyChallengesCompleted] = useState(0)

  // ✅ Carregar dados iniciais
  useEffect(() => {
    const earned = getEarnedBadges()
    setRecentMedalsEarned(earned)

    // Carregar contador de desafios de hoje
    setDailyChallengesCompleted(getDailyCompletedCount())
  }, [profile?.points])

  // ✅ Listener para atualizar quando pontos mudam (em tempo real)
  // O componente atualiza automaticamente via profile.points do AuthContext
  useEffect(() => {
    const handlePointsUpdated = () => {
      // Força re-render quando pontos mudam
      console.log('📊 Dashboard: Pontos foram atualizados')
    }

    window.addEventListener('pointsUpdated', handlePointsUpdated)
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdated)
  }, [])

  // ✅ Listener para atualizar quando medalhas mudam
  useEffect(() => {
    const handleMedalsUpdated = () => {
      const earned = getEarnedBadges()
      setRecentMedalsEarned(earned)
      console.log('🏆 Dashboard - medalhas atualizadas:', earned)
    }

    window.addEventListener('medalsUpdated', handleMedalsUpdated)
    return () => window.removeEventListener('medalsUpdated', handleMedalsUpdated)
  }, [])

  // ✅ Listener para atualizar quando desafios diários mudam
  useEffect(() => {
    const handleDailyProgressUpdated = () => {
      setDailyChallengesCompleted(getDailyCompletedCount())
    }

    window.addEventListener('dailyProgressUpdated', handleDailyProgressUpdated)
    return () => window.removeEventListener('dailyProgressUpdated', handleDailyProgressUpdated)
  }, [])

  // ✅ Listener para resetar quando muda de dia
  useEffect(() => {
    const checkNewDay = () => {
      const today = getDateKey()
      const lastDay = localStorage.getItem('last_tracked_day')
      if (lastDay !== today) {
        setDailyChallengesCompleted(0)
      }
    }

    // Verificar a cada minuto se mudou de dia (00:00)
    const interval = setInterval(checkNewDay, 60000)

    return () => clearInterval(interval)
  }, [])



  return (
    <div className="space-y-6">
      {/* Mensagem de Boas-vindas */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <div className="text-center">
          <div className="text-3xl mb-3">💜</div>
          <h2 className="text-xl font-bold zayia-gradient-text mb-2">
            {greeting}, {profile?.full_name?.split(' ')[0] || 'Guerreira'}!
          </h2>
          <p className="text-zayia-violet-gray text-sm">
            Que alegria ter você aqui! Pronta para mais um dia de transformação?
          </p>
        </div>
      </div>

      {/* Data Atual - CORREÇÃO 1: Remover emoji e centralizar */}
      <div className="flex items-center justify-center">
        <p className="text-sm text-zayia-deep-violet font-medium">
          Data: {getFormattedToday()}
        </p>
      </div>

      {/* Card de Nível e Progresso */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* ✅ Ícone dinâmico sincronizado com LEVELS - CORREÇÃO 2: Calcular nível baseado em pontos */}
            <div className="w-12 h-12 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full flex items-center justify-center">
              {(() => {
                // Calcular nível baseado em pontos reais (não usar profile.level)
                const calculateLevelFromPoints = (points: number): number => {
                  for (let i = LEVELS.length - 1; i >= 0; i--) {
                    if (points >= LEVELS[i].pointsRequired) {
                      return i
                    }
                  }
                  return 0
                }

                const userPoints = profile?.points || 0
                const currentLevel = calculateLevelFromPoints(userPoints)
                const levelIcon = LEVELS[currentLevel]?.icon
                if (levelIcon) {
                  const IconComponent = levelIcon
                  return <IconComponent />
                }
                return <Crown className="w-6 h-6 text-white" />
              })()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zayia-deep-violet">
                {(() => {
                  const calculateLevelFromPoints = (points: number): number => {
                    for (let i = LEVELS.length - 1; i >= 0; i--) {
                      if (points >= LEVELS[i].pointsRequired) {
                        return i
                      }
                    }
                    return 0
                  }
                  return `Nível ${calculateLevelFromPoints(profile?.points || 0)}`
                })()}
              </h3>
              <p className="text-sm text-zayia-violet-gray">Guerreira em Evolução</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-zayia-soft-purple">
              {profile?.points || 0}
            </div>
            <div className="text-xs text-zayia-violet-gray">pontos totais</div>
          </div>
        </div>

        {/* Barra de Progresso do Nível - CORREÇÃO 3: Cálculo correto com fórmula real */}
        {(() => {
          const calculateLevelFromPoints = (points: number): number => {
            for (let i = LEVELS.length - 1; i >= 0; i--) {
              if (points >= LEVELS[i].pointsRequired) {
                return i
              }
            }
            return 0
          }

          const userPoints = profile?.points || 0
          const currentLevel = calculateLevelFromPoints(userPoints)

          // Se atingiu o máximo, não mostrar barra
          if (currentLevel >= LEVELS.length - 1) {
            return null
          }

          const currentLevelThreshold = LEVELS[currentLevel].pointsRequired
          const nextLevelThreshold = LEVELS[currentLevel + 1].pointsRequired
          const pointsInCurrentLevel = userPoints - currentLevelThreshold
          const pointsNeededForNextLevel = nextLevelThreshold - currentLevelThreshold
          const progressPercent = Math.min(100, Math.max(0, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100))
          const pointsRemainingForNextLevel = Math.max(0, nextLevelThreshold - userPoints)

          return (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
                <span>Progresso para Nível {currentLevel + 1} ({LEVELS[currentLevel + 1].name})</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-zayia-lilac/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="text-xs text-zayia-violet-gray mt-1 text-center">
                Faltam {pointsRemainingForNextLevel} pontos para alcançar {LEVELS[currentLevel + 1].name}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Progresso de Hoje */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Progresso de Hoje
        </h3>

        <div className="space-y-4">
          {/* Desafios de Hoje */}
          <div className="flex items-center justify-between p-4 bg-zayia-lilac/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎯</div>
              <div>
                <p className="text-sm text-zayia-violet-gray">Desafios Completados</p>
                <p className="text-2xl font-bold text-zayia-deep-violet">
                  {dailyChallengesCompleted}/4
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zayia-violet-gray">Hoje</p>
              <p className="text-lg font-bold text-zayia-soft-purple">
                {dailyChallengesCompleted === 4 ? '✅ COMPLETO!' : `${4 - dailyChallengesCompleted} faltam`}
              </p>
            </div>
          </div>

          {/* Dias Seguidos */}
          <div className="flex items-center justify-between p-4 bg-zayia-lilac/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div>
                <p className="text-sm text-zayia-violet-gray">Dias Seguidos</p>
                <p className="text-2xl font-bold text-zayia-deep-violet">
                  {profile?.streak || 0}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zayia-violet-gray">Sequência</p>
              <p className="text-lg font-bold text-orange-500">
                🔥 Mantendo!
              </p>
            </div>
          </div>

          {/* Barra de Progresso do Dia */}
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-zayia-violet-gray">Progresso do dia</span>
              <span className="font-bold text-zayia-soft-purple">{Math.round((dailyChallengesCompleted / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-zayia-lilac/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all"
                style={{ width: `${(dailyChallengesCompleted / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CORREÇÃO 4 & 5: Próximos Níveis com lógica corrigida */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Próximos Níveis
        </h3>

        {/* CORREÇÃO 5: Mostrar próximos 3 níveis corretamente */}
        {(() => {
          const calculateLevelFromPoints = (points: number): number => {
            for (let i = LEVELS.length - 1; i >= 0; i--) {
              if (points >= LEVELS[i].pointsRequired) {
                return i
              }
            }
            return 0
          }

          const userPoints = profile?.points || 0
          const currentLevel = calculateLevelFromPoints(userPoints)

          // Próximos 3 níveis
          const nextThreeLevels = []
          for (let i = currentLevel + 1; i < Math.min(currentLevel + 4, LEVELS.length); i++) {
            nextThreeLevels.push(LEVELS[i])
          }

          return nextThreeLevels.length > 0 ? (
            <div className="space-y-3">
              {nextThreeLevels.map((level) => {
                const pointsRemainingForThisLevel = Math.max(0, level.pointsRequired - userPoints)

                return (
                  <div key={level.level} className="p-4 border-2 border-zayia-lilac/30 rounded-lg">
                    <div className="flex items-center justify-between gap-4">
                      {/* Ícone do Nível */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-zayia-lilac/20 to-zayia-soft-purple/20 flex items-center justify-center">
                        {level.icon ? (
                          (() => {
                            const IconComponent = level.icon
                            return <IconComponent />
                          })()
                        ) : (
                          <div>📍</div>
                        )}
                      </div>

                      {/* Informações do Nível */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-zayia-deep-violet">
                          Nível {level.level}: {level.name}
                        </h4>
                        <p className="text-xs text-zayia-violet-gray">
                          {pointsRemainingForThisLevel} pontos restantes
                        </p>
                      </div>

                      {/* Badge de progresso */}
                      <div className="text-2xl">🎯</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-2xl mb-2">🏆</p>
              <p className="text-zayia-deep-violet font-semibold">
                Você atingiu o máximo!
              </p>
              <p className="text-sm text-zayia-violet-gray mt-1">
                Parabéns, Suprema! Você é uma lenda!
              </p>
            </div>
          )
        })()}
      </div>

      {/* ✅ ATUALIZADO: Medalhas Conquistadas com dados reais */}
      {recentMedalsEarned.length > 0 && (
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Medalhas Conquistadas ({recentMedalsEarned.length})
          </h3>

          <div className="flex justify-center items-center gap-4 flex-wrap">
            {recentMedalsEarned.slice(0, 8).map((medalId) => {
              const medal = BADGES.find(b => b.id === medalId)
              if (!medal) return null

              return (
                <div
                  key={medalId}
                  className="w-24 h-24 flex flex-col items-center justify-center p-4 rounded-lg text-center transition-transform hover:scale-105"
                  style={{
                    backgroundColor: `${medal.color}20`,
                    border: `2px solid ${medal.color}`
                  }}
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-1">
                    {(() => {
                      const IconComponent = medal.icon
                      return <IconComponent />
                    })()}
                  </div>
                  <h4 className="font-semibold text-xs text-zayia-deep-violet line-clamp-1">
                    {medal.name}
                  </h4>
                </div>
              )
            })}
          </div>

          {recentMedalsEarned.length > 8 && (
            <div className="text-center mt-4">
              <a href="/medalhas" className="text-zayia-soft-purple font-semibold hover:underline">
                Ver todas ({recentMedalsEarned.length}) →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Motivação do Dia */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-cream to-zayia-lilac/20">
        <div className="text-center">
          <Gift className="w-8 h-8 text-zayia-orchid mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">
            Frase do Dia ✨
          </h3>
          <p className="text-sm text-zayia-deep-violet italic">
            "Cada pequeno passo que você dá hoje é uma vitória que merece ser celebrada. 
            Você é mais forte do que imagina!"
          </p>
        </div>
      </div>
    </div>
  )
}