import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { CommunityDataMock, CommunityMessage, MessageReaction, CommunityBan } from '../../../lib/community-data-mock'
import { MessageCircle, BookOpen } from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { MessageWithHover } from './community/Message'
import { MessageInput } from './community/MessageInput'
import { RulesModal } from './community/RulesModal'
import { UserBanPanel } from './community/UserBanPanel'
import { DeleteMessageModal } from './community/DeleteMessageModal'

export function CommunitySection() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [selectedUserForBan, setSelectedUserForBan] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<{ id: string; content: string } | null>(null)
  const [rules, setRules] = useState('')
  const [banStatus, setBanStatus] = useState<{ isBanned: boolean; expiresAt?: string }>({ isBanned: false })

  // Verificar se usuária está banida
  useEffect(() => {
    if (user?.id) {
      const status = CommunityDataMock.checkIfUserIsBanned(user.id)
      setBanStatus(status)
    }
  }, [user?.id])

  // Carregar mensagens e regras
  useEffect(() => {
    loadCommunityData()
    const interval = setInterval(loadCommunityData, 3000) // Sincronizar a cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  const loadCommunityData = () => {
    try {
      setLoading(true)
      const communityMessages = CommunityDataMock.getMessages(50, 0)
      setMessages(communityMessages)

      const communityRules = CommunityDataMock.getRules()
      setRules(communityRules.content)
    } catch (error) {
      console.error('Error loading community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (content: string) => {
    if (!user || !profile) return

    const newMessage = CommunityDataMock.sendMessage(user.id, {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url
    }, content)

    setMessages(prev => [newMessage, ...prev])
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!user) return

    const success = CommunityDataMock.addReaction(messageId, user.id, emoji)
    if (success) {
      loadCommunityData()
    }
  }

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    if (!user) return

    const success = CommunityDataMock.removeReaction(messageId, user.id, emoji)
    if (success) {
      loadCommunityData()
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageToDelete({ id: messageId, content: message.content })
      setDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = (reason: string) => {
    if (!messageToDelete || !user) return

    const success = CommunityDataMock.deleteMessage(messageToDelete.id, user.id, reason)
    if (success) {
      loadCommunityData()
      setDeleteModalOpen(false)
      setMessageToDelete(null)
    }
  }

  const handleBanUser = (duration: '1_day' | '7_days' | 'permanent', reason: string) => {
    if (!selectedUserForBan || !user) return

    CommunityDataMock.banUser(selectedUserForBan.id, user.id, reason)
    setSelectedUserForBan(null)
    loadCommunityData()
  }

  const handleClickUser = (userId: string, userName: string) => {
    // Apenas admin (CEO) pode banir
    if (profile?.role !== 'ceo') return

    const userMessages = messages.filter(m => m.userId === userId)
    if (userMessages.length > 0) {
      const userProfile = userMessages[0].userProfile
      setSelectedUserForBan({
        id: userId,
        name: userName,
        email: userProfile.email,
        avatar: userProfile.avatarUrl
      })
    }
  }

  const handleSaveRules = (content: string) => {
    if (!user) return

    CommunityDataMock.updateRules(content, user.id)
    setRules(content)
    setRulesOpen(false)
    loadCommunityData()
  }

  const isAdmin = profile?.role === 'ceo'

  // Determinar mensagem de banimento
  let banMessage = ''
  if (banStatus.isBanned) {
    if (banStatus.expiresAt) {
      const expiresDate = new Date(banStatus.expiresAt).toLocaleDateString('pt-BR')
      banMessage = `Você está banida da comunidade até ${expiresDate}`
    } else {
      banMessage = 'Você foi permanentemente banida da comunidade'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando comunidade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="text-zayia-pink" />
            Comunidade ZAYIA
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {messages.length} mensagens • {isAdmin ? '👑 Modo Admin' : '👩‍💼 Modo Usuária'}
          </p>
        </div>

        <button
          onClick={() => setRulesOpen(true)}
          className="px-4 py-2 bg-zayia-purple text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <BookOpen size={18} />
          Regras
        </button>
      </div>

      {/* Ban Notice */}
      {banStatus.isBanned && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">🚫 {banMessage}</p>
        </div>
      )}

      {/* Community Container */}
      <div className="flex gap-4">
        {/* Messages Section */}
        <div className="flex-1 space-y-4">
          {/* Rules Modal */}
          <RulesModal
            isOpen={rulesOpen}
            rules={rules}
            isAdmin={isAdmin}
            onClose={() => setRulesOpen(false)}
            onSaveRules={handleSaveRules}
          />

          {/* Messages List */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-96 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>Nenhuma mensagem ainda. Seja a primeira! 💜</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(message => {
                  const reactions = CommunityDataMock.getFormattedReactions(message.id, user?.id || '')
                  return (
                    <MessageWithHover
                      key={message.id}
                      message={message}
                      reactions={reactions}
                      currentUserId={user?.id || ''}
                      isAdmin={isAdmin}
                      onAddReaction={handleAddReaction}
                      onRemoveReaction={handleRemoveReaction}
                      onDelete={handleDeleteMessage}
                      onClickUser={handleClickUser}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Message Input */}
          <MessageInput
            onSendMessage={handleSendMessage}
            isDisabled={banStatus.isBanned}
            disabledReason={banMessage}
          />
        </div>

        {/* Admin Panel (Right Side) */}
        {selectedUserForBan && isAdmin && (
          <UserBanPanel
            userId={selectedUserForBan.id}
            userName={selectedUserForBan.name}
            userEmail={selectedUserForBan.email}
            userAvatar={selectedUserForBan.avatar}
            banHistory={CommunityDataMock.getUserBanHistory(selectedUserForBan.id)}
            onClose={() => setSelectedUserForBan(null)}
            onBan={handleBanUser}
          />
        )}
      </div>

      {/* Delete Message Modal */}
      {messageToDelete && (
        <DeleteMessageModal
          isOpen={deleteModalOpen}
          messageContent={messageToDelete.content}
          onClose={() => {
            setDeleteModalOpen(false)
            setMessageToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}