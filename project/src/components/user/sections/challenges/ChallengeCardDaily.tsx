import React from 'react'
import { Check } from 'lucide-react'
import { Challenge } from '../../../../lib/challenges-data-mock'

interface ChallengeCardDailyProps {
  challenge: Challenge
  isCompleted: boolean
  onComplete: () => void
}

export const ChallengeCardDaily: React.FC<ChallengeCardDailyProps> = ({
  challenge,
  isCompleted,
  onComplete,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition ${
        isCompleted
          ? 'bg-green-50 border-green-300'
          : 'bg-white border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h6 className="font-bold text-gray-900">{challenge.title}</h6>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{challenge.description}</p>

          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>⏱️ {challenge.duration}min</span>
            <span>⭐ {challenge.points}pts</span>
          </div>
        </div>

        {isCompleted ? (
          <div className="flex-shrink-0">
            <div className="bg-green-500 text-white p-2 rounded-full">
              <Check size={20} />
            </div>
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="flex-shrink-0 px-4 py-2 bg-zayia-purple text-white rounded-lg hover:bg-zayia-deep-violet font-bold text-sm transition"
          >
            Completar
          </button>
        )}
      </div>
    </div>
  )
}
