import React from 'react'
import { Edit, Trash2, ChevronRight } from 'lucide-react'
import { ChallengeCategory } from '../../../lib/challenges-data-mock'

interface CategoryCardProps {
  category: ChallengeCategory
  onEdit: (category: ChallengeCategory) => void
  onDelete: (category: ChallengeCategory) => void
  onViewChallenges: (category: ChallengeCategory) => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onViewChallenges,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{category.icon}</div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
            title="Editar categoria"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
            title="Deletar categoria"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Category Name */}
      <h3 className="text-xl font-bold mb-2">{category.label}</h3>

      {/* Description (if exists) */}
      {category.description && (
        <p className="text-sm text-white/80 mb-4 line-clamp-2">
          {category.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex gap-6 mb-6 text-sm font-semibold">
        <div>
          <div className="opacity-80">Fáceis</div>
          <div className="text-2xl">{category.easyCount}</div>
        </div>
        <div>
          <div className="opacity-80">Difíceis</div>
          <div className="text-2xl">{category.hardCount}</div>
        </div>
        <div>
          <div className="opacity-80">Conclusão</div>
          <div className="text-2xl">{category.completionRate}%</div>
        </div>
      </div>

      {/* View Challenges Button */}
      <button
        onClick={() => onViewChallenges(category)}
        className="w-full bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
      >
        Ver Desafios
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
