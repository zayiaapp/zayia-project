import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Edit, 
  Save, 
  X, 
  Download, 
  Eye, 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  Globe,
  Lock,
  UserCheck,
  Trash2,
  Database,
  Clock,
  BarChart3,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

// Importar dados de compliance
import complianceData from '../../data/compliance.json'

interface ComplianceData {
  company: {
    name: string
    cnpj: string
    address: {
      street: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    contact: {
      email: string
      phone: string
      support_email: string
      dpo_email: string
    }
    website: string
  }
  documents: {
    privacy_policy: {
      title: string
      last_updated: string
      version: string
      content: string
    }
    terms_of_use: {
      title: string
      last_updated: string
      version: string
      content: string
    }
    cookie_policy: {
      title: string
      last_updated: string
      version: string
      content: string
    }
  }
  compliance_status: {
    lgpd_compliant: boolean
    terms_updated: boolean
    privacy_updated: boolean
    cookie_policy_updated: boolean
    dpo_assigned: boolean
    data_requests_handled: boolean
    last_audit: string
  }
  metrics: {
    total_users: number
    terms_accepted: number
    privacy_accepted: number
    data_requests: number
    account_deletions: number
    cookie_consents: number
    last_updated: string
  }
}

export function ComplianceSection() {
  const [data, setData] = useState<ComplianceData>(complianceData as ComplianceData)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<unknown>({})
  const [isSaving, setIsSaving] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zayia_compliance_data')
    if (saved) {
      try {
        setData(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading compliance data:', error)
      }
    }
  }, [])

  // Salvar dados no localStorage
  const saveData = () => {
    localStorage.setItem('zayia_compliance_data', JSON.stringify(data))
  }

  // Abrir editor
  const openEditor = (section: string) => {
    setEditingSection(section)
    
    if (section === 'company') {
      setEditData(data.company)
    } else if (section.startsWith('document_')) {
      const docType = section.replace('document_', '')
      setEditData(data.documents[docType as keyof typeof data.documents])
    }
  }

