import React, { FC } from 'react'
import { X } from 'lucide-react'

interface Medal {
  id: string
  name: string
  icon: FC | string
  description?: string
  requirement?: number
  points?: number
  rarity?: string
  unlockDate?: string
  isEarned: boolean
}

interface MedalDetailModalProps {
  isOpen: boolean
  medal: Medal | null
  onClose: () => void
}

export const MedalDetailModal: React.FC<MedalDetailModalProps> = ({
  isOpen,
  medal,
  onClose
}) => {
  if (!isOpen || !medal) return null

  // Rarity color mapping
  const rarityColors: Record<string, string> = {
    'comum': 'bg-gray-100 text-gray-700 border-gray-300',
    'incomum': 'bg-green-100 text-green-700 border-green-300',
    'raro': 'bg-blue-100 text-blue-700 border-blue-300',
    'épico': 'bg-purple-100 text-purple-700 border-purple-300',
    'lendária': 'bg-yellow-100 text-yellow-700 border-yellow-300'
  }

  const rarityBadgeClass = rarityColors[medal.rarity || 'comum'] || rarityColors['comum']

  // Requirement text
  const getRequirementText = () => {
    if (medal.isEarned) {
      return medal.unlockDate ? `Desbloqueada em ${medal.unlockDate}` : 'Desbloqueada ✓'
    }

    if (medal.requirement) {
      return `Desbloqueie completando ${medal.requirement} desafios`
    }

    return 'Desbloqueie completando os requisitos'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-zayia-lilac/20">
          <h2 className="text-lg font-bold text-zayia-deep-violet">Detalhes da Medalha</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zayia-lilac/20 rounded-lg transition"
          >
            <X className="w-5 h-5 text-zayia-violet-gray" />
          </button>
        </div>

        {/* Medal content */}
        <div className="p-6">
          {/* Medal icon - large */}
          <div className="flex justify-center mb-6">
            <div className="text-8xl opacity-90">
              {typeof medal.icon === 'function'
                ? React.createElement(medal.icon as FC)
                : medal.icon}
            </div>
          </div>

          {/* Medal name */}
          <h3 className="text-2xl font-bold text-center text-zayia-deep-violet mb-3">
            {medal.name}
          </h3>

          {/* Rarity badge */}
          {medal.rarity && (
            <div className="flex justify-center mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold border ${rarityBadgeClass}`}>
                {medal.rarity.charAt(0).toUpperCase() + medal.rarity.slice(1)}
              </span>
            </div>
          )}

          {/* Description */}
          {medal.description && (
            <p className="text-center text-zayia-violet-gray text-sm mb-6">
              {medal.description}
            </p>
          )}

          {/* Earned status and unlock info */}
          <div className="bg-zayia-lilac/20 rounded-lg p-4 mb-6">
            <p className="text-center text-sm text-zayia-deep-violet font-semibold">
              {medal.isEarned ? '✅' : '🔒'} {getRequirementText()}
            </p>
          </div>

          {/* Points earned */}
          {medal.points && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-zayia-cream rounded-lg">
                <div className="text-2xl font-bold text-zayia-purple">
                  +{medal.points}
                </div>
                <div className="text-xs text-zayia-violet-gray">
                  Pontos
                </div>
              </div>

              {medal.isEarned && (
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    ✓
                  </div>
                  <div className="text-xs text-green-600">
                    Conquistada
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-zayia-purple to-zayia-soft-purple hover:from-zayia-soft-purple hover:to-zayia-purple text-white font-semibold rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
