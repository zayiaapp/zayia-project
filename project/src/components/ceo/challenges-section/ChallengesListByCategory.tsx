import React, { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Challenge, ChallengeCategory } from '../../../lib/supabase-client'
import { supabaseClient } from '../../../lib/supabase-client'
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

// Map Supabase Challenge to mock's Challenge format (for UI components)
function dbToUi(ch: any): Challenge {
  return {
    id: ch.id,
    category_id: ch.category_id,
    title: ch.title,
    description: ch.description || '',
    points_easy: ch.points_easy ?? 10,
    points_hard: ch.points_hard ?? 25,
    duration_minutes: ch.duration_minutes ?? 5,
    difficulty: (ch.difficulty === 'easy' ? 'facil' : ch.difficulty === 'hard' ? 'dificil' : ch.difficulty) as 'facil' | 'dificil',
    is_active: ch.is_active ?? true,
    created_at: ch.created_at || new Date().toISOString(),
    updated_at: ch.updated_at || new Date().toISOString(),
  }
}

// Map mock's Challenge format to Supabase update payload
function uiToDb(data: Partial<Challenge>): any {
  const out: any = {}
  if (data.title !== undefined) out.title = data.title
  if (data.description !== undefined) out.description = data.description
  if (data.difficulty !== undefined) out.difficulty = data.difficulty
  if (data.category_id !== undefined) out.category_id = data.category_id
  if (data.duration !== undefined) out.duration_minutes = data.duration
  if (data.points !== undefined) {
    out.points_easy = data.points
    out.points_hard = data.points
  }
  return out
}

// Pure client-side filter
function searchChallenges(challenges: Challenge[], difficulty: 'facil' | 'dificil' | 'both', query: string): Challenge[] {
  let filtered = [...challenges]
  if (difficulty !== 'both') {
    filtered = filtered.filter(c => c.difficulty === difficulty)
  }
  if (query.trim()) {
    const q = query.toLowerCase()
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }
  return filtered
}

// Pure client-side sort
function sortChallenges(challenges: Challenge[], sortBy: SortOption): Challenge[] {
  const sorted = [...challenges]
  switch (sortBy) {
    case 'title-asc': sorted.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'title-desc': sorted.sort((a, b) => b.title.localeCompare(a.title)); break
    case 'points-asc': sorted.sort((a, b) => a.points - b.points); break
    case 'points-desc': sorted.sort((a, b) => b.points - a.points); break
    case 'duration-asc': sorted.sort((a, b) => a.duration - b.duration); break
    case 'duration-desc': sorted.sort((a, b) => b.duration - a.duration); break
    default: break
  }
  return sorted
}

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
  const [isLoading, setIsLoading] = useState(true)

  const [allChallenges, setAllChallenges] = useState<Challenge[]>([])

  const reloadChallenges = async () => {
    try {
      const data = await supabaseClient.getChallengesByCategory(category.id)
      setAllChallenges(data.map(dbToUi))
    } catch (error) {
      console.error('Error loading challenges:', error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    reloadChallenges().finally(() => setIsLoading(false))
  }, [category.id])

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return searchChallenges(allChallenges, difficulty, searchQuery)
  }, [allChallenges, difficulty, searchQuery])

  // Sort challenges
  const sortedChallenges = useMemo(() => {
    return sortChallenges(filteredChallenges, sortBy)
  }, [filteredChallenges, sortBy])

  // Split by difficulty
  const easyChallenges = sortedChallenges.filter(c => c.difficulty === 'facil')
  const hardChallenges = sortedChallenges.filter(c => c.difficulty === 'dificil')

  // Paginate
  const easyVisible = easyChallenges.slice(0, easyPage * ITEMS_PER_PAGE)
  const hardVisible = hardChallenges.slice(0, hardPage * ITEMS_PER_PAGE)

  const handleCreateChallenge = async (data: Partial<Challenge>) => {
    await supabaseClient.createChallenge({
      title: data.title || '',
      description: data.description || '',
      category_id: data.category_id || category.id,
      difficulty: data.difficulty || 'facil',
      points_easy: data.points || 10,
      points_hard: data.points || 25,
      duration_minutes: data.duration,
    })
    await reloadChallenges()
  }

  const handleEditChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setFormOpen(true)
  }

  const handleUpdateChallenge = async (data: Partial<Challenge>) => {
    if (!selectedChallenge) return
    await supabaseClient.updateChallenge(selectedChallenge.id, uiToDb(data))
    await reloadChallenges()
  }

  const handleDeleteClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedChallenge) return
    await supabaseClient.deleteChallenge(selectedChallenge.id)
    setDeleteModalOpen(false)
    setSelectedChallenge(null)
    await reloadChallenges()
  }

  const handleDuplicateChallenge = async (challenge: Challenge) => {
    await supabaseClient.createChallenge({
      title: `${challenge.title} (cópia)`,
      description: challenge.description,
      category_id: challenge.category_id || category.id,
      difficulty: challenge.difficulty,
      points_easy: challenge.difficulty === 'facil' ? challenge.points : 10,
      points_hard: challenge.difficulty === 'dificil' ? challenge.points : 25,
      duration_minutes: challenge.duration,
    })
    await reloadChallenges()
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

  const handleBulkEdit = async (updates: Partial<Challenge>) => {
    await supabaseClient.bulkUpdateChallenges(Array.from(selectedChallenges), uiToDb(updates))
    setSelectedChallenges(new Set())
    setBulkEditOpen(false)
    await reloadChallenges()
  }

  const handleBulkDelete = async () => {
    await supabaseClient.bulkDeleteChallenges(Array.from(selectedChallenges))
    setSelectedChallenges(new Set())
    setBulkDeleteOpen(false)
    await reloadChallenges()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
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
        onSubmit={selectedChallenge ? handleUpdateChallenge : handleCreateChallenge}
        onSuccess={() => {
          setFormOpen(false)
          setSelectedChallenge(null)
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
