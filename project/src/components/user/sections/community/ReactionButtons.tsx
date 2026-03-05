import { useState } from 'react'
import { SmilePlus } from 'lucide-react'

// MessageReaction type (previously from community-data-mock)
interface MessageReaction {
  emoji: string
  count: number
  userReacted?: boolean
}

const EMOJI_OPTIONS = ['😍', '🔥', '💪', '🙌', '❤️']

interface ReactionButtonsProps {
  messageId: string
  reactions: MessageReaction[]
  currentUserId: string
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
}

export function ReactionButtons({
  messageId,
  reactions,
  currentUserId,
  onAddReaction,
  onRemoveReaction
}: ReactionButtonsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleEmojiClick = (emoji: string) => {
    const existingReaction = reactions.find(r => r.emoji === emoji && r.userReacted)

    if (existingReaction) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }

    setShowEmojiPicker(false)
  }

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {/* Reações existentes */}
      {reactions.map(reaction => (
        <button
          key={reaction.emoji}
          onClick={() => handleEmojiClick(reaction.emoji)}
          className={`px-2 py-1 rounded-full text-sm font-medium transition ${
            reaction.userReacted
              ? 'bg-zayia-pink/30 border border-zayia-pink text-zayia-pink'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {reaction.emoji} {reaction.count}
        </button>
      ))}

      {/* Botão para adicionar reação */}
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1 hover:bg-gray-100 rounded transition"
          title="Adicionar reação"
        >
          <SmilePlus size={16} className="text-gray-500" />
        </button>

        {/* Emoji picker popup */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg p-2 shadow-lg z-10 flex gap-1">
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl hover:scale-125 transition cursor-pointer"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
