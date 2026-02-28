import { useState, useEffect } from 'react'
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: 'monthly' | 'yearly'
  description: string
  features: string[]
  stripe_product_id: string
  stripe_price_id: string
  stripe_link: string
  status: 'active' | 'inactive'
  created_at: string
  active_subscribers: number
  monthly_revenue: number
}

interface Subscriber {
  id: string
  name: string
  email: string
  plan_id: string
  plan_name: string
  status: 'active' | 'cancelled' | 'past_due'
  subscription_date: string
  next_billing_date: string
  amount: number
  payment_method: 'card' | 'pix' | 'bank_transfer'
  stripe_customer_id: string
  stripe_subscription_id: string
}

interface Invoice {
  id: string
  subscriber_name: string
  subscriber_email: string
  plan_name: string
  amount: number
  currency: string
  payment_method: 'card' | 'pix' | 'bank_transfer'
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  date: string
  due_date: string
  stripe_invoice_id: string
  description: string
}

export function SubscriptionsSection() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'subscribers' | 'invoices'>('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    loadMockData()
    setIsLoading(false)
  }

  const loadMockData = () => {
    // Planos
    setPlans([
      {
        id: 'plan_basic',
        name: 'Básico',
        price: 14.97,
        currency: 'BRL',
        billing_cycle: 'monthly',
        description: 'Acesso completo a desafios, medalhas, comunidade e suporte',
        features: [
          'Acesso a todos os desafios',
          'Sistema de medalhas e níveis',
          'Comunidade e networking',
          'Suporte por email',
          'Relatórios mensais',
          'Avatar personalizado'
        ],
        stripe_product_id: 'prod_basic_zayia',
        stripe_price_id: 'price_basic_monthly',
        stripe_link: 'https://buy.stripe.com/test_basic',
        status: 'active',
        created_at: '2026-01-01',
        active_subscribers: 1247,
        monthly_revenue: 18638.59
      },
      {
        id: 'plan_premium',
        name: 'Premium',
        price: 29.97,
        currency: 'BRL',
        billing_cycle: 'monthly',
        description: 'Tudo do Básico + Mentorias, Relatórios Avançados e Prioridade',
        features: [
          'Tudo do plano Básico',
          'Sessões de mentoria (1x/mês)',
          'Relatórios avançados em PDF',
          'Comunidade exclusiva',
          'Suporte prioritário via WhatsApp',
          'Acesso a webinars privados'
        ],
        stripe_product_id: 'prod_premium_zayia',
        stripe_price_id: 'price_premium_monthly',
        stripe_link: 'https://buy.stripe.com/test_premium',
        status: 'active',
        created_at: '2026-01-15',
        active_subscribers: 342,
        monthly_revenue: 10248.74
      }
    ])

    // Assinantes
    setSubscribers([
      {
        id: '1',
        name: 'Ana Silva',
        email: 'ana@email.com',
        plan_id: 'plan_basic',
        plan_name: 'Básico',
        status: 'active',
        subscription_date: '2026-01-15',
        next_billing_date: '2026-03-15',
        amount: 14.97,
        payment_method: 'card',
        stripe_customer_id: 'cus_ana_silva',
        stripe_subscription_id: 'sub_ana_001'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        plan_id: 'plan_basic',
        plan_name: 'Básico',
        status: 'active',
        subscription_date: '2026-02-01',
        next_billing_date: '2026-03-01',
        amount: 14.97,
        payment_method: 'pix',
        stripe_customer_id: 'cus_maria_santos',
        stripe_subscription_id: 'sub_maria_001'
      },
      {
        id: '3',
        name: 'Julia Costa',
        email: 'julia@email.com',
        plan_id: 'plan_premium',
        plan_name: 'Premium',
        status: 'active',
        subscription_date: '2025-12-10',
        next_billing_date: '2026-03-10',
        amount: 29.97,
        payment_method: 'card',
        stripe_customer_id: 'cus_julia_costa',
        stripe_subscription_id: 'sub_julia_001'
      },
      {
        id: '4',
        name: 'Carolina Dias',
        email: 'carolina@email.com',
        plan_id: 'plan_basic',
        plan_name: 'Básico',
        status: 'cancelled',
        subscription_date: '2025-11-20',
        next_billing_date: '2026-02-20',
        amount: 14.97,
        payment_method: 'card',
        stripe_customer_id: 'cus_carolina_dias',
        stripe_subscription_id: 'sub_carolina_001'
      },
      {
        id: '5',
        name: 'Beatriz Lima',
        email: 'beatriz@email.com',
        plan_id: 'plan_basic',
        plan_name: 'Básico',
        status: 'past_due',
        subscription_date: '2026-01-01',
        next_billing_date: '2026-02-28',
        amount: 14.97,
        payment_method: 'pix',
        stripe_customer_id: 'cus_beatriz_lima',
        stripe_subscription_id: 'sub_beatriz_001'
      }
    ])

    // Faturas
    setInvoices([
      {
        id: 'inv_001',
        subscriber_name: 'Ana Silva',
        subscriber_email: 'ana@email.com',
        plan_name: 'Básico',
        amount: 14.97,
        currency: 'BRL',
        payment_method: 'card',
        status: 'paid',
        date: '2026-02-15',
        due_date: '2026-02-20',
        stripe_invoice_id: 'in_ana_001',
        description: 'Assinatura Básica - Fevereiro 2026'
      },
      {
        id: 'inv_002',
        subscriber_name: 'Maria Santos',
        subscriber_email: 'maria@email.com',
        plan_name: 'Básico',
        amount: 14.97,
        currency: 'BRL',
        payment_method: 'pix',
        status: 'paid',
        date: '2026-02-01',
        due_date: '2026-02-05',
        stripe_invoice_id: 'in_maria_001',
        description: 'Assinatura Básica - Fevereiro 2026'
      },
      {
        id: 'inv_003',
        subscriber_name: 'Julia Costa',
        subscriber_email: 'julia@email.com',
        plan_name: 'Premium',
        amount: 29.97,
        currency: 'BRL',
        payment_method: 'card',
        status: 'paid',
        date: '2026-02-10',
        due_date: '2026-02-15',
        stripe_invoice_id: 'in_julia_001',
        description: 'Assinatura Premium - Fevereiro 2026'
      },
      {
        id: 'inv_004',
        subscriber_name: 'Beatriz Lima',
        subscriber_email: 'beatriz@email.com',
        plan_name: 'Básico',
        amount: 14.97,
        currency: 'BRL',
        payment_method: 'pix',
        status: 'failed',
        date: '2026-02-28',
        due_date: '2026-03-05',
        stripe_invoice_id: 'in_beatriz_001',
        description: 'Assinatura Básica - Fevereiro 2026'
      }
    ])
  }

  // Calcular KPIs
  const calculateKPIs = () => {
    const active = subscribers.filter(s => s.status === 'active').length
    const mrr = plans.reduce((acc, plan) => acc + (plan.monthly_revenue || 0), 0)
    const churn = subscribers.filter(s => s.status === 'cancelled').length
    const churnRate = subscribers.length > 0 ? ((churn / subscribers.length) * 100).toFixed(2) : '0'
    const conversionRate = ((active / 2000) * 100).toFixed(1) // Assumindo 2000 usuários registrados

    return { active, mrr, churn, churnRate, conversionRate }
  }

  const filteredSubscribers = filterStatus
    ? subscribers.filter(s => s.status === filterStatus)
    : subscribers

  const kpis = calculateKPIs()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando assinaturas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-zayia-lilac/30 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-zayia-soft-purple text-zayia-deep-violet'
              : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'plans'
              ? 'border-zayia-soft-purple text-zayia-deep-violet'
              : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
          }`}
        >
          💰 Planos
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'subscribers'
              ? 'border-zayia-soft-purple text-zayia-deep-violet'
              : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
          }`}
        >
          👥 Assinantes
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'border-zayia-soft-purple text-zayia-deep-violet'
              : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
          }`}
        >
          📋 Faturas
        </button>
      </div>

      {/* SEÇÃO 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zayia-deep-violet">Visão Geral de Assinaturas</h2>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Assinantes Ativos */}
            <div className="zayia-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zayia-violet-gray mb-1">Assinantes Ativos</p>
                  <p className="text-3xl font-bold text-zayia-deep-violet">{kpis.active}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            {/* KPI 2: Receita Recorrente Mensal (MRR) */}
            <div className="zayia-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zayia-violet-gray mb-1">Receita Mensal (MRR)</p>
                  <p className="text-3xl font-bold text-zayia-deep-violet">
                    R$ {kpis.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            {/* KPI 3: Cancelamentos */}
            <div className="zayia-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zayia-violet-gray mb-1">Canceladas</p>
                  <p className="text-3xl font-bold text-red-500">{kpis.churn}</p>
                  <p className="text-xs text-zayia-violet-gray mt-1">Churn: {kpis.churnRate}%</p>
                </div>
                <div className="text-4xl">📉</div>
              </div>
            </div>

            {/* KPI 4: Taxa de Conversão */}
            <div className="zayia-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zayia-violet-gray mb-1">Taxa Conversão</p>
                  <p className="text-3xl font-bold text-zayia-soft-purple">{kpis.conversionRate}%</p>
                  <p className="text-xs text-zayia-violet-gray mt-1">Cadastrados → Pagos</p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
            </div>
          </div>

          {/* Status das Assinaturas */}
          <div className="zayia-card p-6">
            <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">Status das Assinaturas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-3xl">✅</div>
                <div>
                  <p className="text-sm text-zayia-violet-gray">Ativas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {subscribers.filter(s => s.status === 'active').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="text-3xl">❌</div>
                <div>
                  <p className="text-sm text-zayia-violet-gray">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {subscribers.filter(s => s.status === 'cancelled').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="text-3xl">⚠️</div>
                <div>
                  <p className="text-sm text-zayia-violet-gray">Vencidas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {subscribers.filter(s => s.status === 'past_due').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 2: GERENCIAR PLANOS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zayia-deep-violet">Gerenciar Planos</h2>
            <button className="bg-zayia-soft-purple hover:bg-zayia-deep-violet text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <Plus className="w-4 h-4" />
              Novo Plano
            </button>
          </div>

          {/* Cards de Planos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className="zayia-card p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-zayia-deep-violet">{plan.name}</h3>
                    <p className="text-xs text-zayia-violet-gray mt-1">{plan.description}</p>
                  </div>
                  <div className="text-3xl font-bold text-zayia-soft-purple">
                    R$ {plan.price.toFixed(2)}
                    <span className="text-xs text-zayia-violet-gray font-normal">/mês</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {plan.status === 'active' ? '✅ Ativo' : '⭕ Inativo'}
                  </span>
                </div>

                {/* Features */}
                <div>
                  <p className="text-xs font-semibold text-zayia-deep-violet mb-2">Inclusos:</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-zayia-violet-gray flex items-center gap-2">
                        <span>✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zayia-lilac/30">
                  <div>
                    <p className="text-xs text-zayia-violet-gray">Assinantes Ativos</p>
                    <p className="text-lg font-bold text-zayia-deep-violet">{plan.active_subscribers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zayia-violet-gray">Receita Mensal</p>
                    <p className="text-lg font-bold text-zayia-soft-purple">
                      R$ {plan.monthly_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-2 pt-4 border-t border-zayia-lilac/30">
                  {/* Link Stripe */}
                  <div className="flex items-center gap-2 bg-zayia-lilac/10 p-3 rounded-lg">
                    <input
                      type="text"
                      value={plan.stripe_link}
                      readOnly
                      className="flex-1 bg-transparent text-xs text-zayia-violet-gray outline-none"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(plan.stripe_link)}
                      className="text-zayia-soft-purple hover:text-zayia-deep-violet transition text-xs font-semibold"
                    >
                      Copiar
                    </button>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2">
                    <button className="flex-1 border-2 border-zayia-lilac text-zayia-deep-violet py-2 rounded-lg hover:bg-zayia-lilac/10 transition flex items-center justify-center gap-2 text-sm">
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button className="flex-1 bg-zayia-soft-purple hover:bg-zayia-deep-violet text-white py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </div>

                  {/* Link Stripe Button */}
                  <a
                    href={plan.stripe_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple text-white py-2 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Ir para Stripe
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO 3: ASSINANTES */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-zayia-deep-violet">Assinantes ({filteredSubscribers.length})</h2>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-zayia-lilac rounded-lg text-sm"
              >
                <option value="">Todos os Status</option>
                <option value="active">✅ Ativa</option>
                <option value="cancelled">❌ Cancelada</option>
                <option value="past_due">⚠️ Vencida</option>
              </select>
              <button className="bg-zayia-soft-purple hover:bg-zayia-deep-violet text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Tabela de Assinantes */}
          <div className="zayia-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zayia-lilac/30 bg-zayia-lilac/10">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Plano</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Próxima Cobrança</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map(sub => (
                  <tr key={sub.id} className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/10 transition">
                    <td className="px-6 py-3 text-sm text-zayia-deep-violet font-medium">{sub.name}</td>
                    <td className="px-6 py-3 text-sm text-zayia-violet-gray">{sub.email}</td>
                    <td className="px-6 py-3 text-sm text-zayia-deep-violet">{sub.plan_name}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : sub.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sub.status === 'active' ? '✅ Ativa' : sub.status === 'cancelled' ? '❌ Cancelada' : '⚠️ Vencida'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-zayia-violet-gray">{sub.next_billing_date}</td>
                    <td className="px-6 py-3 text-sm text-zayia-violet-gray">
                      {sub.payment_method === 'card' ? '💳 Cartão' : sub.payment_method === 'pix' ? '🔐 PIX' : '🏦 Débito'}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="text-zayia-soft-purple hover:text-zayia-deep-violet transition" title="Visualizar">
                          <Eye className="w-4 h-4" />
                        </button>
                        {sub.status === 'active' && (
                          <button className="text-red-500 hover:text-red-700 transition" title="Cancelar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {sub.status !== 'active' && (
                          <button className="text-green-500 hover:text-green-700 transition text-sm font-bold" title="Reativar">
                            ↻
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEÇÃO 4: FATURAS */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-zayia-deep-violet">Histórico de Faturas ({invoices.length})</h2>
            <div className="flex gap-2">
              <input type="date" className="px-4 py-2 border-2 border-zayia-lilac rounded-lg text-sm" />
              <input type="date" className="px-4 py-2 border-2 border-zayia-lilac rounded-lg text-sm" />
              <button className="bg-zayia-soft-purple hover:bg-zayia-deep-violet text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Tabela de Faturas */}
          <div className="zayia-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zayia-lilac/30 bg-zayia-lilac/10">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Assinante</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Plano</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zayia-deep-violet">Ações</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/10 transition">
                    <td className="px-6 py-3 text-sm text-zayia-deep-violet font-medium">{inv.date}</td>
                    <td className="px-6 py-3 text-sm text-zayia-deep-violet">{inv.subscriber_name}</td>
                    <td className="px-6 py-3 text-sm text-zayia-violet-gray">{inv.plan_name}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-zayia-deep-violet">
                      R$ {inv.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-sm text-zayia-violet-gray">
                      {inv.payment_method === 'card' ? '💳 Cartão' : inv.payment_method === 'pix' ? '🔐 PIX' : '🏦 Débito'}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                        inv.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : inv.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : inv.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {inv.status === 'paid' ? '✅ Pago' : inv.status === 'failed' ? '❌ Falhou' : inv.status === 'pending' ? '⏳ Pendente' : '↩️ Reembolso'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="text-zayia-soft-purple hover:text-zayia-deep-violet transition text-xs" title="Ver Recibo">
                          👁️
                        </button>
                        {inv.status === 'failed' && (
                          <button className="text-orange-500 hover:text-orange-700 transition text-xs" title="Reemitir">
                            🔄
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
