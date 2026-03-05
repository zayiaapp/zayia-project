import React, { useState } from 'react'
import { Edit, Trash2, Copy, Check } from 'lucide-react'
import { Challenge } from '../../../lib/supabase-client' 

interface ChallengeCardProps {
  challenge: Challenge
  index: number
  isSelected?: boolean
  onSelect?: (challengeId: string) => void
  onEdit: (challenge: Challenge) => void
  onDelete: (challenge: Challenge) => void
  onDuplicate: (challenge: Challenge) => void
  showCheckbox?: boolean
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  showCheckbox,
}) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className={`bg-white border-2 rounded-xl p-4 transition ${
        isSelected
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-purple-300'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex gap-4">
        {/* Checkbox */}
        {showCheckbox && (
          <button
            onClick={() => onSelect?.(challenge.id)}
            className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
              isSelected
                ? 'bg-purple-500 border-purple-500'
                : 'border-gray-300 hover:border-purple-500'
            }`}
          >
            {isSelected && <Check size={16} className="text-white" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">
                #{index + 1}
              </div>
              <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                {challenge.title}
              </h4>
            </div>
            <div className="flex-shrink-0 inline-block px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700">
              {challenge.points}pts
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {challenge.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span>⏱️ {challenge.duration}min</span>
            <span>
              {challenge.difficulty === 'facil' ? '😊 Fácil' : '💪 Difícil'}
            </span>
          </div>

          {/* Actions */}
          {isHovering && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(challenge)}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition"
              >
                <Edit size={14} />
                Editar
              </button>
              <button
                onClick={() => onDuplicate(challenge)}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition"
              >
                <Copy size={14} />
                Duplicar
              </button>
              <button
                onClick={() => onDelete(challenge)}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition"
              >
                <Trash2 size={14} />
                Deletar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
