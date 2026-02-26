import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { CommunityBan } from '../../../../lib/community-data-mock'

interface UserBanPanelProps {
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  banHistory: CommunityBan[]
  onClose: () => void
  onBan: (duration: '1_day' | '7_days' | 'permanent', reason: string) => void
}

export function UserBanPanel({
  userId,
  userName,
  userEmail,
  userAvatar,
  banHistory,
  onClose,
  onBan
}: UserBanPanelProps) {
  const [selectedDuration, setSelectedDuration] = useState<'1_day' | '7_days' | 'permanent'>('1_day')
  const [banReason, setBanReason] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const nextBanNumber = banHistory.length + 1

  const getBanMessage = () => {
    switch (nextBanNumber) {
      case 1:
        return '⚠️ PRIMEIRA violação. Usuária será banida por 1 dia.'
      case 2:
        return '⚠️ SEGUNDA violação. Usuária será banida por 7 dias.'
      case 3:
        return '🚨 TERCEIRA violação. BANIMENTO PERMANENTE!'
      default:
        return '🚨 Múltiplas violações. BANIMENTO PERMANENTE!'
    }
  }

  const handleConfirmBan = () => {
    if (!banReason.trim()) {
      alert('Por favor, insira o motivo do ban')
      return
    }

    onBan(selectedDuration, banReason)
    setIsConfirming(false)
    setBanReason('')
    onClose()
  }

  const avatar = userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl z-40 border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Painel de Moderação</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={avatar}
            alt={userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-gray-900">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Ban History */}
      {banHistory.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">📋 Histórico de Bans</h4>
          <div className="space-y-2">
            {banHistory.map((ban, idx) => (
              <div key={ban.id} className="text-sm bg-gray-50 p-2 rounded">
                <p className="font-medium text-gray-900">
                  Ban #{ban.banNumber} - {ban.banDuration === 'permanent' ? '🔒 Permanente' : `${ban.banDuration.replace('_', ' ')}`}
                </p>
                <p className="text-gray-600 text-xs mt-1">{ban.reason}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(ban.bannedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ban Section */}
      <div className="p-4 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
            <AlertTriangle size={16} />
            {getBanMessage()}
          </p>
        </div>

        {!isConfirming ? (
          <button
            onClick={() => setIsConfirming(true)}
            style={{ backgroundColor: '#EF4444', color: 'white' }}
            className="w-full px-4 py-2 rounded-lg font-medium cursor-pointer"
          >
            🚫 Iniciar Processo de Ban
          </button>
        ) : (
          <div className="space-y-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-900">Motivo do Ban:</p>

            <textarea
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              placeholder="Ex: Comportamento abusivo, spam, hate speech..."
              className="w-full h-24 p-2 border border-red-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsConfirming(false)
                  setBanReason('')
                }}
                className="flex-1 px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition text-sm font-medium"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmBan}
                style={{ backgroundColor: '#EF4444', color: 'white' }}
                className="flex-1 px-3 py-2 rounded text-sm font-medium cursor-pointer"
              >
                Confirmar Ban
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
