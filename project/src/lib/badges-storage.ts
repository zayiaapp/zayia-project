/**
 * localStorage helper for badges and levels
 * Single source of truth for user's earned badges and current level
 */

const EARNED_BADGES_KEY = 'zayia_earned_badges'
const EARNED_LEVEL_KEY = 'zayia_earned_level'

/**
 * Get array of badge IDs that the user has earned
 */
export function getEarnedBadges(): string[] {
  try {
    const data = localStorage.getItem(EARNED_BADGES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading earned badges:', error)
    return []
  }
}

/**
 * Get the highest level the user has reached
 */
export function getEarnedLevel(): number {
  try {
    const data = localStorage.getItem(EARNED_LEVEL_KEY)
    return data ? parseInt(data, 10) : 0
  } catch (error) {
    console.error('Error reading earned level:', error)
    return 0
  }
}

/**
 * Add a badge to the user's earned list
 */
export function addEarnedBadge(badgeId: string): void {
  try {
    const earned = getEarnedBadges()
    if (!earned.includes(badgeId)) {
      earned.push(badgeId)
      localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(earned))
      window.dispatchEvent(new CustomEvent('badgesUpdated', { detail: { badgeId } }))
    }
  } catch (error) {
    console.error('Error adding badge:', error)
  }
}

/**
 * Set the user's current level
 */
export function setEarnedLevel(level: number): void {
  try {
    const current = getEarnedLevel()
    if (level > current) {
      localStorage.setItem(EARNED_LEVEL_KEY, level.toString())
      window.dispatchEvent(new CustomEvent('levelUpdated', { detail: { level } }))
    }
  } catch (error) {
    console.error('Error setting level:', error)
  }
}

/**
 * Remove a badge (for testing/reset)
 */
export function removeEarnedBadge(badgeId: string): void {
  try {
    const earned = getEarnedBadges()
    const filtered = earned.filter(id => id !== badgeId)
    localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent('badgesUpdated'))
  } catch (error) {
    console.error('Error removing badge:', error)
  }
}

/**
 * Clear all earned badges and level (for reset)
 */
export function clearAllBadges(): void {
  try {
    localStorage.removeItem(EARNED_BADGES_KEY)
    localStorage.removeItem(EARNED_LEVEL_KEY)
    window.dispatchEvent(new CustomEvent('badgesUpdated'))
  } catch (error) {
    console.error('Error clearing badges:', error)
  }
}

/**
 * Get mock data for testing (simulates some badges earned)
 */
export function initializeMockBadges(): void {
  const mockBadges = [
    'org_iniciante', // Organization badge
    'com_iniciante', // Communication badge
    'global_ovo' // Global butterfly egg
  ]

  localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(mockBadges))
  localStorage.setItem(EARNED_LEVEL_KEY, '2')
  window.dispatchEvent(new CustomEvent('badgesUpdated'))
}
