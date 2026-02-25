import { BookOpen, Edit2 } from 'lucide-react'

interface RulesBannerProps {
  isAdmin: boolean
  onViewRules: () => void
}

export function RulesBanner({ isAdmin, onViewRules }: RulesBannerProps) {
  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-zayia-purple to-zayia-soft-pink px-4 py-4 md:px-6 md:py-5 rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-2xl flex-shrink-0">📋</div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-base md:text-lg">
              LEIA AS REGRAS DA COMUNIDADE
            </h3>
            <p className="text-purple-100 text-xs md:text-sm">
              Conheça nossos valores e convivência
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin && (
            <button
              onClick={onViewRules}
              className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-xs md:text-sm flex items-center gap-1 whitespace-nowrap"
              title="Editar regras"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}

          <button
            onClick={onViewRules}
            className="px-4 py-2 bg-white text-zayia-purple rounded-lg hover:bg-gray-100 transition font-semibold text-xs md:text-sm flex items-center gap-1 whitespace-nowrap"
          >
            <BookOpen size={16} />
            <span>Ver Regras</span>
          </button>
        </div>
      </div>
    </div>
  )
}
