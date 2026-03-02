import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  Send, 
  Clock, 
  Users, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Calendar,
  Smartphone,
  Moon,
  Sun,
  UserX,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react'
import { integrationsManager } from '../../lib/integrations-manager'
import { morningMessages, eveningMessages, absenceMessages, notificationScheduler } from '../../lib/notificationScheduler'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface NotificationHistory {
  id: string
  title: string
  body: string
  timestamp: string
  read: boolean
  type: 'morning' | 'evening' | 'absence' | 'manual'
}

interface NotificationSettings {
  morningEnabled: boolean
  eveningEnabled: boolean
  absenceEnabled: boolean
  morningTime: string
  eveningTime: string
  timezone: string
}

export function NotificationsSection() {
  const [isActive, setIsActive] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    morningEnabled: true,
    eveningEnabled: true,
    absenceEnabled: true,
    morningTime: '06:00',
    eveningTime: '20:00',
    timezone: 'America/Sao_Paulo'
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [testMessage, setTestMessage] = useState('')
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('granted')
  const [fcmToken, setFCMToken] = useState<string | null>(null)
  const [sendingTest, setSendingTest] = useState(false)
  const [notificationsSent, setNotificationsSent] = useState(0)
  const [testNotificationsSent, setTestNotificationsSent] = useState(0)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('notification_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Carregar histórico
    const history = JSON.parse(localStorage.getItem('notification_history') || '[]')
    setNotificationHistory(history)

    // Verificar status de permissão
    setPermissionStatus(Notification.permission)

    // Carregar token FCM
    const token = localStorage.getItem('fcm_token')
    setFCMToken(token)
    
    // Carregar contadores de notificações
    const sentCount = parseInt(localStorage.getItem('notifications_sent_count') || '0')
    const testSentCount = parseInt(localStorage.getItem('test_notifications_sent_count') || '0')
    setNotificationsSent(sentCount)
    setTestNotificationsSent(testSentCount)
    
    // CEO sempre tem sistema ativo por padrão
    setIsActive(true)
  }, [])

  const handleActivateSystem = () => {
    setIsActive(true)
    localStorage.setItem('notification_system_active', 'true')
    notificationScheduler.initialize()
  }

  const handleDeactivateSystem = () => {
    setIsActive(false)
    localStorage.setItem('notification_system_active', 'false')
    setShowDeactivateModal(false)
    // Aqui você poderia cancelar notificações agendadas se necessário
  }

  const handleSaveSettings = () => {
    localStorage.setItem('notification_settings', JSON.stringify(settings))
    
    if (isActive) {
      // Reinicializar com novas configurações
      notificationScheduler.initialize()
    }
  }

  const sendTestNotification = async () => {
    if (!testMessage.trim()) return

    setSendingTest(true)
    try {
      const success = await integrationsManager.sendNotification({
        title: '🧪 Teste ZAYIA',
        body: testMessage,
        icon: '/zayia-icon.png'
      })
      
      if (success) {
        // Incrementar contador de testes
        const newTestCount = testNotificationsSent + 1
        setTestNotificationsSent(newTestCount)
        localStorage.setItem('test_notifications_sent_count', newTestCount.toString())
        
        // Adicionar ao histórico
        const newNotification: NotificationHistory = {
          id: Date.now().toString(),
          title: '🧪 Teste ZAYIA',
          body: testMessage,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'manual'
        }

        setNotificationHistory(prev => [newNotification, ...prev])
        setTestMessage('')
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
    } finally {
      setSendingTest(false)
    }
  }

  const incrementNotificationCount = () => {
    const newCount = notificationsSent + 1
    setNotificationsSent(newCount)
    localStorage.setItem('notifications_sent_count', newCount.toString())
  }
  const getNextScheduledTimes = () => {
    const now = new Date()
    const morning = new Date()
    const evening = new Date()

    morning.setHours(6, 0, 0, 0)
    evening.setHours(20, 0, 0, 0)

    // Se já passou do horário hoje, mostrar para amanhã
    if (morning <= now) {
      morning.setDate(morning.getDate() + 1)
    }
    if (evening <= now) {
      evening.setDate(evening.getDate() + 1)
    }

    return { morning, evening }
  }

  const scheduledTimes = getNextScheduledTimes()

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Status do Sistema */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">
              Status do Sistema de Notificações
            </h3>
            <p className="text-zayia-violet-gray">
              {isActive ? 'Sistema ativo e funcionando' : 'Sistema desativado'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <button
              onClick={isActive ? () => setShowDeactivateModal(true) : handleActivateSystem}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'zayia-button text-white'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? 'Desativar Sistema' : 'Ativar Sistema'}
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">15</div>
            <div className="text-sm text-zayia-violet-gray">Mensagens Manhã</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Moon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">15</div>
            <div className="text-sm text-zayia-violet-gray">Mensagens Noite</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <UserX className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">7</div>
            <div className="text-sm text-zayia-violet-gray">Mensagens Ausência</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Bell className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{notificationsSent}</div>
            <div className="text-sm text-zayia-violet-gray">Total Enviadas</div>
          </div>
        </div>
      </div>

      {/* Próximas Notificações */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          Próximas Notificações Agendadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-800">Mensagem da Manhã</div>
                <div className="text-sm text-yellow-600">Próxima às 06:00 (Brasília)</div>
              </div>
            </div>
            <div className="text-sm text-yellow-700">
              {scheduledTimes.morning.toLocaleString('pt-BR')}
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Moon className="w-6 h-6 text-purple-600" />
              <div>
                <div className="font-semibold text-purple-800">Mensagem da Noite</div>
                <div className="text-sm text-purple-600">Próxima às 20:00 (Brasília)</div>
              </div>
            </div>
            <div className="text-sm text-purple-700">
              {scheduledTimes.evening.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>

      {/* Teste de Notificação */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          🧪 Teste de Notificação
        </h3>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Testes enviados: {testNotificationsSent}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Digite uma mensagem de teste..."
            className="flex-1 zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
            disabled={sendingTest}
          />
          <button
            onClick={sendTestNotification}
            disabled={!testMessage.trim() || sendingTest}
            className="zayia-button px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sendingTest ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
            {sendingTest ? 'Enviando...' : 'Enviar Teste'}
          </button>
        </div>
        <p className="text-xs text-zayia-violet-gray mt-2">
          💡 {integrationsManager.isFirebaseConfigured() ? 'Firebase configurado - notificações reais' : 'Configure Firebase para notificações reais'}
        </p>
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      {/* Mensagens da Manhã */}
      <div className="zayia-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sun className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-zayia-deep-violet">
            Mensagens da Manhã (06h) - {morningMessages.length} mensagens
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {morningMessages.map((message, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-yellow-700">#{index + 1}</span>
                <span className="text-xs text-yellow-600">Manhã</span>
              </div>
              <p className="text-sm text-yellow-800">{message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagens da Noite */}
      <div className="zayia-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Moon className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold text-zayia-deep-violet">
            Mensagens da Noite (20h) - {eveningMessages.length} mensagens
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {eveningMessages.map((message, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-purple-700">#{index + 1}</span>
                <span className="text-xs text-purple-600">Noite</span>
              </div>
              <p className="text-sm text-purple-800">{message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagens de Ausência */}
      <div className="zayia-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserX className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold text-zayia-deep-violet">
            Mensagens de Ausência (24h sem login) - {absenceMessages.length} mensagens
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {absenceMessages.map((message, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-red-700">#{index + 1}</span>
                <span className="text-xs text-red-600">Ausência</span>
              </div>
              <p className="text-sm text-red-800">{message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet">
            Histórico de Notificações ({notificationHistory.length})
          </h3>
          <button
            onClick={() => {
              localStorage.removeItem('notification_history')
              setNotificationHistory([])
            }}
            className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Histórico
          </button>
        </div>

        {notificationHistory.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-zayia-violet-gray mx-auto mb-4" />
            <p className="text-zayia-violet-gray">Nenhuma notificação enviada ainda</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notificationHistory.map((notification) => (
              <div key={notification.id} className="p-4 border border-zayia-lilac/30 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'morning' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'evening' ? 'bg-purple-100 text-purple-600' :
                      notification.type === 'absence' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'morning' ? <Sun className="w-4 h-4" /> :
                       notification.type === 'evening' ? <Moon className="w-4 h-4" /> :
                       notification.type === 'absence' ? <UserX className="w-4 h-4" /> :
                       <Bell className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-zayia-deep-violet">{notification.title}</div>
                      <div className="text-sm text-zayia-violet-gray">
                        {new Date(notification.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.type === 'morning' ? 'bg-yellow-100 text-yellow-700' :
                    notification.type === 'evening' ? 'bg-purple-100 text-purple-700' :
                    notification.type === 'absence' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {notification.type === 'morning' ? 'Manhã' :
                     notification.type === 'evening' ? 'Noite' :
                     notification.type === 'absence' ? 'Ausência' :
                     'Manual'}
                  </span>
                </div>
                <p className="text-sm text-zayia-deep-violet bg-zayia-lilac/10 p-3 rounded-lg">
                  {notification.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">
          Configurações de Notificações
        </h3>

        <div className="space-y-6">
          {/* Horários */}
          <div>
            <h4 className="font-semibold text-zayia-deep-violet mb-4">Horários (Brasília)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notificação da Manhã
                </label>
                <input
                  type="time"
                  value={settings.morningTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, morningTime: e.target.value }))}
                  className="zayia-input w-full px-4 py-3 rounded-xl border-0 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notificação da Noite
                </label>
                <input
                  type="time"
                  value={settings.eveningTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, eveningTime: e.target.value }))}
                  className="zayia-input w-full px-4 py-3 rounded-xl border-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ativação por Tipo */}
          <div>
            <h4 className="font-semibold text-zayia-deep-violet mb-4">Tipos de Notificação</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.morningEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, morningEnabled: e.target.checked }))}
                  className="rounded border-zayia-lilac"
                />
                <Sun className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Notificações da Manhã (06h)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.eveningEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, eveningEnabled: e.target.checked }))}
                  className="rounded border-zayia-lilac"
                />
                <Moon className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Notificações da Noite (20h)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.absenceEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, absenceEnabled: e.target.checked }))}
                  className="rounded border-zayia-lilac"
                />
                <UserX className="w-5 h-5 text-red-500" />
                <span className="font-medium">Notificações de Ausência (24h sem login)</span>
              </label>
            </div>
          </div>

          {/* Token FCM */}
          {fcmToken && (
            <div>
              <h4 className="font-semibold text-zayia-deep-violet mb-4">Token FCM</h4>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-gray-600 break-all mr-3">
                    {fcmToken.substring(0, 50)}...
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(fcmToken)}
                    className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSaveSettings}
            className="zayia-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Bell },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'history', label: 'Histórico', icon: Clock },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              🔔 Sistema de Notificações
            </h2>
            <p className="text-zayia-violet-gray">
              Gerencie notificações automáticas motivacionais para as usuárias
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-zayia-deep-violet">
              {isActive ? 'Sistema Ativo' : 'Sistema Inativo'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zayia-lilac/30">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-zayia-soft-purple text-zayia-deep-violet'
                    : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'messages' && renderMessages()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'settings' && renderSettings()}

      {/* Modal de Confirmação de Desativação */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Desativar Sistema de Notificações?
                </h3>
                <p className="text-gray-600 text-sm">
                  Isso vai interromper todas as notificações automáticas para as usuárias. 
                  As mensagens motivacionais da manhã, noite e ausência não serão mais enviadas.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800 text-sm">Atenção:</div>
                    <div className="text-yellow-700 text-sm">
                      As usuárias podem perder o engajamento sem os lembretes diários.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeactivateSystem}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Sim, Desativar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}