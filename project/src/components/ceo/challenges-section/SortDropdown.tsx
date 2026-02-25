import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type SortOption =
  | 'title-asc'
  | 'title-desc'
  | 'points-asc'
  | 'points-desc'
  | 'duration-asc'
  | 'duration-desc'
  | 'popularity'

interface SortDropdownProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'title-asc', label: 'Título A-Z' },
  { value: 'title-desc', label: 'Título Z-A' },
  { value: 'points-asc', label: 'Pontos (menor)' },
  { value: 'points-desc', label: 'Pontos (maior)' },
  { value: 'duration-asc', label: 'Tempo (menor)' },
  { value: 'duration-desc', label: 'Tempo (maior)' },
  { value: 'popularity', label: 'Popularidade' },
]

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const currentLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Ordenar por'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
      >
        {currentLabel}
        <ChevronDown
          size={18}
          className={`transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-40">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                sortBy === option.value ? 'bg-purple-100 text-purple-700 font-semibold' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
