import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'

interface LeaderboardUser {
  id: string
  name: string
  avatar?: string
  points: number
  rank: number
}

function getTierColor(rank: number): string {
  if (rank === 1) return 'bg-yellow-500/20 border-yellow-400'
  if (rank === 2) return 'bg-gray-400/20 border-gray-300'
  if (rank === 3) return 'bg-orange-500/20 border-orange-400'
  return 'bg-zayia-lilac/10 border-zayia-lilac/30'
}

function getTierIcon(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '📍'
}

function getTierBadgeColor(points: number): string {
  if (points >= 5001) return 'text-cyan-400'
  if (points >= 3001) return 'text-blue-400'
  if (points >= 1501) return 'text-yellow-400'
  if (points >= 501) return 'text-gray-400'
  return 'text-orange-600'
}

function getTierIcon_(points: number): string {
  if (points >= 5001) return '💠'
  if (points >= 3001) return '💎'
  if (points >= 1501) return '🥇'
  if (points >= 501) return '🥈'
  return '🥉'
}

export function LeaderboardSection() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const loadLeaderboard = async () => {
      setIsLoading(true)
      try {
        // Load leaderboard
        const topUsers = await supabaseClient.getUsersForLeaderboard(10)
        setLeaderboard(topUsers)

        // Get user's rank
        const rankData = await supabaseClient.getUserRankingByPoints(user.id)
        setUserRank(rankData.rank)
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()

    // Listen for rank updates
    const handleRankingUpdated = () => {
      loadLeaderboard()
    }

    window.addEventListener('rankingUpdated', handleRankingUpdated)
    window.addEventListener('pointsUpdated', handleRankingUpdated)

    return () => {
      window.removeEventListener('rankingUpdated', handleRankingUpdated)
      window.removeEventListener('pointsUpdated', handleRankingUpdated)
    }
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zayia-purple"></div>
          <p className="text-zayia-violet-gray mt-4">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with current user's rank */}
      {userRank && (
        <div className="bg-gradient-to-r from-zayia-purple/20 to-zayia-lilac/20 border border-zayia-lilac/30 rounded-lg p-4 text-center">
          <p className="text-sm text-zayia-violet-gray">Sua Posição</p>
          <p className="text-2xl font-bold text-zayia-purple">🏆 #{userRank}º lugar</p>
        </div>
      )}

      {/* Leaderboard Title */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <h3 className="text-xl font-bold text-zayia-purple">Top 10 Guerreiras</h3>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-zayia-violet-gray">
            <p>Nenhum dado de ranking disponível</p>
          </div>
        ) : (
          leaderboard.map((leaderboardUser) => {
            const isCurrentUser = leaderboardUser.id === user?.id
            const tierColor = getTierColor(leaderboardUser.rank)
            const tierIcon = getTierIcon(leaderboardUser.rank)
            const tierBadge = getTierIcon_(leaderboardUser.points)

            return (
              <div
                key={leaderboardUser.id}
                className={`flex items-center gap-4 p-3 rounded-lg border-2 transition ${
                  isCurrentUser
                    ? 'bg-zayia-purple/20 border-zayia-purple'
                    : `${tierColor} border`
                }`}
              >
                {/* Rank */}
                <div className="text-2xl font-bold w-12 text-center">
                  {tierIcon}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {leaderboardUser.avatar && (
                      <img
                        src={leaderboardUser.avatar}
                        alt={leaderboardUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="font-semibold text-zayia-purple truncate">
                      {leaderboardUser.name}
                      {isCurrentUser && <span className="text-xs ml-2">(você)</span>}
                    </span>
                  </div>
                </div>

                {/* Tier Badge */}
                <div className={`flex items-center gap-1 ${getTierBadgeColor(leaderboardUser.points)}`}>
                  <span className="text-lg">{tierBadge}</span>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-bold text-zayia-purple text-lg">{leaderboardUser.points.toLocaleString()}</p>
                  <p className="text-xs text-zayia-violet-gray">pts</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Note about updating */}
      <p className="text-xs text-zayia-violet-gray text-center">
        O ranking é atualizado em tempo real conforme você completa desafios
      </p>
    </div>
  )
}
