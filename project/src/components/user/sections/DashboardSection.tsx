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
import { getNextMilestones } from '../../../lib/medals-unlock'
import { getEarnedBadges } from '../../../lib/badges-storage'
import { BADGES, LEVELS } from '../../../lib/badges-data-mock'
import { getDailyCompletedCount, getFormattedToday, getDateKey } from '../../../lib/challenges-storage'

export function DashboardSection() {
  const { profile } = useAuth()
  const greeting = getGreeting()

  // ✅ State para Próximos Milestones e Medalhas
  const [nextMilestones, setNextMilestones] = useState<any[]>([])
  const [recentMedalsEarned, setRecentMedalsEarned] = useState<string[]>([])
  const [currentPoints, setCurrentPoints] = useState(0)
  const [dailyChallengesCompleted, setDailyChallengesCompleted] = useState(0)

  // ✅ Carregar dados iniciais
  useEffect(() => {
    const points = profile?.points || parseInt(localStorage.getItem('user_points') || '0', 10)
    setCurrentPoints(points)
    const milestones = getNextMilestones(points)
    setNextMilestones(milestones)

    const earned = getEarnedBadges()
    setRecentMedalsEarned(earned)

    // Carregar contador de desafios de hoje
    setDailyChallengesCompleted(getDailyCompletedCount())
  }, [profile?.points])

  // ✅ Listener para atualizar quando pontos mudam (em tempo real)
  useEffect(() => {
    const handlePointsUpdated = () => {
      // ⚠️ IMPORTANTE: Pegar valor DIRETO do localStorage
      const updatedPoints = parseInt(localStorage.getItem('user_points') || '0', 10)
      console.log('📊 Dashboard: Recebeu pointsUpdated, novo valor:', updatedPoints)
      setCurrentPoints(updatedPoints)
      const milestones = getNextMilestones(updatedPoints)
      setNextMilestones(milestones)
    }

    // Listener
    window.addEventListener('pointsUpdated', handlePointsUpdated)

    // Também atualizar ao montar o componente
    const initialPoints = parseInt(localStorage.getItem('user_points') || '0', 10)
    setCurrentPoints(initialPoints)
    console.log('📊 Dashboard: Inicial points:', initialPoints)

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

      {/* Data Atual */}
      <div className="text-right text-sm text-zayia-violet-gray">
        📅 Dia de hoje: <span className="font-semibold text-zayia-deep-violet">{getFormattedToday()}</span>
      </div>

      {/* Card de Nível e Progresso */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* ✅ Ícone dinâmico sincronizado com LEVELS */}
            <div className="w-12 h-12 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full flex items-center justify-center">
              {(() => {
                const currentLevel = profile?.level || 1
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
                Nível {profile?.level || 1}
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

        {/* Barra de Progresso do Nível */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
            <span>Progresso para Nível {(profile?.level || 1) + 1}</span>
            <span>{Math.min(100, ((profile?.points || 0) % 200))}%</span>
          </div>
          <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${Math.min(100, ((profile?.points || 0) % 200) / 2)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="text-xs text-zayia-violet-gray mt-1">
            Faltam {200 - ((profile?.points || 0) % 200)} pontos para o próximo nível
          </div>
        </div>
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

      {/* ✅ NOVA SEÇÃO: Próximos Milestones com ícones sincronizados */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Próximos Milestones
        </h3>

        {nextMilestones.length > 0 ? (
          <div className="space-y-4">
            {nextMilestones.map((milestone, idx) => {
              const progress = (currentPoints / milestone.points) * 100

              return (
                <div key={idx} className="p-4 border-2 border-zayia-lilac/30 rounded-lg">
                  <div className="flex items-start gap-4">
                    {/* Ícone do Milestone */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      {milestone.icon ? (
                        (() => {
                          const IconComponent = milestone.icon
                          return (
                            <div className="w-full h-full flex items-center justify-center">
                              <IconComponent />
                            </div>
                          )
                        })()
                      ) : (
                        <div className="text-2xl">🎯</div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      {/* Nome e pontos faltando */}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-zayia-deep-violet">
                          {milestone.medalName}
                        </h4>
                        <span className="text-sm font-bold text-zayia-soft-purple whitespace-nowrap ml-2">
                          {milestone.pointsNeeded} pts
                        </span>
                      </div>

                      {/* Barra de progresso */}
                      <div className="mb-2">
                        <div className="w-full bg-zayia-lilac/30 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>

                      {/* Progresso em números */}
                      <div className="text-xs text-zayia-violet-gray">
                        {currentPoints} / {milestone.points} pontos
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-zayia-violet-gray">
            🎉 Todos os milestones conquistados! Parabéns!
          </div>
        )}
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