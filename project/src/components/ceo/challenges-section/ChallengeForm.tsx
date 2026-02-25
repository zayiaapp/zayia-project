import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Challenge, ChallengeCategory } from '../../../lib/challenges-data-mock'
import { Toast } from '../../ui/Toast'

interface ChallengeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Challenge>) => void
  onSuccess?: () => void
  initialData?: Challenge
  defaultCategoryId?: string
  categories?: ChallengeCategory[]
}

const DURATION_OPTIONS = [2, 5, 10, 15, 30, 45, 60]

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  initialData,
  defaultCategoryId,
  categories = [],
}) => {
  const [formData, setFormData] = useState<Partial<Challenge>>({
    title: '',
    description: '',
    categoryId: defaultCategoryId || '',
    difficulty: 'facil',
    duration: 5,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: defaultCategoryId || '',
        difficulty: 'facil',
        duration: 5,
      })
    }
  }, [initialData, defaultCategoryId, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title?.trim()) {
      setToastMessage('❌ Título é obrigatório')
      setShowToast(true)
      return
    }

    if (!formData.description?.trim()) {
      setToastMessage('❌ Descrição é obrigatória')
      setShowToast(true)
      return
    }

    if (!formData.categoryId) {
      setToastMessage('❌ Categoria é obrigatória')
      setShowToast(true)
      return
    }

    onSubmit(formData)
    setToastMessage(
      initialData
        ? '✅ Desafio atualizado com sucesso'
        : '✅ Desafio criado com sucesso'
    )
    setShowToast(true)

    setTimeout(() => {
      onClose()
      setShowToast(false)
      onSuccess?.()
    }, 1500)
  }

  const points = formData.difficulty === 'dificil' ? 25 : 10

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Editar Desafio' : 'Criar Desafio'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={e =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título do desafio"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description || ''}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o desafio em detalhes"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Difficulty Selection */}
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
                      checked={formData.difficulty === diff}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value as 'facil' | 'dificil',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-700">
                      {diff === 'facil' ? '😊 Fácil (10 pts)' : '💪 Difícil (25 pts)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <select
                value={formData.duration || 5}
                onChange={e =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {DURATION_OPTIONS.map(dur => (
                  <option key={dur} value={dur}>
                    {dur} minuto{dur !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Points Display */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700">
                Pontos: <span className="text-purple-600">{points}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Os pontos são calculados automaticamente com base na dificuldade
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              {initialData ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </div>
      </div>

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  )
}
