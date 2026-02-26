/**
 * ZAYIA Ranking System - Data Mock + Interfaces
 * Estrutura completa para Ranking com Prêmios Mensais e Desempate
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface MonthlyRankingEntry {
  id: string
  month: number
  year: number
  userId: string
  position: number
  points: number
  badgesCount: number
  completedChallenges: number
  firstChallengeTime: string // ISO timestamp CRÍTICO para desempate!
  favoriteCategory: string
  createdAt: string
}

export interface MonthlyWinner {
  id: string
  month: number
  year: number
  firstPlaceUserId: string
  firstPlacePoints: number
  secondPlaceUserId: string
  secondPlacePoints: number
  thirdPlaceUserId: string
  thirdPlacePoints: number
  createdAt: string
  finalizedAt: string
}

export interface PrizePayment {
  id: string
  winnerId: string
  position: number // 1, 2, 3
  month: number
  year: number
  prizeAmount: number // R$ customizável
  status: 'pending' | 'paid' | 'cancelled'
  paymentProofUrl?: string // screenshot comprovante
  paymentDate?: string
  paymentMethod: 'pix' | 'transfer' | 'other'
  pixKey?: string // telefone ou email PIX
  notes?: string
  badgeEarned: string
  badgeEarnedAt: string
  updatedAt: string
  updatedBy: string
}

export interface RankingConfig {
  first_place_prize: number
  second_place_prize: number
  third_place_prize: number
  auto_reset_enabled: boolean
  reset_day: number
  reset_time: string
  notification_enabled: boolean
}

export interface RankingUser {
  id: string
  position: number
  previousPosition: number
  positionChange: 'up' | 'down' | 'same'
  name: string
  email: string
  avatar_url: string
  points: number
  level: number
  streak: number
  badges_count: number
  completed_challenges: number
  completed_today: number // NOVO: desafios completados HOJE
  firstChallengeTime: string // NOVO: hora do 1º desafio de hoje
  last_activity: string
  weekly_growth: number
  monthly_growth: number
  favorite_category: string
  total_sessions: number
  join_date: string
  recent_badges: Array<{
    id: string
    name: string
    icon: string
    earned_at: string
  }>
  isCurrentUser?: boolean
  isPrizeWinner?: boolean
  prizePosition?: 1 | 2 | 3
  prizeAmount?: number
  prizeStatus?: 'pending' | 'paid' | 'cancelled'
  hasWonBefore?: boolean
  totalPrizesWon?: number
  totalEarned?: number // R$ total ganho
  zone?: 'prize' | 'attention' | 'neutral' // Para cores na UI
}

export interface RankingStats {
  total_users: number
  active_today: number
  average_points: number
  top_performer_growth: number
  total_points_distributed: number
  new_users_this_week: number
  currentMonth: number
  currentYear: number
  daysLeftInMonth: number
  monthStartDate: string
  monthEndDate: string
  totalPrizesThisMonth: number
  totalSpentThisMonth: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

const femaleNames = [
  'Ana Silva', 'Maria Santos', 'Julia Costa', 'Beatriz Oliveira', 'Camila Souza',
  'Fernanda Lima', 'Gabriela Alves', 'Helena Rodrigues', 'Isabella Ferreira', 'Larissa Martins',
  'Letícia Pereira', 'Mariana Carvalho', 'Natália Ribeiro', 'Patrícia Gomes', 'Rafaela Barbosa',
  'Sabrina Dias', 'Tatiana Moreira', 'Vanessa Castro', 'Yasmin Araújo', 'Adriana Nascimento',
  'Bruna Cardoso', 'Carolina Mendes', 'Daniela Rocha', 'Eduarda Teixeira', 'Fabiana Correia',
  'Giovanna Pinto', 'Ingrid Monteiro', 'Jéssica Freitas', 'Karina Lopes', 'Luana Cavalcanti',
  'Mônica Azevedo', 'Nicole Campos', 'Priscila Nunes', 'Roberta Vieira', 'Simone Machado',
  'Thais Ramos', 'Viviane Cunha', 'Amanda Farias', 'Bianca Moura', 'Cláudia Rezende',
  'Débora Silveira', 'Eliane Torres', 'Flávia Batista', 'Graziela Melo', 'Heloísa Duarte',
  'Íris Nogueira', 'Jaqueline Siqueira', 'Kelly Miranda', 'Luciana Vasconcelos', 'Michele Andrade'
]

const categories = ['autoestima', 'rotina', 'mindfulness', 'corpo_saude', 'relacionamentos', 'carreira', 'digital_detox']

// ============================================================================
// GERADOR DE DADOS MOCK
// ============================================================================

export function generateMockRankingUsers(): RankingUser[] {
  const now = new Date()
  const users: RankingUser[] = []

  for (let i = 0; i < 50; i++) {
    const basePoints = Math.max(0, Math.floor(Math.random() * 5000) + (50 - i) * 50)
    const level = Math.min(20, Math.floor(basePoints / 200) + 1)
    const streak = Math.floor(Math.random() * 100)
    const badges_count = Math.floor(level * 1.5 + Math.random() * 5)
    const completed_challenges = Math.floor(basePoints / 15)
    const completed_today = Math.floor(Math.random() * 5) // 0-4 desafios hoje

    // CRÍTICO: Hora do primeiro desafio de hoje
    const firstChallengeOffset = Math.floor(Math.random() * 12 * 60 * 60 * 1000) // 0-12 horas atrás
    const firstChallengeTime = new Date(now.getTime() - firstChallengeOffset).toISOString()

    // Determinar zona de prêmio
    let zone: 'prize' | 'attention' | 'neutral' = 'neutral'
    if (i < 3) zone = 'prize'
    else if (i < 10) zone = 'attention'

    const user: RankingUser = {
      id: `user-${i + 1}`,
      position: i + 1,
      previousPosition: i + 1 + Math.floor(Math.random() * 6) - 3,
      positionChange: 'same',
      name: femaleNames[i] || `Usuária ${i + 1}`,
      email: `user${i + 1}@exemplo.com`,
      avatar_url: `https://images.pexels.com/photos/${3756679 + (i * 123) % 1000}/pexels-photo-${3756679 + (i * 123) % 1000}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
      points: basePoints,
      level,
      streak,
      badges_count,
      completed_challenges,
      completed_today,
      firstChallengeTime,
      last_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      weekly_growth: Math.floor(Math.random() * 40) - 10,
      monthly_growth: Math.floor(Math.random() * 60) - 15,
      favorite_category: categories[Math.floor(Math.random() * categories.length)],
      total_sessions: Math.floor(completed_challenges * 0.7),
      join_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      recent_badges: Array.from({ length: Math.min(3, badges_count) }, (_, idx) => ({
        id: `badge-${i}-${idx}`,
        name: ['Primeira Semana', 'Guerreira', 'Inspiradora', 'Constante', 'Sábia'][Math.floor(Math.random() * 5)],
        icon: ['🌟', '⚔️', '✨', '🔥', '🦉'][Math.floor(Math.random() * 5)],
        earned_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      })),
      zone,
      isPrizeWinner: i < 3,
      prizePosition: i < 3 ? ((i + 1) as 1 | 2 | 3) : undefined,
      prizeAmount: i === 0 ? 500 : i === 1 ? 300 : i === 2 ? 100 : undefined,
      prizeStatus: 'pending',
      hasWonBefore: Math.random() > 0.6,
      totalPrizesWon: Math.floor(Math.random() * 4),
      totalEarned: Math.floor(Math.random() * 3000)
    }

    users.push(user)
  }

  // Ordenar por pontos
  return users.sort((a, b) => b.points - a.points).map((user, index) => ({
    ...user,
    position: index + 1,
    previousPosition: user.previousPosition > index + 1 ? user.previousPosition : index + 1,
    positionChange: user.previousPosition > index + 1 ? 'up' :
                    user.previousPosition < index + 1 ? 'down' : 'same'
  }))
}

// ============================================================================
// LÓGICA DE DESEMPATE (CRÍTICA!)
// ============================================================================

/**
 * Calcula ranking com desempate baseado em firstChallengeTime
 * Regra: Quem completar os 4 PRIMEIROS desafios primeiro VENCE
 */
