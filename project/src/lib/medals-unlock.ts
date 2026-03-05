/**
 * Sistema automático de desbloqueio de medalhas
 * Verifica quando usuário atinge milestones de pontos
 */

import { FC } from 'react'
import { addEarnedBadge, getEarnedBadges } from './badges-storage'
import { LEVELS, BADGES } from './badges-data-mock'
import ChallengesDataMock from './challenges-data-mock'
import { supabaseClient } from './supabase-client'

/**
 * Verificar e desbloquear medalhas baseado em pontos (NÍVEIS)
 * Chamado toda vez que usuário ganha pontos
 */
export function checkAndUnlockMedals(newPoints: number, previousPoints: number, userId?: string): string[] {
  const unlockedMedalIds: string[] = []

  // 1️⃣ Verificar medalhas de nível
  const previousLevel = LEVELS.filter(l => previousPoints >= l.pointsRequired).length - 1
  const currentLevel = LEVELS.filter(l => newPoints >= l.pointsRequired).length - 1

  // Se subiu de nível, desbloquear medalha
  if (currentLevel > previousLevel) {
    for (let i = previousLevel + 1; i <= currentLevel; i++) {
      const levelMedal = LEVELS[i]
      if (levelMedal) {
        const medalId = `level_${i}` // Formato: level_0, level_1, etc
        addEarnedBadge(medalId)
        unlockedMedalIds.push(medalId)
        console.log(`🏆 NÍVEL DESBLOQUEADO: ${medalId} - ${levelMedal.name}`)
      }
    }
  }

  // 2️⃣ Verificar medalhas de categoria (se userId fornecido)
  if (userId) {
    const earnedBadgeIds = getEarnedBadges()

    // Pegar todas as categorias
    const categories = ChallengesDataMock.getCategories()

    categories.forEach(category => {
      // Contar desafios completados nesta categoria
      const completedCount = ChallengesDataMock.getUserCompletedChallenges(category.id, userId).length

      // Verificar medalhas de categoria
      BADGES.forEach(badge => {
        // Se é medalha desta categoria E usuário completou requisito
        if (
          badge.category === category.label &&
          !badge.category.includes('Global') &&
          completedCount >= badge.requirement &&
          !earnedBadgeIds.includes(badge.id)
        ) {
          addEarnedBadge(badge.id)
          unlockedMedalIds.push(badge.id)
          console.log(`🎖️ CATEGORIA DESBLOQUEADA: ${badge.id} - ${badge.name} (${completedCount}/${badge.requirement})`)
        }
      })
    })

    // 3️⃣ Verificar medalhas GLOBAIS (baseado em TOTAL acumulado de desafios)
    console.log('\n🌍 VERIFICANDO MEDALHAS GLOBAIS:')

    // Usar o total global rastreado
    const totalChallengesCompleted = ChallengesDataMock.getTotalChallengesCompleted(userId)
    console.log(`   Total acumulado de desafios: ${totalChallengesCompleted}`)

    // Verificar cada medalha global
    BADGES.forEach(badge => {
      if (
        badge.category === 'Global' &&
        totalChallengesCompleted >= badge.requirement &&
        !earnedBadgeIds.includes(badge.id)
      ) {
        addEarnedBadge(badge.id)
        unlockedMedalIds.push(badge.id)
        console.log(`🌍 GLOBAL DESBLOQUEADA: ${badge.id} - ${badge.name} (${totalChallengesCompleted}/${badge.requirement})`)
      }
    })
  }

  return unlockedMedalIds
}

/**
 * Verificar e desbloquear medalhas de categoria (ASSÍNCRONO — usa Supabase, não localStorage)
 * Medalhas globais são checadas separadamente via checkAndAwardGlobalMedals()
 */
export async function checkAndUnlockMedalsAsync(
  newPoints: number,
  previousPoints: number,
  userId: string
): Promise<string[]> {
  // 1. Buscar dados reais do Supabase
  const totalCompleted = await supabaseClient.getUserTotalCompletedCount(userId)
  const earnedBadgeIds = await supabaseClient.getUserEarnedBadgeIds(userId)

  // 2. Verificar medalhas de categoria (não globais)
  const newMedals: string[] = []

  for (const badge of BADGES) {
    if (earnedBadgeIds.includes(badge.id)) continue // já tem
    if (badge.category === 'Global') continue // globais checadas separadamente

    let unlocked = false
    if (badge.requirement && totalCompleted >= badge.requirement) {
      unlocked = true
    }

    if (unlocked) {
      newMedals.push(badge.id)
    }
  }

  return newMedals
}

/**
 * Obter próximos milestones (para mostrar no Dashboard)
 */
export function getNextMilestones(currentPoints: number): Array<{
  points: number
  medalName: string
  pointsNeeded: number
  level: number
  medalId: string
  icon: FC
}> {
  return LEVELS
    .filter(l => l.pointsRequired > currentPoints)
    .slice(0, 3)
    .map(l => ({
      points: l.pointsRequired,
      medalName: l.name,
      pointsNeeded: l.pointsRequired - currentPoints,
      level: l.level,
      medalId: `level_${l.level}`,
      icon: l.icon
    }))
}

/**
 * Obter medal info por ID
 */
export function getMedalById(medalId: string) {
  return BADGES.find(b => b.id === medalId)
}

/**
 * Obter todas as medalhas de um usuário incluindo os dados
 */
export function getEarnedMedalsData(earnedBadgeIds: string[]) {
  return earnedBadgeIds
    .map(id => BADGES.find(b => b.id === id))
    .filter(Boolean)
}
