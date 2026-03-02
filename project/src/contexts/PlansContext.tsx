import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  stripe_link?: string
  status: 'active' | 'inactive'
  active_subscribers?: number
  monthly_revenue?: number
}

interface PlansContextType {
  plans: Plan[]
  setPlans: (plans: Plan[]) => void
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, plan: Plan) => void
  deletePlan: (id: string) => void
}

const PlansContext = createContext<PlansContextType | undefined>(undefined)

// Key para localStorage
const PLANS_STORAGE_KEY = 'zayia_plans'

// Planos padrão iniciais
const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan-1',
    name: 'Básico',
    price: 14.97,
    description: 'Acesso a conteúdo básico de coaching',
    features: ['Acesso a 5 desafios/mês', 'Dashboard básico', 'Email support'],
    stripe_link: 'https://stripe.com/basic',
    status: 'active',
    active_subscribers: 45,
    monthly_revenue: 674.65
  },
  {
    id: 'plan-2',
    name: 'Premium',
    price: 29.97,
    description: 'Acesso completo com mentoria',
    features: ['Desafios ilimitados', 'Mentoria 1:1', 'Dashboard avançado', 'Priority support'],
    stripe_link: 'https://stripe.com/premium',
    status: 'active',
    active_subscribers: 23,
    monthly_revenue: 689.31
  }
]

/**
 * Provider de Planos - compartilha estado entre Admin e User
 * Sincronização em tempo real entre SubscriptionsSection (Admin) e SubscriptionSection (User)
 * Com persistência em localStorage e sincronização entre abas
 */
export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlansState] = useState<Plan[]>(() => {
    // Carregar do localStorage ao inicializar
    try {
      const saved = localStorage.getItem(PLANS_STORAGE_KEY)
      if (saved) {
        console.log('✅ Planos carregados do localStorage')
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar planos do localStorage:', error)
    }
    // Se não houver no localStorage, usar padrão
    console.log('ℹ️ Usando planos padrão iniciais')
    return DEFAULT_PLANS
  })

  // Salvar em localStorage sempre que plans mudam
  useEffect(() => {
    try {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans))
      console.log('💾 Planos salvos em localStorage')
    } catch (error) {
      console.error('❌ Erro ao salvar planos em localStorage:', error)
    }
  }, [plans])

  // Sincronizar entre abas/janelas quando localStorage muda
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PLANS_STORAGE_KEY && event.newValue) {
        try {
          const updatedPlans = JSON.parse(event.newValue)
          setPlansState(updatedPlans)
          console.log('🔄 Planos sincronizados de outra aba')
        } catch (error) {
          console.error('❌ Erro ao sincronizar planos:', error)
        }
      }
    }

    // Escutar mudanças de localStorage de outras abas/janelas
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const setPlans = (newPlans: Plan[]) => {
    setPlansState(newPlans)
  }

  const addPlan = (plan: Plan) => {
    setPlansState([...plans, plan])
    console.log('✅ Plano adicionado (sincronizado):', plan.name)
  }

  const updatePlan = (id: string, updatedPlan: Plan) => {
    setPlansState(plans.map(p => p.id === id ? updatedPlan : p))
    console.log('✅ Plano atualizado (sincronizado):', updatedPlan.name)
  }

  const deletePlan = (id: string) => {
    const deletedPlan = plans.find(p => p.id === id)
    setPlansState(plans.filter(p => p.id !== id))
    console.log('✅ Plano deletado (sincronizado):', deletedPlan?.name)
  }

  return (
    <PlansContext.Provider value={{ plans, setPlans, addPlan, updatePlan, deletePlan }}>
      {children}
    </PlansContext.Provider>
  )
}

/**
 * Hook para usar o contexto de planos
 */
export function usePlans() {
  const context = useContext(PlansContext)
  if (!context) {
    throw new Error('usePlans deve ser usado dentro de PlansProvider')
  }
  return context
}
