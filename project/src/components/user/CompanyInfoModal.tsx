import React, { useEffect, useState } from 'react'
import { X, Mail, Phone, MapPin, Globe, Building2, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import complianceData from '../../data/compliance.json'

interface CompanyInfo {
  id: string
  company_name: string
  cnpj: string
  address: string
  phone: string
  email: string
  website: string
  dpo_name?: string
  dpo_email?: string
  created_at: string
  updated_at: string
}

interface CompanyInfoModalProps {
  onClose: () => void
}

export const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ onClose }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchCompanyInfo()

    // Escutar mudanças no localStorage (quando admin salva)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zayia_compliance_data' && e.newValue) {
        console.log('Compliance data updated in localStorage, refreshing...')
        fetchCompanyInfo()
      }
    }

    // Escutar evento customizado (mesma aba)
    const handleComplianceUpdate = () => {
      console.log('Compliance data updated (same tab), refreshing...')
      fetchCompanyInfo()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('complianceDataUpdated', handleComplianceUpdate)

    // Polling como fallback (a cada 30 segundos)
    const pollInterval = setInterval(() => {
      console.log('Polling for company info updates')
      fetchCompanyInfo()
    }, 30000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('complianceDataUpdated', handleComplianceUpdate)
      clearInterval(pollInterval)
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchCompanyInfo()
    setIsRefreshing(false)
  }

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Loading company info from localStorage...')

      // Tentar carregar dados do localStorage (salvos pelo admin)
      const savedCompliance = localStorage.getItem('zayia_compliance_data')
      if (savedCompliance) {
        const complianceData = JSON.parse(savedCompliance)
        const companyData = complianceData.company

        const companyInfo: CompanyInfo = {
          id: 'local-storage',
          company_name: companyData.name,
          cnpj: companyData.cnpj,
          address: `${companyData.address.street}, ${companyData.address.neighborhood}`,
          phone: companyData.contact.phone,
          email: companyData.contact.email,
          website: companyData.website,
          dpo_name: companyData.contact?.dpo_name || 'DPO ZAYIA',
          dpo_email: companyData.contact.dpo_email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('Company info loaded from localStorage:', companyInfo)
        setCompanyInfo(companyInfo)
      } else {
        console.log('No data in localStorage, using default compliance.json')
        // Fallback para dados do compliance.json
        const complianceDataTyped = complianceData as any
        const companyData = complianceDataTyped.company

        const companyInfo: CompanyInfo = {
          id: 'default',
          company_name: companyData.name,
          cnpj: companyData.cnpj,
          address: `${companyData.address.street}, ${companyData.address.neighborhood}`,
          phone: companyData.contact.phone,
          email: companyData.contact.email,
          website: companyData.website,
          dpo_name: 'DPO ZAYIA',
          dpo_email: companyData.contact.dpo_email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('Company info loaded from default data:', companyInfo)
        setCompanyInfo(companyInfo)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados'
      console.error('Error loading company info:', errorMessage, err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full space-y-6 p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-600">Informações da Empresa</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-purple-600 transition disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full" />
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-300 rounded p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* CONTEÚDO */}
        {companyInfo && !loading && (
          <div className="space-y-4">
            {/* Razão Social */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase">Razão Social</p>
              </div>
              <p className="text-gray-900 font-semibold">{companyInfo.company_name}</p>
            </div>

            {/* CNPJ */}
            <div className="space-y-1 border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">CNPJ</p>
              <p className="text-gray-900 font-mono">{companyInfo.cnpj}</p>
            </div>

            {/* Endereço */}
            <div className="space-y-1 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase">Endereço</p>
              </div>
              <p className="text-gray-900">{companyInfo.address}</p>
            </div>

            {/* Telefone */}
            <div className="space-y-1 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase">Telefone</p>
              </div>
              <p className="text-gray-900">{companyInfo.phone}</p>
            </div>

            {/* Email */}
            <div className="space-y-1 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
              </div>
              <p className="text-gray-900">{companyInfo.email}</p>
            </div>

            {/* Website */}
            <div className="space-y-1 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase">Website</p>
              </div>
              <a
                href={companyInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline break-all"
              >
                {companyInfo.website}
              </a>
            </div>

            {/* DPO */}
            {companyInfo.dpo_name && (
              <div className="space-y-1 border-t border-gray-200 pt-4 bg-purple-50 rounded p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Encarregado de Proteção de Dados (DPO)
                </p>
                <p className="text-gray-900 font-semibold">{companyInfo.dpo_name}</p>
                {companyInfo.dpo_email && (
                  <p className="text-purple-600 text-sm">{companyInfo.dpo_email}</p>
                )}
              </div>
            )}

            {/* Última Atualização */}
            <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-200">
              Atualizado em {new Date(companyInfo.updated_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        )}

        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

export default CompanyInfoModal
