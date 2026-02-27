import { X } from 'lucide-react'

interface PopUpMedalUnlockedProps {
  isOpen: boolean
  medal: {
    id: string
    name: string
    icon: React.ComponentType | string
    category: string
    points: number
  } | null
  onClose: () => void
  onViewMedal: () => void
}

export function PopUpMedalUnlocked({
  isOpen,
  medal,
  onClose,
  onViewMedal,
}: PopUpMedalUnlockedProps) {
  if (!isOpen || !medal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-2xl relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Confete visual */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-zayia-deep-violet mb-2">
            Parabéns!
          </h2>
          <p className="text-zayia-violet-gray text-sm">
            Você conquistou uma nova medalha
          </p>
        </div>

        {/* Medalha */}
        <div className="bg-gradient-to-br from-zayia-cream to-zayia-lilac/20 rounded-xl p-6 text-center mb-6">
          <div className="text-7xl mb-3 flex justify-center">
            {medal.icon ? (
              (() => {
                const IconComponent = medal.icon
                return typeof IconComponent === 'function' ? (
                  <IconComponent />
                ) : (
                  <span>{medal.icon}</span>
                )
              })()
            ) : (
              <span>🏅</span>
            )}
          </div>

          <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">
            {medal.name}
          </h3>

          <p className="text-sm text-zayia-violet-gray mb-3">
            Categoria: {medal.category}
          </p>

          <div className="bg-zayia-soft-purple/20 rounded-lg p-3 mb-3">
            <p className="text-xs text-zayia-violet-gray mb-1">Você ganhou</p>
            <p className="text-2xl font-bold text-zayia-soft-purple">
              +{medal.points} pontos
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-2">
          <button
            onClick={onViewMedal}
            className="w-full bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple text-white font-bold py-3 rounded-xl hover:shadow-lg transition"
          >
            Ver Medalha
          </button>
          <button
            onClick={onClose}
            className="w-full border-2 border-zayia-lilac text-zayia-deep-violet font-bold py-3 rounded-xl hover:bg-zayia-lilac/10 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
