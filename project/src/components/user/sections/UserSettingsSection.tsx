import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { Settings, Bell, Lock, Download, Trash2, Globe, Type } from 'lucide-react'

interface UserPreferences {
  notifications_email: boolean
  notifications_inapp: boolean
  notifications_community: boolean
  profile_visibility: 'public' | 'friends' | 'private'
  show_email: boolean
  show_last_access: boolean
  language: 'pt' | 'en'
  font_size: 'small' | 'medium' | 'large'
}

export function UserSettingsSection() {
  const { profile, user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications_email: true,
    notifications_inapp: true,
    notifications_community: true,
    profile_visibility: 'public',
    show_email: false,
    show_last_access: true,
    language: 'pt',
    font_size: 'medium'
  })

  const [activeTab, setActiveTab] = useState('notifications')
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      // Save to localStorage for now (would be persisted to DB in production)
      localStorage.setItem(`user_preferences_${user?.id}`, JSON.stringify(preferences))
      alert('✅ Preferências salvas com sucesso!')
    } catch (error) {
      console.error('❌ Error saving preferences:', error)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const userData = {
        profile,
        preferences,
        exportedAt: new Date().toISOString()
      }

      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `zayia-dados-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      alert('✅ Dados exportados com sucesso!')
    } catch (error) {
      console.error('❌ Error exporting data:', error)
      alert('Erro ao exportar dados.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Tem certeza? Esta ação é irreversível e deletará sua conta permanentemente.'
    )

    if (!confirmed) return

    const password = prompt('Digite sua senha para confirmar:')
    if (!password) return

    try {
      alert('⚠️ Funcionalidade de delete será implementada em breve com autenticação segura.')
      setShowDeleteModal(false)
    } catch (error) {
      console.error('❌ Error deleting account:', error)
      alert('Erro ao deletar conta.')
    }
  }

  const tabs = [
    { id: 'notifications', label: '🔔 Notificações' },
    { id: 'privacy', label: '🔒 Privacidade' },
    { id: 'preferences', label: '⚙️ Preferências' },
    { id: 'data', label: '📊 Dados' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Configurações
        </h2>
        <p className="text-purple-100">Personalize sua experiência na ZAYIA</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications_email}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notifications_email: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800">Notificações por Email</p>
                  <p className="text-xs text-gray-600">Receba atualizações importantes</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications_inapp}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notifications_inapp: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800">Notificações na App</p>
                  <p className="text-xs text-gray-600">Alertas em tempo real</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications_community}
                  onChange={(e) =>
                    setPreferences({ ...preferences, notifications_community: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800">Notificações da Comunidade</p>
                  <p className="text-xs text-gray-600">Mensagens e interações</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Visibilidade do Perfil
              </label>
              <select
                value={preferences.profile_visibility}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    profile_visibility: e.target.value as any
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="public">🌐 Público (todos podem ver)</option>
                <option value="friends">👥 Apenas amigos</option>
                <option value="private">🔒 Privado (apenas você)</option>
              </select>
            </div>

            <div className="space-y-3 mt-6">
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.show_email}
                  onChange={(e) =>
                    setPreferences({ ...preferences, show_email: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800">Mostrar Email</p>
                  <p className="text-xs text-gray-600">Seu email será visível no perfil</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.show_last_access}
                  onChange={(e) =>
                    setPreferences({ ...preferences, show_last_access: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800">Mostrar Último Acesso</p>
                  <p className="text-xs text-gray-600">Quando você acessou por último</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Idioma
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="pt">🇧🇷 Português</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Tamanho da Fonte
              </label>
              <select
                value={preferences.font_size}
                onChange={(e) => setPreferences({ ...preferences, font_size: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="small">Pequena</option>
                <option value="medium">Média</option>
                <option value="large">Grande</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                💡 As mudanças de idioma e tamanho de fonte serão aplicadas imediatamente.
              </p>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Exportar Meus Dados
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Baixe uma cópia de todos os seus dados em formato JSON.
              </p>
              <button
                onClick={handleExportData}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                📥 Exportar Dados
              </button>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Deletar Conta
              </h3>
              <p className="text-sm text-red-600 mb-4">
                Esta ação é irreversível. Toda sua conta e dados serão permanentemente deletados.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                ⚠️ Deletar Minha Conta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button (for notifications, privacy, preferences) */}
      {activeTab !== 'data' && (
        <div className="flex gap-3">
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-semibold"
          >
            {saving ? '⏳ Salvando...' : '💾 Salvar Preferências'}
          </button>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-red-600 mb-3">Deletar Conta?</h3>
            <p className="text-gray-700 mb-4 text-sm">
              Esta ação é <strong>irreversível</strong>. Você perderá:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm mb-4 space-y-1">
              <li>Seu perfil completo</li>
              <li>Todos seus pontos e medalhas</li>
              <li>Histórico de desafios</li>
              <li>Mensagens da comunidade</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Sim, Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
