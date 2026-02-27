import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MedalCarouselProps {
  medals: any[]
  categoryName: string
  categoryIcon?: string
}

export function MedalCarousel({ medals, categoryName, categoryIcon = '🏅' }: MedalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex(Math.min(medals.length - 1, currentIndex + 1))
  }

  const currentMedal = medals[currentIndex]

  if (!currentMedal) {
    return (
      <div className="zayia-card p-6 mb-6 text-center">
        <p className="text-zayia-violet-gray">Nenhuma medalha nesta categoria</p>
      </div>
    )
  }

  return (
    <div className="zayia-card p-8 mb-6">
      {/* Título da Categoria */}
      <h3 className="text-lg font-bold text-zayia-deep-violet mb-6 flex items-center gap-2">
        <span className="text-2xl">{categoryIcon}</span>
        {categoryName}
      </h3>

      {/* Carrossel com 1 medalha GRANDE */}
      <div className="flex items-center justify-center gap-6">
        {/* Botão Esquerda */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-full hover:bg-zayia-lilac/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-zayia-deep-violet" />
        </button>

        {/* MEDALHA GRANDE - Moldura Quadrada */}
        <div className="w-72 h-96 p-8 border-4 border-zayia-lilac rounded-2xl bg-gradient-to-br from-zayia-cream to-white flex flex-col items-center justify-center text-center shadow-lg">
          {/* Ícone da Medalha - MUITO GRANDE */}
          <div className="text-9xl mb-6 flex-shrink-0">
            {currentMedal.icon ? (
              (() => {
                const IconComponent = currentMedal.icon
                return typeof IconComponent === 'function' ? <IconComponent /> : currentMedal.icon
              })()
            ) : '🏅'}
          </div>

          {/* Nome da Medalha */}
          <h4 className="font-bold text-2xl text-zayia-deep-violet mb-4">
            {currentMedal.name}
          </h4>

          {/* Requisitos e Recompensas */}
          <div className="space-y-3 w-full text-sm">
            {/* Desafios Necessários */}
            <div className="p-3 bg-zayia-lilac/20 rounded-lg">
              <p className="text-zayia-violet-gray text-xs mb-1">Desafios Necessários</p>
              <p className="font-bold text-zayia-deep-violet text-lg">
                {typeof currentMedal.requirement === 'number' ? currentMedal.requirement : 0} desafios
              </p>
            </div>

            {/* Pontos que Ganha */}
            <div className="p-3 bg-zayia-soft-purple/20 rounded-lg">
              <p className="text-zayia-violet-gray text-xs mb-1">Pontos Ganhos</p>
              <p className="font-bold text-zayia-soft-purple text-lg">
                +{currentMedal.points || 50} pontos
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 pt-4 border-t border-zayia-lilac/30 w-full">
            {currentMedal.isEarned ? (
              <p className="text-lg font-bold text-green-600">✅ Conquistada!</p>
            ) : (
              <p className="text-lg font-bold text-zayia-soft-purple">🔒 Bloqueada</p>
            )}
          </div>
        </div>

        {/* Botão Direita */}
        <button
          onClick={goToNext}
          disabled={currentIndex >= medals.length - 1}
          className="p-3 rounded-full hover:bg-zayia-lilac/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-zayia-deep-violet" />
        </button>
      </div>

      {/* Indicador de Posição */}
      <div className="text-center mt-6 text-sm text-zayia-violet-gray">
        {currentIndex + 1} de {medals.length}
      </div>
    </div>
  )
}
