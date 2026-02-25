interface ReportButtonProps {
  messageId: string
  isOwnMessage: boolean
  isDeleted: boolean
  onReport: (messageId: string) => void
}

export function ReportButton({ messageId, isOwnMessage, isDeleted, onReport }: ReportButtonProps) {
  // Não mostrar botão se for mensagem própria, deletada ou admin
  if (isOwnMessage || isDeleted) {
    return null
  }

  return (
    <button
      onClick={() => onReport(messageId)}
      className="p-1 hover:bg-orange-50 rounded hover:text-orange-600 transition text-gray-600"
      title="Reportar mensagem"
    >
      🚩
    </button>
  )
}
