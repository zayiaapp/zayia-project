import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MedalCarouselProps {
  medals: unknown[]
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

  // 🔍 DEBUG: Log dos pontos
  if (currentMedal) {
    console.log(`🏅 ${categoryName} - ${currentMedal.name}: ${currentMedal.points || 'undefined'} pts`)
  }

  if (!currentMedal) {
    return (
      <div className="zayia-card p-6 mb-6 text-center">
        <p className="text-zayia-violet-gray">Nenhuma medalha nesta categoria</p>
      </div>
    )
  }

  return (
    <div className="zayia-card p-6 mb-6">
      {/* Título da Categoria */}
      <h3 className="text-lg font-bold text-zayia-deep-violet mb-6 flex items-center gap-2">
        <span className="text-2xl">{categoryIcon}</span>
        {categoryName}
      </h3>

      {/* Carrossel com 1 medalha - TAMANHO FIXO */}
      <div className="flex items-stretch justify-center gap-4 min-h-80">
        {/* Botão Esquerda */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-zayia-lilac/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors self-center"
        >
          <ChevronLeft className="w-6 h-6 text-zayia-deep-violet" />
        </button>

        {/* MEDALHA - Moldura QUADRADA FIXA */}
        <div className="w-64 p-6 border-4 border-zayia-lilac rounded-2xl bg-gradient-to-br from-zayia-cream to-white flex flex-col items-center justify-center gap-3 shadow-lg">

          {/* ÍCONE - SEMPRE PEQUENO E ENQUADRADO */}
          <div className="w-24 h-24 flex items-center justify-center flex-shrink-0">
            <div className="text-5xl">
              {currentMedal.icon ? (
                (() => {
                  const IconComponent = currentMedal.icon
                  return typeof IconComponent === 'function' ? <IconComponent /> : currentMedal.icon
                })()
              ) : '🏅'}
            </div>
          </div>

          {/* Nome da Medalha */}
          <h4 className="font-bold text-lg text-zayia-deep-violet text-center line-clamp-2">
            {currentMedal.name}
          </h4>

          {/* Requisitos */}
          <div className="w-full space-y-2 text-xs">
            {/* Desafios ou Nível */}
            <div className="p-2 bg-zayia-lilac/20 rounded-lg">
              <p className="text-zayia-violet-gray text-xs mb-0.5">
                {currentMedal.levelNumber !== undefined ? 'Nível' : 'Desafios'}
              </p>
              <p className="font-bold text-zayia-deep-violet text-sm">
                {currentMedal.levelNumber !== undefined ? currentMedal.levelNumber : currentMedal.requirement}
              </p>
            </div>

            {/* Pontos que Ganha */}
            <div className="p-2 bg-zayia-soft-purple/20 rounded-lg">
              <p className="text-zayia-violet-gray text-xs mb-0.5">Pontos</p>
              <p className="font-bold text-zayia-soft-purple text-sm">
                +{currentMedal.points || 0}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="w-full pt-2 border-t border-zayia-lilac/30">
            {currentMedal.isEarned ? (
              <p className="text-sm font-bold text-green-600 text-center">✅</p>
            ) : (
              <p className="text-sm font-bold text-zayia-soft-purple text-center">🔒</p>
            )}
          </div>
        </div>

        {/* Botão Direita */}
        <button
          onClick={goToNext}
          disabled={currentIndex >= medals.length - 1}
          className="p-2 rounded-full hover:bg-zayia-lilac/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors self-center"
        >
          <ChevronRight className="w-6 h-6 text-zayia-deep-violet" />
        </button>
      </div>

      {/* Indicador de Posição - SEMPRE VISÍVEL EMBAIXO */}
      <div className="text-center mt-4 text-sm text-zayia-violet-gray">
        {currentIndex + 1} de {medals.length}
      </div>
    </div>
  )
}
