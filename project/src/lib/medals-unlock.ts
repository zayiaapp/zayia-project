/**
 * Sistema automático de desbloqueio de medalhas
 * Verifica quando usuário atinge milestones de pontos
 */

import { addEarnedBadge } from './badges-storage'
import { LEVELS, BADGES } from './badges-data-mock'

/**
 * Verificar e desbloquear medalhas baseado em pontos
 * Chamado toda vez que usuário ganha pontos
 */
export function checkAndUnlockMedals(newPoints: number, previousPoints: number): string[] {
  const unlockedMedalIds: string[] = []

  // Verificar medalhas de nível
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
        console.log(`🏆 Medalha desbloqueada: ${levelMedal.name} (${levelMedal.pointsRequired} pts)`)
      }
    }
  }

  return unlockedMedalIds
}

/**
 * Obter próximos milestones (para mostrar no Dashboard)
 */
export function getNextMilestones(currentPoints: number): Array<{
  points: number
  medalName: string
  pointsNeeded: number
  level: number
}> {
  return LEVELS
    .filter(l => l.pointsRequired > currentPoints)
    .slice(0, 3)
    .map(l => ({
      points: l.pointsRequired,
      medalName: l.name,
      pointsNeeded: l.pointsRequired - currentPoints,
      level: l.level
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
