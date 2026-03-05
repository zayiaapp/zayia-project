/**
 * Sistema automático de desbloqueio de medalhas
 * Verifica quando usuário atinge milestones de pontos
 */

import { FC } from 'react'
import { addEarnedBadge, getEarnedBadges } from './badges-storage'
import { supabaseClient } from './supabase-client'

/**
 * [DEPRECATED] Verificar e desbloquear medalhas baseado em pontos (NÍVEIS)
 * ⚠️ USE checkAndUnlockMedalsAsync() INSTEAD - Esta função usa dados do localStorage
 * Mantida por compatibilidade backward
 */
export function checkAndUnlockMedals(newPoints: number, previousPoints: number, userId?: string): string[] {
  const unlockedMedalIds: string[] = []

  // [DEPRECATED] Lógica removida - use checkAndUnlockMedalsAsync() que busca dados reais do Supabase
  console.warn('❌ checkAndUnlockMedals() deprecated. Use checkAndUnlockMedalsAsync() instead.')

  return unlockedMedalIds
}

/**
 * [DEPRECATED] Verificar e desbloquear medalhas de categoria
 * Agora checkAndAwardGlobalMedals() é chamado via supabaseClient
 * Mantém apenas para compatibilidade backward
 */
export async function checkAndUnlockMedalsAsync(
  newPoints: number,
  previousPoints: number,
  userId: string
): Promise<string[]> {
  // Medalhas agora são checadas e desbloqueadas via supabaseClient.checkAndAwardGlobalMedals()
  console.warn('❌ checkAndUnlockMedalsAsync() deprecated. Use supabaseClient.checkAndAwardGlobalMedals() instead.')
  return []
}
