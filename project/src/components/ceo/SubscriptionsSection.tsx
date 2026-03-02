import React, { useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  CheckCircle,
  AlertCircle,
  Pause,
  Play
} from 'lucide-react'
import { usePlans, type Plan } from '../../contexts/PlansContext'
// TODO: Descomentar quando Supabase estiver configurado
// import { createPlan, updatePlan, deletePlan } from '../../lib/plans-service'

interface Subscriber {
  id: string
  name: string
  email: string
  plan_name: string
  status: 'active' | 'inactive' | 'paused'
  subscription_date: string
  next_billing_date: string
  amount: number
  payment_method: string
}

export function SubscriptionsSection() {
  const { plans, addPlan, updatePlan, deletePlan } = usePlans()
  const [activeTab, setActiveTab] = useState<'plans' | 'subscribers'>('plans')

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: 'sub-1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      plan_name: 'Premium',
      status: 'active',
      subscription_date: '2026-01-15',
      next_billing_date: '2026-03-15',
      amount: 29.97,
      payment_method: 'Cartão Crédito'
    },
    {
      id: 'sub-2',
      name: 'Ana Costa',
      email: 'ana@email.com',
      plan_name: 'Básico',
      status: 'active',
      subscription_date: '2026-02-01',
      next_billing_date: '2026-03-01',
      amount: 14.97,
      payment_method: 'Cartão Crédito'
    },
    {
      id: 'sub-3',
      name: 'Paula Santos',
      email: 'paula@email.com',
      plan_name: 'Premium',
      status: 'paused',
      subscription_date: '2025-12-10',
      next_billing_date: 'Pausada',
      amount: 29.97,
      payment_method: 'Cartão Débito'
    },
    {
      id: 'sub-4',
      name: 'Juliana Oliveira',
      email: 'juliana@email.com',
      plan_name: 'Básico',
      status: 'inactive',
      subscription_date: '2025-11-20',
      next_billing_date: 'Cancelada',
      amount: 14.97,
      payment_method: 'PayPal'
    }
  ])

  // Modal states
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showSubscriberModal, setShowSubscriberModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)
  const [subscriberFilter, setSubscriberFilter] = useState<'all' | 'active' | 'inactive' | 'paused'>('all')

  // Form state for plan
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    description: '',
    features: '',
    stripe_link: '',
    status: 'active' as 'active' | 'inactive'
  })

  // Plan handlers
  const handleNewPlan = () => {
    setSelectedPlan(null)
    setPlanForm({
      name: '',
      price: '',
      description: '',
      features: '',
      stripe_link: '',
      status: 'active'
    })
    setShowPlanModal(true)
  }

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setPlanForm({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description,
      features: plan.features.join('\n'),
      stripe_link: plan.stripe_link || '',
      status: plan.status
    })
    setShowPlanModal(true)
  }

  const handleSavePlan = () => {
    // Validações
    if (!planForm.name || !planForm.name.trim()) {
      alert('❌ Nome do plano é obrigatório')
      return
    }

    if (!planForm.price || parseFloat(planForm.price) <= 0) {
      alert('❌ Preço deve ser maior que 0')
      return
    }

    if (!planForm.description || !planForm.description.trim()) {
      alert('❌ Descrição é obrigatória')
      return
    }

    try {
      const newPlan: Plan = {
        id: selectedPlan?.id || `plan_${Date.now()}`,
        name: planForm.name,
        price: parseFloat(planForm.price),
        description: planForm.description,
        features: planForm.features.split('\n').filter(f => f.trim()),
        stripe_link: planForm.stripe_link,
        status: planForm.status as 'active' | 'inactive',
        active_subscribers: selectedPlan?.active_subscribers || 0,
        monthly_revenue: selectedPlan?.monthly_revenue || 0
      }

      if (selectedPlan) {
        // ✅ USAR updatePlan do Context
        updatePlan(selectedPlan.id, newPlan)
        console.log('✅ Plano atualizado (sincronizado)')
      } else {
        // ✅ USAR addPlan do Context
        addPlan(newPlan)
        console.log('✅ Plano criado (sincronizado)')
      }

      // LIMPAR FORM E FECHAR MODAL
      setPlanForm({
        name: '',
        price: '',
        description: '',
        features: '',
        stripe_link: '',
        status: 'active'
      })
      setSelectedPlan(null)
      setShowPlanModal(false)

      // MENSAGEM DE SUCESSO
      alert('✅ Plano salvo com sucesso!')

    } catch (error) {
      console.error('❌ Erro ao salvar plano:', error)
      alert('❌ Erro ao salvar plano. Tente novamente.')
    }
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm('Tem certeza que deseja deletar este plano?')) {
      try {
        // ✅ USAR deletePlan do Context
        deletePlan(planId)
        console.log('✅ Plano deletado (sincronizado)')

        // MENSAGEM DE SUCESSO
        alert('✅ Plano deletado com sucesso!')

      } catch (error) {
        console.error('❌ Erro ao deletar plano:', error)
        alert('❌ Erro ao deletar plano. Tente novamente.')
      }
    }
  }

  // Subscriber handlers
  const handleViewSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber)
    setShowSubscriberModal(true)
  }

  const handleCancelSubscriber = (subscriberId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta assinatura?')) {
      setSubscribers(subscribers.map(s =>
        s.id === subscriberId ? { ...s, status: 'inactive' } : s
      ))
    }
  }

  const handleReactivateSubscriber = (subscriberId: string) => {
    if (confirm('Tem certeza que deseja reativar esta assinatura?')) {
      setSubscribers(subscribers.map(s =>
        s.id === subscriberId ? { ...s, status: 'active' } : s
      ))
    }
  }

  const handlePauseSubscriber = (subscriberId: string) => {
    setSubscribers(subscribers.map(s =>
      s.id === subscriberId ? { ...s, status: s.status === 'paused' ? 'active' : 'paused' } : s
    ))
  }

  // Helper functions
  const getFilteredSubscribers = () => {
    if (subscriberFilter === 'all') return subscribers
    return subscribers.filter(s => s.status === subscriberFilter)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'paused':
        return 'Pausada'
      case 'inactive':
        return 'Cancelada'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'paused':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'inactive':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zayia-deep-violet">Gerenciar Assinaturas</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zayia-lilac/30">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'plans'
              ? 'text-zayia-deep-violet border-b-2 border-zayia-deep-violet'
              : 'text-zayia-violet-gray hover:text-zayia-deep-violet'
          }`}
        >
          Planos
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'subscribers'
              ? 'text-zayia-deep-violet border-b-2 border-zayia-deep-violet'
              : 'text-zayia-violet-gray hover:text-zayia-deep-violet'
          }`}
        >
          Assinantes
        </button>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <button
            onClick={handleNewPlan}
            className="flex items-center gap-2 px-4 py-2 bg-zayia-sunset text-white rounded-lg hover:bg-zayia-sunset/90 transition-all"
          >
            <Plus className="w-5 h-5" />
            Novo Plano
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="zayia-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-zayia-deep-violet">{plan.name}</h3>
                    <p className="text-sm text-zayia-violet-gray mt-1">{plan.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    plan.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-zayia-lilac/30">
                  <p className="text-3xl font-bold text-zayia-soft-purple">
                    R$ {plan.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-zayia-violet-gray">por mês</p>
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-sm font-semibold text-zayia-deep-violet">Características:</p>
                  {plan.features.map((feature, idx) => (
                    <p key={idx} className="text-sm text-zayia-violet-gray flex items-center gap-2">
                      ✓ {feature}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-zayia-lilac/20 rounded-lg">
                  <div>
                    <p className="text-xs text-zayia-violet-gray">Assinantes</p>
                    <p className="text-lg font-bold text-zayia-deep-violet">
                      {plan.active_subscribers}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zayia-violet-gray">Receita Mês</p>
                    <p className="text-lg font-bold text-zayia-soft-purple">
                      R$ {plan.monthly_revenue.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-zayia-lilac/30 text-zayia-deep-violet rounded-lg hover:bg-zayia-lilac/20 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'active', 'inactive', 'paused'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSubscriberFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  subscriberFilter === status
                    ? 'bg-zayia-sunset text-white'
                    : 'bg-zayia-lilac/20 text-zayia-deep-violet hover:bg-zayia-lilac/40'
                }`}
              >
                {status === 'all' ? 'Todas' : status === 'active' ? 'Ativas' : status === 'paused' ? 'Pausadas' : 'Canceladas'}
              </button>
            ))}
          </div>

          {/* Subscribers List */}
          <div className="space-y-3">
            {getFilteredSubscribers().map((subscriber) => (
              <div key={subscriber.id} className="zayia-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zayia-lilac/30 rounded-full flex items-center justify-center">
                        {getStatusIcon(subscriber.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-zayia-deep-violet">{subscriber.name}</p>
                        <p className="text-sm text-zayia-violet-gray">{subscriber.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-semibold text-zayia-deep-violet">{subscriber.plan_name}</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 border ${getStatusColor(subscriber.status)}`}>
                      {getStatusLabel(subscriber.status)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewSubscriber(subscriber)}
                    className="p-2 hover:bg-zayia-lilac/30 rounded-lg transition-all"
                  >
                    <Eye className="w-5 h-5 text-zayia-deep-violet" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zayia-deep-violet">
                {selectedPlan ? 'Editar Plano' : 'Novo Plano'}
              </h3>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-1 hover:bg-zayia-lilac/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-zayia-lilac/30 rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                  placeholder="Ex: Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                  className="w-full px-4 py-2 border border-zayia-lilac/30 rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                  placeholder="29.97"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-zayia-lilac/30 rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                  placeholder="Descrição breve"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Características (uma por linha)
                </label>
                <textarea
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full px-4 py-2 border border-zayia-lilac/30 rounded-lg focus:outline-none focus:border-zayia-soft-purple h-24"
                  placeholder="Desafios ilimitados&#10;Mentoria 1:1&#10;Dashboard avançado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Link Stripe
                </label>
                <input
                  type="text"
                  value={planForm.stripe_link}
                  onChange={(e) => setPlanForm({ ...planForm, stripe_link: e.target.value })}
                  className="w-full px-4 py-2 border border-zayia-lilac/30 rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                  placeholder="https://stripe.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Status
                </label>
                <select
                  value={planForm.status}
                  onChange={(e) => setPlanForm({ ...planForm, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-2 border border-zayia-lilac/30 rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 px-4 py-2 border border-zayia-lilac/30 text-zayia-deep-violet rounded-lg hover:bg-zayia-lilac/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                className="flex-1 px-4 py-2 bg-zayia-sunset text-white rounded-lg hover:bg-zayia-sunset/90 transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscriber Details Modal */}
      {showSubscriberModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zayia-deep-violet">Detalhes da Assinatura</h3>
              <button
                onClick={() => setShowSubscriberModal(false)}
                className="p-1 hover:bg-zayia-lilac/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                <p className="text-sm text-zayia-violet-gray">Nome</p>
                <p className="font-semibold text-zayia-deep-violet">{selectedSubscriber.name}</p>
              </div>

              <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                <p className="text-sm text-zayia-violet-gray">Email</p>
                <p className="font-semibold text-zayia-deep-violet">{selectedSubscriber.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                  <p className="text-sm text-zayia-violet-gray">Plano</p>
                  <p className="font-semibold text-zayia-deep-violet">{selectedSubscriber.plan_name}</p>
                </div>
                <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                  <p className="text-sm text-zayia-violet-gray">Valor</p>
                  <p className="font-semibold text-zayia-soft-purple">R$ {selectedSubscriber.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                <p className="text-sm text-zayia-violet-gray">Data de Inscrição</p>
                <p className="font-semibold text-zayia-deep-violet">{selectedSubscriber.subscription_date}</p>
              </div>

              <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                <p className="text-sm text-zayia-violet-gray">Próximo Faturamento</p>
                <p className="font-semibold text-zayia-deep-violet">{selectedSubscriber.next_billing_date}</p>
              </div>

              <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                <p className="text-sm text-zayia-violet-gray">Método de Pagamento</p>
                <p className="font-semibold text-zayia-deep-violet">{selectedSubscriber.payment_method}</p>
              </div>

              <div className="p-4 bg-zayia-lilac/20 rounded-lg">
                <p className="text-sm text-zayia-violet-gray">Status</p>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 border ${getStatusColor(selectedSubscriber.status)}`}>
                  {getStatusLabel(selectedSubscriber.status)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              {selectedSubscriber.status === 'active' && (
                <>
                  <button
                    onClick={() => {
                      handlePauseSubscriber(selectedSubscriber.id)
                      setShowSubscriberModal(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-all"
                  >
                    <Pause className="w-4 h-4" />
                    Pausar Assinatura
                  </button>
                  <button
                    onClick={() => {
                      handleCancelSubscriber(selectedSubscriber.id)
                      setShowSubscriberModal(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancelar Assinatura
                  </button>
                </>
              )}

              {(selectedSubscriber.status === 'paused' || selectedSubscriber.status === 'inactive') && (
                <button
                  onClick={() => {
                    handleReactivateSubscriber(selectedSubscriber.id)
                    setShowSubscriberModal(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Reativar Assinatura
                </button>
              )}

              <button
                onClick={() => setShowSubscriberModal(false)}
                className="w-full px-4 py-2 border border-zayia-lilac/30 text-zayia-deep-violet rounded-lg hover:bg-zayia-lilac/20 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
