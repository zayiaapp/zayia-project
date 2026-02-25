import React from 'react'
import { Trash2, Edit3 } from 'lucide-react'

interface BulkActionsProps {
  selectedCount: number
  onBulkEdit: () => void
  onBulkDelete: () => void
  onClearSelection: () => void
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkEdit,
  onBulkDelete,
  onClearSelection,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">
          {selectedCount} desafio{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBulkEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          <Edit3 size={18} />
          Editar em Massa
        </button>
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          <Trash2 size={18} />
          Deletar
        </button>
        <button
          onClick={onClearSelection}
          className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
