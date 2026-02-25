import React, { useState, useMemo } from 'react'
import { ChevronLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import ChallengesDataMock, {
  Challenge,
  ChallengeCategory,
} from '../../../lib/challenges-data-mock'
import { ChallengeCard } from './ChallengeCard'
import { SearchFilterBar } from './SearchFilterBar'
import { SortDropdown } from './SortDropdown'
import { ChallengeForm } from './ChallengeForm'
import { DeleteChallengeModal } from './DeleteChallengeModal'
import { BulkActions } from './BulkActions'
import { BulkEditModal } from './BulkEditModal'
import { BulkDeleteModal } from './BulkDeleteModal'

interface ChallengesListByCategoryProps {
  category: ChallengeCategory
  onBack: () => void
  categories: ChallengeCategory[]
}

type SortOption =
  | 'title-asc'
  | 'title-desc'
  | 'points-asc'
  | 'points-desc'
  | 'duration-asc'
  | 'duration-desc'
  | 'popularity'

const ITEMS_PER_PAGE = 12

export const ChallengesListByCategory: React.FC<ChallengesListByCategoryProps> = ({
  category,
  onBack,
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficulty, setDifficulty] = useState<'facil' | 'dificil' | 'both'>('both')
  const [sortBy, setSortBy] = useState<SortOption>('title-asc')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedChallenges, setSelectedChallenges] = useState<Set<string>>(new Set())
  const [easyExpanded, setEasyExpanded] = useState(true)
  const [hardExpanded, setHardExpanded] = useState(true)
  const [easyPage, setEasyPage] = useState(1)
  const [hardPage, setHardPage] = useState(1)

  // Get all challenges for this category
  const [allChallenges, setAllChallenges] = useState<Challenge[]>(() =>
    ChallengesDataMock.getChallengesByCategory(category.id)
  )

  const reloadChallenges = () => {
    const updated = ChallengesDataMock.getChallengesByCategory(category.id)
    setAllChallenges(updated)
  }

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return ChallengesDataMock.searchChallenges(
      category.id,
      difficulty,
      searchQuery
    )
  }, [allChallenges, category.id, difficulty, searchQuery])

  // Sort challenges
  const sortedChallenges = useMemo(() => {
    return ChallengesDataMock.sortChallenges(filteredChallenges, sortBy)
  }, [filteredChallenges, sortBy])

  // Split by difficulty
  const easyChallenges = sortedChallenges.filter(c => c.difficulty === 'facil')
  const hardChallenges = sortedChallenges.filter(c => c.difficulty === 'dificil')

  // Paginate
  const easyVisible = easyChallenges.slice(
    0,
    easyPage * ITEMS_PER_PAGE
  )
  const hardVisible = hardChallenges.slice(
    0,
    hardPage * ITEMS_PER_PAGE
  )

  const handleCreateChallenge = (data: Partial<Challenge>) => {
    ChallengesDataMock.createChallenge(data)
    reloadChallenges()
  }

  const handleEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setFormOpen(true)
  }

  const handleUpdateChallenge = (data: Partial<Challenge>) => {
    if (!selectedChallenge) return
    ChallengesDataMock.updateChallenge(selectedChallenge.id, data)
    reloadChallenges()
  }

  const handleDeleteClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!selectedChallenge) return
    ChallengesDataMock.deleteChallenge(selectedChallenge.id)
    setDeleteModalOpen(false)
    reloadChallenges()
  }

  const handleDuplicateChallenge = (challenge: Challenge) => {
    ChallengesDataMock.duplicateChallenge(challenge.id)
    reloadChallenges()
  }

  const handleSelectChallenge = (challengeId: string) => {
    const newSelected = new Set(selectedChallenges)
    if (newSelected.has(challengeId)) {
      newSelected.delete(challengeId)
    } else {
      newSelected.add(challengeId)
    }
    setSelectedChallenges(newSelected)
  }

  const handleBulkEdit = (updates: Partial<Challenge>) => {
    ChallengesDataMock.bulkUpdateChallenges(Array.from(selectedChallenges), updates)
    setSelectedChallenges(new Set())
    setBulkEditOpen(false)
    reloadChallenges()
  }

  const handleBulkDelete = () => {
    ChallengesDataMock.bulkDeleteChallenges(Array.from(selectedChallenges))
    setSelectedChallenges(new Set())
    setBulkDeleteOpen(false)
    reloadChallenges()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
            <p className="text-sm text-gray-600">
              {allChallenges.length} desafios no total
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedChallenge(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
        >
          <Plus size={20} />
          Criar Desafio
        </button>
      </div>

      {/* Search & Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />

      {/* Sort */}
      <div className="flex justify-end">
        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Bulk Actions */}
      {selectedChallenges.size > 0 && (
        <BulkActions
          selectedCount={selectedChallenges.size}
          onBulkEdit={() => setBulkEditOpen(true)}
          onBulkDelete={() => setBulkDeleteOpen(true)}
          onClearSelection={() => setSelectedChallenges(new Set())}
        />
      )}

      {/* Easy Challenges */}
      <div className="space-y-3">
        <button
          onClick={() => setEasyExpanded(!easyExpanded)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          <span>
            {easyExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
          😊 Desafios Fáceis ({easyChallenges.length})
        </button>

        {easyExpanded && (
          <div className="space-y-3">
            {easyVisible.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-3">
                  {easyVisible.map((challenge, idx) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      index={idx}
                      isSelected={selectedChallenges.has(challenge.id)}
                      onSelect={handleSelectChallenge}
                      onEdit={handleEditChallenge}
                      onDelete={handleDeleteClick}
                      onDuplicate={handleDuplicateChallenge}
                      showCheckbox={true}
                    />
                  ))}
                </div>

                {easyVisible.length < easyChallenges.length && (
                  <button
                    onClick={() => setEasyPage(easyPage + 1)}
                    className="w-full px-4 py-2 text-green-600 font-semibold hover:bg-green-50 rounded-lg transition"
                  >
                    Ver mais ({easyChallenges.length - easyVisible.length} faltando)
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600 py-4">Nenhum desafio fácil encontrado</p>
            )}
          </div>
        )}
      </div>

      {/* Hard Challenges */}
      <div className="space-y-3">
        <button
          onClick={() => setHardExpanded(!hardExpanded)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          <span>
            {hardExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
          💪 Desafios Difíceis ({hardChallenges.length})
        </button>

        {hardExpanded && (
          <div className="space-y-3">
            {hardVisible.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-3">
                  {hardVisible.map((challenge, idx) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      index={idx}
                      isSelected={selectedChallenges.has(challenge.id)}
                      onSelect={handleSelectChallenge}
                      onEdit={handleEditChallenge}
                      onDelete={handleDeleteClick}
                      onDuplicate={handleDuplicateChallenge}
                      showCheckbox={true}
                    />
                  ))}
                </div>

                {hardVisible.length < hardChallenges.length && (
                  <button
                    onClick={() => setHardPage(hardPage + 1)}
                    className="w-full px-4 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-lg transition"
                  >
                    Ver mais ({hardChallenges.length - hardVisible.length} faltando)
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600 py-4">Nenhum desafio difícil encontrado</p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ChallengeForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedChallenge(null)
        }}
        onSubmit={
          selectedChallenge ? handleUpdateChallenge : handleCreateChallenge
        }
        onSuccess={() => {
          setFormOpen(false)
          setSelectedChallenge(null)
          reloadChallenges()
        }}
        initialData={selectedChallenge || undefined}
        defaultCategoryId={category.id}
        categories={categories}
      />

      <DeleteChallengeModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedChallenge(null)
        }}
        onConfirm={handleDeleteConfirm}
        challenge={selectedChallenge}
      />

      <BulkEditModal
        isOpen={bulkEditOpen}
        onClose={() => setBulkEditOpen(false)}
        onSubmit={handleBulkEdit}
        selectedCount={selectedChallenges.size}
        categories={categories}
      />

      <BulkDeleteModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        count={selectedChallenges.size}
      />
    </div>
  )
}
