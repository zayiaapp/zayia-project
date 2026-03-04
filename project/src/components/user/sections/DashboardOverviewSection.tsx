import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import {
  Award,
  TrendingUp,
  Zap,
  CheckCircle,
  Trophy,
  Flame,
  Target
} from 'lucide-react'

interface UserStats {
  points: number
  level: number
  badgesCount: number
  completedChallenges: number
  memberSince: string
  lastAccess: string
}

interface UserRanking {
  position: number | null
  points: number
  month: number
  year: number
}

export function DashboardOverviewSection() {
  const { profile, user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [ranking, setRanking] = useState<UserRanking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    // Load initial stats
    loadStats()

    // Setup real-time listeners
    const profileSubscription = supabase
      .channel(`profile-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        () => {
          loadStats()
        }
      )
      .subscribe()

    const badgesSubscription = supabase
      .channel(`badges-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_earned_badges',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadStats()
        }
      )
      .subscribe()

    const rankingSubscription = supabase
      .channel(`ranking-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monthly_rankings',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadStats()
        }
      )
      .subscribe()

    return () => {
      profileSubscription.unsubscribe()
      badgesSubscription.unsubscribe()
      rankingSubscription.unsubscribe()
    }
  }, [user?.id])

  const loadStats = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      // Fetch user stats
      const userStats = await supabaseClient.getUserStats(user.id)
      if (userStats) {
        setStats(userStats)
      }

      // Fetch ranking
      const userRanking = await supabaseClient.getUserRanking(user.id)
      if (userRanking) {
        setRanking(userRanking)
      }
    } catch (error) {
      console.error('❌ Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const nextLevelPoints = Math.ceil(((stats?.level || 0) + 1) * 100)
  const pointsToNextLevel = Math.max(0, nextLevelPoints - (stats?.points || 0))

  const getRankingBadgeColor = () => {
    if (!ranking?.position) return 'bg-gray-100 text-gray-700'
    if (ranking.position === 1) return 'bg-yellow-100 text-yellow-700'
    if (ranking.position === 2) return 'bg-gray-100 text-gray-700'
    if (ranking.position === 3) return 'bg-orange-100 text-orange-700'
    return 'bg-purple-100 text-purple-700'
  }

  const getRankingMedal = () => {
    if (!ranking?.position) return '🥓'
    if (ranking.position === 1) return '🥇'
    if (ranking.position === 2) return '🥈'
    if (ranking.position === 3) return '🥉'
    return '🎖️'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">
          <Zap className="w-8 h-8 text-purple-600" />
        </div>
        <span className="ml-4 text-purple-600 font-medium">Carregando dados...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase">Pontos</span>
          </div>
          <div className="text-3xl font-bold text-purple-900">{stats?.points || 0}</div>
          <p className="text-xs text-purple-700 mt-2">
            {pointsToNextLevel} para próximo nível
          </p>
        </div>

        {/* Level Card */}
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg p-4 border border-violet-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <span className="text-xs font-semibold text-violet-600 uppercase">Nível</span>
          </div>
          <div className="text-3xl font-bold text-violet-900">{stats?.level || 0}</div>
          <p className="text-xs text-violet-700 mt-2">Nível Máximo: 9</p>
        </div>

        {/* Badges Card */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-pink-600" />
            <span className="text-xs font-semibold text-pink-600 uppercase">Medalhas</span>
          </div>
          <div className="text-3xl font-bold text-pink-900">{stats?.badgesCount || 0}</div>
          <p className="text-xs text-pink-700 mt-2">Coleção em andamento</p>
        </div>

        {/* Challenges Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase">Desafios</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats?.completedChallenges || 0}</div>
          <p className="text-xs text-blue-700 mt-2">Completados</p>
        </div>
      </div>

      {/* Progress to Next Level */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Progresso para Próximo Nível
          </h3>
          <span className="text-sm text-gray-600">
            {stats?.points || 0} / {nextLevelPoints}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, ((stats?.points || 0) / nextLevelPoints) * 100)}%`
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {pointsToNextLevel} pontos para chegar ao nível {(stats?.level || 0) + 1}
        </p>
      </div>

      {/* Ranking Position */}
      {ranking?.position && (
        <div className={`${getRankingBadgeColor()} rounded-lg p-6 border-2`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5" />
                Sua Posição no Ranking
              </h3>
              <p className="text-sm opacity-75">
                Março 2026 - Ranking Mensal
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{getRankingMedal()}</div>
              <div className="text-4xl font-bold">{ranking.position}º</div>
            </div>
          </div>
        </div>
      )}

      {/* Account Information */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          Informações da Conta
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              Membro desde
            </p>
            <p className="text-sm font-medium text-gray-800">
              {stats ? formatDate(stats.memberSince) : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              Último acesso
            </p>
            <p className="text-sm font-medium text-gray-800">
              {stats ? formatDateTime(stats.lastAccess) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Motivation Message */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">
          🎉 Parabéns, {profile?.full_name?.split(' ')[0]}!
        </h3>
        <p className="text-sm opacity-90 mb-4">
          {stats && stats.completedChallenges === 0
            ? 'Comece sua jornada completando seu primeiro desafio!'
            : stats && stats.badgesCount === 0
            ? 'Você está progredindo bem! Continue para conquistar suas primeiras medalhas.'
            : stats && stats.level < 3
            ? 'Você está começando ótimo! Continue completando desafios para ganhar mais pontos.'
            : stats && stats.level < 6
            ? 'Excelente progresso! Você é uma guerreira em ascensão. 💪'
            : 'Você é uma verdadeira guerreira ZAYIA! Continue assim! 👑'}
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Começar Novo Desafio →
        </button>
      </div>
    </div>
  )
}
