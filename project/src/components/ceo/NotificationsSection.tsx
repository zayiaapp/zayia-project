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

  // NOVOS: Estados de Filtro
  const [filterStartDate, setFilterStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [filterEndDate, setFilterEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [filterType, setFilterType] = useState<'all' | 'morning' | 'evening' | 'absence' | 'manual'>('all')
  const [filteredHistory, setFilteredHistory] = useState<NotificationHistory[]>([])

  // NOVA: Função para pedir permissão de notificações
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Browser não suporta notificações')
      return
    }

    if (Notification.permission === 'granted') {
      return
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission()
        setPermissionStatus(permission as any)
        localStorage.setItem('notification_permission', permission)
      } catch (error) {
        console.error('Erro ao pedir permissão:', error)
      }
    }
  }

  // NOVA: Função para filtrar notificações (com parâmetro opcional para usar history customizada)
  const applyFilters = (historyToFilter?: NotificationHistory[]) => {
    const history = historyToFilter || notificationHistory

    console.log('🎬 applyFilters() CHAMADA')
    console.log('  - history.length:', history.length)
    console.log('  - filterType:', filterType)
    console.log('  - filterStartDate:', filterStartDate)
    console.log('  - filterEndDate:', filterEndDate)

    let filtered = [...history]
    console.log('  - Começando com', filtered.length, 'itens')

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType)
      console.log('  - Após filtro de tipo:', filtered.length, 'itens')
    }

    // Filtro por data
    const startDate = new Date(filterStartDate + 'T00:00:00')
    const endDate = new Date(filterEndDate + 'T23:59:59')

    console.log('  - Intervalo:', startDate, 'até', endDate)

    filtered = filtered.filter(n => {
      const notifDate = new Date(n.timestamp)
      return notifDate >= startDate && notifDate <= endDate
    })

    console.log('  - Após filtro de data:', filtered.length, 'itens')
    console.log('  - Setando filteredHistory com:', filtered.length, 'notificações')

    setFilteredHistory(filtered)
  }

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

    // NOVA: Pedir permissão de notificações
    requestNotificationPermission()

    // NOVA: Atualizar último login a cada minuto
    const loginInterval = setInterval(() => {
      const now = new Date().toISOString()
      localStorage.setItem('last_login_time', now)
    }, 60000)

    return () => clearInterval(loginInterval)
  }, [])

  // NOVA: Aplicar filtros quando dados mudam
  useEffect(() => {
    applyFilters()
  }, [filterStartDate, filterEndDate, filterType, notificationHistory])

  const handleActivateSystem = () => {
    setIsActive(true)
    localStorage.setItem('notification_system_active', 'true')
    notificationScheduler.initialize()
    console.log('✅ Sistema de notificações ativado')
  }

  const handleDeactivateSystem = () => {
    setIsActive(false)
    localStorage.setItem('notification_system_active', 'false')
    setShowDeactivateModal(false)
    console.log('❌ Sistema de notificações desativado')
  }

  const handleSaveSettings = () => {
    localStorage.setItem('notification_settings', JSON.stringify(settings))
    
    if (isActive) {
      // Reinicializar com novas configurações
      notificationScheduler.initialize()
    }
  }

  const sendTestNotification = async () => {
    if (!testMessage.trim()) {
      alert('Digite uma mensagem!')
      return
    }

    console.log('🚀 sendTestNotification() foi CHAMADA!')

    setSendingTest(true)
    try {
      console.log('📤 Iniciando envio de teste...')

      // 1. Enviar notificação local via Notification API
      console.log('Notification.permission:', Notification.permission)

      if (Notification.permission === 'granted') {
        console.log('✅ Enviando notificação pro navegador...')
        try {
          const notification = new Notification('🧪 Teste ZAYIA', {
            body: testMessage,
            badge: '🔔',
            tag: 'zayia-test-' + Date.now(), // Único para cada notificação
            requireInteraction: false, // Deixa desaparecer automaticamente
          })

          // Callback quando notificação é clicada
          notification.onclick = () => {
            console.log('✅ Notificação clicada!')
            window.focus()
          }

          console.log('✅ Notificação criada com sucesso')
        } catch (error) {
          console.error('❌ Erro ao criar notificação:', error)
        }
      } else {
        console.error('❌ Permissão negada:', Notification.permission)
        alert('⚠️ Permissões de notificação não concedidas. Clique em "Ativar Permissões" acima.')
      }

      // 2. Criar notificação para histórico
      const newNotification: NotificationHistory = {
        id: `test-${Date.now()}`,
        title: '🧪 Teste ZAYIA',
        body: testMessage,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'manual'
      }

      console.log('📊 Notificação criada:', newNotification)

      // 3. Calcular updated history ANTES de salvar
      const updatedHistory = [newNotification, ...notificationHistory]
      if (updatedHistory.length > 100) {
        updatedHistory.splice(100) // Remove do final
      }

      console.log('💾 Salvando em localStorage...', updatedHistory.length, 'itens')

      // 4. ✅ CORRIGIDO: Salvar em localStorage PRIMEIRO (síncrono - imediato)
      localStorage.setItem('notification_history', JSON.stringify(updatedHistory))

      // 5. Incrementar contador e salvar em localStorage PRIMEIRO
      const newTestCount = testNotificationsSent + 1
      localStorage.setItem('test_notifications_sent_count', newTestCount.toString())

      console.log('✅ localStorage atualizado - contador:', newTestCount)

      // 6. ✅ DEPOIS atualizar states (assincronos, mas localStorage já está correto)
      console.log('📝 Chamando setNotificationHistory com', updatedHistory.length, 'itens')
      setNotificationHistory(updatedHistory)

      console.log('📊 Chamando setTestNotificationsSent:', newTestCount)
      setTestNotificationsSent(newTestCount)

      // 7. ✅ NOVO: Chamar applyFilters() DIRETAMENTE com o updatedHistory
      // Isso garante que a filtragem use os dados atualizados
      // O useEffect vai executar depois, mas já teremos a UI atualizada
      console.log('🔄 Aplicando filtros imediatamente com dados atualizados...')
      applyFilters(updatedHistory)

      // 8. ✅ Feedback visual
      console.log('✅ Teste enviado com sucesso!')
      alert('✅ Teste enviado! Verifique o Histórico.')

      // 9. Limpar input
      setTestMessage('')
    } catch (error) {
      console.error('❌ Erro ao enviar teste:', error)
      alert('❌ Erro ao enviar teste: ' + String(error))
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
      {/* FILTROS */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">📊 Filtrar Notificações</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
            >
              <option value="all">Todas</option>
              <option value="morning">Manhã (6h)</option>
              <option value="evening">Noite (20h)</option>
              <option value="absence">Ausência (24h)</option>
              <option value="manual">Teste Manual</option>
            </select>
          </div>

          {/* Estatísticas do Filtro */}
          <div className="bg-zayia-lilac/10 rounded p-3 flex flex-col justify-center">
            <div className="text-xs text-zayia-violet-gray mb-1">Total Filtrado</div>
            <div className="text-2xl font-bold text-zayia-soft-purple">
              {filteredHistory.length}
            </div>
          </div>
        </div>
      </div>

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
          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {filteredHistory.filter(n => n.type === 'morning').length}
            </div>
            <div className="text-sm text-zayia-violet-gray">Manhã</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <Moon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {filteredHistory.filter(n => n.type === 'evening').length}
            </div>
            <div className="text-sm text-zayia-violet-gray">Noite</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
            <UserX className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {filteredHistory.filter(n => n.type === 'absence').length}
            </div>
            <div className="text-sm text-zayia-violet-gray">Ausência</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Bell className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {filteredHistory.filter(n => n.type === 'manual').length}
            </div>
            <div className="text-sm text-zayia-violet-gray">Testes</div>
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

      {/* Teste de Notificação MELHORADO */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Teste de Notificação
        </h3>

        <div className="space-y-3">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            ✅ Testes enviados: <strong>{testNotificationsSent}</strong>
            <br />
            💡 Notificações de teste aparecem no Histórico e no navegador
          </div>

          {/* Input + Botão */}
          <div className="flex gap-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Digite a mensagem de teste..."
              className="flex-1 border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
            />
            <button
              onClick={sendTestNotification}
              disabled={sendingTest || !testMessage.trim()}
              className={`px-6 py-2 rounded font-medium text-white transition ${
                sendingTest || !testMessage.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-zayia-soft-purple hover:bg-zayia-deep-violet'
              }`}
            >
              {sendingTest ? '⏳ Enviando...' : '📤 Enviar Teste'}
            </button>
          </div>

          {/* Aviso Firebase */}
          {!integrationsManager.isFirebaseConfigured() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              ⚠️ Firebase não configurado - Notificações locais apenas
              <br />
              Firebase será adicionado depois para enviar no celular
            </div>
          )}
        </div>
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
    <div className="space-y-4">
      {/* Botão Limpar */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-zayia-deep-violet">
          Histórico ({filteredHistory.length} / {notificationHistory.length})
        </h3>
        <button
          onClick={() => {
            if (window.confirm('Limpar todo o histórico de notificações?')) {
              setNotificationHistory([])
              localStorage.removeItem('notification_history')
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          🗑️ Limpar
        </button>
      </div>

      {/* Lista */}
      <div className="max-h-96 overflow-y-auto space-y-2 zayia-card p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-zayia-violet-gray">
            {notificationHistory.length === 0
              ? 'Nenhuma notificação enviada ainda'
              : 'Nenhuma notificação encontrada no período/tipo selecionado'}
          </div>
        ) : (
          filteredHistory.map((notif) => {
            const iconEmoji = {
              'morning': '🌅',
              'evening': '🌙',
              'absence': '👤',
              'manual': '📤'
            }[notif.type] || '🔔'

            const bgColor = {
              'morning': 'bg-yellow-100',
              'evening': 'bg-blue-100',
              'absence': 'bg-orange-100',
              'manual': 'bg-green-100'
            }[notif.type] || 'bg-gray-100'

            const typeLabel = {
              'morning': 'Manhã',
              'evening': 'Noite',
              'absence': 'Ausência',
              'manual': 'Teste'
            }[notif.type] || 'Desconhecido'

            return (
              <div key={notif.id} className={`${bgColor} p-4 rounded-lg border`}>
                <div className="flex gap-3">
                  <div className="text-2xl">{iconEmoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-zayia-deep-violet flex justify-between">
                      <span>{notif.title}</span>
                      <span className="text-xs font-normal text-zayia-violet-gray">
                        {typeLabel}
                      </span>
                    </div>
                    <div className="text-sm text-zayia-violet-gray mt-1">
                      {notif.body}
                    </div>
                    <div className="text-xs text-zayia-violet-gray mt-2">
                      {new Date(notif.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
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