import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient, type CommunityMessage, type CommunityBan } from '../../../lib/supabase-client'
import { CommunityDataMock, type MessageReport } from '../../../lib/community-data-mock'
import { MessageCircle } from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { Toast } from '../../ui/Toast'
import { MessageWithHover } from './community/Message'
import { MessageInput } from './community/MessageInput'
import { RulesModal } from './community/RulesModal'
import { UserBanPanel } from './community/UserBanPanel'
import { DeleteMessageModal } from './community/DeleteMessageModal'
import { QuickBanModal } from './community/QuickBanModal'
import { RulesBanner } from './community/RulesBanner'
import { ReportModal } from './community/ReportModal'
import { ReportsListModal } from './community/ReportsListModal'

export function CommunitySection() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [selectedUserForBan, setSelectedUserForBan] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<{ id: string; content: string } | null>(null)
  const [quickBanModalOpen, setQuickBanModalOpen] = useState(false)
  const [messageForQuickBan, setMessageForQuickBan] = useState<{ id: string; userId: string; userName: string; content: string } | null>(null)
  const [rules, setRules] = useState('')
  const [banStatus, setBanStatus] = useState<{ isBanned: boolean; expiresAt?: string }>({ isBanned: false })
  const [banToastMessage, setBanToastMessage] = useState<string | null>(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [messageForReport, setMessageForReport] = useState<{ id: string; content: string; senderName: string } | null>(null)
  const [reportsListOpen, setReportsListOpen] = useState(false)
  const [allReports, setAllReports] = useState<MessageReport[]>([])
  const [reportToastMessage, setReportToastMessage] = useState<string | null>(null)
  const [reportCount, setReportCount] = useState(0)

  // Check if user is banned
  useEffect(() => {
    if (user?.id) {
      checkUserBanStatus()
    }
  }, [user?.id])

  // Load messages and setup real-time listener
  useEffect(() => {
    loadCommunityData()

    // Setup real-time listener for messages
    const unsubscribeMessages = supabaseClient.onMessagesChange((change: any) => {
      console.log('📱 Message change:', change.eventType)
      // Reload messages on any change
      loadCommunityData()
    })

    // Setup real-time listener for ban status
    let unsubscribeBan: (() => void) | undefined
    if (user?.id) {
      unsubscribeBan = supabaseClient.onUserBanChange(user.id, (_change: any) => {
        checkUserBanStatus()
      })
    }

    return () => {
      unsubscribeMessages()
      if (unsubscribeBan) unsubscribeBan()
    }
  }, [user?.id])

  const checkUserBanStatus = async () => {
    if (!user?.id) return

    try {
      const ban = await supabaseClient.getUserBanStatus(user.id)
      const isBanned = ban !== null && ban.status === 'active'
      const expiresAt = ban?.expires_at

      setBanStatus(prevStatus => {
        // If changed from not banned to banned, show notification
        if (!prevStatus.isBanned && isBanned) {
          const message = expiresAt
            ? `🚫 Você foi banida até ${new Date(expiresAt).toLocaleDateString('pt-BR')}`
            : '🚫 Você foi permanentemente banida da comunidade'
          setBanToastMessage(message)
        } else if (prevStatus.isBanned && !isBanned) {
          // Ban expired
          setBanToastMessage('✅ Seu ban expirou! Bem-vinda de volta à comunidade!')
        }
        return { isBanned, expiresAt }
      })
    } catch (error) {
      console.error('Error checking ban status:', error)
    }
  }

  const loadCommunityData = async () => {
    try {
      setLoading(true)

      // Load messages from Supabase
      const communityMessages = await supabaseClient.getMessages(50, 0)
      setMessages(communityMessages)

      // Load rules from mock (TODO: migrate to Supabase in Phase 3)
      const communityRules = CommunityDataMock.getRules()
      setRules(communityRules.content)

      // Load pending reports (TODO: migrate to Supabase in Phase 3)
      const reports = CommunityDataMock.getReports()
      setAllReports(reports)
      setReportCount(CommunityDataMock.getPendingReportCount())
    } catch (error) {
      console.error('Error loading community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!user || !profile) return

    // Check if user is banned
    const ban = await supabaseClient.getUserBanStatus(user.id)
    if (ban && ban.status === 'active') {
      setBanToastMessage('🚫 Você não pode enviar mensagens enquanto está banida')
      return
    }

    // Post message to Supabase
    const newMessage = await supabaseClient.postMessage(user.id, content)
    if (newMessage) {
      // Message will be loaded via real-time listener
      console.log('✅ Message posted:', newMessage.id)
    } else {
      console.error('Failed to post message')
    }
  }

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!user) return

    const success = await supabaseClient.addReaction(messageId, user.id, emoji)
    if (success) {
      console.log('✅ Reaction added')
      // Will be updated via real-time listener
    }
  }

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    if (!user) return

    const success = await supabaseClient.removeReaction(messageId, user.id, emoji)
    if (success) {
      console.log('✅ Reaction removed')
      // Will be updated via real-time listener
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageToDelete({ id: messageId, content: message.content })
      setDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async (reason: string) => {
    if (!messageToDelete || !user) return

    const success = await supabaseClient.deleteMessage(messageToDelete.id, user.id, reason)
    if (success) {
      setDeleteModalOpen(false)
      setMessageToDelete(null)
      console.log('✅ Message deleted')
      // Will be updated via real-time listener
    }
  }

  const handleQuickBan = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageForQuickBan({
        id: messageId,
        userId: message.user_id,
        userName: message.user_profile.full_name,
        content: message.content
      })
      setQuickBanModalOpen(true)
    }
  }

  const handleConfirmQuickBan = async (duration: '1_day' | '7_days' | 'permanent', reason: string) => {
    if (!messageForQuickBan || !user) return

    // Delete message
    const deleteSuccess = await supabaseClient.deleteMessage(messageForQuickBan.id, user.id, 'Deletada por quick-ban')

    // Ban user
    if (deleteSuccess) {
      await supabaseClient.banUser(messageForQuickBan.userId, duration, reason)
      setQuickBanModalOpen(false)
      setMessageForQuickBan(null)
      console.log('✅ User banned and message deleted')
      // Will be updated via real-time listener
    }
  }

  const handleBanUser = async (duration: '1_day' | '7_days' | 'permanent', reason: string) => {
    if (!selectedUserForBan || !user) return

    await supabaseClient.banUser(selectedUserForBan.id, duration, reason)
    setSelectedUserForBan(null)
    console.log('✅ User banned')
    // Will be updated via real-time listener
  }

  const handleClickUser = (userId: string, userName: string) => {
    // Apenas admin (CEO) pode banir
    if (profile?.role !== 'ceo') return

    const userMessages = messages.filter(m => m.user_id === userId)
    if (userMessages.length > 0) {
      const userProfile = userMessages[0].user_profile
      setSelectedUserForBan({
        id: userId,
        name: userName,
        email: userProfile?.email || '',
        avatar: userProfile?.avatar_url
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

  const handleReport = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageForReport({
        id: messageId,
        content: message.content,
        senderName: message.user_profile.full_name
      })
      setReportModalOpen(true)
    }
  }

  const handleSubmitReport = async (reason: string, description: string, anonymous: boolean) => {
    if (!messageForReport || !user) return

    const success = await supabaseClient.reportMessage(
      messageForReport.id,
      anonymous ? undefined : user.id,
      reason as 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other',
      description
    )

    if (success) {
      setReportToastMessage('✅ Report enviado com sucesso')
      setReportModalOpen(false)
      setMessageForReport(null)
      console.log('✅ Report submitted')
    }
  }

  const handleReportAction = async (action: 'ban' | 'delete' | 'archive', reportId: string, messageId?: string) => {
    if (action === 'archive') {
      const success = CommunityDataMock.updateReportStatus(reportId, 'resolved')
      if (success) {
        console.log('✅ Report archived')
      }
    } else if (action === 'delete' && messageId) {
      const message = messages.find(m => m.id === messageId)
      if (message && user) {
        await supabaseClient.deleteMessage(messageId, user.id, 'Deletada por report')
        CommunityDataMock.updateReportStatus(reportId, 'resolved')
        console.log('✅ Message deleted and report archived')
        // Will be updated via real-time listener
      }
    } else if (action === 'ban' && messageId) {
      const message = messages.find(m => m.id === messageId)
      if (message) {
        setMessageForQuickBan({
          id: messageId,
          userId: message.user_id,
          userName: message.user_profile.full_name,
          content: message.content
        })
        setQuickBanModalOpen(true)
        // Marcar report como resolvido após banir
        const success = CommunityDataMock.updateReportStatus(reportId, 'resolved')
        if (success) {
          loadCommunityData()
        }
      }
    }
  }

  const isAdmin = profile?.role === 'ceo'

  // Helper function to convert Supabase reactions to mock format
  const formatReactionsForUI = (supabaseReactions: any[] | undefined, currentUserId: string) => {
    if (!supabaseReactions || supabaseReactions.length === 0) {
      return []
    }

    // Group by emoji
    const grouped = supabaseReactions.reduce((acc: any, reaction: any) => {
      const emoji = reaction.emoji
      if (!acc[emoji]) {
        acc[emoji] = { emoji, count: 0, userIds: [] }
      }
      acc[emoji].count++
      acc[emoji].userIds.push(reaction.user_id)
      return acc
    }, {})

    // Convert to mock format
    return Object.values(grouped).map((group: any) => ({
      emoji: group.emoji,
      count: group.count,
      userReacted: group.userIds.includes(currentUserId)
    }))
  }

  // Determinar mensagem de banimento
  let banMessage = ''
  if (banStatus.isBanned) {
    if (banStatus.expiresAt) {
      const expiresDate = new Date(banStatus.expiresAt)
      const daysRemaining = Math.ceil((expiresDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      banMessage = `Você está banida até ${expiresDate.toLocaleDateString('pt-BR')} (${daysRemaining} dias)`
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
      {/* Ban Toast Notification */}
      {banToastMessage && (
        <Toast
          message={banToastMessage}
          type={banToastMessage.includes('✅') ? 'success' : 'error'}
          duration={5000}
          onClose={() => setBanToastMessage(null)}
        />
      )}

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

        <div className="flex items-center gap-2">
          {isAdmin && reportCount > 0 && (
            <button
              onClick={() => setReportsListOpen(true)}
              className="relative px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <span>📊 Reports</span>
              <span className="bg-white text-red-500 rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                {reportCount}
              </span>
            </button>
          )}
        </div>
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
          {/* Rules Banner */}
          <RulesBanner
            isAdmin={isAdmin}
            onViewRules={() => setRulesOpen(true)}
          />

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
                  const reactions = formatReactionsForUI(message.reactions, user?.id || '')
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
                      onQuickBan={handleQuickBan}
                      onReport={handleReport}
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

      {/* Quick Ban Modal */}
      {messageForQuickBan && (
        <QuickBanModal
          isOpen={quickBanModalOpen}
          userName={messageForQuickBan.userName}
          messageContent={messageForQuickBan.content}
          onClose={() => {
            setQuickBanModalOpen(false)
            setMessageForQuickBan(null)
          }}
          onConfirm={handleConfirmQuickBan}
        />
      )}

      {/* Report Modal */}
      {messageForReport && (
        <ReportModal
          isOpen={reportModalOpen}
          messageContent={messageForReport.content}
          messageSenderName={messageForReport.senderName}
          onClose={() => {
            setReportModalOpen(false)
            setMessageForReport(null)
          }}
          onConfirm={handleSubmitReport}
        />
      )}

      {/* Reports List Modal */}
      {isAdmin && (
        <ReportsListModal
          isOpen={reportsListOpen}
          reports={allReports}
          onClose={() => setReportsListOpen(false)}
          onViewContext={() => {}} // TODO: implementar scroll para mensagem
          onBan={(messageId) => handleReportAction('ban', allReports.find(r => r.messageId === messageId)?.id || '', messageId)}
          onDelete={(messageId) => handleReportAction('delete', allReports.find(r => r.messageId === messageId)?.id || '', messageId)}
          onArchive={(reportId) => handleReportAction('archive', reportId)}
        />
      )}

      {/* Report Toast */}
      {reportToastMessage && (
        <Toast
          message={reportToastMessage}
          type="success"
          duration={4000}
          onClose={() => setReportToastMessage(null)}
        />
      )}
    </div>
  )
}