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

    console.clear() // LIMPAR console para clareza
    console.log('╔═══════════════════════════════════════════╗')
    console.log('║ 🚀 PROCESSAMENTO DE DESAFIO               ║')
    console.log('╚═══════════════════════════════════════════╝')

    // 1. PEGAR VALORES INICIAIS
    const challenge = ChallengesDataMock.getChallengeById(challengeId)
    if (!challenge) {
      console.error('❌ DESAFIO NÃO ENCONTRADO:', challengeId)
      return
    }

    // ⚠️ CRÍTICO: Ler localStorage EXATAMENTE como está
    const beforeStorage = localStorage.getItem('user_points')
    const previousPoints = beforeStorage ? parseInt(beforeStorage, 10) : 0

    console.log('\n📊 LEITURA DO STORAGE:')
    console.log('   localStorage.getItem("user_points"):', beforeStorage)
    console.log('   Interpretado como número:', previousPoints)
    console.log('   Tipo:', typeof previousPoints)

    console.log('\n📋 DESAFIO:')
    console.log('   ID:', challengeId)
    console.log('   Pontos:', challenge.points)
    console.log('   Tipo:', typeof challenge.points)

    // 2. CALCULAR PONTOS DO DESAFIO
    const pointsFromChallenge = challenge.points
    const totalAfterChallenge = previousPoints + pointsFromChallenge

    console.log('\n🧮 CÁLCULO DO DESAFIO:')
    console.log('   ' + previousPoints + ' + ' + pointsFromChallenge + ' = ' + totalAfterChallenge)

    // 3. Update local state
    const newCompleted = new Set(completedChallengeIds)
    newCompleted.add(challengeId)
    setCompletedChallengeIds(newCompleted)

    // 4. VERIFICAR MEDALHAS
    console.log('\n🎖️ VERIFICANDO MEDALHAS:')
    const unlockedLevelMedalIds = checkAndUnlockMedals(totalAfterChallenge, previousPoints, user.id)
    console.log('   checkAndUnlockMedals() retornou:', unlockedLevelMedalIds)

    // 5. DETECTAR NOVAS MEDALHAS
    const currentEarnedBadges = getEarnedBadges()
    const newUnlockedMedalIds = currentEarnedBadges.filter(id => !previousEarnedBadges.has(id))
    setPreviousEarnedBadges(new Set(currentEarnedBadges))

    console.log('   Novas medalhas detectadas:', newUnlockedMedalIds)

    // 6. COMBINAR TODAS MEDALHAS
    const allNewMedals = [...unlockedLevelMedalIds, ...newUnlockedMedalIds]
    console.log('   Total de medalhas novas:', allNewMedals)

    // 7. CALCULAR PONTOS DAS MEDALHAS
    console.log('\n💎 PONTOS DAS MEDALHAS:')
    let medalPointsAdded = 0
    allNewMedals.forEach((medalId, index) => {
      const medalObj = BADGES.find(b => b.id === medalId)
      console.log(`   [${index + 1}] ${medalId}`)
      if (medalObj) {
        console.log(`       Nome: ${medalObj.name}`)
        console.log(`       Pontos: ${medalObj.points}`)
        if (medalObj.points) {
          medalPointsAdded += medalObj.points
          console.log(`       Somando: medalPointsAdded += ${medalObj.points}`)
        }
      } else {
        console.log(`       ⚠️ MEDALHA NÃO ENCONTRADA EM BADGES!`)
      }
    })

    console.log(`   Total de pontos de medalhas: ${medalPointsAdded}`)

    // 8. CALCULAR TOTAL FINAL
    const finalTotalPoints = totalAfterChallenge + medalPointsAdded

    console.log('\n💰 CÁLCULO FINAL:')
    console.log('   Fórmula: previousPoints + challenge + medals')
    console.log('            ' + previousPoints + ' + ' + pointsFromChallenge + ' + ' + medalPointsAdded + ' = ' + finalTotalPoints)

    // 9. SALVAR APENAS UMA VEZ
    localStorage.setItem('user_points', finalTotalPoints.toString())
    const afterStorage = localStorage.getItem('user_points')

    console.log('\n✅ SALVANDO EM STORAGE:')
    console.log('   localStorage.setItem("user_points", "' + finalTotalPoints + '")')
    console.log('   Verificação: localStorage.getItem("user_points") =', afterStorage)
    console.log('   Match:', afterStorage === finalTotalPoints.toString() ? '✅ SIM' : '❌ NÃO')

    // 10. MOSTRAR POP-UP
    if (allNewMedals.length > 0) {
      const newMedalId = allNewMedals[0]
      const medalObj = BADGES.find(b => b.id === newMedalId)
      if (medalObj) {
        console.log('\n🎪 EXIBINDO POP-UP:')
        console.log('   ' + medalObj.name + ' (+' + medalObj.points + ' pts)')
        setUnlockedMedalPopup(medalObj)
      }
    }

    // 11. INCREMENTAR DESAFIOS HOJE
    incrementDailyCount()

    // 12. DISPARAR EVENTOS
    console.log('\n📡 DISPARANDO EVENTOS:')
    console.log('   pointsUpdated')
    console.log('   dailyProgressUpdated')
    if (allNewMedals.length > 0) {
      console.log('   medalsUpdated')
    }

    window.dispatchEvent(new Event('pointsUpdated'))
    window.dispatchEvent(new Event('dailyProgressUpdated'))
    if (allNewMedals.length > 0) {
      window.dispatchEvent(new Event('medalsUpdated'))
    }

    console.log('\n╔═══════════════════════════════════════════╗')
    console.log('║ ✅ PROCESSAMENTO CONCLUÍDO                ║')
    console.log('║ Dashboard deve mostrar: ' + finalTotalPoints + ' pts            ║')
    console.log('╚═══════════════════════════════════════════╝\n')
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