export function calculateRankingPosition(users: RankingUser[]): RankingUser[] {
  // 1. Ordenar por PONTOS (maior primeiro)
  const sorted = [...users].sort((a, b) => b.points - a.points)

  // 2. Agrupar por pontos iguais
  const pointsGroups: { [key: number]: RankingUser[] } = {}
  sorted.forEach(user => {
    if (!pointsGroups[user.points]) pointsGroups[user.points] = []
    pointsGroups[user.points].push(user)
  })

  // 3. Ordenar cada grupo por firstChallengeTime (quem completou 4 primeiros antes)
  Object.keys(pointsGroups).forEach(points => {
    pointsGroups[parseInt(points)].sort((a, b) => {
      if (a.firstChallengeTime && b.firstChallengeTime) {
        return new Date(a.firstChallengeTime).getTime() -
               new Date(b.firstChallengeTime).getTime()
      }
      return 0
    })
  })

  // 4. Reconstruir ranking com posições corretas
  const finalRanking: RankingUser[] = []
  let position = 1

  Object.keys(pointsGroups).forEach(points => {
    pointsGroups[parseInt(points)].forEach(user => {
      user.position = position
      finalRanking.push(user)
      position++
    })
  })

  return finalRanking
}

// ============================================================================
// MOCK HISTÓRICO DE VENCEDORAS
// ============================================================================

