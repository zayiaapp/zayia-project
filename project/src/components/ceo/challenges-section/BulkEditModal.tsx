import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Challenge, ChallengeCategory } from '../../../lib/supabase-client'
import { Toast } from '../../ui/Toast'

interface BulkEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (updates: Partial<Challenge>) => void
  selectedCount: number
  categories: ChallengeCategory[]
}

const DURATION_OPTIONS = [2, 5, 10, 15, 30, 45, 60]

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedCount,
  categories,
}) => {
  const [updates, setUpdates] = useState<Partial<Challenge>>({})
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.keys(updates).length === 0) {
      setShowToast(true)
      return
    }

    onSubmit(updates)
    setShowToast(true)

    setTimeout(() => {
      onClose()
      setUpdates({})
      setShowToast(false)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-blue-500" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Editar em Massa</h2>
                <p className="text-sm text-gray-600">{selectedCount} desafios selecionados</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dificuldade
              </label>
              <div className="flex gap-4">
                {['facil', 'dificil'].map(diff => (
                  <label key={diff} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={diff}
                      checked={updates.difficulty === diff}
                      onChange={e =>
                        setUpdates({
                          ...updates,
                          difficulty: e.target.value as 'facil' | 'dificil',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {diff === 'facil' ? '😊 Fácil' : '💪 Difícil'}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value=""
                    checked={!updates.difficulty}
                    onChange={() => {
                      setUpdates(prev => {
                        const copy = { ...prev }
                        delete copy.difficulty
                        return copy
                      })
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-500">Sem mudança</span>
                </label>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <select
                value={updates.duration || ''}
                onChange={e =>
                  setUpdates({
                    ...updates,
                    duration: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Sem mudança</option>
                {DURATION_OPTIONS.map(dur => (
                  <option key={dur} value={dur}>
                    {dur} minuto{dur !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mover para Categoria
              </label>
              <select
                value={updates.category_id || ''}
                onChange={e =>
                  setUpdates({
                    ...updates,
                    category_id: e.target.value || undefined,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Sem mudança</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                ℹ️ Deixe os campos em branco para não alterá-los
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Atualizar {selectedCount}
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast message={`✅ ${selectedCount} desafios atualizados com sucesso`} onClose={() => setShowToast(false)} />
      )}
    </>
  )
}
