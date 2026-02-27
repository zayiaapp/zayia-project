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
  const [unlockedMedalPopup, setUnlockedMedalPopup] = useState<any>(null)
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

  const handleChallengeCompleted = (challengeId: string) => {
    if (!activeCategory || !user?.id) return

    console.log('═══════════════════════════════════════════')
    console.log('🚀 INICIANDO PROCESSAMENTO DE DESAFIO')
    console.log('═══════════════════════════════════════════')

    // 1. LIMPAR valores antigos e pegar valores CORRETOS
    const challenge = ChallengesDataMock.getChallengeById(challengeId)
    if (!challenge) return

    // ⚠️ IMPORTANTE: Pegar valor EXATO do localStorage
    const storedPointsString = localStorage.getItem('user_points')
    const previousPoints = storedPointsString ? parseInt(storedPointsString, 10) : 0

    console.log('📊 ESTADO INICIAL:')
    console.log('   - Pontos anteriores:', previousPoints)
    console.log('   - Valor em localStorage:', storedPointsString)
    console.log('   - ID Desafio:', challengeId)
    console.log('   - Pontos do desafio:', challenge.points)

    // 2. Calcular APENAS desafio (sem medalhas ainda)
    const pointsFromChallenge = challenge.points // EX: 10
    const totalAfterChallenge = previousPoints + pointsFromChallenge // EX: 50 + 10 = 60

    console.log('✅ APÓS DESAFIO:')
    console.log('   - Pontos adicionados:', pointsFromChallenge)
    console.log('   - Total temporário:', totalAfterChallenge)

    // 3. Update local state
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    // 4. ✅ Verificar e desbloquear medalhas (nível + categoria)
    const unlockedLevelMedalIds = checkAndUnlockMedals(totalAfterChallenge, previousPoints, user.id)

    console.log('🏆 MEDALHAS DESBLOQUEADAS (por nível):', unlockedLevelMedalIds)

    // 5. ✅ Detectar NOVAS medalhas conquistadas
    const currentEarnedBadges = getEarnedBadges()
    const newUnlockedMedalIds = currentEarnedBadges.filter(id => !previousEarnedBadges.has(id))
    setPreviousEarnedBadges(new Set(currentEarnedBadges))

    console.log('🎖️ MEDALHAS DESBLOQUEADAS (novas):', newUnlockedMedalIds)

    // 6. Combinar medalhas
    const allNewMedals = [...unlockedLevelMedalIds, ...newUnlockedMedalIds]

    console.log('🎯 TODAS MEDALHAS NOVAS:', allNewMedals)

    // 7. ✅ CALCULAR PONTOS FINAIS (APENAS UMA VEZ)
    let finalTotalPoints = totalAfterChallenge // Começa com desafio

    let medalPointsAdded = 0
    allNewMedals.forEach(medalId => {
      const medalObj = BADGES.find(b => b.id === medalId)
      if (medalObj && medalObj.points) {
        medalPointsAdded += medalObj.points
        console.log(`   💎 ${medalObj.name}: +${medalObj.points}`)
      }
    })

    finalTotalPoints += medalPointsAdded

    console.log('💰 CÁLCULO FINAL:')
    console.log('   - Pontos anteriores: ' + previousPoints)
    console.log('   - Desafio: +' + pointsFromChallenge)
    console.log('   - Medalhas: +' + medalPointsAdded)
    console.log('   - TOTAL FINAL: ' + finalTotalPoints)

    // 8. ⚠️ SALVAR APENAS UMA VEZ
    localStorage.setItem('user_points', finalTotalPoints.toString())

    console.log('✅ SALVO EM localStorage:', finalTotalPoints)

    // 9. Show pop-up for first new medal
    if (allNewMedals.length > 0) {
      const newMedalId = allNewMedals[0]
      const medalObj = BADGES.find(b => b.id === newMedalId)

      if (medalObj) {
        console.log('🎪 MOSTRANDO POP-UP:', medalObj.name)
        setUnlockedMedalPopup(medalObj)
      }
    } else {
      console.log('❌ Nenhuma medalha nova')
    }

    // 10. Incrementar contador de desafios hoje
    incrementDailyCount()

    // 11. ⚠️ DISPATCH EVENTOS (APENAS UMA VEZ!)
    window.dispatchEvent(new Event('pointsUpdated'))
    window.dispatchEvent(new Event('dailyProgressUpdated'))
    if (allNewMedals.length > 0) {
      window.dispatchEvent(new Event('medalsUpdated'))
    }

    console.log('═══════════════════════════════════════════')
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
