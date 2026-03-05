import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import { ChallengeCategory } from '../../../../lib/supabase-client'

interface CategoriesLockedViewProps {
  activeCategory: ChallengeCategory
  allCategories: ChallengeCategory[]
}

export const CategoriesLockedView: React.FC<CategoriesLockedViewProps> = ({
  activeCategory,
  allCategories,
}) => {
  const [showWarning, setShowWarning] = useState(false)
  const [selectedLockedCategory, setSelectedLockedCategory] = useState<ChallengeCategory | null>(
    null
  )

  const handleLockedCategoryClick = (category: ChallengeCategory) => {
    if (category.id !== activeCategory.id) {
      setSelectedLockedCategory(category)
      setShowWarning(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          📌 <strong>Categoria Ativa:</strong> {activeCategory.label}
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Complete todos os 120 desafios para desbloquear outras categorias
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allCategories.map(category => (
          <button
            key={category.id}
            onClick={() => handleLockedCategoryClick(category)}
            disabled={category.id === activeCategory.id}
            className={`relative p-4 rounded-lg border-2 transition cursor-pointer ${
              category.id === activeCategory.id
                ? 'bg-zayia-lilac/20 border-zayia-soft-purple cursor-default'
                : 'bg-white border-gray-400 hover:border-gray-500'
            }`}
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <div className="font-bold text-gray-900 text-sm">{category.label}</div>
            <div className="text-xs text-gray-500">120 desafios</div>

            {/* Cadeado - para categorias não ativas */}
            {category.id !== activeCategory.id && (
              <div className="absolute top-2 right-2 bg-gray-400 text-white p-1 rounded">
                <Lock size={16} />
              </div>
            )}

            {/* Badge de ativa */}
            {category.id === activeCategory.id && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                Ativa
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Modal de aviso */}
      {showWarning && selectedLockedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <Lock className="text-amber-500 mr-2" size={28} />
              <p className="text-xl font-bold text-gray-900">Categoria Bloqueada</p>
            </div>

            <p className="text-gray-600 mb-6 text-center">
              Você já tem uma categoria ativa (<strong>{activeCategory.label}</strong>).
              <br />
              Complete todos os 120 desafios para começar outra.
            </p>

            <button
              onClick={() => setShowWarning(false)}
              style={{ backgroundColor: '#8B4FC1', color: 'white' }}
              className="w-full px-4 py-2 rounded-lg font-bold cursor-pointer"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
