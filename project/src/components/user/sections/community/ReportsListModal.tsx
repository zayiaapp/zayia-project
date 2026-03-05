import { useState } from 'react'
import { X, Eye, Ban, Trash2, Archive } from 'lucide-react'
import { type MessageReport } from '../../../../lib/supabase-client'

interface ReportsListModalProps {
  isOpen: boolean
  reports: MessageReport[]
  onClose: () => void
  onViewContext: (messageId: string) => void
  onBan: (messageId: string) => void
  onDelete: (messageId: string) => void
  onArchive: (reportId: string) => void
}

const REASON_LABELS: Record<string, string> = {
  disrespectful: 'Desrespeitosa/Agressiva',
  inappropriate: 'Conteúdo inadequado',
  spam: 'Spam',
  discrimination: 'Discriminação/Preconceito',
  privacy: 'Violação de privacidade',
  other: 'Outro'
}

function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ReportsListModal({
  isOpen,
  reports,
  onClose,
  onViewContext,
  onBan,
  onDelete,
  onArchive
}: ReportsListModalProps) {
  if (!isOpen) return null

  const pendingReports = reports.filter(r => r.status === 'pending')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Reports Pendentes ({pendingReports.length})
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {pendingReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">✅ Nenhum report pendente!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReports.map(report => (
                <div
                  key={report.id}
                  className="border border-gray-200 bg-white hover:border-orange-200 rounded-lg p-4 transition"
                >
                  {/* Report header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      {/* Message preview */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 font-medium mb-1">Mensagem:</p>
                        <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded border border-gray-200">
                          "{report.message?.content || '—'}"
                        </p>
                      </div>

                      {/* Report info grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 font-medium">Enviado por</p>
                          <p className="text-gray-800">{report.message?.user_profile?.full_name || 'Desconhecido'}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 font-medium">Reportado por</p>
                          <p className="text-gray-800">
                            {report.reporter?.full_name || 'Anônimo'}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 font-medium">Motivo</p>
                          <p className="text-gray-800">
                            {REASON_LABELS[report.reason] || report.reason}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 font-medium">Data</p>
                          <p className="text-gray-800">{formatDate(report.created_at)}</p>
                        </div>
                      </div>

                      {/* Description */}
                      {report.description && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">Descrição:</p>
                          <p className="text-sm text-gray-700">{report.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => onViewContext(report.message_id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Ver Contexto
                    </button>

                    <button
                      onClick={() => onBan(report.message_id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition flex items-center gap-1"
                    >
                      <Ban size={14} />
                      Banir
                    </button>

                    <button
                      onClick={() => onDelete(report.message_id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Deletar
                    </button>

                    <button
                      onClick={() => onArchive(report.id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition flex items-center gap-1"
                    >
                      <Archive size={14} />
                      Arquivar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
