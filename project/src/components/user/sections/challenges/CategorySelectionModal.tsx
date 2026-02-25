import React, { useState } from 'react'
import { X } from 'lucide-react'
import ChallengesDataMock, { ChallengeCategory } from '../../../../lib/challenges-data-mock'

interface CategorySelectionModalProps {
  userId: string
  onCategorySelected: (category: ChallengeCategory) => void
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  userId,
  onCategorySelected,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  ChallengesDataMock.initialize()
  const categories = ChallengesDataMock.getCategories()

  const handleConfirm = async () => {
    if (!selectedCategoryId) return

    setIsLoading(true)
    const success = ChallengesDataMock.setActiveCategory(userId, selectedCategoryId)

    if (success) {
      const category = ChallengesDataMock.getCategoryById(selectedCategoryId)
      if (category) {
        onCategorySelected(category)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Escolha Sua Categoria de Desafios
          </h2>
          <X size={24} className="text-gray-500 cursor-pointer" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <p className="text-amber-900">
              ⚠️ <strong>Atenção:</strong> Esta escolha é permanente. Você não poderá trocar de
              categoria até completar TODOS os 120 desafios. Você está pronta?
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`p-4 rounded-xl border-2 transition ${
                  selectedCategoryId === category.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{category.label}</div>
                <div className="text-xs text-gray-500 mt-1">120 desafios</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Escolher Depois
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCategoryId || isLoading}
            className="flex-1 px-4 py-2 bg-zayia-purple hover:bg-zayia-deep-violet text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isLoading ? 'Confirmando...' : 'Confirmar Escolha'}
          </button>
        </div>
      </div>
    </div>
  )
}
