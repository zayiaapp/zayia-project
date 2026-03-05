import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { ExportDataSection } from './ExportDataSection'
import CompanyInfoModal from '../CompanyInfoModal'

interface NotificationPrefs {
  notify_challenges: boolean
  notify_medals: boolean
  notify_community: boolean
}

export function SettingsSection() {
  const { user } = useAuth()
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    notify_challenges: true,
    notify_medals: true,
    notify_community: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    supabaseClient.getUserPreferences(user.id).then((data: any) => {
      if (data) {
        setPrefs({
          notify_challenges: data.notify_challenges ?? true,
          notify_medals: data.notify_medals ?? true,
          notify_community: data.notify_community ?? true,
        })
      }
      setIsLoading(false)
    })
  }, [user?.id])

  const handleToggle = async (key: keyof NotificationPrefs) => {
    if (!user?.id) return
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    setIsSaving(true)
    await supabaseClient.updateUserPreferences(user.id, { [key]: updated[key] })
    setIsSaving(false)
    setSaveMessage('✅ Salvo')
    setTimeout(() => setSaveMessage(null), 2000)
  }

  const TOGGLES: { key: keyof NotificationPrefs; label: string }[] = [
    { key: 'notify_challenges', label: 'Desafios Diários' },
    { key: 'notify_medals', label: 'Medalhas Conquistadas' },
    { key: 'notify_community', label: 'Mensagens da Comunidade' },
  ]

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zayia-deep-violet">⚙️ Configurações</h2>
        <p className="text-zayia-violet-gray text-sm mt-1">Personalize sua experiência na ZAYIA</p>
      </div>

      {/* Notificações Section */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zayia-deep-violet">🔔 Notificações</h3>
          {isSaving && <span className="text-xs text-zayia-violet-gray">Salvando...</span>}
          {saveMessage && <span className="text-xs text-green-600">{saveMessage}</span>}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-zayia-purple" />
          </div>
        ) : (
          <div className="space-y-3">
            {TOGGLES.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <label className="text-gray-700 font-medium cursor-pointer" onClick={() => handleToggle(key)}>
                  {label}
                </label>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() => handleToggle(key)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exportar Dados Section - LGPD Compliance */}
      <div className="zayia-card p-6">
        <ExportDataSection />
      </div>

      {/* Sobre Section */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">ℹ️ Sobre</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Versão da ZAYIA</span>
            <span className="font-semibold text-zayia-deep-violet">2.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Ambiente</span>
            <span className="font-semibold text-zayia-deep-violet">Produção</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Última atualização</span>
            <span className="font-semibold text-zayia-deep-violet">2026-02-25</span>
          </div>
        </div>

        <button
          onClick={() => setShowCompanyModal(true)}
          className="mt-4 text-zayia-soft-purple hover:text-zayia-deep-violet underline font-semibold text-sm transition"
        >
          Ver informações da empresa
        </button>
      </div>

      {showCompanyModal && (
        <CompanyInfoModal onClose={() => setShowCompanyModal(false)} />
      )}
    </div>
  )
}