export function generateMockMonthlyWinners(): MonthlyWinner[] {
  const winners: MonthlyWinner[] = []
  const now = new Date()

  // Últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const month = (now.getMonth() - i + 12) % 12 + 1
    const year = now.getFullYear() - (now.getMonth() - i < 0 ? 1 : 0)

    const top3Indices = [
      Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 20)
    ].sort()

    winners.push({
      id: `winner-${year}-${month}`,
      month,
      year,
      firstPlaceUserId: `user-${top3Indices[0] + 1}`,
      firstPlacePoints: 4500 + Math.random() * 1000,
      secondPlaceUserId: `user-${top3Indices[1] + 1}`,
      secondPlacePoints: 4000 + Math.random() * 800,
      thirdPlaceUserId: `user-${top3Indices[2] + 1}`,
      thirdPlacePoints: 3500 + Math.random() * 800,
      createdAt: new Date(year, month - 1, 28).toISOString(),
      finalizedAt: new Date(year, month - 1, 28, 23, 59).toISOString()
    })
  }

  return winners
}

// ============================================================================
// CONFIGURAÇÃO PADRÃO DE PRÊMIOS
// ============================================================================

export const defaultRankingConfig: RankingConfig = {
  first_place_prize: 500,
  second_place_prize: 300,
  third_place_prize: 100,
  auto_reset_enabled: false,
  reset_day: 28,
  reset_time: '23:59',
  notification_enabled: true
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDaysLeftInMonth(): number {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.getDate() - now.getDate()
}

export function getMonthStartDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export function getMonthEndDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function getZoneColor(zone: 'prize' | 'attention' | 'neutral'): string {
  switch (zone) {
    case 'prize':
      return 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
    case 'attention':
      return 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300'
    case 'neutral':
      return 'bg-white border-gray-200'
  }
}

export function getPrizeAmount(position: number, config: RankingConfig = defaultRankingConfig): number {
  switch (position) {
    case 1:
      return config.first_place_prize
    case 2:
      return config.second_place_prize
    case 3:
      return config.third_place_prize
    default:
      return 0
  }
}

export function getPrizeMedal(position: number): string {
  switch (position) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return ''
  }
}
