import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient, type CommunityMessage } from '../../../lib/supabase-client'
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
import { useRealtimeCommunity } from '../../../hooks/useRealtimeCommunity'
import { useBanStatus } from '../../../hooks/useBanStatus'
import { useCommunityActions } from '../../../hooks/useCommunityActions'
import { useRules } from '../../../hooks/useRules'

export function CommunitySection() {
  const { user, profile } = useAuth()

  // Custom hooks for real-time sync and community operations
  const {
    messages,
    loading,
    addMessageOptimistic,
    updateMessageOptimistic
  } = useRealtimeCommunity({ userId: user?.id })

  const {
    banStatus,
    banMessage,
    checkBanStatus
  } = useBanStatus(user?.id)

  const {
    postMessage: postMessageAction,
    deleteMessage: deleteMessageAction,
    addReaction,
    removeReaction,
    banUser,
    reportMessage
  } = useCommunityActions({
    userId: user?.id,
    userRole: profile?.role,
    onOptimisticAdd: addMessageOptimistic,
    onOptimisticUpdate: updateMessageOptimistic
  })

  const { rules, updateRules } = useRules(user?.id)

  // Local UI state (modals, forms, toasts)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [selectedUserForBan, setSelectedUserForBan] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<{ id: string; content: string } | null>(null)
  const [quickBanModalOpen, setQuickBanModalOpen] = useState(false)
  const [messageForQuickBan, setMessageForQuickBan] = useState<{ id: string; userId: string; userName: string; content: string } | null>(null)
  const [banToastMessage, setBanToastMessage] = useState<string | null>(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [messageForReport, setMessageForReport] = useState<{ id: string; content: string; senderName: string } | null>(null)
  const [reportsListOpen, setReportsListOpen] = useState(false)
  const [allReports, setAllReports] = useState<MessageReport[]>([])
  const [reportToastMessage, setReportToastMessage] = useState<string | null>(null)
  const [reportCount, setReportCount] = useState(0)

  const handleSendMessage = async (content: string) => {
    if (!user || !profile) return

    try {
      await postMessageAction(content, profile)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post message'
      setBanToastMessage(message)
    }
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji)
  }

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    removeReaction(messageId, emoji)
  }

  const handleDeleteMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageToDelete({ id: messageId, content: message.content })
      setDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async (reason: string) => {
    if (!messageToDelete) return

    const success = await deleteMessageAction(messageToDelete.id, reason)
    if (success) {
      setDeleteModalOpen(false)
      setMessageToDelete(null)
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
    if (!messageForQuickBan) return

    // Delete message
    const deleteSuccess = await deleteMessageAction(messageForQuickBan.id, 'Deletada por quick-ban')

    // Ban user
    if (deleteSuccess) {
      await banUser(messageForQuickBan.userId, duration, reason)
      setQuickBanModalOpen(false)
      setMessageForQuickBan(null)
    }
  }

  const handleBanUser = async (duration: '1_day' | '7_days' | 'permanent', reason: string) => {
    if (!selectedUserForBan) return

    await banUser(selectedUserForBan.id, duration, reason)
    setSelectedUserForBan(null)
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

  const handleSaveRules = async (content: string) => {
    const success = await updateRules(content)
    if (success) {
      setRulesOpen(false)
    }
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
    if (!messageForReport) return

    const success = await reportMessage(
      messageForReport.id,
      reason as 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other',
      description,
      anonymous
    )

    if (success) {
      setReportToastMessage('✅ Report enviado com sucesso')
      setReportModalOpen(false)
      setMessageForReport(null)
    }
  }

  const handleReportAction = async (action: 'ban' | 'delete' | 'archive', reportId: string, messageId?: string) => {
    if (action === 'archive') {
      const success = CommunityDataMock.updateReportStatus(reportId, 'resolved')
      if (success) {
        console.log('✅ Report archived')
      }
    } else if (action === 'delete' && messageId) {
      const success = await deleteMessageAction(messageId, 'Deletada por report')
      if (success) {
        CommunityDataMock.updateReportStatus(reportId, 'resolved')
        console.log('✅ Message deleted and report archived')
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
          console.log('✅ Report marked as resolved')
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

  // banMessage is provided by useBanStatus hook

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