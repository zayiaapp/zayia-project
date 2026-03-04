import React from 'react'

interface RankTierBadgeProps {
  points: number
}

interface TierInfo {
  name: string
  icon: string
  color: string
  minPoints: number
  maxPoints: number
}

const TIERS: TierInfo[] = [
  { name: 'Bronze', icon: '🥉', color: '#CD7F32', minPoints: 0, maxPoints: 500 },
  { name: 'Silver', icon: '🥈', color: '#C0C0C0', minPoints: 501, maxPoints: 1500 },
  { name: 'Gold', icon: '🥇', color: '#FFD700', minPoints: 1501, maxPoints: 3000 },
  { name: 'Platinum', icon: '💎', color: '#87CEEB', minPoints: 3001, maxPoints: 5000 },
  { name: 'Diamond', icon: '💠', color: '#00CED1', minPoints: 5001, maxPoints: Infinity }
]

export function RankTierBadge({ points }: RankTierBadgeProps) {
  const currentTier = TIERS.find(t => points >= t.minPoints && points <= t.maxPoints) || TIERS[0]
  const nextTier = TIERS.find(t => t.minPoints > points)

  const progressToNextTier = nextTier
    ? Math.min(100, Math.max(0, ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
    : 100

  const pointsNeededForNext = nextTier ? nextTier.minPoints - points : 0

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-zayia-purple/10 to-zayia-lilac/10 rounded-lg border border-zayia-lilac/20">
      {/* Tier Display */}
      <div className="flex items-center gap-2">
        <span className="text-3xl">{currentTier.icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zayia-violet-gray">Seu Tier</span>
          <span className="text-lg font-bold text-zayia-purple">{currentTier.name}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {nextTier && (
        <>
          <div className="w-full bg-zayia-lilac/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-zayia-purple to-zayia-lilac transition-all duration-300"
              style={{ width: `${progressToNextTier}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zayia-violet-gray">
            <span>{points.toLocaleString()} pts</span>
            <span>{pointsNeededForNext.toLocaleString()} pts até {nextTier.name}</span>
          </div>
        </>
      )}

      {/* Diamond Tier (no next tier) */}
      {!nextTier && (
        <div className="text-center text-sm font-semibold text-zayia-purple">
          🎉 Você atingiu o nível máximo!
        </div>
      )}
    </div>
  )
}
