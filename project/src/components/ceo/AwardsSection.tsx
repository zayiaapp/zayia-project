import { useState } from 'react'
import { supabaseClient, LEVELS, getBadgesByCategory } from '../../lib/supabase-client'
import { MedalCard } from './medals/MedalCard'
import { Trophy, Award } from 'lucide-react'

export function AwardsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Organização')
  const [viewMode, setViewMode] = useState<'categories' | 'levels'>('categories')

  // Categorias agora carregadas do Supabase via getAllBadgesWithUserStatus()
  const allCategories: any[] = [] // TODO: Carregar do Supabase

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">🏅 Sistema de Medalhas</h1>
        <p className="text-white/90 text-lg mt-2">Visualização admin das medalhas e níveis</p>
      </div>

      {/* Tabs: Categorias vs Níveis */}
      <div className="flex gap-4">
        <button
          onClick={() => setViewMode('categories')}
          style={{
            backgroundColor: viewMode === 'categories' ? '#8B4FC1' : '#E5E7EB',
            color: viewMode === 'categories' ? 'white' : '#4B5563'
          }}
          className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <Award className="w-5 h-5" />
          📂 Categorias (28 medalhas)
        </button>
        <button
          onClick={() => setViewMode('levels')}
          style={{
            backgroundColor: viewMode === 'levels' ? '#8B4FC1' : '#E5E7EB',
            color: viewMode === 'levels' ? 'white' : '#4B5563'
          }}
          className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          📊 Níveis (10 níveis)
        </button>
      </div>

      {/* MODO: CATEGORIAS */}
      {viewMode === 'categories' && (
        <>
          {/* Seletor de categoria */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? '#8B4FC1' : '#E5E7EB',
                  color: selectedCategory === cat ? 'white' : '#4B5563'
                }}
                className="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de medalhas */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {getBadgesByCategory(selectedCategory).map((badge) => (
              <MedalCard key={badge.id} badge={badge} />
            ))}
          </div>
        </>
      )}

      {/* MODO: NÍVEIS */}
      {viewMode === 'levels' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {LEVELS.map((level) => (
            <div
              key={level.level}
              className="p-4 rounded-lg text-center border-2 transition-all hover:shadow-lg hover:scale-105"
              style={{
                borderColor: level.color,
                backgroundColor: `${level.color}20`
              }}
            >
              <div className="w-16 h-16 mx-auto mb-2">
                {(() => {
                  const IconComponent = level.icon
                  return <IconComponent />
                })()}
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{level.name}</h4>
              <p className="text-xs text-gray-600 font-medium">Nível {level.level}</p>
              <p className="text-xs text-gray-600 mt-2">{level.pointsRequired} pts</p>
              <p className="text-xs text-gray-500 mt-2 italic">{level.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Medalhas Globais (sempre visíveis) */}
      {viewMode === 'categories' && (
        <>
          <hr className="my-8 border-gray-200" />
          <div>
            <h2 className="text-xl font-bold text-zayia-deep-violet mb-4">🌍 Medalhas Globais</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {getBadgesByCategory('Global').map((badge) => (
                <MedalCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
