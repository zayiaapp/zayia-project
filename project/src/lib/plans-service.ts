import { supabase } from './supabase'
import type { Plan } from '../types/subscription'

/**
 * Buscar todos os planos ativos do Supabase
 */
export async function getActivePlans(): Promise<Plan[]> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('status', 'active')
      .order('price', { ascending: true })

    if (error) {
      console.error('❌ Erro ao buscar planos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('❌ Erro ao buscar planos:', error)
    return []
  }
}

/**
 * Buscar plano específico por ID
 */
export async function getPlanById(planId: string): Promise<Plan | null> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (error) {
      console.error('❌ Erro ao buscar plano:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('❌ Erro ao buscar plano:', error)
    return null
  }
}

/**
 * Observar mudanças em tempo real (planos adicionados/editados/deletados)
 */
export function subscribeToPlansChanges(callback: (plans: Plan[]) => void): () => void {
  // Subscribe to realtime changes
  const channel = supabase
    .channel('plans_changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events: INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'plans'
      },
      async (payload: unknown) => {
        console.log('📢 Mudança em planos detectada:', payload)
        // Recarregar planos quando há mudança
        const plans = await getActivePlans()
        callback(plans)
      }
    )
    .subscribe()

  // Retornar função para desinscrever
  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Criar novo plano (Admin)
 */
export async function createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>): Promise<Plan | null> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .insert([plan])
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar plano:', error)
      return null
    }

    console.log('✅ Plano criado:', data)
    return data
  } catch (error) {
    console.error('❌ Erro ao criar plano:', error)
    return null
  }
}

/**
 * Atualizar plano (Admin)
 */
export async function updatePlan(planId: string, updates: Partial<Plan>): Promise<Plan | null> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar plano:', error)
      return null
    }

    console.log('✅ Plano atualizado:', data)
    return data
  } catch (error) {
    console.error('❌ Erro ao atualizar plano:', error)
    return null
  }
}

/**
 * Deletar plano (Admin)
 */
export async function deletePlan(planId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', planId)

    if (error) {
      console.error('❌ Erro ao deletar plano:', error)
      return false
    }

    console.log('✅ Plano deletado:', planId)
    return true
  } catch (error) {
    console.error('❌ Erro ao deletar plano:', error)
    return false
  }
}
