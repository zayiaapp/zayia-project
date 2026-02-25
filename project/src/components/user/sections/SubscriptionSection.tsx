import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import {
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  Crown,
  Star,
  Shield,
  Clock,
  Receipt,
  X
} from 'lucide-react'
import { integrationsManager } from '../../../lib/integrations-manager'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  invoice_url?: string
}

export function SubscriptionSection() {
  const { profile } = useAuth()
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Mock de faturas para demonstração
  const mockInvoices: Invoice[] = [
    {
      id: 'inv_001',
      date: '2024-01-15',
      amount: 13.90,
      status: 'paid',
      description: 'ZAYIA Premium - Janeiro 2024',
      invoice_url: 'https://stripe.com/invoice/inv_001'
    },
    {
      id: 'inv_002',
      date: '2023-12-15',
      amount: 13.90,
      status: 'paid',
      description: 'ZAYIA Premium - Dezembro 2023',
      invoice_url: 'https://stripe.com/invoice/inv_002'
    },
    {
      id: 'inv_003',
      date: '2023-11-15',
      amount: 13.90,
      status: 'paid',
      description: 'ZAYIA Premium - Novembro 2023',
      invoice_url: 'https://stripe.com/invoice/inv_003'
    },
    {
      id: 'inv_004',
      date: '2023-10-15',
      amount: 13.90,
      status: 'paid',
      description: 'ZAYIA Premium - Outubro 2023',
      invoice_url: 'https://stripe.com/invoice/inv_004'
    }
  ]

  const handleCancelSubscription = async () => {
    // Redirecionar para Stripe Customer Portal
    if (integrationsManager.isStripeConfigured()) {
      // Em produção, criar sessão do customer portal
      window.open('https://billing.stripe.com/p/login/test_customer_portal', '_blank')
    } else {
      // Fallback para página de cancelamento
      alert('Redirecionando para cancelamento...')
    }
    setShowCancelModal(false)
  }

  const handleManagePayment = () => {
    // Redirecionar para gerenciar método de pagamento
    if (integrationsManager.isStripeConfigured()) {
      window.open('https://billing.stripe.com/p/login/test_payment_method', '_blank')
    } else {
      alert('Redirecionando para gerenciar pagamento...')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'failed': return 'Falhou'
      default: return 'Desconhecido'
    }
  }

  const nextBillingDate = new Date()
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

  return (
    <div className="space-y-6">
      {/* Header da Assinatura */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-zayia-orchid to-zayia-amethyst rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Sua Assinatura ZAYIA
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Gerencie seu plano e acompanhe seu histórico de pagamentos
        </p>
      </div>

      {/* Card do Plano Atual */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zayia-deep-violet">ZAYIA Premium</h3>
              <p className="text-sm text-zayia-violet-gray">Plano Único</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-zayia-soft-purple">R$ 13,90</div>
            <div className="text-xs text-zayia-violet-gray">por mês</div>
          </div>
        </div>

        {/* Status da Assinatura */}
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">Assinatura Ativa</span>
        </div>

        {/* Próxima Cobrança */}
        <div className="bg-white/60 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zayia-soft-purple" />
              <span className="text-sm text-zayia-deep-violet">Próxima cobrança:</span>
            </div>
            <span className="text-sm font-bold text-zayia-deep-violet">
              {nextBillingDate.toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Benefícios do Plano */}
        <div className="space-y-2 mb-6">
          <h4 className="font-semibold text-zayia-deep-violet text-sm mb-3">✨ Seus Benefícios:</h4>
          {[
            'Acesso a todos os 840 desafios',
            'Sistema completo de medalhas e níveis',
            'Comunidade exclusiva no WhatsApp',
            'Suporte prioritário via SOS',
            'Atualizações e novos conteúdos',
            'Ranking em tempo real'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-zayia-deep-violet">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <button
            onClick={handleManagePayment}
            className="w-full bg-zayia-lilac text-zayia-deep-violet py-3 px-4 rounded-xl font-semibold hover:bg-zayia-lavender transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Gerenciar Método de Pagamento
          </button>
          
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full bg-red-100 text-red-600 py-3 px-4 rounded-xl font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar Assinatura
          </button>
        </div>
      </div>

      {/* Histórico de Faturas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Histórico de Faturas
        </h3>
        
        <div className="space-y-3">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="p-4 border border-zayia-lilac/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-zayia-deep-violet text-sm">
                    {invoice.description}
                  </div>
                  <div className="text-xs text-zayia-violet-gray">
                    {new Date(invoice.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-zayia-soft-purple">
                    R$ {invoice.amount.toFixed(2)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>
              </div>
              
              {invoice.invoice_url && (
                <button
                  onClick={() => window.open(invoice.invoice_url, '_blank')}
                  className="w-full mt-3 bg-zayia-lilac/20 text-zayia-deep-violet py-2 px-4 rounded-lg font-medium hover:bg-zayia-lilac/40 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Fatura
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="zayia-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">💡 Informações Importantes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cobrança automática todo dia 15 do mês</li>
              <li>• Cancele a qualquer momento sem multa</li>
              <li>• Acesso mantido até o fim do período pago</li>
              <li>• Suporte via chat ou email: suporte@zayia.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Cancelar Assinatura?
                </h3>
                <p className="text-gray-600 text-sm">
                  Você perderá acesso a todos os recursos premium da ZAYIA. 
                  Tem certeza que deseja continuar?
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800 text-sm">Acesso mantido até:</div>
                    <div className="text-yellow-700 text-sm">
                      {nextBillingDate.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Manter Assinatura
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  Sim, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}