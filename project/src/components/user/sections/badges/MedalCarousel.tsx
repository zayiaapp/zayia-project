import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MedalCarouselProps {
  medals: any[]
  categoryName: string
  categoryIcon?: string
}

export function MedalCarousel({ medals, categoryName, categoryIcon = '🏅' }: MedalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const itemsPerView = 4
  const maxIndex = Math.max(0, medals.length - itemsPerView)

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1))
  }

  const visibleMedals = medals.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className="zayia-card p-6 mb-6">
      {/* Título da Categoria */}
      <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
        <span className="text-2xl">{categoryIcon}</span>
        {categoryName}
      </h3>

      {/* Carrossel */}
      <div className="flex items-center gap-4">
        {/* Botão Esquerda */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-zayia-lilac/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-zayia-deep-violet" />
        </button>

        {/* Grid de Medalhas - 4 colunas, cada uma é quadrada */}
        <div className="flex-1 grid grid-cols-4 gap-4">
          {visibleMedals.map((medal) => (
            <div
              key={medal.id}
              className="aspect-square p-4 border-2 border-zayia-lilac rounded-lg bg-gradient-to-br from-zayia-cream to-white flex flex-col items-center justify-center text-center"
            >
              {/* Ícone da Medalha - GRANDE */}
              <div className="text-5xl mb-2 flex-shrink-0">
                {medal.icon ? (
                  (() => {
                    const IconComponent = medal.icon
                    return typeof IconComponent === 'function' ? <IconComponent /> : medal.icon
                  })()
                ) : '🏅'}
              </div>

              {/* Nome - truncado */}
              <h4 className="font-semibold text-xs text-zayia-deep-violet mb-1 line-clamp-2 leading-tight">
                {medal.name}
              </h4>

              {/* Requisito */}
              <p className="text-xs text-zayia-violet-gray mb-2 line-clamp-1">
                {typeof medal.requirement === 'number' ? `${medal.requirement} desafios` : medal.requirement}
              </p>

              {/* Status */}
              <div className="mt-auto">
                {medal.isEarned ? (
                  <span className="text-xs font-bold text-green-600">✅</span>
                ) : (
                  <span className="text-xs text-zayia-violet-gray">🔒</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botão Direita */}
        <button
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
          className="p-2 rounded-full hover:bg-zayia-lilac/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-zayia-deep-violet" />
        </button>
      </div>

      {/* Indicador de Posição */}
      {medals.length > itemsPerView && (
        <div className="text-center mt-4 text-xs text-zayia-violet-gray">
          {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, medals.length)} de {medals.length}
        </div>
      )}
    </div>
  )
}
