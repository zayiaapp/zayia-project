import React, { useEffect, useState } from 'react'
import { LEVELS } from '../../../lib/badges-data-mock'

interface LevelUpModalProps {
  isOpen: boolean
  newLevel: number
  bonusPoints: number
  challengePoints: number
  medalPoints: number
  onClose: () => void
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  bonusPoints,
  challengePoints,
  medalPoints,
  onClose
}) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const levelData = LEVELS[newLevel]
  const nextLevel = newLevel + 1 < LEVELS.length ? LEVELS[newLevel + 1] : null

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen || !levelData) return null

  const totalPoints = challengePoints + medalPoints + bonusPoints

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Confetti background effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  opacity: Math.random(),
                  animationDuration: `${0.5 + Math.random()}s`
                }}
              >
                {Math.random() > 0.5 ? '🎉' : '✨'}
              </div>
            ))}
          </div>
        )}

        {/* Level Icon */}
        <div className="text-center mb-6">
          <div className="inline-block text-8xl mb-4 animate-bounce">
            {levelData.icon && typeof levelData.icon === 'string' ? levelData.icon : '🎖️'}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 zayia-gradient-text">
            🎉 Parabéns!
          </h2>
          <h3 className="text-2xl font-bold text-zayia-deep-violet mb-2">
            Nível {newLevel}
          </h3>
          <p className="text-lg font-semibold" style={{ color: levelData.color }}>
            {levelData.name}
          </p>
          <p className="text-sm text-zayia-violet-gray mt-2">{levelData.description}</p>
        </div>

        {/* Points Breakdown */}
        <div className="bg-zayia-lilac/20 rounded-lg p-4 mb-6 border border-zayia-soft-purple/50">
          <p className="text-sm font-semibold text-zayia-deep-violet mb-3">Pontos Ganhos:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zayia-violet-gray">Desafio:</span>
              <span className="font-bold text-zayia-purple">+{challengePoints}</span>
            </div>
            {medalPoints > 0 && (
              <div className="flex justify-between">
                <span className="text-zayia-violet-gray">Medalha:</span>
                <span className="font-bold text-zayia-purple">+{medalPoints}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-zayia-soft-purple/30 pt-2">
              <span className="text-zayia-violet-gray font-semibold">Bônus Level-up:</span>
              <span className="font-bold text-zayia-purple text-lg">+{bonusPoints}</span>
            </div>
            <div className="flex justify-between border-t border-zayia-soft-purple/50 pt-2 mt-2">
              <span className="font-bold text-zayia-deep-violet">Total:</span>
              <span className="font-bold text-zayia-purple text-lg">+{totalPoints}</span>
            </div>
          </div>
        </div>

        {/* Next Level Info */}
        {nextLevel && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-sm font-semibold text-blue-700 mb-2">Próximo nível:</p>
            <p className="text-sm text-blue-600">
              Nível {nextLevel.level}: {nextLevel.name}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {nextLevel.pointsRequired.toLocaleString()} pontos necessários
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-zayia-purple to-zayia-soft-purple hover:from-zayia-soft-purple hover:to-zayia-purple transition"
        >
          Continuar Jornada ✨
        </button>
      </div>
    </div>
  )
}
