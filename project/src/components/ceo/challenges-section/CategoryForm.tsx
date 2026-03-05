import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Challenge, ChallengeCategory } from '../../../lib/supabase-client'
import { Toast } from '../../ui/Toast'

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<ChallengeCategory>) => void
  onSuccess?: () => void
  initialData?: ChallengeCategory
}

const EMOJI_OPTIONS = ['💪', '📚', '💼', '🧘', '📱', '❤️', '⏰', '✅']

const GRADIENT_OPTIONS = [
  'from-green-400 to-emerald-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-yellow-400 to-yellow-600',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
]

export const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<ChallengeCategory>>({
    label: '',
    icon: '📌',
    color: 'from-gray-400 to-gray-600',
    description: '',
    area: '',
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        label: '',
        icon: '📌',
        color: 'from-gray-400 to-gray-600',
        description: '',
        area: '',
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.label?.trim()) {
      setToastMessage('❌ Nome da categoria é obrigatório')
      setShowToast(true)
      return
    }

    onSubmit(formData)
    setToastMessage(
      initialData
        ? '✅ Categoria atualizada com sucesso'
        : '✅ Categoria criada com sucesso'
    )
    setShowToast(true)

    setTimeout(() => {
      onClose()
      setShowToast(false)
      onSuccess?.()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Editar Categoria' : 'Criar Categoria'}
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
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={formData.label || ''}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Corpo & Saúde"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description || ''}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o propósito desta categoria"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emoji
              </label>
              <div className="grid grid-cols-4 gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`text-2xl p-3 rounded-lg transition ${
                      formData.icon === emoji
                        ? 'bg-purple-200 ring-2 ring-purple-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cor
              </label>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_OPTIONS.map(gradient => (
                  <button
                    key={gradient}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: gradient })}
                    className={`h-12 rounded-lg transition ${
                      formData.color === gradient
                        ? 'ring-4 ring-gray-900'
                        : 'ring-1 ring-gray-300'
                    } bg-gradient-to-br ${gradient}`}
                  />
                ))}
              </div>
            </div>

            {/* Area (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Área (opcional)
              </label>
              <input
                type="text"
                value={formData.area || ''}
                onChange={e => setFormData({ ...formData, area: e.target.value })}
                placeholder="Ex: Organização Pessoal"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
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
