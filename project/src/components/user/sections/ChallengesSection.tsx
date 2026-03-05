import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import ChallengesDataMock, { ChallengeCategory } from '../../../lib/challenges-data-mock'
import { CategorySelectionModal } from './challenges/CategorySelectionModal'
import { DailyChallengesView } from './challenges/DailyChallengesView'
import { CategoriesLockedView } from './challenges/CategoriesLockedView'
import { PopUpMedalUnlocked } from '../modals/PopUpMedalUnlocked'
import { LevelUpModal } from '../modals/LevelUpModal'
import { checkAndUnlockMedals } from '../../../lib/medals-unlock'
import { getEarnedBadges } from '../../../lib/badges-storage'
import { incrementDailyCount } from '../../../lib/challenges-storage'
import { BADGES, type Badge } from '../../../lib/badges-data-mock'
import { supabaseClient } from '../../../lib/supabase-client'

// Seed localStorage from Supabase data so checkAndUnlockMedals (sync) can read it
function seedLocalStorage(userId: string, activeCategoryId: string, completed: string[], totalCompleted: number) {
  localStorage.setItem(`zayia_user_challenges_${userId}`, JSON.stringify({
    activeCategory: activeCategoryId,
    completedChallenges: completed,
    totalCompleted,
    completionDate: null,
  }))
}

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
  const [previousEarnedBadges, setPreviousEarnedBadges] = useState<Set<string>>(new Set())
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
        ChallengesDataMock.initialize()

        // Load all categories from Supabase
        const supabaseCategories = await supabaseClient.getChallengeCategories()
        const mappedCategories = supabaseCategories.map((cat: any) => ({
          ...cat,
          label: cat.name,
          challenges: [],
        }))
        setAllCategories(mappedCategories)

        // Track previously earned badges
        const earnedBadges = getEarnedBadges()
        setPreviousEarnedBadges(new Set(earnedBadges))

        // Load active category from Supabase (replaces ChallengesDataMock.getActiveCategory)
        const activeCategoryId = await supabaseClient.getUserActiveCategory(user.id)

        if (activeCategoryId) {
          const category = mappedCategories.find((cat: any) => cat.id === activeCategoryId)
          if (category) {
            setActiveCategory(category)

            // Load completed challenges from Supabase (replaces ChallengesDataMock.getUserCompletedChallenges)
            const [completed, totalCompleted] = await Promise.all([
              supabaseClient.getUserCompletedChallengeIds(user.id, activeCategoryId),
              supabaseClient.getUserTotalCompletedCount(user.id),
            ])
            setCompletedChallengeIds(new Set(completed))

            // Seed localStorage so checkAndUnlockMedals (sync) can read correct counts
            seedLocalStorage(user.id, activeCategoryId, completed, totalCompleted)
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

    // 1. Points come directly from child callback (no need for getChallengeById)
    const previousPoints = profile?.points || 0
    const pointsFromChallenge = points
    const totalAfterChallenge = previousPoints + pointsFromChallenge

    // 2. Update localStorage counter so checkAndUnlockMedals (sync) reads correct total
    ChallengesDataMock.completeChallenge(challengeId, user.id)

    // 3. Update local React state
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    // 4. Check medals synchronously (uses localStorage which we keep in sync)
    const allNewMedals = checkAndUnlockMedals(totalAfterChallenge, previousPoints, user.id)
    const currentEarnedBadges = getEarnedBadges()
    setPreviousEarnedBadges(new Set(currentEarnedBadges))

    // 5. Calculate medal points + persist category medals to Supabase
    let medalPointsAdded = 0
    if (allNewMedals.length > 0) {
      allNewMedals.forEach((medalId) => {
        const medalObj = BADGES.find(b => b.id === medalId)
        if (medalObj?.points) medalPointsAdded += medalObj.points
        if (!medalId.startsWith('global_')) {
          supabaseClient.awardBadgeByKey(user.id, medalId)
        }
      })
    }

    let finalTotalPoints = totalAfterChallenge + medalPointsAdded

    const savePointsAndCheck = async () => {
      try {
        // Level-up check
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

        // Global medals check
        const globalMedalResult = await supabaseClient.checkAndAwardGlobalMedals(
          user.id, currentEarnedBadges, finalTotalPoints
        )
        if (globalMedalResult.newGlobalMedals.length > 0) {
          console.log(`🌟 Global medals unlocked:`, globalMedalResult.newGlobalMedals)
        }

        // Streak update
        const streakResult = await supabaseClient.updateStreak(user.id)
        const streakBonus = Math.floor(pointsFromChallenge * Math.min(streakResult.currentStreak * 0.01, 0.5))
        finalTotalPoints += streakBonus
        if (streakResult.currentStreak > 0) {
          await supabaseClient.checkStreakMilestone(user.id, streakResult.currentStreak)
        }
        if (streakResult.streakBroken) {
          window.dispatchEvent(new CustomEvent('showStreakWarning', { detail: { previousStreak: streakResult.currentStreak } }))
        }

        // Save points to Supabase
        await supabaseClient.addUserPoints(user.id, finalTotalPoints - previousPoints, 'challenge_complete', challengeId)

        // Record completion to Supabase challenge_completions table
        await supabaseClient.recordChallengeCompletion(user.id, challengeId, activeCategory.id, difficulty, pointsFromChallenge)

        // Register in activity_log (non-critical — fire and forget)
        await supabaseClient.logActivity(user.id, 'challenge_completed', {
          challenge_id: challengeId,
          points_earned: pointsFromChallenge,
          category_id: activeCategory.id,
          difficulty,
        })

        localStorage.setItem('user_points', finalTotalPoints.toString())

        // Show medal popup
        if (allNewMedals.length > 0) {
          const medalObj = BADGES.find(b => b.id === allNewMedals[0])
          if (medalObj) setUnlockedMedalPopup(medalObj)
        }

        incrementDailyCount()

        window.dispatchEvent(new Event('pointsUpdated'))
        window.dispatchEvent(new Event('rankingUpdated'))
        window.dispatchEvent(new Event('dailyProgressUpdated'))
        if (allNewMedals.length > 0) window.dispatchEvent(new Event('medalsUpdated'))
      } catch (error) {
        console.error('❌ Error saving points to Supabase:', error)
        localStorage.setItem('user_points', finalTotalPoints.toString())
        window.dispatchEvent(new Event('pointsUpdated'))
      }
    }

    savePointsAndCheck()
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
