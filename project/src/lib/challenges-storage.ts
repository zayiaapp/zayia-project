/**
 * Daily Challenges Storage & Tracking
 * Gerencia contador de desafios do dia com reset automático a 00:00
 */

export function getDateKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getFormattedToday(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}/${month}/${year}`
}

export function initializeDailyTracking(): void {
  const today = getDateKey()
  const lastTrackedDay = localStorage.getItem('last_tracked_day')

  // Se mudou de dia, reseta contador
  if (lastTrackedDay !== today) {
    localStorage.setItem('completed_challenges_today', '0')
    localStorage.setItem('last_tracked_day', today)
  }
}

export function getDailyCompletedCount(): number {
  initializeDailyTracking()
  return parseInt(localStorage.getItem('completed_challenges_today') || '0', 10)
}

export function incrementDailyCount(): void {
  initializeDailyTracking()
  const current = getDailyCompletedCount()
  localStorage.setItem('completed_challenges_today', (current + 1).toString())
  window.dispatchEvent(new Event('dailyProgressUpdated'))
}
