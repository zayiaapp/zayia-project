import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import ChallengesDataMock, { ChallengeCategory } from '../../../lib/challenges-data-mock'
import { CategorySelectionModal } from './challenges/CategorySelectionModal'
import { DailyChallengesView } from './challenges/DailyChallengesView'
import { CategoriesLockedView } from './challenges/CategoriesLockedView'
import { checkAndUnlockMedals, getMedalById } from '../../../lib/medals-unlock'

export function ChallengesSection() {
  const { user } = useAuth()

  // State
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null)
  const [allCategories, setAllCategories] = useState<ChallengeCategory[]>([])
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<string>>(new Set())
  const [subTab, setSubTab] = useState<'desafios' | 'categorias'>('desafios')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize on mount
  useEffect(() => {
    if (!user?.id) return

    setIsLoading(true)
    ChallengesDataMock.initialize()

    // Load all categories
    const categories = ChallengesDataMock.getCategories()
    setAllCategories(categories)

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

  const handleChallengeCompleted = (challengeId: string) => {
    if (!activeCategory || !user?.id) return

    // 1. Find the challenge to get points
    const challenge = ChallengesDataMock.getChallengeById(challengeId)
    if (!challenge) return

    const previousPoints = parseInt(localStorage.getItem('user_points') || '0', 10)
    const newPoints = previousPoints + challenge.points

    // 2. Update local state
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    // 3. Save points to localStorage
    localStorage.setItem('user_points', newPoints.toString())

    // 4. ✅ Verificar e desbloquear medalhas
    const unlockedMedalIds = checkAndUnlockMedals(newPoints, previousPoints)

    // 5. Show notification for new medals
    unlockedMedalIds.forEach(medalId => {
      const medal = getMedalById(medalId)
      if (medal) {
        alert(`🏆 PARABÉNS! Você conquistou: ${medal.name}!`)
      }
    })

    // 6. Dispatch events to update other tabs
    window.dispatchEvent(new Event('pointsUpdated'))
    if (unlockedMedalIds.length > 0) {
      window.dispatchEvent(new Event('medalsUpdated'))
    }

    console.log(`✅ Desafio completo! +${challenge.points} pontos (Total: ${newPoints})`)
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
          <CategorySelectionModal userId={user?.id || ''} onCategorySelected={handleCategorySelected} />
        )}
      </div>
    )
  }

  // Render with active category
  return (
    <div className="space-y-6">
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
