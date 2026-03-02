import React, { useState, useEffect } from 'react'
import { 
  Database, 
  Bell, 
  Mail, 
  CreditCard, 
  Check, 
  X, 
  Settings, 
  Eye, 
  EyeOff, 
  Copy, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Save,
  TestTube,
  RefreshCw,
  ExternalLink,
  Shield,
  Key,
  Globe,
  Smartphone,
  DollarSign,
  Users,
  BarChart3,
  Activity
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { integrationsManager } from '../../lib/integrations-manager'

// Mapa de ícones para evitar problemas de serialização
const integrationIconMap = {
  Database: Database,
  Bell: Bell,
  Mail: Mail,
  CreditCard: CreditCard
} as const

type IntegrationIconType = keyof typeof integrationIconMap

interface Integration {
  id: string
  name: string
  description: string
  icon: IntegrationIconType
  color: string
  status: 'connected' | 'disconnected' | 'error'
  config: { [key: string]: string }
  lastSync?: string
  features: string[]
  isRequired: boolean
}

interface TestResult {
  success: boolean
  message: string
  details?: unknown
}

export default function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Banco de dados e autenticação',
      icon: 'Database',
      color: 'from-green-400 to-green-600',
      status: 'connected',
      config: {
        url: 'https://xyzcompany.supabase.co',
        anon_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
        service_role_key: ''
      },
      lastSync: '2024-01-20 10:00:00',
      features: ['Autenticação', 'Banco de Dados', 'Storage', 'Edge Functions'],
      isRequired: true
    },
    {
      id: 'firebase',
      name: 'Firebase',
      description: 'Notificações push e analytics',
      icon: 'Bell',
      color: 'from-orange-400 to-orange-600',
      status: 'connected',
      config: {
        api_key: 'AIzaSyC...',
        auth_domain: 'zayia-app.firebaseapp.com',
        project_id: 'zayia-app',
        storage_bucket: 'zayia-app.appspot.com',
        messaging_sender_id: '123456789',
        app_id: '1:123456789:web:abcdef',
        vapid_key: 'BNxS...'
      },
      lastSync: '2024-01-20 09:45:00',
      features: ['Push Notifications', 'Analytics', 'Crash Reporting', 'Performance'],
      isRequired: true
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Envio de emails automáticos',
      icon: 'Mail',
      color: 'from-blue-400 to-blue-600',
      status: 'connected',
      config: {
        api_key: 're_123abc...',
        from_email: 'noreply@zayia.com',
        from_name: 'ZAYIA'
      },
      lastSync: '2024-01-20 08:30:00',
      features: ['Emails Transacionais', 'Recuperação de Senha', 'Confirmação de Cadastro', 'Newsletters'],
      isRequired: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Processamento de pagamentos',
      icon: 'CreditCard',
      color: 'from-purple-400 to-purple-600',
      status: 'connected',
      config: {
        publishable_key: 'pk_test_...',
        secret_key: 'sk_test_...',
        webhook_secret: 'whsec_...',
        price_basic: 'price_basic_monthly'
      },
      lastSync: '2024-01-20 07:15:00',
      features: ['Assinaturas', 'Pagamentos Únicos', 'Webhooks', 'Analytics'],
      isRequired: false
    }
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({})
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null)
  const [configData, setConfigData] = useState<{ [key: string]: string }>({})
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Carregar configurações salvas
  useEffect(() => {
    const saved = localStorage.getItem('zayia_integrations')
    if (saved) {
      try {
        setIntegrations(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading integrations:', error)
      }
    }
  }, [])

  // Salvar configurações
  const saveIntegrations = () => {
    localStorage.setItem('zayia_integrations', JSON.stringify(integrations))
  }

  // Fechar modal
  const closeConfigModal = () => {
    setShowConfigModal(null)
    setConfigData({})
    setShowPasswords({})
    setCopiedField(null)
  }

  // Salvar configuração
  const saveConfiguration = async () => {
    if (!showConfigModal) return

    setIsSaving(true)
    
    try {
      // Update integrations manager
      integrationsManager.updateConfig(showConfigModal, configData)

      setIntegrations(prev => prev.map(integration => 
        integration.id === showConfigModal 
          ? { 
              ...integration, 
              config: configData,
              status: Object.values(configData).some(v => v.trim()) ? 'connected' : 'disconnected',
              lastSync: new Date().toLocaleString('pt-BR')
            }
          : integration
      ))
      
      // Salvar no localStorage
      saveIntegrations()
    } catch (error) {
      console.error('Error saving configuration:', error)
    }
    
    setIsSaving(false)
    closeConfigModal()
  }

  // Atualizar campo de configuração
  const updateConfigField = (field: string, value: string) => {
    setConfigData(prev => ({ ...prev, [field]: value }))
  }

  // Toggle visibilidade de senha
  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // Copiar para clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Abrir modal de configuração
  const openConfigModal = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId)
    if (integration) {
      setConfigData(integration.config || {})
      setShowConfigModal(integrationId)
    }
  }

  // Configurações específicas para cada integração
  const getIntegrationFields = (integrationId: string) => {
    const fieldConfigs: { [key: string]: Array<{ key: string, label: string, type: string, required: boolean, description: string, placeholder: string }> } = {
      supabase: [
        {
          key: 'url',
          label: 'URL do Projeto',
          type: 'url',
          required: true,
          description: 'URL do seu projeto Supabase',
          placeholder: 'https://seuproject.supabase.co'
        },
        {
          key: 'anon_key',
          label: 'Anon Key (Chave Pública)',
          type: 'password',
          required: true,
          description: 'Chave pública para autenticação',
          placeholder: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
        },
        {
          key: 'service_role_key',
          label: 'Service Role Key (Chave Privada)',
          type: 'password',
          required: false,
          description: 'Chave privada para operações administrativas (opcional)',
          placeholder: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
        }
      ],
      firebase: [
        {
          key: 'api_key',
          label: 'API Key',
          type: 'password',
          required: true,
          description: 'Chave da API do Firebase',
          placeholder: 'AIzaSyC...'
        },
        {
          key: 'auth_domain',
          label: 'Auth Domain',
          type: 'text',
          required: true,
          description: 'Domínio de autenticação',
          placeholder: 'zayia-app.firebaseapp.com'
        },
        {
          key: 'project_id',
          label: 'Project ID',
          type: 'text',
          required: true,
          description: 'ID do projeto Firebase',
          placeholder: 'zayia-app'
        },
        {
          key: 'storage_bucket',
          label: 'Storage Bucket',
          type: 'text',
          required: true,
          description: 'Bucket de armazenamento',
          placeholder: 'zayia-app.appspot.com'
        },
        {
          key: 'messaging_sender_id',
          label: 'Messaging Sender ID',
          type: 'text',
          required: true,
          description: 'ID do remetente de mensagens',
          placeholder: '123456789'
        },
        {
          key: 'app_id',
          label: 'App ID',
          type: 'text',
          required: true,
          description: 'ID da aplicação',
          placeholder: '1:123456789:web:abcdef'
        },
        {
          key: 'vapid_key',
          label: 'VAPID Key',
          type: 'password',
          required: true,
          description: 'Chave para notificações web push',
          placeholder: 'BNxS...'
        }
      ],
      resend: [
        {
          key: 'api_key',
          label: 'API Key',
          type: 'password',
          required: true,
          description: 'Chave da API do Resend',
          placeholder: 're_123abc...'
        },
        {
          key: 'from_email',
          label: 'From Email',
          type: 'email',
          required: true,
          description: 'Email remetente verificado no Resend',
          placeholder: 'noreply@zayia.com'
        },
        {
          key: 'from_name',
          label: 'From Name',
          type: 'text',
          required: true,
          description: 'Nome do remetente que aparece nos emails',
          placeholder: 'ZAYIA'
        }
      ],
      stripe: [
        {
          key: 'publishable_key',
          label: 'Publishable Key',
          type: 'text',
          required: true,
          description: 'Chave pública do Stripe',
          placeholder: 'pk_test_... ou pk_live_...'
        },
        {
          key: 'secret_key',
          label: 'Secret Key',
          type: 'password',
          required: true,
          description: 'Chave secreta do Stripe',
          placeholder: 'sk_test_... ou sk_live_...'
        },
        {
          key: 'webhook_secret',
          label: 'Webhook Secret',
          type: 'password',
          required: false,
          description: 'Segredo para validar webhooks (opcional)',
          placeholder: 'whsec_...'
        },
        {
          key: 'price_basic',
          label: 'Price ID Básico',
          type: 'text',
          required: false,
          description: 'ID do preço do plano básico mensal',
          placeholder: 'price_basic_monthly'
        }
      ]
    }

    return fieldConfigs[integrationId] || []
  }

  // Testar uma integração específica
  const testIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (!integration) return

    setTestResults(prev => ({ ...prev, [id]: { success: false, message: 'Testando...' } }))

    try {
      let result: TestResult

      switch (id) {
        case 'supabase':
          result = await testSupabase(integration.config)
          break
        case 'firebase':
          result = await testFirebase(integration.config)
          break
        case 'resend':
          result = await testResend(integration.config)
          break
        case 'stripe':
          result = await testStripe(integration.config)
          break
        default:
          result = { success: false, message: 'Integração não encontrada' }
      }

      setTestResults(prev => ({ ...prev, [id]: result }))
      
      // Atualizar status da integração
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: result.success ? 'connected' : 'error', lastSync: new Date().toLocaleString('pt-BR') }
          : integration
      ))

    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [id]: { success: false, message: 'Erro ao testar integração' }
      }))
    }
  }

  // Funções de teste para cada integração
  const testSupabase = async (config: unknown): Promise<TestResult> => {
    try {
      // Update integrations manager with new config
      integrationsManager.updateConfig('supabase', config)
      
      // Test real connection
      return await integrationsManager.testSupabase()
    } catch (error) {
      return { 
        success: false, 
        message: `Erro ao testar Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      }
    }
  }

  const testFirebase = async (config: unknown): Promise<TestResult> => {
    try {
      // Update integrations manager with new config
      integrationsManager.updateConfig('firebase', config)
      
      // Test real connection
      return await integrationsManager.testFirebase()
    } catch (error) {
      return { 
        success: false, 
        message: `Erro ao testar Firebase: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      }
    }
  }

  const testResend = async (config: unknown): Promise<TestResult> => {
    try {
      // Update integrations manager with new config
      integrationsManager.updateConfig('resend', config)
      
      // Test real connection with a test email
      const testEmail = config.from_email // Use from_email as test recipient
      return await integrationsManager.testResend(testEmail)
    } catch (error) {
      return { 
        success: false, 
        message: `Erro ao testar Resend: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      }
    }
  }

  const testStripe = async (config: unknown): Promise<TestResult> => {
    try {
      // Update integrations manager with new config
      integrationsManager.updateConfig('stripe', config)
      
      // Test real connection
      return await integrationsManager.testStripe()
    } catch (error) {
      return { 
        success: false, 
        message: `Erro ao testar Stripe: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      }
    }
  }

  // Testar todas as integrações
  const testAllIntegrations = async () => {
    setIsTestingAll(true)
    
    for (const integration of integrations) {
      await testIntegration(integration.id)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsTestingAll(false)
  }

  // Gerar arquivo .env
  const generateEnvFile = () => {
    let envContent = '# ZAYIA - Variáveis de Ambiente\n\n'
    
    integrations.forEach(integration => {
      envContent += `# ${integration.name}\n`
      Object.entries(integration.config).forEach(([key, value]) => {
        const envKey = `VITE_${integration.id.toUpperCase()}_${key.toUpperCase()}`
        envContent += `${envKey}=${value}\n`
      })
      envContent += '\n'
    })

    return envContent
  }

  // Exportar configurações
  const exportConfig = () => {
    const config = {
      timestamp: new Date().toISOString(),
      integrations: integrations.map(i => ({
        id: i.id,
        name: i.name,
        status: i.status,
        config: i.config
      }))
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'zayia-integrations.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const systemHealth = getSystemHealth()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <Clock className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const renderIntegrationCard = (integration: Integration) => {
    const Icon = integrationIconMap[integration.icon] || Database
    
    return (
      <div key={integration.id} className="zayia-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${integration.color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zayia-deep-violet">{integration.name}</h3>
              <p className="text-sm text-zayia-violet-gray">{integration.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {integration.isRequired && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                Obrigatório
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(integration.status)}`}>
              {getStatusIcon(integration.status)}
              {integration.status === 'connected' ? 'Conectado' : 
               integration.status === 'error' ? 'Erro' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="text-sm text-zayia-violet-gray mb-2">Funcionalidades:</div>
          <div className="flex flex-wrap gap-2">
            {integration.features.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-zayia-lilac/20 text-zayia-deep-violet text-xs rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Last Sync */}
        {integration.lastSync && (
          <div className="text-xs text-zayia-violet-gray mb-4">
            Última sincronização: {integration.lastSync}
          </div>
        )}

        {/* Test Result */}
        {testResults[integration.id] && (
          <div className={`mb-4 p-3 rounded-lg ${
            testResults[integration.id].success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`text-sm font-medium ${
              testResults[integration.id].success ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResults[integration.id].message}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => openConfigModal(integration.id)}
            className="flex-1 zayia-button py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configurar
          </button>
          
          <button
            onClick={() => testIntegration(integration.id)}
            className="bg-zayia-lilac text-zayia-deep-violet px-4 py-3 rounded-xl font-medium hover:bg-zayia-lavender transition-colors flex items-center gap-2"
          >
            <TestTube className="w-4 h-4" />
            Testar
          </button>
        </div>
      </div>
    )
  }

  function getSystemHealth() {
    const requiredIntegrations = integrations.filter(i => i.isRequired)
    const connectedRequired = requiredIntegrations.filter(i => i.status === 'connected')
    const healthPercentage = (connectedRequired.length / requiredIntegrations.length) * 100
    
    return {
      percentage: healthPercentage,
      status: healthPercentage === 100 ? 'healthy' : healthPercentage >= 75 ? 'warning' : 'critical',
      connectedRequired: connectedRequired.length,
      totalRequired: requiredIntegrations.length
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              ⚙️ Integrações do Sistema
            </h2>
            <p className="text-zayia-violet-gray">
              Configure as integrações essenciais para o funcionamento da ZAYIA
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={testAllIntegrations}
              disabled={isTestingAll}
              className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isTestingAll ? <LoadingSpinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
              {isTestingAll ? 'Testando...' : 'Testar Todas'}
            </button>
            
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-zayia-lilac text-zayia-deep-violet px-4 py-2 rounded-xl font-medium hover:bg-zayia-lavender transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <div className={`text-2xl font-bold ${
              systemHealth.status === 'healthy' ? 'text-green-600' :
              systemHealth.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {systemHealth.percentage.toFixed(0)}%
            </div>
            <div className="text-sm text-zayia-violet-gray">Saúde do Sistema</div>
          </div>
          
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {systemHealth.connectedRequired}/{systemHealth.totalRequired}
            </div>
            <div className="text-sm text-zayia-violet-gray">Obrigatórias Ativas</div>
          </div>
          
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <div className="text-2xl font-bold text-zayia-soft-purple">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
            <div className="text-sm text-zayia-violet-gray">Total Conectadas</div>
          </div>
          
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <div className="text-2xl font-bold text-zayia-lavender">4</div>
            <div className="text-sm text-zayia-violet-gray">Integrações Disponíveis</div>
          </div>
        </div>

        {/* Health Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
            <span>Saúde Geral do Sistema</span>
            <span>{systemHealth.percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                systemHealth.status === 'healthy' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                systemHealth.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${systemHealth.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(renderIntegrationCard)}
      </div>

      {/* Modal de Configuração */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {(() => {
                const integration = integrations.find(i => i.id === showConfigModal)
                if (!integration) return null
                
                const Icon = integration.icon
                const fields = getIntegrationFields(showConfigModal)
                
                return (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${integration.color} flex items-center justify-center`}>
                          {(() => {
                            const IconComponent = integrationIconMap[integration.icon] || Database
                            return <IconComponent className="w-8 h-8 text-white" />
                          })()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-zayia-deep-violet">
                            Configurar {integration.name}
                          </h3>
                          <p className="text-zayia-violet-gray">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeConfigModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Instruções */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-800 text-sm mb-1">
                            📍 Onde encontrar essas informações:
                          </div>
                          <div className="text-blue-700 text-sm">
                            {showConfigModal === 'supabase' && 'Dashboard do Supabase → Settings → API'}
                            {showConfigModal === 'firebase' && 'Firebase Console → Project Settings → General → Your apps'}
                            {showConfigModal === 'resend' && 'Dashboard do Resend → API Keys'}
                            {showConfigModal === 'stripe' && 'Dashboard do Stripe → Developers → API Keys'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campos de Configuração */}
                    <div className="space-y-6">
                      {fields.map((field) => {
                        const isPassword = field.type === 'password'
                        const showPassword = showPasswords[field.key]
                        const value = configData[field.key] || ''
                        
                        return (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            
                            <p className="text-xs text-zayia-violet-gray mb-3 bg-zayia-lilac/10 p-2 rounded-lg">
                              💡 {field.description}
                            </p>
                            
                            <div className="relative">
                              <input
                                type={isPassword && !showPassword ? 'password' : field.type}
                                value={value}
                                onChange={(e) => updateConfigField(field.key, e.target.value)}
                                className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none pr-20"
                                placeholder={field.placeholder}
                                required={field.required}
                              />
                              
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                                {isPassword && (
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility(field.key)}
                                    className="text-zayia-violet-gray hover:text-zayia-deep-violet transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                )}
                                
                                {value && (
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(value, field.key)}
                                    className="text-zayia-violet-gray hover:text-zayia-deep-violet transition-colors"
                                  >
                                    {copiedField === field.key ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Status da Configuração */}
                    <div className="mt-6 p-4 bg-zayia-lilac/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-zayia-soft-purple" />
                        <div>
                          <div className="font-medium text-zayia-deep-violet">Status da Configuração</div>
                          <div className="text-sm text-zayia-violet-gray">
                            {fields.filter(f => f.required && configData[f.key]?.trim()).length} de {fields.filter(f => f.required).length} campos obrigatórios preenchidos
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 mt-8 pt-6 border-t border-zayia-lilac/30">
                      <button
                        onClick={saveConfiguration}
                        disabled={isSaving || fields.filter(f => f.required).some(f => !configData[f.key]?.trim())}
                        className="flex-1 zayia-button py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Salvando...' : 'Salvar Configuração'}
                      </button>
                      
                      <button
                        onClick={() => testIntegration(showConfigModal)}
                        disabled={fields.filter(f => f.required).some(f => !configData[f.key]?.trim())}
                        className="bg-zayia-lilac text-zayia-deep-violet px-6 py-3 rounded-xl font-medium hover:bg-zayia-lavender transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TestTube className="w-4 h-4" />
                        Testar
                      </button>
                      
                      <button
                        onClick={closeConfigModal}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zayia-deep-violet">Exportar Configurações</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    exportConfig()
                    setShowExportModal(false)
                  }}
                  className="w-full p-4 border-2 border-dashed border-zayia-lilac hover:border-zayia-soft-purple transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-zayia-soft-purple" />
                    <div>
                      <div className="font-medium text-zayia-deep-violet">Backup Completo</div>
                      <div className="text-sm text-zayia-violet-gray">Exportar todas as configurações em JSON</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    const envContent = generateEnvFile()
                    const blob = new Blob([envContent], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = '.env'
                    a.click()
                    URL.revokeObjectURL(url)
                    setShowExportModal(false)
                  }}
                  className="w-full p-4 border-2 border-dashed border-zayia-lilac hover:border-zayia-soft-purple transition-colors rounded-xl text-left"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-6 h-6 text-zayia-soft-purple" />
                    <div>
                      <div className="font-medium text-zayia-deep-violet">Arquivo .env</div>
                      <div className="text-sm text-zayia-violet-gray">Gerar variáveis de ambiente</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}