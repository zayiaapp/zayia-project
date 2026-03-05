import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabaseClient } from '../../../../lib/supabase-client'

interface CategorySelectionModalProps {
  userId: string
  onCategorySelected: (category: any) => void
  onClose: () => void
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  userId,
  onCategorySelected,
  onClose,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)

  // Load categories from Supabase on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await supabaseClient.getChallengeCategories()
        // Map Supabase structure to match component expectations
        const mappedCategories = data.map((cat: any) => ({
          ...cat,
          label: cat.name, // Map 'name' to 'label' for backward compatibility
        }))
        setCategories(mappedCategories)
      } catch (error) {
        console.error('❌ Error loading categories:', error)
        setCategories([])
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const handleConfirm = async () => {
    if (!selectedCategoryId) return

    setIsConfirming(true)
    const success = await supabaseClient.setUserActiveCategory(userId, selectedCategoryId)

    if (success) {
      const category = categories.find((cat: any) => cat.id === selectedCategoryId)
      if (category) onCategorySelected(category)
    }
    setIsConfirming(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Escolha Sua Categoria de Desafios
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1 rounded hover:bg-gray-100"
            title="Fechar modal"
          >
            <X size={24} />
          </button>
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
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
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
            onClick={onClose}
            disabled={isConfirming}
            className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold transition ${
              isConfirming ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
            }`}
          >
            Escolher Depois
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCategoryId || isConfirming}
            style={!selectedCategoryId || isConfirming ? { backgroundColor: '#9CA3AF', color: '#4B5563' } : { backgroundColor: '#8B4FC1', color: 'white' }}
            className="flex-1 px-4 py-2 rounded-lg font-semibold cursor-pointer"
          >
            {isConfirming ? 'Confirmando...' : 'Confirmar Escolha'}
          </button>
        </div>
      </div>
    </div>
  )
}
