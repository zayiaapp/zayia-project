import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import ChallengesDataMock, { ChallengeCategory } from '../../../lib/challenges-data-mock'
import { CategorySelectionModal } from './challenges/CategorySelectionModal'
import { DailyChallengesView } from './challenges/DailyChallengesView'
import { CategoriesLockedView } from './challenges/CategoriesLockedView'
import { PopUpMedalUnlocked } from '../modals/PopUpMedalUnlocked'
import { checkAndUnlockMedals } from '../../../lib/medals-unlock'
import { getEarnedBadges } from '../../../lib/badges-storage'
import { incrementDailyCount } from '../../../lib/challenges-storage'
import { BADGES } from '../../../lib/badges-data-mock'

export function ChallengesSection() {
  const { user } = useAuth()

  // State
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null)
  const [allCategories, setAllCategories] = useState<ChallengeCategory[]>([])
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set())
  const [subTab, setSubTab] = useState<'desafios' | 'categorias'>('desafios')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unlockedMedalPopup, setUnlockedMedalPopup] = useState<Badge | null>(null)
  const [previousEarnedBadges, setPreviousEarnedBadges] = useState<Set<string>>(new Set())

  // Initialize on mount
  useEffect(() => {
    if (!user?.id) return

    setIsLoading(true)
    ChallengesDataMock.initialize()

    // Load all categories
    const categories = ChallengesDataMock.getCategories()
    setAllCategories(categories)

    // Track previously earned badges to detect new ones
    const earnedBadges = getEarnedBadges()
    setPreviousEarnedBadges(new Set(earnedBadges))

    // Load user's active category
    const activeCategoryId = ChallengesDataMock.getActiveCategory(user.id)

    if (activeCategoryId) {
      const category = ChallengesDataMock.getCategoryById(activeCategoryId)
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

    setIsLoading(false)
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

    // ⚠️ CRÍTICO: Ler localStorage EXATAMENTE como está
    const beforeStorage = localStorage.getItem('user_points')
    const previousPoints = beforeStorage ? parseInt(beforeStorage, 10) : 0



    // 2. CALCULAR PONTOS DO DESAFIO
    const pointsFromChallenge = challenge.points
    const totalAfterChallenge = previousPoints + pointsFromChallenge


    // 3. IMPORTANTE: Marcar desafio como completo ANTES de verificar medalhas globais
    // Isso incrementa totalCompleted para que checkAndUnlockMedals() leia o valor correto
    const completeSuccess = ChallengesDataMock.completeChallenge(challengeId, user.id)

    // 4. Update local state
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    // 5. VERIFICAR MEDALHAS (checkAndUnlockMedals já chama addEarnedBadge)
    const allNewMedals = checkAndUnlockMedals(totalAfterChallenge, previousPoints, user.id)

    // Atualizar previousEarnedBadges para próxima vez
    const currentEarnedBadges = getEarnedBadges()
    setPreviousEarnedBadges(new Set(currentEarnedBadges))


    // 6. CALCULAR PONTOS DAS MEDALHAS
    let medalPointsAdded = 0

    if (allNewMedals.length > 0) {
      allNewMedals.forEach((medalId, index) => {
        const medalObj = BADGES.find(b => b.id === medalId)
        if (medalObj) {
          if (medalObj.points) {
            medalPointsAdded += medalObj.points
          }
        }
      })
    }


    // 7. CALCULAR TOTAL FINAL
    const finalTotalPoints = totalAfterChallenge + medalPointsAdded


    // 8. SALVAR APENAS UMA VEZ
    localStorage.setItem('user_points', finalTotalPoints.toString())
    const afterStorage = localStorage.getItem('user_points')


    // 9. MOSTRAR POP-UP
    if (allNewMedals.length > 0) {
      const newMedalId = allNewMedals[0]
      const medalObj = BADGES.find(b => b.id === newMedalId)
      if (medalObj) {
        setUnlockedMedalPopup(medalObj)
      }
    }

    // 10. INCREMENTAR DESAFIOS HOJE
    incrementDailyCount()

    // 11. DISPARAR EVENTOS
    window.dispatchEvent(new Event('pointsUpdated'))
    window.dispatchEvent(new Event('dailyProgressUpdated'))
    if (allNewMedals.length > 0) {
      window.dispatchEvent(new Event('medalsUpdated'))
    }

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
