import { useState } from 'react'
import { X, Edit2, Save } from 'lucide-react'

// Simple markdown rendering
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-xl font-bold mt-3 mb-2 text-gray-900">
          {line.substring(3)}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-2xl font-bold mt-4 mb-2 text-gray-900">
          {line.substring(2)}
        </h1>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={index} className="mb-1 text-gray-800 ml-4">
          {line.substring(2)}
        </li>
      )
    } else if (line.trim() === '') {
      elements.push(<br key={index} />)
    } else {
      elements.push(
        <p key={index} className="mb-2 text-gray-800">
          {line}
        </p>
      )
    }
  })

  return elements
}

interface RulesModalProps {
  isOpen: boolean
  rules: string
  isAdmin: boolean
  onClose: () => void
  onSaveRules?: (content: string) => void
}

export function RulesModal({ isOpen, rules, isAdmin, onClose, onSaveRules }: RulesModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedRules, setEditedRules] = useState(rules)

  const handleSave = () => {
    if (onSaveRules) {
      onSaveRules(editedRules)
      setIsEditing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">📋 Regras da Comunidade</h2>

          <div className="flex items-center gap-2">
            {isAdmin && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-zayia-pink"
                title="Editar regras"
              >
                <Edit2 size={20} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            // Edit mode
            <div className="space-y-4">
              <textarea
                value={editedRules}
                onChange={e => setEditedRules(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zayia-pink/30"
                placeholder="Digite as regras em Markdown..."
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedRules(rules)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  style={{ backgroundColor: '#EC4899', color: 'white' }}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save size={18} />
                  Salvar Regras
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="text-gray-700 space-y-2">
              {renderMarkdown(rules)}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEditing && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              ℹ️ Ao entrar na comunidade, você concorda com estas regras. Violações resultarão em bans escalados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
