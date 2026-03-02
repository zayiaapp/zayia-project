import React, { useState, useEffect } from 'react'
import { ExternalLink, Shield } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { createStripePortalSession } from '../../../lib/stripe-service'
// TODO: Descomentar quando Supabase estiver configurado
// import { getActivePlans, subscribeToPlansChanges } from '../../../lib/plans-service'
import type { Subscription, Plan } from '../../../types/subscription'

export function SubscriptionSection() {
  const { profile } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [plansLoading, setPlansLoading] = useState(true)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===== CARREGAR DADOS =====
  useEffect(() => {
    if (profile?.id) {
      loadSubscriptionData()

      // TODO: Descomentar quando Supabase estiver configurado
      // Observar mudanças em planos em tempo real
      // const unsubscribe = subscribeToPlansChanges((plans) => {
      //   setAvailablePlans(plans)
      //   console.log('✅ Planos atualizados em tempo real')
      // })
      // return () => unsubscribe()
    }
  }, [profile?.id])

  const loadSubscriptionData = async () => {
    if (!profile?.id) return

    setIsLoading(true)
    setError(null)

    try {
      // 1. Buscar subscription do user
      const subscriptionData = await fetchUserSubscription(profile.id)
      setSubscription(subscriptionData)

      // 2. Buscar planos disponíveis (mock data por enquanto)
      const mockPlans: Plan[] = [
        {
          id: 'plan_basic',
          name: 'Básico',
          price: 14.97,
          description: 'Acesso a conteúdo básico de coaching',
          features: ['Acesso a 5 desafios/mês', 'Dashboard básico', 'Email support'],
          stripe_link: 'https://buy.stripe.com/basic',
          status: 'active'
        },
        {
          id: 'plan_premium',
          name: 'Premium',
          price: 29.97,
          description: 'Acesso completo com mentoria',
          features: ['Desafios ilimitados', 'Mentoria 1:1', 'Dashboard avançado', 'Priority support'],
          stripe_link: 'https://buy.stripe.com/premium',
          status: 'active'
        }
      ]

      setAvailablePlans(mockPlans)
      setPlansLoading(false)

      console.log('✅ Dados de assinatura carregados (usando mock data):', subscriptionData)
    } catch (err) {
      console.error('❌ Erro ao carregar assinatura:', err)
      setError('Erro ao carregar dados de assinatura. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // ===== FETCH FUNCTIONS =====

  const fetchUserSubscription = async (userId: string): Promise<Subscription | null> => {
    try {
      // TODO: Integrar com Supabase real
      // const { data } = await supabase
      //   .from('subscriptions')
      //   .select('*, plan:plan_id (*)')
      //   .eq('user_id', userId)
      //   .eq('status', 'active')
      //   .single()

      // Mock data - substitua com fetch real
      return {
        id: 'sub_123',
        user_id: userId,
        plan_id: 'plan_premium',
        plan: {
          id: 'plan_premium',
          name: 'ZAYIA Premium',
          price: 13.90,
          description: 'Acesso completo a desafios, medalhas e comunidade',
          features: [
            'Acesso a todos os 840 desafios',
            'Sistema completo de medalhas e níveis',
            'Comunidade exclusiva no WhatsApp',
            'Suporte prioritário via SOS',
            'Atualizações e novos conteúdos',
            'Ranking em tempo real'
          ],
          status: 'active'
        },
        status: 'active',
        current_period_start: '2026-02-14',
        current_period_end: '2026-03-14',
        cancel_at_period_end: false,
        stripe_subscription_id: 'sub_stripe_123',
        stripe_customer_id: 'cus_stripe_123'
      }
    } catch (err) {
      console.error('Erro ao buscar subscription:', err)
      return null
    }
  }

  // ===== AÇÕES =====

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      setError('Dados de assinatura não encontrados')
      return
    }

    setIsLoadingPortal(true)
    setError(null)

    try {
      // Criar sessão do Stripe Customer Portal
      const portalUrl = await createStripePortalSession(subscription.stripe_customer_id)

      // Abrir em nova aba
      window.open(portalUrl, '_blank')
      console.log('✅ Portal Stripe aberto:', portalUrl)
    } catch (err) {
      console.error('❌ Erro ao abrir portal:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(`Não foi possível abrir o portal Stripe: ${errorMessage}`)
    } finally {
      setIsLoadingPortal(false)
    }
  }

  // ===== HELPERS =====

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' }
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: '❌' }
      case 'past_due':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⚠️' }
      case 'suspended':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🔒' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '❓' }
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Assinatura Ativa'
      case 'cancelled':
        return 'Cancelada'
      case 'past_due':
        return 'Vencida'
      case 'suspended':
        return 'Suspensa'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateDaysUntilNextBilling = () => {
    if (!subscription) return 0
    const end = new Date(subscription.current_period_end)
    const today = new Date()
    const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  // ===== RENDER =====

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <p className="ml-4 text-zayia-violet-gray">Carregando dados de assinatura...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="zayia-card p-6 border-l-4 border-red-500 bg-red-50">
        <p className="text-red-700 font-semibold">⚠️ Erro</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-zayia-deep-violet">💳 Assinatura</h1>

        {plansLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <p className="ml-4 text-zayia-violet-gray">Carregando planos...</p>
          </div>
        ) : availablePlans.length === 0 ? (
          <div className="zayia-card p-8 text-center space-y-4">
            <p className="text-zayia-violet-gray">Nenhum plano disponível no momento</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-zayia-deep-violet">Escolha seu plano</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="zayia-card p-8 space-y-4 border-2 border-zayia-lilac/30 hover:border-zayia-lilac/50 transition"
                >
                  {/* Nome e Descrição */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zayia-deep-violet">{plan.name}</h3>
                    <p className="text-sm text-zayia-violet-gray">{plan.description}</p>
                  </div>

                  {/* Preço */}
                  <div className="bg-zayia-lilac/10 p-4 rounded-lg">
                    <p className="text-xs text-zayia-violet-gray mb-1">Preço Mensal</p>
                    <p className="text-4xl font-bold text-zayia-soft-purple">
                      R$ {plan.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-xs font-semibold text-zayia-deep-violet mb-2">Inclusos:</p>
                    <ul className="space-y-1">
                      {plan.features?.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-zayia-violet-gray"
                        >
                          <span className="text-green-500 font-bold">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botão Assinar */}
                  <a
                    href={plan.stripe_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple text-white py-3 rounded-xl font-semibold hover:shadow-lg transition block text-center"
                  >
                    Alterar Plano
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ===== RENDER: COM ASSINATURA ATIVA =====

  const statusInfo = getStatusInfo(subscription.status)
  const daysRemaining = calculateDaysUntilNextBilling()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zayia-deep-violet">Sua Assinatura ZAYIA</h1>
      </div>

      {/* Card da Assinatura */}
      <div className="zayia-card p-8 space-y-6 border-2 border-zayia-lilac/30">
        {/* Header do Card */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zayia-deep-violet">
              {subscription.plan?.name}
            </h2>
            <p className="text-sm text-zayia-violet-gray">{subscription.plan?.description}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}
          >
            {statusInfo.icon} {getStatusLabel(subscription.status)}
          </span>
        </div>

        {/* Preço */}
        <div className="bg-zayia-lilac/10 p-4 rounded-lg">
          <p className="text-xs text-zayia-violet-gray mb-1">Preço Mensal</p>
          <p className="text-4xl font-bold text-zayia-soft-purple">
            R$ {subscription.plan?.price.toFixed(2)}
          </p>
        </div>

        {/* Próxima Cobrança */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-zayia-lilac/10 rounded-lg">
          <div>
            <p className="text-xs text-zayia-violet-gray mb-1">Próxima Cobrança</p>
            <p className="font-bold text-zayia-deep-violet">
              {formatDate(subscription.current_period_end)}
            </p>
            <p className="text-xs text-zayia-violet-gray mt-1">Em {daysRemaining} dias</p>
          </div>
          <div>
            <p className="text-xs text-zayia-violet-gray mb-1">Tipo de Plano</p>
            <p className="font-bold text-zayia-deep-violet">Único</p>
            <p className="text-xs text-zayia-violet-gray mt-1">Sem limitações</p>
          </div>
        </div>

        {/* Benefícios */}
        <div>
          <h3 className="font-bold text-zayia-deep-violet mb-3">Seus Benefícios:</h3>
          <ul className="space-y-2">
            {subscription.plan?.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-zayia-violet-gray">
                <span className="text-green-500 font-bold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Botão Gerenciar */}
        <button
          onClick={handleManageSubscription}
          disabled={isLoadingPortal}
          className="w-full bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoadingPortal ? (
            <>
              <LoadingSpinner />
              Abrindo...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Gerenciar Assinatura
            </>
          )}
        </button>
      </div>

      {/* Informações Importantes */}
      <div className="zayia-card p-6 border-l-4 border-blue-500 bg-blue-50">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-700">Informações Importantes:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Cobrança automática todo dia 15 do mês</li>
              <li>• Cancele a qualquer momento sem multa</li>
              <li>• Acesso mantido até o fim do período pago</li>
              <li>• Suporte via chat ou email: suporte@zayia.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
