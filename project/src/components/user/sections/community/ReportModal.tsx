import { useState } from 'react'
import { Flag, X } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  messageContent: string
  messageSenderName: string
  onClose: () => void
  onConfirm: (reason: string, description: string, anonymous: boolean) => void
  isLoading?: boolean
}

const REPORT_REASONS = [
  { value: 'disrespectful', label: 'Desrespeitosa/Agressiva' },
  { value: 'inappropriate', label: 'Conteúdo inadequado' },
  { value: 'spam', label: 'Spam' },
  { value: 'discrimination', label: 'Discriminação/Preconceito' },
  { value: 'privacy', label: 'Violação de privacidade' },
  { value: 'other', label: 'Outro' }
]

export function ReportModal({
  isOpen,
  messageContent,
  messageSenderName,
  onClose,
  onConfirm,
  isLoading = false
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('disrespectful')
  const [description, setDescription] = useState('')
  const [anonymous, setAnonymous] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onConfirm(selectedReason, description, anonymous)

    // Reset form
    setSelectedReason('disrespectful')
    setDescription('')
    setAnonymous(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Flag size={20} className="text-orange-600" />
            <h2 className="font-bold text-gray-900">Reportar Mensagem</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-orange-100 rounded transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Message preview */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Mensagem de {messageSenderName}:</p>
            <p className="text-sm text-gray-600 line-clamp-3">{messageContent}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Reason dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Motivo do Report
              </label>

              <select
                value={selectedReason}
                onChange={e => setSelectedReason(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                {REPORT_REASONS.map(reason => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Descrição Adicional (opcional)
              </label>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explique mais sobre o motivo do report..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Anonymous checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 cursor-pointer"
              />

              <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">
                Manter anônimo
              </label>
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
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Enviando...' : 'Enviar Report'}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center">
            ℹ️ Sua denúncia ajuda a manter a comunidade segura e respeitosa.
          </p>
        </div>
      </div>
    </div>
  )
}
