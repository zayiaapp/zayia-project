import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { CommunityDataMock, CommunityMessage } from '../../../lib/community-data-mock'
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
  const [allReports, setAllReports] = useState<unknown[]>([])
  const [reportToastMessage, setReportToastMessage] = useState<string | null>(null)
  const [reportCount, setReportCount] = useState(0)

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

      // Carregar reports pendentes
      const reports = CommunityDataMock.getReports()
      setAllReports(reports)
      setReportCount(CommunityDataMock.getPendingReportCount())

      // Verificar ban status a cada reload (para detectar bans em tempo real)
      if (user?.id) {
        const currentBanStatus = CommunityDataMock.checkIfUserIsBanned(user.id)
        setBanStatus(prevStatus => {
          // Se mudou de não banido para banido, mostrar notificação
          if (!prevStatus.isBanned && currentBanStatus.isBanned) {
            const message = currentBanStatus.expiresAt
              ? `🚫 Você foi banida até ${new Date(currentBanStatus.expiresAt).toLocaleDateString('pt-BR')}`
              : '🚫 Você foi permanentemente banida da comunidade'
            setBanToastMessage(message)
          } else if (prevStatus.isBanned && !currentBanStatus.isBanned) {
            // Ban expirou
            setBanToastMessage('✅ Seu ban expirou! Bem-vinda de volta à comunidade!')
          }
          return currentBanStatus
        })
      }
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

  const handleQuickBan = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageForQuickBan({
        id: messageId,
        userId: message.userId,
        userName: message.userProfile.fullName,
        content: message.content
      })
      setQuickBanModalOpen(true)
    }
  }

  const handleConfirmQuickBan = (_duration: '1_day' | '7_days' | 'permanent', reason: string) => {
    if (!messageForQuickBan || !user) return

    // Delete message
    const deleteSuccess = CommunityDataMock.deleteMessage(messageForQuickBan.id, user.id, 'Deletada por quick-ban')

    // Ban user (banNumber is determined by existing bans)
    if (deleteSuccess) {
      CommunityDataMock.banUser(messageForQuickBan.userId, user.id, reason)
      loadCommunityData()
      setQuickBanModalOpen(false)
      setMessageForQuickBan(null)
    }
  }

  const handleBanUser = (_duration: '1_day' | '7_days' | 'permanent', reason: string) => {
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

  const handleReport = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setMessageForReport({
        id: messageId,
        content: message.content,
        senderName: message.userProfile.fullName
      })
      setReportModalOpen(true)
    }
  }

  const handleSubmitReport = (reason: string, description: string, anonymous: boolean) => {
    if (!messageForReport || !user) return

    const message = messages.find(m => m.id === messageForReport.id)
    if (!message) return

    const report = CommunityDataMock.submitReport(
      messageForReport.id,
      message,
      anonymous ? null : user.id,
      anonymous ? null : profile?.full_name || 'Usuária',
      reason as unknown,
      description
    )

    if (report) {
      setReportToastMessage('✅ Report enviado com sucesso')
      setReportModalOpen(false)
      setMessageForReport(null)
      loadCommunityData()
    }
  }

  const handleReportAction = (action: 'ban' | 'delete' | 'archive', reportId: string, messageId?: string) => {
    if (action === 'archive') {
      const success = CommunityDataMock.updateReportStatus(reportId, 'resolved')
      if (success) {
        loadCommunityData()
      }
    } else if (action === 'delete' && messageId) {
      const message = messages.find(m => m.id === messageId)
      if (message && user) {
        CommunityDataMock.deleteMessage(messageId, user.id, 'Deletada por report')
        CommunityDataMock.updateReportStatus(reportId, 'resolved')
        loadCommunityData()
      }
    } else if (action === 'ban' && messageId) {
      const message = messages.find(m => m.id === messageId)
      if (message) {
        setMessageForQuickBan({
          id: messageId,
          userId: message.userId,
          userName: message.userProfile.fullName,
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