  // Salvar edições
  const saveEdits = async () => {
    setIsSaving(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingSection === 'company') {
      setData(prev => ({ ...prev, company: editData }))
    } else if (editingSection?.startsWith('document_')) {
      const docType = editingSection.replace('document_', '')
      setData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: {
            ...editData,
            last_updated: new Date().toISOString().split('T')[0]
          }
        }
      }))
    }
    
    setIsSaving(false)
    setEditingSection(null)
    setEditData({})
    
    // Salvar no localStorage
    setTimeout(saveData, 100)
  }

  // Copiar para clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Calcular compliance score
  const getComplianceScore = () => {
    const status = data.compliance_status
    const total = Object.keys(status).length - 1 // -1 para excluir last_audit
    const compliant = Object.entries(status)
      .filter(([key, value]) => key !== 'last_audit' && value === true)
      .length
    
    return Math.round((compliant / total) * 100)
  }

  // Gerar documento para download
  const generateDocument = (type: 'privacy' | 'terms' | 'cookies') => {
    const docMap = {
      privacy: data.documents.privacy_policy,
      terms: data.documents.terms_of_use,
      cookies: data.documents.cookie_policy
    }
    
    const doc = docMap[type]
    const content = `${doc.title}\n\nVersão: ${doc.version}\nÚltima atualização: ${doc.last_updated}\n\n${doc.content}\n\n---\n${data.company.name}\nCNPJ: ${data.company.cnpj}\nContato: ${data.company.contact.email}`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_policy_zayia.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const complianceScore = getComplianceScore()

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              ⚖️ Compliance Legal
            </h2>
            <p className="text-zayia-violet-gray">
              Conformidade com LGPD, CDC e Marco Civil da Internet
            </p>
          </div>
          
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              complianceScore >= 90 ? 'text-green-600' :
              complianceScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {complianceScore}%
            </div>
            <div className="text-sm text-zayia-violet-gray">Compliance Score</div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
            <span>Status Geral de Conformidade</span>
            <span>{complianceScore}% completo</span>
          </div>
          <div className="w-full bg-zayia-lilac/30 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                complianceScore >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                complianceScore >= 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${complianceScore}%` }}
            ></div>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <UserCheck className="w-6 h-6 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">{data.metrics.terms_accepted}</div>
            <div className="text-xs text-zayia-violet-gray">Termos Aceitos</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Database className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">{data.metrics.data_requests}</div>
            <div className="text-xs text-zayia-violet-gray">Solicitações de Dados</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Trash2 className="w-6 h-6 text-zayia-lavender mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">{data.metrics.account_deletions}</div>
            <div className="text-xs text-zayia-violet-gray">Exclusões de Conta</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Shield className="w-6 h-6 text-zayia-orchid mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">{data.metrics.cookie_consents}</div>
            <div className="text-xs text-zayia-violet-gray">Cookies Aceitos</div>
          </div>
        </div>
      </div>

      {/* Informações da Empresa */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-zayia-deep-violet">🏢 Dados da Empresa</h3>
          <button
            onClick={() => openEditor('company')}
            className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zayia-violet-gray">Razão Social</label>
              <div className="font-semibold text-zayia-deep-violet">{data.company.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-zayia-violet-gray">CNPJ</label>
              <div className="font-semibold text-zayia-deep-violet">{data.company.cnpj}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-zayia-violet-gray">Website</label>
              <div className="font-semibold text-zayia-deep-violet">{data.company.website}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zayia-violet-gray">Endereço</label>
              <div className="font-semibold text-zayia-deep-violet">
                {data.company.address.street}, {data.company.address.neighborhood}<br/>
                {data.company.address.city}, {data.company.address.state} - {data.company.address.zipcode}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zayia-violet-gray">Contatos</label>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zayia-soft-purple" />
                  <span className="font-semibold text-zayia-deep-violet">{data.company.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zayia-soft-purple" />
                  <span className="font-semibold text-zayia-deep-violet">{data.company.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zayia-soft-purple" />
                  <span className="font-semibold text-zayia-deep-violet">{data.company.contact.dpo_email}</span>
                  <span className="text-xs text-zayia-violet-gray">(DPO)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentos Legais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Política de Privacidade */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-zayia-deep-violet">Política de Privacidade</h4>
                <p className="text-sm text-zayia-violet-gray">LGPD Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.compliance_status.privacy_updated ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Versão:</span>
              <span className="font-medium text-zayia-deep-violet ml-2">{data.documents.privacy_policy.version}</span>
            </div>
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Atualizada em:</span>
              <span className="font-medium text-zayia-deep-violet ml-2">
                {new Date(data.documents.privacy_policy.last_updated).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Aceites:</span>
              <span className="font-medium text-green-600 ml-2">{data.metrics.privacy_accepted} usuárias</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openEditor('document_privacy_policy')}
              className="flex-1 zayia-button py-2 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => generateDocument('privacy')}
              className="bg-zayia-lilac text-zayia-deep-violet px-3 py-2 rounded-xl hover:bg-zayia-lavender transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Termos de Uso */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-zayia-deep-violet">Termos de Uso</h4>
                <p className="text-sm text-zayia-violet-gray">CDC Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.compliance_status.terms_updated ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Versão:</span>
              <span className="font-medium text-zayia-deep-violet ml-2">{data.documents.terms_of_use.version}</span>
            </div>
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Atualizada em:</span>
              <span className="font-medium text-zayia-deep-violet ml-2">
                {new Date(data.documents.terms_of_use.last_updated).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Aceites:</span>
              <span className="font-medium text-green-600 ml-2">{data.metrics.terms_accepted} usuárias</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openEditor('document_terms_of_use')}
              className="flex-1 zayia-button py-2 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => generateDocument('terms')}
              className="bg-zayia-lilac text-zayia-deep-violet px-3 py-2 rounded-xl hover:bg-zayia-lavender transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Política de Cookies */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-zayia-deep-violet">Política de Cookies</h4>
                <p className="text-sm text-zayia-violet-gray">Marco Civil</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.compliance_status.cookie_policy_updated ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Versão:</span>
              <span className="font-medium text-zayia-deep-violet ml-2">{data.documents.cookie_policy.version}</span>
            </div>
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Atualizada em:</span>
              <span className="font-medium text-zayia-deep-violet ml-2">
                {new Date(data.documents.cookie_policy.last_updated).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-zayia-violet-gray">Aceites:</span>
              <span className="font-medium text-green-600 ml-2">{data.metrics.cookie_consents} usuárias</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openEditor('document_cookie_policy')}
              className="flex-1 zayia-button py-2 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => generateDocument('cookies')}
              className="bg-zayia-lilac text-zayia-deep-violet px-3 py-2 rounded-xl hover:bg-zayia-lavender transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status de Conformidade */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">📋 Checklist de Conformidade</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'lgpd_compliant', label: 'LGPD Compliant', description: 'Conformidade com Lei Geral de Proteção de Dados' },
            { key: 'terms_updated', label: 'Termos Atualizados', description: 'Termos de Uso atualizados e válidos' },
            { key: 'privacy_updated', label: 'Privacidade Atualizada', description: 'Política de Privacidade atualizada' },
            { key: 'cookie_policy_updated', label: 'Cookies Atualizados', description: 'Política de Cookies atualizada' },
            { key: 'dpo_assigned', label: 'DPO Designado', description: 'Responsável pelos dados designado' },
            { key: 'data_requests_handled', label: 'Solicitações Atendidas', description: 'Processo para solicitações de dados' }
          ].map((item) => {
            const isCompliant = data.compliance_status[item.key as keyof typeof data.compliance_status]
            
            return (
              <div key={item.key} className={`p-4 rounded-xl border-2 ${
                isCompliant 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {isCompliant ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    isCompliant ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {item.label}
                  </span>
                </div>
                <p className={`text-sm ${
                  isCompliant ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Solicitações de Dados */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">📊 Solicitações LGPD</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Database className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-800">{data.metrics.data_requests}</div>
            <div className="text-sm text-blue-600">Solicitações de Dados</div>
            <div className="text-xs text-blue-500 mt-2">Últimos 30 dias</div>
          </div>
          
          <div className="text-center p-6 bg-red-50 rounded-xl">
            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-red-800">{data.metrics.account_deletions}</div>
            <div className="text-sm text-red-600">Exclusões de Conta</div>
            <div className="text-xs text-red-500 mt-2">Últimos 30 dias</div>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-800">100%</div>
            <div className="text-sm text-green-600">Taxa de Atendimento</div>
            <div className="text-xs text-green-500 mt-2">Dentro do prazo legal</div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-zayia-deep-violet">
                  {editingSection === 'company' ? 'Editar Dados da Empresa' : 'Editar Documento Legal'}
                </h3>
                <button
                  onClick={() => setEditingSection(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {editingSection === 'company' ? (
                // Editor de Dados da Empresa
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social *</label>
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="ZAYIA LTDA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                      <input
                        type="text"
                        value={editData.cnpj || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, cnpj: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website *</label>
                    <input
                      type="url"
                      value={editData.website || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                      placeholder="https://zayia.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Principal *</label>
                      <input
                        type="email"
                        value={editData.contact?.email || ''}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="contato@zayia.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                      <input
                        type="tel"
                        value={editData.contact?.phone || ''}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="(11) 3000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email do DPO (Responsável pelos Dados) *</label>
                    <input
                      type="email"
                      value={editData.contact?.dpo_email || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        contact: { ...prev.contact, dpo_email: e.target.value }
                      }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                      placeholder="privacidade@zayia.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo *</label>
                      <input
                        type="text"
                        value={editData.address?.street || ''}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none mb-3"
                        placeholder="Rua das Flores, 123"
                      />
                      <input
                        type="text"
                        value={editData.address?.neighborhood || ''}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, neighborhood: e.target.value }
                        }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none mb-3"
                        placeholder="Vila Madalena"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={editData.address?.city || ''}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none mb-3"
                        placeholder="São Paulo"
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={editData.address?.state || ''}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, state: e.target.value }
                          }))}
                          className="flex-1 zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="SP"
                        />
                        <input
                          type="text"
                          value={editData.address?.zipcode || ''}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, zipcode: e.target.value }
                          }))}
                          className="flex-1 zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                          placeholder="05432-000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Editor de Documentos
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título do Documento</label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Versão</label>
                      <input
                        type="text"
                        value={editData.version || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, version: e.target.value }))}
                        className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                        placeholder="1.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo do Documento *
                    </label>
                    <textarea
                      value={editData.content || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none resize-none"
                      rows={15}
                      placeholder="Cole aqui o texto completo do documento legal..."
                    />
                  </div>

                  <div className="bg-zayia-lilac/20 p-4 rounded-xl">
                    <h4 className="font-semibold text-zayia-deep-violet mb-2">💡 Dicas:</h4>
                    <ul className="text-sm text-zayia-violet-gray space-y-1">
                      <li>• Use parágrafos curtos e linguagem simples</li>
                      <li>• Inclua todos os direitos do usuário (LGPD)</li>
                      <li>• Especifique como exercer os direitos</li>
                      <li>• Mantenha contatos atualizados</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-zayia-lilac/30">
                <button
                  onClick={saveEdits}
                  disabled={isSaving}
                  className="zayia-button px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}