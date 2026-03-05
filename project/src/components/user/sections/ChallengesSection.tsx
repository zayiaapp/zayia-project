import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { ChallengeCategory } from '../../../lib/challenges-data-mock'
import { CategorySelectionModal } from './challenges/CategorySelectionModal'
import { DailyChallengesView } from './challenges/DailyChallengesView'
import { CategoriesLockedView } from './challenges/CategoriesLockedView'
import { PopUpMedalUnlocked } from '../modals/PopUpMedalUnlocked'
import { LevelUpModal } from '../modals/LevelUpModal'
import { checkAndUnlockMedalsAsync } from '../../../lib/medals-unlock'
import { BADGES, type Badge } from '../../../lib/badges-data-mock'
import { supabaseClient } from '../../../lib/supabase-client'

export function ChallengesSection() {
  const { user, profile } = useAuth()

  // State
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null)
  const [allCategories, setAllCategories] = useState<ChallengeCategory[]>([])
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set())
  const [subTab, setSubTab] = useState<'desafios' | 'categorias'>('desafios')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unlockedMedalPopup, setUnlockedMedalPopup] = useState<Badge | null>(null)
  // Level-up state
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number
    bonusPoints: number
    challengePoints: number
    medalPoints: number
  } | null>(null)

  // Initialize on mount
  useEffect(() => {
    if (!user?.id) return

    const initializeData = async () => {
      try {
        setIsLoading(true)

        // Load all categories from Supabase
        const supabaseCategories = await supabaseClient.getChallengeCategories()
        const mappedCategories = supabaseCategories.map((cat: any) => ({
          ...cat,
          label: cat.name,
          challenges: [],
        }))
        setAllCategories(mappedCategories)

        // Load active category from Supabase
        const activeCategoryId = await supabaseClient.getUserActiveCategory(user.id)

        if (activeCategoryId) {
          const category = mappedCategories.find((cat: any) => cat.id === activeCategoryId)
          if (category) {
            setActiveCategory(category)

            // Load completed challenges from Supabase
            const completed = await supabaseClient.getUserCompletedChallengeIds(user.id, activeCategoryId)
            setCompletedChallengeIds(new Set(completed))
          } else {
            setShowCategoryModal(true)
          }
        } else {
          setShowCategoryModal(true)
        }
      } catch (error) {
        console.error('❌ Error initializing challenges:', error)
        setShowCategoryModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [user?.id])

  const handleCategorySelected = (category: ChallengeCategory) => {
    setActiveCategory(category)
    setShowCategoryModal(false)
    setCompletedChallengeIds(new Set())
  }

  const handleCloseModal = () => {
    // 1. Fechar modal
    setShowCategoryModal(false)

    // 2. Aguardar animação de fechamento
    setTimeout(() => {
      // 3. Disparar evento para voltar ao Dashboard
      window.dispatchEvent(new Event('navigateToDashboard'))
    }, 300)
  }

  const handleChallengeCompleted = (challengeId: string, points: number, difficulty: 'facil' | 'dificil') => {
    if (!activeCategory || !user?.id) return

    const previousPoints = profile?.points || 0
    const pointsFromChallenge = points
    const totalAfterChallenge = previousPoints + pointsFromChallenge

    // Optimistic UI update
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    const processCompletion = async () => {
      try {
        // 1. Verificar medalhas de categoria async (Supabase, não localStorage)
        const allNewMedals = await checkAndUnlockMedalsAsync(totalAfterChallenge, previousPoints, user.id)

        // 2. Calcular pontos de medalhas + persistir no Supabase
        let medalPointsAdded = 0
        if (allNewMedals.length > 0) {
          for (const medalId of allNewMedals) {
            const medalObj = BADGES.find(b => b.id === medalId)
            if (medalObj?.points) medalPointsAdded += medalObj.points
            await supabaseClient.awardBadgeByKey(user.id, medalId)
          }
        }

        let finalTotalPoints = totalAfterChallenge + medalPointsAdded

        // 3. Level-up check
        const levelUpResult = await supabaseClient.checkAndAwardLevelUp(user.id, finalTotalPoints, 0)
        if (levelUpResult.leveledUp) {
          finalTotalPoints += levelUpResult.totalBonus
          setLevelUpData({
            newLevel: levelUpResult.newLevel,
            bonusPoints: levelUpResult.totalBonus,
            challengePoints: pointsFromChallenge,
            medalPoints: medalPointsAdded,
          })
        }

        // 4. Medalhas globais
        const currentEarnedBadgeIds = await supabaseClient.getUserEarnedBadgeIds(user.id)
        const globalMedalResult = await supabaseClient.checkAndAwardGlobalMedals(
          user.id, currentEarnedBadgeIds, finalTotalPoints
        )
        if (globalMedalResult.newGlobalMedals.length > 0) {
          console.log(`🌟 Global medals unlocked:`, globalMedalResult.newGlobalMedals)
        }

        // 5. Streak
        const streakResult = await supabaseClient.updateStreak(user.id)
        const streakBonus = Math.floor(pointsFromChallenge * Math.min(streakResult.currentStreak * 0.01, 0.5))
        finalTotalPoints += streakBonus
        if (streakResult.currentStreak > 0) {
          await supabaseClient.checkStreakMilestone(user.id, streakResult.currentStreak)
        }
        if (streakResult.streakBroken) {
          window.dispatchEvent(new CustomEvent('showStreakWarning', { detail: { previousStreak: streakResult.currentStreak } }))
        }

        // 6. Salvar pontos no Supabase
        await supabaseClient.addUserPoints(user.id, finalTotalPoints - previousPoints, 'challenge_complete', challengeId)

        // 7. Registrar conclusão
        await supabaseClient.recordChallengeCompletion(user.id, challengeId, activeCategory.id, difficulty, pointsFromChallenge)

        // 8. Activity log
        await supabaseClient.logActivity(user.id, 'challenge_completed', {
          challenge_id: challengeId,
          points_earned: pointsFromChallenge,
          category_id: activeCategory.id,
          difficulty,
        })

        // 9. Eventos de UI
        window.dispatchEvent(new Event('pointsUpdated'))
        window.dispatchEvent(new Event('rankingUpdated'))
        window.dispatchEvent(new Event('dailyProgressUpdated'))
        if (allNewMedals.length > 0) {
          window.dispatchEvent(new Event('medalsUpdated'))
          const medalObj = BADGES.find(b => b.id === allNewMedals[0])
          if (medalObj) setUnlockedMedalPopup(medalObj)
        }
      } catch (error) {
        console.error('❌ Error processing challenge completion:', error)
        window.dispatchEvent(new Event('pointsUpdated'))
      }
    }

    processCompletion()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zayia-purple"></div>
          <p className="text-zayia-violet-gray mt-4">Carregando desafios...</p>
        </div>
      </div>
    )
  }

  // If no category selected and no modal showing, wait
  if (!activeCategory) {
    return (
      <div>
        {showCategoryModal && (
          <CategorySelectionModal
            userId={user?.id || ''}
            onCategorySelected={handleCategorySelected}
            onClose={handleCloseModal}
          />
        )}
      </div>
    )
  }

  // Handler for viewing medal
  const handleViewMedal = () => {
    // Close modal and dispatch event so parent can switch to medals tab
    setUnlockedMedalPopup(null)
    window.dispatchEvent(new CustomEvent('navigateToMedalTab', {
      detail: { medalId: unlockedMedalPopup?.id }
    }))
  }

  // Render with active category
  return (
    <div className="space-y-6">
      {/* Pop-up para medalha desbloqueada */}
      <PopUpMedalUnlocked
        isOpen={!!unlockedMedalPopup}
        medal={unlockedMedalPopup}
        onClose={() => setUnlockedMedalPopup(null)}
        onViewMedal={handleViewMedal}
      />

      {/* Pop-up para level-up */}
      {levelUpData && (
        <LevelUpModal
          isOpen={!!levelUpData}
          newLevel={levelUpData.newLevel}
          bonusPoints={levelUpData.bonusPoints}
          challengePoints={levelUpData.challengePoints}
          medalPoints={levelUpData.medalPoints}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-zayia-lilac/30">
        <button
          onClick={() => setSubTab('desafios')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            subTab === 'desafios'
              ? 'text-zayia-purple border-zayia-purple'
              : 'text-zayia-violet-gray border-transparent hover:border-zayia-lilac/30'
          }`}
        >
          ⚡ Desafios
        </button>
        <button
          onClick={() => setSubTab('categorias')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            subTab === 'categorias'
              ? 'text-zayia-purple border-zayia-purple'
              : 'text-zayia-violet-gray border-transparent hover:border-zayia-lilac/30'
          }`}
        >
          🔒 Categorias
        </button>
      </div>

      {/* Tab Content */}
      {subTab === 'desafios' && (
        <DailyChallengesView
          userId={user?.id || ''}
          category={activeCategory}
          completedChallengeIds={completedChallengeIds}
          onChallengeCompleted={handleChallengeCompleted}
        />
      )}

      {subTab === 'categorias' && (
        <CategoriesLockedView activeCategory={activeCategory} allCategories={allCategories} />
      )}
    </div>
  )
}
