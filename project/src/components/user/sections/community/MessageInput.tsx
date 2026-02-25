import { useState } from 'react'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  isDisabled: boolean
  disabledReason?: string
}

export function MessageInput({ onSendMessage, isDisabled, disabledReason }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    onSendMessage(content)
    setContent('')
  }

  if (isDisabled) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm font-medium">🚫 {disabledReason}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Digite sua mensagem aqui... (use @nome para mencionar)"
        className={`flex-1 px-4 py-3 border rounded-lg transition focus:outline-none focus:ring-2 ${
          isFocused
            ? 'border-zayia-pink focus:ring-zayia-pink/30 bg-white'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      />

      <button
        type="submit"
        disabled={!content.trim()}
        className="px-4 py-3 bg-zayia-pink text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 font-medium"
      >
        <Send size={18} />
        <span className="hidden sm:inline">Enviar</span>
      </button>
    </form>
  )
}
