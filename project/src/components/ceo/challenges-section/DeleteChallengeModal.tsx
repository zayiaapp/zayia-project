import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Challenge } from '../../../lib/challenges-data-mock'
import { Toast } from '../../ui/Toast'

interface DeleteChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  challenge: Challenge | null
}

export const DeleteChallengeModal: React.FC<DeleteChallengeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  challenge,
}) => {
  const [showToast, setShowToast] = useState(false)

  if (!isOpen || !challenge) return null

  const handleConfirm = () => {
    onConfirm()
    setShowToast(true)

    setTimeout(() => {
      onClose()
      setShowToast(false)
    }, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Deletar Desafio?
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja deletar este desafio?
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {challenge.title}
              </p>
              <p className="text-xs text-gray-600 line-clamp-3">
                {challenge.description}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Esta ação não pode ser desfeita.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast message="✅ Desafio deletado com sucesso" onClose={() => setShowToast(false)} />
      )}
    </>
  )
}
