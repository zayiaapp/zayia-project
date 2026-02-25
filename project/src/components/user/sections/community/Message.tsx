import { Trash2 } from 'lucide-react'
import { CommunityMessage, MessageReaction } from '../../../../lib/community-data-mock'
import { ReactionButtons } from './ReactionButtons'

// Formatar tempo relativo (ex: "há 5 minutos")
function formatTimeAgo(date: string): string {
  const now = new Date()
  const messageDate = new Date(date)
  const diffMs = now.getTime() - messageDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `há ${diffMins}m`
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays < 7) return `há ${diffDays}d`

  return messageDate.toLocaleDateString('pt-BR')
}

interface MessageProps {
  message: CommunityMessage
  reactions: MessageReaction[]
  currentUserId: string
  isAdmin: boolean
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  onDelete: (messageId: string) => void
  onQuickBan: (messageId: string) => void
  onClickUser: (userId: string, userName: string) => void
}

export function Message({
  message,
  reactions,
  currentUserId,
  isAdmin,
  onAddReaction,
  onRemoveReaction,
  onDelete,
  onQuickBan,
  onClickUser
}: MessageProps) {
  const avatar = message.userProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userProfile.fullName}`
  const timeAgo = formatTimeAgo(message.createdAt)

  // Render deleted message placeholder
  if (message.deletedByAdmin) {
    return (
      <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
        <div className="flex items-start gap-3">
          <img
            src={avatar}
            alt={message.userProfile.fullName}
            className="w-10 h-10 rounded-full object-cover opacity-50"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">{message.userProfile.fullName}</span>
              <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>

            {/* Deleted message placeholder */}
            <div className="bg-gray-100 rounded-lg p-3 mt-2 border border-gray-200">
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span>📋</span>
                <span>Mensagem removida por administrador</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Highlight mentions
  const highlightMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g
    const parts = text.split(mentionRegex)

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Mention
        return (
          <span key={index} className="text-zayia-blue font-semibold bg-blue-50 px-1 rounded cursor-pointer hover:bg-blue-100">
            @{part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
      {/* Header: Avatar + Nome + Tempo */}
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={message.userProfile.fullName}
          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
          onClick={() => onClickUser(message.userId, message.userProfile.fullName)}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onClickUser(message.userId, message.userProfile.fullName)}
                className="font-semibold text-gray-900 hover:text-zayia-pink transition"
              >
                {message.userProfile.fullName}
              </button>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>

            {/* Admin buttons */}
            {isAdmin && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => onQuickBan(message.id)}
                  className="p-1 hover:bg-orange-50 rounded hover:text-orange-600 transition text-gray-600"
                  title="Banir usuária"
                >
                  ⛔
                </button>

                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition"
                  title="Deletar mensagem"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <p className="text-gray-800 mt-1 break-words">
            {highlightMentions(message.content)}
          </p>

          {/* Reações */}
          <ReactionButtons
            messageId={message.id}
            reactions={reactions}
            currentUserId={currentUserId}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
          />
        </div>
      </div>
    </div>
  )
}

// Wrapper com hover effect
export function MessageWithHover(props: MessageProps) {
  return (
    <div className="group hover:bg-gray-50 px-4 py-2 rounded transition">
      <Message {...props} />
    </div>
  )
}
