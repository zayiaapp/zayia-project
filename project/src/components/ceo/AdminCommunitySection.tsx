import React, { useState, useEffect } from 'react'
import { supabaseClient, type CommunityMessage, type CommunityRules } from '../../lib/supabase-client'
import { Trash2, Shield, Edit, X, MessageSquare, AlertCircle, Calendar } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface DeleteMessageState {
  messageId: string
  authorName: string
  reason: 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other'
  description: string
}

interface BanUserState {
  userId: string
  userName: string
  duration: '1_day' | '7_days' | 'permanent'
  reason: string
}

const deleteReasons = [
  { value: 'disrespectful' as const, label: 'Desrespeitoso' },
  { value: 'inappropriate' as const, label: 'Inapropriado' },
  { value: 'spam' as const, label: 'Spam' },
  { value: 'discrimination' as const, label: 'Discriminação' },
  { value: 'privacy' as const, label: 'Privacidade' },
  { value: 'other' as const, label: 'Outro' }
]

const banDurations = [
  { value: '1_day' as const, label: '1 dia' },
  { value: '7_days' as const, label: '7 dias' },
  { value: 'permanent' as const, label: 'Permanente' }
]

export function AdminCommunitySection() {
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [rules, setRules] = useState<CommunityRules | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditRules, setShowEditRules] = useState(false)
  const [rulesContent, setRulesContent] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState<DeleteMessageState | null>(null)
  const [showBanModal, setShowBanModal] = useState<BanUserState | null>(null)

  // Fetch messages and rules on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [messagesData, rulesData] = await Promise.all([
          supabaseClient.getMessages(50, 0),
          supabaseClient.getRules()
        ])
        setMessages(messagesData)
        setRules(rulesData)
        if (rulesData) setRulesContent(rulesData.content)
      } catch (error) {
        console.error('Error loading community data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDeleteMessage = async () => {
    if (!showDeleteModal) return

    try {
      const success = await supabaseClient.deleteMessage(
        showDeleteModal.messageId,
        '', // Will be set from user context in real implementation
        'ceo',
        showDeleteModal.reason
      )
      if (success) {
        setMessages(prev =>
          prev.map(m =>
            m.id === showDeleteModal.messageId
              ? { ...m, deleted_at: new Date().toISOString() }
              : m
          )
        )
        setShowDeleteModal(null)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Erro ao deletar mensagem')
    }
  }

  const handleBanUser = async () => {
    if (!showBanModal) return

    try {
      const success = await supabaseClient.banUser(
        showBanModal.userId,
        showBanModal.duration,
        showBanModal.reason
      )
      if (success) {
        setShowBanModal(null)
        alert('Usuária banida com sucesso!')
      }
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Erro ao banir usuária')
    }
  }

  const handleUpdateRules = async () => {
    try {
      const updated = await supabaseClient.updateRules(rulesContent, '')
      if (updated) {
        setRules(updated)
        setShowEditRules(false)
      }
    } catch (error) {
      console.error('Error updating rules:', error)
      alert('Erro ao atualizar regras')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          💬 Comunidade - Moderação
        </h2>
        <p className="text-zayia-violet-gray">
          Gerenciar mensagens, regras e usuárias banidas
        </p>
      </div>

      {/* Community Rules Section */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-zayia-deep-violet flex items-center gap-2">
            📜 Regras da Comunidade
          </h3>
          <button
            onClick={() => setShowEditRules(true)}
            className="zayia-button px-3 py-1 text-white flex items-center gap-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>
        <div className="bg-zayia-lilac/20 p-4 rounded-lg">
          <p className="text-zayia-deep-violet whitespace-pre-wrap text-sm leading-relaxed">
            {rules?.content || 'Nenhuma regra definida'}
          </p>
          {rules && (
            <p className="text-xs text-zayia-violet-gray mt-3">
              Última atualização: {new Date(rules.updated_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Mensagens da Comunidade ({messages.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border ${
                message.deleted_at
                  ? 'bg-red-50 border-red-200'
                  : 'bg-zayia-lilac/10 border-zayia-lilac/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-zayia-deep-violet">
                    {message.user_profile?.full_name || 'Anônimo'}
                  </p>
                  <p className="text-sm text-zayia-violet-gray mb-2">
                    {message.user_profile?.email}
                  </p>
                  <p className="text-sm text-zayia-deep-violet">
                    {message.deleted_at ? '[Mensagem deletada]' : message.content}
                  </p>
                  <p className="text-xs text-zayia-violet-gray mt-2">
                    {new Date(message.created_at).toLocaleDateString('pt-BR')}{' '}
                    {new Date(message.created_at).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                {!message.deleted_at && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        setShowDeleteModal({
                          messageId: message.id,
                          authorName: message.user_profile?.full_name || 'Anônimo',
                          reason: 'inappropriate',
                          description: ''
                        })
                      }
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Deletar mensagem"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      onClick={() =>
                        setShowBanModal({
                          userId: message.user_id,
                          userName: message.user_profile?.full_name || 'Anônimo',
                          duration: '7_days',
                          reason: ''
                        })
                      }
                      className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                      title="Banir usuária"
                    >
                      <Shield className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Rules Modal */}
      {showEditRules && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/20">
              <h3 className="text-xl font-bold text-zayia-deep-violet">Editar Regras</h3>
              <button
                onClick={() => setShowEditRules(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={rulesContent}
                onChange={e => setRulesContent(e.target.value)}
                className="w-full h-64 p-4 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none"
                placeholder="Digite as regras da comunidade..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowEditRules(false)}
                className="px-6 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateRules}
                className="zayia-button px-6 py-2 text-white"
              >
                Salvar Regras
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Message Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-red-200 bg-red-50">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Deletar Mensagem
              </h3>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="p-1 hover:bg-red-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-zayia-violet-gray mb-4">
                De: <strong>{showDeleteModal.authorName}</strong>
              </p>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                Motivo da deleção *
              </label>
              <select
                value={showDeleteModal.reason}
                onChange={e =>
                  setShowDeleteModal({
                    ...showDeleteModal,
                    reason: e.target.value as any
                  })
                }
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple mb-4"
              >
                {deleteReasons.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={showDeleteModal.description}
                onChange={e =>
                  setShowDeleteModal({
                    ...showDeleteModal,
                    description: e.target.value
                  })
                }
                className="w-full h-24 p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none"
                placeholder="Detalhe o motivo..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-6 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteMessage}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Deletar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-orange-200 bg-orange-50">
              <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Banir Usuária
              </h3>
              <button
                onClick={() => setShowBanModal(null)}
                className="p-1 hover:bg-orange-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-zayia-violet-gray mb-4">
                <strong>{showBanModal.userName}</strong> será banida da comunidade
              </p>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                Duração do banimento *
              </label>
              <select
                value={showBanModal.duration}
                onChange={e =>
                  setShowBanModal({
                    ...showBanModal,
                    duration: e.target.value as any
                  })
                }
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple mb-4"
              >
                {banDurations.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                Motivo do banimento *
              </label>
              <textarea
                value={showBanModal.reason}
                onChange={e =>
                  setShowBanModal({
                    ...showBanModal,
                    reason: e.target.value
                  })
                }
                className="w-full h-24 p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none"
                placeholder="Explique o motivo do banimento..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowBanModal(null)}
                className="px-6 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleBanUser}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Banir Usuária
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
