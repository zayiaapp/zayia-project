import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface QuickBanModalProps {
  isOpen: boolean
  userName: string
  messageContent: string
  onClose: () => void
  onConfirm: (duration: '1_day' | '7_days' | 'permanent', reason: string) => void
  isLoading?: boolean
}

export function QuickBanModal({
  isOpen,
  userName,
  messageContent,
  onClose,
  onConfirm,
  isLoading = false
}: QuickBanModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<'1_day' | '7_days' | 'permanent'>('1_day')
  const [reason, setReason] = useState(`Mensagem: "${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}"`)

  const durationLabels = {
    '1_day': 'Ban 1 dia',
    '7_days': 'Ban 7 dias',
    'permanent': 'Ban Permanente'
  }

  const durationDescriptions = {
    '1_day': 'Usuária poderá voltar em 24 horas',
    '7_days': 'Usuária poderá voltar em 7 dias',
    'permanent': 'Usuária não poderá mais acessar a comunidade'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason.trim()) {
      alert('Por favor, insira o motivo do ban')
      return
    }

    onConfirm(selectedDuration, reason)
    setReason('')
    setSelectedDuration('1_day')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="font-bold text-gray-900">Banir {userName}?</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-red-100 rounded transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Message preview */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Mensagem:</p>
            <p className="text-sm text-gray-600 line-clamp-2">{messageContent}</p>
          </div>

          {/* Duration selection */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Duração do Ban
              </label>

              <div className="space-y-2">
                {(['1_day', '7_days', 'permanent'] as const).map(duration => (
                  <label
                    key={duration}
                    className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-orange-50 transition"
                    style={{
                      borderColor: selectedDuration === duration ? '#E85D75' : '#E5E7EB'
                    }}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={selectedDuration === duration}
                      onChange={() => setSelectedDuration(duration)}
                      disabled={isLoading}
                      className="mt-1 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {durationLabels[duration]}
                      </p>
                      <p className="text-xs text-gray-600">
                        {durationDescriptions[duration]}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Motivo do Ban (obrigatório)
              </label>

              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Assédio, spam, conteúdo ofensivo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-sm resize-none"
                rows={3}
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
                {isLoading ? 'Banindo...' : 'Banir'}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center">
            ⚠️ A mensagem será deletada e a usuária será banida imediatamente.
          </p>
        </div>
      </div>
    </div>
  )
}
