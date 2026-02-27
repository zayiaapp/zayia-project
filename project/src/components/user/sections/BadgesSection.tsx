import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  Medal,
  Lock,
  Gift,
  Target
} from 'lucide-react'
import { BADGES, LEVELS, getRarityColor, getBadgesByCategory, getAllCategories } from '../../../lib/badges-data-mock'
import { getEarnedBadges } from '../../../lib/badges-storage'

export function BadgesSection() {
  const { profile } = useAuth()
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([])

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const earned = getEarnedBadges()
    setEarnedBadgeIds(earned)
  }, [])

  // ✅ Listener para atualizar quando medalhas mudam (em tempo real)
  useEffect(() => {
    const handleMedalsUpdated = () => {
      const earned = getEarnedBadges()
      setEarnedBadgeIds(earned)
      console.log('🏆 Medalhas atualizadas:', earned)
    }

    window.addEventListener('medalsUpdated', handleMedalsUpdated)
    return () => window.removeEventListener('medalsUpdated', handleMedalsUpdated)
  }, [])

  // ✅ Listener para atualizar quando pontos mudam
  useEffect(() => {
    const handlePointsUpdated = () => {
      // Trigger a re-render para atualizar os níveis desbloqueados
      console.log('📊 Pontos atualizados - recarregando níveis...')
    }

    window.addEventListener('pointsUpdated', handlePointsUpdated)
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdated)
  }, [])

  // Usar dados do admin (MESMA FONTE DE VERDADE)
  const allCategories = getAllCategories()

  // Calcular níveis desbloqueados com base nos pontos do usuário
  const unlockedLevels = LEVELS.filter(l => (profile?.points || 0) >= l.pointsRequired)
  const currentLevel = unlockedLevels[unlockedLevels.length - 1] || LEVELS[0]
  const nextLevelIndex = LEVELS.indexOf(currentLevel) + 1
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null

  // Mapear badges com status de earned
  const badgesWithStatus = BADGES.map(badge => ({
    ...badge,
    unlocked: earnedBadgeIds.includes(badge.id)
  }))

  const unlockedBadges = badgesWithStatus.filter(b => b.unlocked)
  const availableBadges = badgesWithStatus.filter(b => !b.unlocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-zayia-orchid to-zayia-amethyst rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Medalhas & Níveis 🏆
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Suas conquistas e progresso na jornada ZAYIA
        </p>
      </div>

      {/* Pontos Totais */}
      <div className="zayia-card p-6 text-center bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <Gift className="w-12 h-12 text-zayia-orchid mx-auto mb-3" />
        <div className="text-3xl font-bold zayia-gradient-text mb-2">
          {(profile?.points || 0).toLocaleString()}
        </div>
        <div className="text-sm text-zayia-violet-gray">Pontos Totais Acumulados</div>
      </div>

      {/* Nível Atual */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Seu Nível Atual
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center`}>
            {(() => {
              const IconComponent = currentLevel.icon
              return <IconComponent />
            })()}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-zayia-deep-violet">
              Nível {currentLevel.level}: {currentLevel.name}
            </h4>
            <p className="text-sm text-zayia-violet-gray">{currentLevel.description}</p>
          </div>
        </div>

        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
              <span>Progresso para {nextLevel.name}</span>
              <span>
                {profile?.points || 0}/{nextLevel.pointsRequired} pontos
              </span>
            </div>
            <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${nextLevel.color} transition-all duration-1000`}
                style={{ 
                  width: `${Math.min(100, ((profile?.points || 0) / nextLevel.pointsRequired) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="text-xs text-zayia-violet-gray mt-1">
              Faltam {nextLevel.pointsRequired - (profile?.points || 0)} pontos
            </div>
          </div>
        )}
      </div>

      {/* Medalhas Conquistadas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Medalhas Conquistadas ({unlockedBadges.length})
        </h3>

        {unlockedBadges.length === 0 ? (
          <div className="text-center py-8">
            <Medal className="w-12 h-12 text-zayia-violet-gray mx-auto mb-3" />
            <p className="text-zayia-violet-gray text-sm">
              Complete desafios para conquistar suas primeiras medalhas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {unlockedBadges.map((badge) => {
              const IconComponent = badge.icon
              return (
              <div key={badge.id} className={`p-4 rounded-xl border-2`} style={{ backgroundColor: `${badge.color}40`, borderColor: badge.color }}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2">
                    <IconComponent />
                  </div>
                  <h4 className="font-bold text-zayia-deep-violet text-sm mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-zayia-violet-gray mb-1">
                    {badge.description}
                  </p>
                  <div className={`text-xs font-semibold ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity.toUpperCase()}
                  </div>
                  <div className="text-xs text-zayia-deep-violet font-bold mt-1">
                    +{badge.points} pts
                  </div>
                </div>
              </div>
            )
            })}
          </div>
        )}
      </div>

      {/* Próximas Medalhas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Próximas Medalhas ({availableBadges.length})
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {availableBadges.map((badge) => (
            <div key={badge.id} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 opacity-60">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center opacity-40">
                  {(() => {
                    const IconComponent = badge.icon
                    return <IconComponent />
                  })()}
                </div>
                <h4 className="font-bold text-gray-700 text-sm mb-1">
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  {badge.description}
                </p>
                <div className="text-xs font-semibold text-gray-500 mb-1">
                  {badge.requirement} desafios
                </div>
                <div className="text-xs text-gray-600 font-bold">
                  +{badge.points} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Todos os Níveis */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Todos os Níveis
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {LEVELS.map((level) => {
            const isUnlocked = (profile?.points || 0) >= level.pointsRequired
            const IconComponent = level.icon

            return (
              <div
                key={level.level}
                className="p-4 rounded-lg text-center border-2 transition-all hover:shadow-lg hover:scale-105"
                style={{
                  borderColor: level.color,
                  backgroundColor: isUnlocked ? `${level.color}20` : '#F3F4F6'
                }}
              >
                <div className="w-16 h-16 mx-auto mb-2 relative">
                  <div style={{ background: isUnlocked ? `linear-gradient(135deg, ${level.color}, ${level.color}dd)` : '#D1D5DB' }} className="w-full h-full rounded-full flex items-center justify-center">
                    <IconComponent />
                  </div>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h4 className={`font-bold ${isUnlocked ? 'text-zayia-deep-violet' : 'text-gray-600'} text-sm mb-1`}>
                  {level.name}
                </h4>
                <p className={`text-xs ${isUnlocked ? 'text-zayia-violet-gray' : 'text-gray-500'} font-medium`}>
                  Nível {level.level}
                </p>
                <p className={`text-xs ${isUnlocked ? 'text-zayia-violet-gray' : 'text-gray-500'} mt-2 italic`}>
                  {level.description}
                </p>
                <p className={`text-xs font-bold mt-2 ${isUnlocked ? 'text-zayia-soft-purple' : 'text-gray-500'}`}>
                  {level.pointsRequired} pts
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Categorias de Medalhas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
          Medalhas por Categoria
        </h3>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {allCategories.map((category) => {
            const categoryBadges = getBadgesByCategory(category)
            const unlockedCount = categoryBadges.filter(b => earnedBadgeIds.includes(b.id)).length
            const totalCount = categoryBadges.length

            return (
              <div
                key={category}
                className="zayia-card p-4 text-center hover:scale-105 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-semibold text-zayia-deep-violet text-sm mb-1 line-clamp-2">
                  {category}
                </div>
                <div className="text-xs text-zayia-violet-gray">
                  {unlockedCount}/{totalCount} medalhas
                </div>
                <div className="w-full bg-zayia-lilac/30 rounded-full h-1 mt-2">
                  <div
                    className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-1 rounded-full"
                    style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Motivação */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-cream to-zayia-lilac/20">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-zayia-orchid mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">
            Continue Brilhando! ✨
          </h3>
          <p className="text-sm text-zayia-deep-violet">
            Cada medalha conquistada é uma prova da sua força e determinação. 
            Você está no caminho certo!
          </p>
        </div>
      </div>
    </div>
  )
}