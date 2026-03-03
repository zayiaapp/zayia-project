import React, { useState } from 'react'
import { Shield } from 'lucide-react'
import CompanyInfoModal from '../components/user/CompanyInfoModal'

export const UserCompliance: React.FC = () => {
  const [showCompanyModal, setShowCompanyModal] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-600">Compliance Legal</h1>
          </div>
          <p className="text-gray-600">
            Conformidade com LGPD, CDC e Marco Civil da Internet
          </p>
        </div>

        {/* SEÇÃO SOBRE */}
        <div className="bg-purple-50 border border-purple-300 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-purple-700">Sobre</h2>

          <p className="text-gray-700">
            A ZAYIA é uma plataforma de coaching e desenvolvimento pessoal comprometida com a transparência e proteção de dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>

          <p className="text-gray-600 text-sm">
            Para conhecer mais sobre nossa empresa, como operamos e informações de contato, clique no link abaixo:
          </p>

          {/* BOTÃO EM LINHA */}
          <button
            onClick={() => setShowCompanyModal(true)}
            className="text-purple-600 hover:text-purple-700 underline font-semibold text-sm transition"
          >
            Ver informações da empresa
          </button>
        </div>

        {/* SEÇÃO DIREITOS LGPD */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-blue-700">Seus Direitos LGPD</h2>

          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600">✓</span>
              <span><strong>Direito de acesso:</strong> Você pode solicitar cópia de todos seus dados pessoais.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600">✓</span>
              <span><strong>Direito de correção:</strong> Você pode corrigir dados imprecisos ou incompletos.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600">✓</span>
              <span><strong>Direito de exclusão:</strong> Você pode solicitar a exclusão de seus dados (direito ao esquecimento).</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600">✓</span>
              <span><strong>Direito de portabilidade:</strong> Você pode exportar seus dados em formato estruturado.</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600">✓</span>
              <span><strong>Direito de recusa:</strong> Você pode recusar o processamento de dados em certos casos.</span>
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-4 pt-4 border-t border-blue-200">
            Para exercer qualquer desses direitos, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através do link acima.
          </p>
        </div>

        {/* SEÇÃO POLÍTICAS */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Documentos Legais</h2>

          <p className="text-gray-700 text-sm">
            Você pode acessar nossos documentos legais completos aqui:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/politica-privacidade"
              className="block p-4 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 transition text-center"
            >
              <p className="font-semibold text-purple-600 hover:text-purple-700">Política de Privacidade</p>
              <p className="text-xs text-gray-500 mt-1">LGPD Compliance</p>
            </a>

            <a
              href="/termos-uso"
              className="block p-4 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 transition text-center"
            >
              <p className="font-semibold text-purple-600 hover:text-purple-700">Termos de Uso</p>
              <p className="text-xs text-gray-500 mt-1">CDC Compliance</p>
            </a>
          </div>
        </div>

        {/* MODAL */}
        {showCompanyModal && (
          <CompanyInfoModal onClose={() => setShowCompanyModal(false)} />
        )}
      </div>
    </div>
  )
}

export default UserCompliance
