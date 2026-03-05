import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { ChallengeCategory } from '../../../lib/challenges-data-mock'
import { supabaseClient } from '../../../lib/supabase-client'
import { CategoryCard } from './CategoryCard'
import { CategoryForm } from './CategoryForm'
import { DeleteCategoryModal } from './DeleteCategoryModal'

interface CategoriesListProps {
  onViewChallenges: (category: ChallengeCategory) => void
  onCategoryUpdated?: () => void
}

// Map Supabase category to mock's ChallengeCategory format (for UI components)
function toUiCategory(cat: any, easyCounts: Record<string, number>, hardCounts: Record<string, number>): ChallengeCategory {
  return {
    id: cat.id,
    label: cat.name || cat.label || '',
    icon: cat.icon || '📌',
    color: cat.color || 'from-gray-400 to-gray-600',
    description: cat.description,
    area: cat.area,
    easyCount: easyCounts[cat.id] ?? 0,
    hardCount: hardCounts[cat.id] ?? 0,
    completionRate: 0,
  }
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  onViewChallenges,
  onCategoryUpdated,
}) => {
  const [categories, setCategories] = useState<ChallengeCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [easyCounts, setEasyCounts] = useState<Record<string, number>>({})
  const [hardCounts, setHardCounts] = useState<Record<string, number>>({})

  const [formOpen, setFormOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | null>(null)

  const reloadCategories = async () => {
    try {
      const data = await supabaseClient.getChallengeCategories()
      // Load challenge counts for all categories concurrently
      const countResults = await Promise.all(
        data.map(cat => supabaseClient.getChallengesByCategory(cat.id))
      )
      const easy: Record<string, number> = {}
      const hard: Record<string, number> = {}
      data.forEach((cat, i) => {
        const challenges = countResults[i]
        easy[cat.id] = challenges.filter((c: any) => c.difficulty === 'facil' || c.difficulty === 'easy').length
        hard[cat.id] = challenges.filter((c: any) => c.difficulty === 'dificil' || c.difficulty === 'hard').length
      })
      setEasyCounts(easy)
      setHardCounts(hard)
      setCategories(data.map(cat => toUiCategory(cat, easy, hard)))
      onCategoryUpdated?.()
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    reloadCategories().finally(() => setIsLoading(false))
  }, [])

  const handleCreateCategory = async (data: Partial<ChallengeCategory>) => {
    await supabaseClient.createChallengeCategory({
      name: data.label || '',
      icon: data.icon || '📌',
      color: data.color || 'from-gray-400 to-gray-600',
    })
    await reloadCategories()
  }

  const handleEditCategory = (category: ChallengeCategory) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  const handleUpdateCategory = async (data: Partial<ChallengeCategory>) => {
    if (!selectedCategory) return
    await supabaseClient.updateChallengeCategory(selectedCategory.id, {
      name: data.label,
      icon: data.icon,
      color: data.color,
    })
    await reloadCategories()
  }

  const handleDeleteClick = (category: ChallengeCategory) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return
    await supabaseClient.deleteChallengeCategory(selectedCategory.id)
    setDeleteModalOpen(false)
    setSelectedCategory(null)
    await reloadCategories()
  }

  const getChallengeCounts = (categoryId: string) => {
    return (easyCounts[categoryId] ?? 0) + (hardCounts[categoryId] ?? 0)
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
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h2>
        <button
          onClick={() => {
            setSelectedCategory(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
        >
          <Plus size={20} />
          Criar Categoria
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteClick}
            onViewChallenges={onViewChallenges}
          />
        ))}
      </div>

      {/* Modals */}
      <CategoryForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedCategory(null)
        }}
        onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
        onSuccess={() => {
          setFormOpen(false)
          setSelectedCategory(null)
        }}
        initialData={selectedCategory || undefined}
      />

      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedCategory(null)
        }}
        onConfirm={handleDeleteConfirm}
        category={selectedCategory}
        challengeCount={
          selectedCategory ? getChallengeCounts(selectedCategory.id) : 0
        }
      />
    </div>
  )
}
