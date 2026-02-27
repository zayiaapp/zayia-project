import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import {
  Trophy,
  Target,
  Flame,
  Award,
  Crown,
  Zap,
  CheckCircle,
  Clock,
  Gift
} from 'lucide-react'
import { getGreeting } from '../../../lib/utils'
import { getNextMilestones } from '../../../lib/medals-unlock'
import { getEarnedBadges } from '../../../lib/badges-storage'
import { BADGES } from '../../../lib/badges-data-mock'

export function DashboardSection() {
  const { profile } = useAuth()
  const greeting = getGreeting()

  // ✅ State para Próximos Milestones e Medalhas
  const [nextMilestones, setNextMilestones] = useState<any[]>([])
  const [recentMedalsEarned, setRecentMedalsEarned] = useState<string[]>([])
  const [currentPoints, setCurrentPoints] = useState(0)

  // ✅ Carregar dados iniciais
  useEffect(() => {
    const points = profile?.points || parseInt(localStorage.getItem('user_points') || '0', 10)
    setCurrentPoints(points)
    const milestones = getNextMilestones(points)
    setNextMilestones(milestones)

    const earned = getEarnedBadges()
    setRecentMedalsEarned(earned)
  }, [profile?.points])

  // ✅ Listener para atualizar quando pontos mudam (em tempo real)
  useEffect(() => {
    const handlePointsUpdated = () => {
      const points = parseInt(localStorage.getItem('user_points') || '0', 10)
      setCurrentPoints(points)
      const milestones = getNextMilestones(points)
      setNextMilestones(milestones)
      console.log('📊 Dashboard atualizado - próximos milestones:', milestones)
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

  // Mock de dados de progresso
  const progressData = {
    todayCompleted: 2,
    todayTarget: 2,
    weekCompleted: 12,
    weekTarget: 14,
    monthCompleted: 45,
    monthTarget: 60
  }

  // Mock de medalhas recentes
  const recentBadges = [
    { id: '1', name: 'Primeira Semana', icon: '🌟', rarity: 'bronze', earnedAt: '2024-01-15' },
    { id: '2', name: 'Meditadora', icon: '🧘‍♀️', rarity: 'silver', earnedAt: '2024-01-18' },
    { id: '3', name: 'Guerreira', icon: '⚔️', rarity: 'gold', earnedAt: '2024-01-20' },
    { id: '4', name: 'Inspiradora', icon: '✨', rarity: 'diamond', earnedAt: '2024-01-22' }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'from-orange-400 to-orange-600'
      case 'silver': return 'from-gray-400 to-gray-600'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'diamond': return 'from-purple-400 to-purple-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getProgressPercentage = (completed: number, target: number) => {
    return Math.min(100, (completed / target) * 100)
  }

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

      {/* Card de Nível e Progresso */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
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

      {/* Progresso de Desafios */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Progresso de Desafios
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {/* Hoje */}
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E9D5FF"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  strokeDasharray={`${getProgressPercentage(progressData.todayCompleted, progressData.todayTarget)}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-zayia-deep-violet">
                  {progressData.todayCompleted}/{progressData.todayTarget}
                </span>
              </div>
            </div>
            <div className="text-xs text-zayia-violet-gray">Hoje</div>
          </div>

          {/* Semana */}
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E9D5FF"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeDasharray={`${getProgressPercentage(progressData.weekCompleted, progressData.weekTarget)}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-zayia-deep-violet">
                  {progressData.weekCompleted}/{progressData.weekTarget}
                </span>
              </div>
            </div>
            <div className="text-xs text-zayia-violet-gray">Semana</div>
          </div>

          {/* Mês */}
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E9D5FF"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#C084FC"
                  strokeWidth="2"
                  strokeDasharray={`${getProgressPercentage(progressData.monthCompleted, progressData.monthTarget)}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-zayia-deep-violet">
                  {progressData.monthCompleted}/{progressData.monthTarget}
                </span>
              </div>
            </div>
            <div className="text-xs text-zayia-violet-gray">Mês</div>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="zayia-card p-4 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-zayia-deep-violet">{profile?.streak || 0}</div>
          <div className="text-xs text-zayia-violet-gray">Dias Seguidos</div>
        </div>
        <div className="zayia-card p-4 text-center">
          <Trophy className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
          <div className="text-xl font-bold text-zayia-deep-violet">{profile?.completed_challenges || 0}</div>
          <div className="text-xs text-zayia-violet-gray">Desafios Completos</div>
        </div>
      </div>

      {/* ✅ NOVA SEÇÃO: Próximos Milestones */}
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
                <div key={idx} className="space-y-2">
                  {/* Nome do milestone */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zayia-deep-violet">
                      🎯 {milestone.medalName}
                    </span>
                    <span className="text-sm font-bold text-zayia-soft-purple">
                      {milestone.pointsNeeded} pts faltam
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="w-full bg-zayia-lilac/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>

                  {/* Progresso em números */}
                  <div className="text-xs text-zayia-violet-gray">
                    {currentPoints} / {milestone.points} pontos
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-zayia-violet-gray">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentMedalsEarned.slice(0, 8).map((medalId) => {
              const medal = BADGES.find(b => b.id === medalId)
              if (!medal) return null

              return (
                <div
                  key={medalId}
                  className="p-4 rounded-lg text-center transition-transform hover:scale-105"
                  style={{
                    backgroundColor: `${medal.color}20`,
                    border: `2px solid ${medal.color}`
                  }}
                >
                  <div className="w-16 h-16 mx-auto mb-2">
                    {(() => {
                      const IconComponent = medal.icon
                      return <IconComponent />
                    })()}
                  </div>
                  <h4 className="font-semibold text-sm text-zayia-deep-violet">
                    {medal.name}
                  </h4>
                  <p className="text-xs text-zayia-violet-gray mt-1">
                    {medal.requirement} desafios
                  </p>
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

      {/* Medalhas Conquistadas Recentemente */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zayia-deep-violet flex items-center gap-2">
            <Award className="w-5 h-5" />
            Medalhas Recentes
          </h3>
          <button className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors text-sm font-medium">
            Ver todas →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {recentBadges.slice(0, 4).map((badge) => (
            <div key={badge.id} className="p-3 bg-zayia-lilac/20 rounded-xl text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                <span className="text-xl">{badge.icon}</span>
              </div>
              <div className="text-sm font-semibold text-zayia-deep-violet mb-1">
                {badge.name}
              </div>
              <div className="text-xs text-zayia-violet-gray">
                {new Date(badge.earnedAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Desafios */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Próximos Desafios
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800">Desafio Fácil</div>
              <div className="text-xs text-green-600">Alongamento matinal - 1 ponto</div>
            </div>
            <div className="text-xs text-green-600 font-bold">FEITO</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-orange-800">Desafio Difícil</div>
              <div className="text-xs text-orange-600">Caminhada 30min - 3 pontos</div>
            </div>
            <div className="text-xs text-orange-600 font-bold">PENDENTE</div>
          </div>
        </div>

        <button className="w-full mt-4 zayia-button py-3 rounded-xl text-white font-semibold">
          Ver Todos os Desafios
        </button>
      </div>

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