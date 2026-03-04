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
        // Map Supabase structure to match component expectations
        const mappedCategories = supabaseCategories.map((cat: any) => ({
          ...cat,
          label: cat.name, // Map 'name' to 'label' for backward compatibility
          challenges: [], // Placeholder - will be populated by DailyChallengesView
        }))
        setAllCategories(mappedCategories)

        // Track previously earned badges to detect new ones
        const earnedBadges = getEarnedBadges()
        setPreviousEarnedBadges(new Set(earnedBadges))

        // Load user's active category
        const activeCategoryId = ChallengesDataMock.getActiveCategory(user.id)

        if (activeCategoryId) {
          // Find category from loaded Supabase data
          const category = mappedCategories.find((cat: any) => cat.id === activeCategoryId)
          if (category) {
            setActiveCategory(category)

            // Load completed challenges
            const completed = ChallengesDataMock.getUserCompletedChallenges(activeCategoryId, user.id)
            setCompletedChallengeIds(new Set(completed))
          }
        } else {
          // First time - show modal
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

  const handleChallengeCompleted = (challengeId: string) => {
    if (!activeCategory || !user?.id) return

    // 1. PEGAR VALORES INICIAIS
    const challenge = ChallengesDataMock.getChallengeById(challengeId)
    if (!challenge) {
      return
    }

    // ⚠️ CRÍTICO: Ler pontos do Supabase (não localStorage)
    // Use profile.points que já está sincronizado do AuthContext
    const previousPoints = profile?.points || 0

    // 2. CALCULAR PONTOS DO DESAFIO
    const pointsFromChallenge = challenge.points
    const totalAfterChallenge = previousPoints + pointsFromChallenge

    // 3. IMPORTANTE: Marcar desafio como completo ANTES de verificar medalhas globais
    const completeSuccess = ChallengesDataMock.completeChallenge(challengeId, user.id)

    // 4. Update local state
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    // 5. VERIFICAR MEDALHAS
    const allNewMedals = checkAndUnlockMedals(totalAfterChallenge, previousPoints, user.id)

    // Atualizar previousEarnedBadges para próxima vez
    const currentEarnedBadges = getEarnedBadges()
    setPreviousEarnedBadges(new Set(currentEarnedBadges))

    // 6. CALCULAR PONTOS DAS MEDALHAS
    let medalPointsAdded = 0

    if (allNewMedals.length > 0) {
      allNewMedals.forEach((medalId) => {
        const medalObj = BADGES.find(b => b.id === medalId)
        if (medalObj?.points) {
          medalPointsAdded += medalObj.points
        }
      })
    }

    // 7. CALCULAR TOTAL FINAL
    let finalTotalPoints = totalAfterChallenge + medalPointsAdded

    // 8. Async function to save points and handle level-up/medals
    const savePointsAndCheck = async () => {
      try {
        // 8.1 VERIFICAR LEVEL-UP
        const levelUpResult = await supabaseClient.checkAndAwardLevelUp(
          user.id,
          finalTotalPoints,
          0
        )

        if (levelUpResult.leveledUp) {
          finalTotalPoints += levelUpResult.totalBonus

          setLevelUpData({
            newLevel: levelUpResult.newLevel,
            bonusPoints: levelUpResult.totalBonus,
            challengePoints: pointsFromChallenge,
            medalPoints: medalPointsAdded
          })
        }

        // 8.5 VERIFICAR MEDALHAS GLOBAIS
        const globalMedalResult = await supabaseClient.checkAndAwardGlobalMedals(
          user.id,
          currentEarnedBadges,
          finalTotalPoints
        )
        if (globalMedalResult.newGlobalMedals.length > 0) {
          console.log(`🌟 Global medals unlocked:`, globalMedalResult.newGlobalMedals)
        }

        // 8.7 ATUALIZAR STREAK (now uses Supabase)
        const streakResult = await supabaseClient.updateStreak(user.id)
        const streakMultiplier = Math.min(streakResult.currentStreak * 0.01, 0.5)
        const streakBonus = Math.floor(pointsFromChallenge * streakMultiplier)
        finalTotalPoints += streakBonus

        if (streakResult.currentStreak > 0) {
          await supabaseClient.checkStreakMilestone(user.id, streakResult.currentStreak)
        }

        console.log(`🔥 Streak: ${streakResult.currentStreak} days (+${streakBonus} bonus)`)

        if (streakResult.streakBroken) {
          window.dispatchEvent(
            new CustomEvent('showStreakWarning', {
              detail: { previousStreak: streakResult.currentStreak }
            })
          )
        }

        // 9. SALVAR PONTOS FINAIS NA SUPABASE (primary source, not localStorage)
        const totalPointsToAdd = finalTotalPoints - previousPoints
        await supabaseClient.addUserPoints(
          user.id,
          totalPointsToAdd,
          'challenge_complete',
          challengeId
        )

        // Also save to localStorage as secondary cache
        localStorage.setItem('user_points', finalTotalPoints.toString())

        // 10. MOSTRAR POP-UP DE MEDALHA (se houver)
        if (allNewMedals.length > 0) {
          const newMedalId = allNewMedals[0]
          const medalObj = BADGES.find(b => b.id === newMedalId)
          if (medalObj) {
            setUnlockedMedalPopup(medalObj)
          }
        }

        // 11. INCREMENTAR DESAFIOS HOJE
        incrementDailyCount()

        // 12. DISPARAR EVENTOS
        window.dispatchEvent(new Event('pointsUpdated'))
        window.dispatchEvent(new Event('rankingUpdated'))
        window.dispatchEvent(new Event('dailyProgressUpdated'))
        if (allNewMedals.length > 0) {
          window.dispatchEvent(new Event('medalsUpdated'))
        }
      } catch (error) {
        console.error('❌ Error saving points to Supabase:', error)
        // Fallback: still save to localStorage if Supabase fails
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
