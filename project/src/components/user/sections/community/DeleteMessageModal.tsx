import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface DeleteMessageModalProps {
  isOpen: boolean
  messageContent: string
  onClose: () => void
  onConfirm: (reason: string) => void
  isLoading?: boolean
}

export function DeleteMessageModal({
  isOpen,
  messageContent,
  onClose,
  onConfirm,
  isLoading = false
}: DeleteMessageModalProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason.trim()) {
      alert('Por favor, insira o motivo da deleção')
      return
    }

    onConfirm(reason)
    setReason('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="font-bold text-gray-900">Deletar Mensagem?</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Message preview */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 line-clamp-3">{messageContent}</p>
          </div>

          {/* Reason input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Motivo da Deleção (obrigatório)
              </label>

              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Spam, conteúdo ofensivo, NSFW..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                disabled={isLoading}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isLoading || !reason.trim()}
                style={isLoading || !reason.trim() ? { backgroundColor: '#9CA3AF', color: 'white' } : { backgroundColor: '#EF4444', color: 'white' }}
                className="flex-1 px-4 py-2 rounded-lg font-medium cursor-pointer"
              >
                {isLoading ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center">
            ⚠️ Esta ação não pode ser desfeita. A mensagem será removida para todos.
          </p>
        </div>
      </div>
    </div>
  )
}
