import React from 'react'
import { AlertCircle, Mail, LogOut } from 'lucide-react'

interface TrialExpiredModalProps {
  trialDays: number
  expiresAt: Date
  onContactClick: () => void
  onLogoutClick: () => void
}

export function TrialExpiredModal({
  trialDays,
  expiresAt,
  onContactClick,
  onLogoutClick
}: TrialExpiredModalProps) {
  const formattedDate = expiresAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header com ícone de alerta */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Seu teste expirou!
          </h2>
        </div>

        {/* Conteúdo */}
        <div className="p-8">
          {/* Mensagem */}
          <p className="text-center text-gray-600 mb-6">
            Seu período de teste de <strong>{trialDays} dias</strong> expirou em{' '}
            <strong>{formattedDate}</strong>.
          </p>

          {/* Informações */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              Para continuar usando todos os recursos da ZAYIA, entre em contato conosco para discussão de planos de assinatura ou outras opções de acesso.
            </p>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            {/* Botão principal: Contato */}
            <button
              onClick={onContactClick}
              className="w-full bg-zayia-purple hover:bg-zayia-deep-violet text-white font-semibold py-3 px-4 rounded-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Entrar em Contato
            </button>

            {/* Botão secundário: Sair */}
            <button
              onClick={onLogoutClick}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>

          {/* Email de contato */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            Email: <a href="mailto:contato@zayia.com.br" className="text-zayia-purple hover:underline font-semibold">
              contato@zayia.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
