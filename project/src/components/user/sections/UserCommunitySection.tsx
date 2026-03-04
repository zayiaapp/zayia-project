import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import {
  Send,
  MessageCircle,
  SmilePlus,
  Flag,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface Message {
  id: string
  user_id: string
  content: string
  created_at: string
  deleted_at: string | null
  deletion_reason?: string
  user_profile?: {
    full_name: string
    avatar_url?: string
  }
  reactions?: Array<{
    emoji: string
    count: number
    userReacted: boolean
  }>
}

export function UserCommunitySection() {
  const { profile, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [isBanned, setIsBanned] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [rules, setRules] = useState<string>('')
  const [reportingMessage, setReportingMessage] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')

  const EMOJI_REACTIONS = ['👍', '❤️', '😂', '🔥', '😍', '😢']

  useEffect(() => {
    if (!user?.id) return

    const initLoad = async () => {
      await loadMessages()
      await checkBanStatus()

      const subscription = supabase
        .channel(`community-messages-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'community_messages'
          },
          () => loadMessages()
        )
        .subscribe()

      return () => subscription.unsubscribe()
    }

    initLoad()
  }, [user?.id])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('community_messages')
        .select(`
          id,
          user_id,
          content,
          created_at,
          deleted_at,
          deletion_reason,
          profiles:user_id (full_name, avatar_url)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setMessages(
        data?.map((msg: any) => ({
          id: msg.id,
          user_id: msg.user_id,
          content: msg.content,
          created_at: msg.created_at,
          deleted_at: msg.deleted_at,
          deletion_reason: msg.deletion_reason,
          user_profile: Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles
        })) || []
      )

      // Load rules
      const { data: rulesData } = await supabase
        .from('community_rules')
        .select('content')
        .order('created_at', { ascending: false })
        .limit(1)

      if (rulesData && rulesData.length > 0) {
        setRules(rulesData[0].content)
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkBanStatus = async () => {
    if (!user?.id) return
    try {
      const banned = await supabaseClient.getUserStats(user.id).then(stats => {
        // Check if user has active ban
        return false // Placeholder - would need to query community_bans
      })
      setIsBanned(banned)
    } catch (error) {
      console.error('Error checking ban status:', error)
    }
  }

  const handlePostMessage = async () => {
    if (!user?.id || !newMessage.trim()) return

    setPosting(true)
    try {
      const { error } = await supabase.from('community_messages').insert([
        {
          user_id: user.id,
          content: newMessage.trim()
        }
      ])

      if (error) throw error

      setNewMessage('')
      await loadMessages()
    } catch (error) {
      console.error('❌ Error posting message:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setPosting(false)
    }
  }

  const handleReportMessage = async (messageId: string) => {
    if (!user?.id || !reportReason.trim()) return

    try {
      const { error } = await supabase.from('message_reports').insert([
        {
          message_id: messageId,
          reported_by: user.id,
          reason: reportReason,
          status: 'pending'
        }
      ])

      if (error) throw error

      alert('✅ Mensagem reportada. Obrigado!')
      setReportingMessage(null)
      setReportReason('')
    } catch (error) {
      console.error('❌ Error reporting message:', error)
      alert('Erro ao reportar. Tente novamente.')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!user?.id) return

    if (!confirm('Tem certeza que deseja deletar esta mensagem?')) return

    try {
      const { error } = await supabase
        .from('community_messages')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by_admin: user.id,
          deletion_reason: 'user_requested'
        })
        .eq('id', messageId)
        .eq('user_id', user.id)

      if (error) throw error

      await loadMessages()
    } catch (error) {
      console.error('❌ Error deleting message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <span className="ml-4 text-purple-600 font-medium">Carregando comunidade...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rules Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <button
          onClick={() => setShowRulesModal(!showRulesModal)}
          className="w-full text-left flex items-center justify-between hover:bg-blue-100 p-2 rounded transition"
        >
          <span className="font-semibold text-blue-900">📋 Regras da Comunidade</span>
          <span className="text-blue-600">{showRulesModal ? '▼' : '▶'}</span>
        </button>
        {showRulesModal && (
          <div className="mt-3 text-sm text-blue-900 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {rules || 'Nenhuma regra definida ainda.'}
          </div>
        )}
      </div>

      {/* Ban Warning */}
      {isBanned && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">Você está banido da comunidade</p>
            <p className="text-sm text-red-600">Não pode postar mensagens no momento.</p>
          </div>
        </div>
      )}

      {/* Post Message Section */}
      {!isBanned && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value.slice(0, 2000))}
            placeholder="Compartilhe algo com a comunidade..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {newMessage.length}/2000 caracteres
            </span>
            <button
              onClick={handlePostMessage}
              disabled={posting || !newMessage.trim()}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-semibold"
            >
              {posting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma mensagem ainda. Seja a primeira!</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              {/* Message Header */}
              <div className="flex items-start gap-3 mb-2">
                <img
                  src={message.user_profile?.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {message.user_profile?.full_name || 'Usuária'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                {message.deleted_at ? (
                  <span className="italic text-gray-500">[Mensagem deletada]</span>
                ) : (
                  message.content
                )}
              </p>

              {/* Emoji Reactions */}
              {!message.deleted_at && (
                <div className="flex gap-1 mb-3 flex-wrap">
                  {EMOJI_REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-purple-100 rounded-full text-sm transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 text-xs">
                {!message.deleted_at && (
                  <>
                    {message.user_id === user?.id && (
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-red-600 hover:text-red-700 hover:underline"
                      >
                        Deletar
                      </button>
                    )}
                    <button
                      onClick={() => setReportingMessage(message.id)}
                      className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                    >
                      <Flag className="w-3 h-3" />
                      Reportar
                    </button>
                  </>
                )}
              </div>

              {/* Report Modal */}
              {reportingMessage === message.id && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Motivo do relatório:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                  >
                    <option value="">Selecione um motivo...</option>
                    <option value="disrespectful">Desrespeitoso</option>
                    <option value="inappropriate">Inapropriado</option>
                    <option value="spam">Spam</option>
                    <option value="discrimination">Discriminação</option>
                    <option value="privacy">Privacidade</option>
                    <option value="other">Outro</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReportMessage(message.id)}
                      disabled={!reportReason}
                      className="flex-1 bg-orange-600 text-white py-1 rounded text-sm hover:bg-orange-700 disabled:bg-gray-400 transition"
                    >
                      Reportar
                    </button>
                    <button
                      onClick={() => setReportingMessage(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-1 rounded text-sm hover:bg-gray-400 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
