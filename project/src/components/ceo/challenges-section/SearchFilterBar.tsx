import React from 'react'
import { Search, X } from 'lucide-react'

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  difficulty: 'facil' | 'dificil' | 'both'
  onDifficultyChange: (difficulty: 'facil' | 'dificil' | 'both') => void
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  difficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="flex gap-4 flex-wrap items-center">
      {/* Search */}
      <div className="flex-1 min-w-xs relative">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar desafios..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2">
        {['facil', 'dificil', 'both'].map(diff => (
          <button
            key={diff}
            onClick={() =>
              onDifficultyChange(diff as 'facil' | 'dificil' | 'both')
            }
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              difficulty === diff
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {diff === 'facil' ? '😊 Fácil' : diff === 'dificil' ? '💪 Difícil' : 'Todos'}
          </button>
        ))}
      </div>
    </div>
  )
}
