import { useState, useEffect } from 'react'
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
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Para confete após 2 segundos
      const timer = setTimeout(() => setShowConfetti(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen || !medal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Confete - apenas visual com CSS animations */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animation: `confetti-fall ${2 + Math.random() * 1}s linear forwards`,
                opacity: Math.random() * 0.8,
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-2xl relative z-10">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Parabenização */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-zayia-deep-violet mb-2">
            PARABÉNS!
          </h2>
          <p className="text-zayia-violet-gray text-sm">
            Você conquistou uma nova medalha incrível!
          </p>
        </div>

        {/* Card da Medalha */}
        <div className="bg-gradient-to-br from-zayia-cream to-zayia-lilac/30 rounded-2xl p-6 text-center mb-6 border-2 border-zayia-soft-purple">
          <div className="text-8xl mb-4 flex justify-center">
            {medal.icon ? (
              (() => {
                const IconComponent = medal.icon as any
                if (typeof IconComponent === 'function') {
                  return <IconComponent />
                } else {
                  return <>{String(IconComponent)}</>
                }
              })()
            ) : (
              <>🏅</>
            )}
          </div>

          <h3 className="text-2xl font-bold text-zayia-deep-violet mb-1">
            {medal.name}
          </h3>

          <p className="text-sm text-zayia-violet-gray mb-4">
            📂 {medal.category}
          </p>

          <div className="bg-white rounded-xl p-4 mb-3 border-2 border-zayia-soft-purple">
            <p className="text-xs text-zayia-violet-gray mb-1">Você ganhou</p>
            <p className="text-3xl font-bold text-zayia-soft-purple">
              +{medal.points} 💎 pontos
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-2">
          <button
            onClick={onViewMedal}
            className="w-full bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple text-white font-bold py-3 rounded-xl hover:shadow-lg transition transform hover:scale-105"
          >
            🎖️ Ver Medalha
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
