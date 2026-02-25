import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Toast } from '../../ui/Toast'

interface BulkDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  count: number
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
}) => {
  const [showToast, setShowToast] = useState(false)

  if (!isOpen) return null

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
              <h2 className="text-xl font-bold text-gray-900">Deletar em Massa?</h2>
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
              Tem certeza que deseja deletar esses {count} desafio{count !== 1 ? 's' : ''}?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                ⚠️ Esta ação não pode ser desfeita.
              </p>
            </div>
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
        <Toast message={`✅ ${count} desafios deletados com sucesso`} onClose={() => setShowToast(false)} />
      )}
    </>
  )
}
