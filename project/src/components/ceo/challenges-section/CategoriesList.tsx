import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import ChallengesDataMock, { ChallengeCategory } from '../../../lib/challenges-data-mock'
import { CategoryCard } from './CategoryCard'
import { CategoryForm } from './CategoryForm'
import { DeleteCategoryModal } from './DeleteCategoryModal'

interface CategoriesListProps {
  onViewChallenges: (category: ChallengeCategory) => void
  onCategoryUpdated?: () => void
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  onViewChallenges,
  onCategoryUpdated,
}) => {
  const [categories, setCategories] = useState<ChallengeCategory[]>(() => {
    ChallengesDataMock.initialize()
    return ChallengesDataMock.getCategories()
  })

  const [formOpen, setFormOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | null>(null)

  const reloadCategories = () => {
    setCategories(ChallengesDataMock.getCategories())
    onCategoryUpdated?.()
  }

  const handleCreateCategory = (data: Partial<ChallengeCategory>) => {
    ChallengesDataMock.createCategory(data)
    reloadCategories()
  }

  const handleEditCategory = (category: ChallengeCategory) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  const handleUpdateCategory = (data: Partial<ChallengeCategory>) => {
    if (!selectedCategory) return
    ChallengesDataMock.updateCategory(selectedCategory.id, data)
    reloadCategories()
  }

  const handleDeleteClick = (category: ChallengeCategory) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!selectedCategory) return
    ChallengesDataMock.deleteCategory(selectedCategory.id)
    setDeleteModalOpen(false)
    reloadCategories()
  }

  const getChallengeCounts = (categoryId: string) => {
    const count = ChallengesDataMock.getChallengeCount(categoryId)
    return count.easy + count.hard
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
          reloadCategories()
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
