import React from 'react'
import type { Badge } from '../../../lib/supabase-client'

// Função para obter cor de raridade baseado em nome/tipo
function getRarityColor(rarity?: string): string {
  switch (rarity?.toLowerCase()) {
    case 'comum':
      return 'text-gray-500'
    case 'raro':
      return 'text-blue-500'
    case 'épico':
      return 'text-purple-500'
    case 'lendário':
      return 'text-yellow-500'
    default:
      return 'text-gray-400'
  }
}

interface MedalCardProps {
  badge: Badge
}

export const MedalCard: React.FC<MedalCardProps> = ({ badge }) => {
  const IconComponent = badge.icon

  return (
    <div
      className="p-4 rounded-lg text-center border-2 transition-all hover:shadow-lg hover:scale-105"
      style={{
        backgroundColor: `${badge.color}20`,
        borderColor: badge.color
      }}
    >
      {/* Ícone grande 3D */}
      <div className="w-16 h-16 mx-auto mb-2">
        <IconComponent />
      </div>

      {/* Nome */}
      <h4 className="font-bold text-gray-900 text-sm mb-1">{badge.name}</h4>

      {/* Raridade */}
      <div className={`text-xs font-semibold mb-2 ${getRarityColor(badge.rarity)}`}>
        {badge.rarity.toUpperCase()}
      </div>

      {/* Requerimento */}
      <p className="text-xs text-gray-600 mb-2">{badge.requirement} desafios</p>

      {/* Pontos */}
      <div className="text-lg font-bold text-gray-900">
        +{badge.points} pts
      </div>
    </div>
  )
}
