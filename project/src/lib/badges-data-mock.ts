import { FC } from 'react'
import { OrganizationInitiate3D, OrganizationPractitioner3D, OrganizationMaster3D, OrganizationSuprema3D } from '../components/icons/medals/OrganizationMedals3D'
import { CommunicationInitiate3D, CommunicationPractitioner3D, CommunicationMaster3D, CommunicationSuprema3D } from '../components/icons/medals/CommunicationMedals3D'
import { EmotionalInitiate3D, EmotionalPractitioner3D, EmotionalMaster3D, EmotionalSuprema3D } from '../components/icons/medals/EmotionalMedals3D'
import { LeadershipInitiate3D, LeadershipPractitioner3D, LeadershipMaster3D, LeadershipSuprema3D } from '../components/icons/medals/LeadershipMedals3D'
import { InnovationInitiate3D, InnovationPractitioner3D, InnovationMaster3D, InnovationSuprema3D } from '../components/icons/medals/InnovationMedals3D'
import { RoutineInitiate3D, RoutinePractitioner3D, RoutineMaster3D, RoutineSuprema3D } from '../components/icons/medals/RoutineMedals3D'
import { HealthInitiate3D, HealthPractitioner3D, HealthMaster3D, HealthSuprema3D } from '../components/icons/medals/HealthMedals3D'
import { GlobalEgg3D, GlobalCaterpillar3D, GlobalChrysalis3D, GlobalButterflyEmerging3D, GlobalButterflyRadiant3D } from '../components/icons/medals/GlobalMedals3D'
import { Level0Icon3D, Level1Icon3D, Level2Icon3D, Level3Icon3D, Level4Icon3D, Level5Icon3D, Level6Icon3D, Level7Icon3D, Level8Icon3D, Level9Icon3D } from '../components/icons/medals/LevelIcons3D'

export interface Badge {
  id: string
  name: string
  description: string
  icon: FC
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  category: string
  requirement: number
  points: number
  color: string
}

export interface Level {
  level: number
  pointsRequired: number
  name: string
  icon: FC
  color: string
  description: string
  bonusPoints?: number // Bonus points awarded when reaching this level
}

export const LEVELS: Level[] = [
  { level: 0, pointsRequired: 0, name: "Iniciante", icon: Level0Icon3D, color: "#D1D5DB", description: "Você acaba de começar sua jornada!", bonusPoints: 0 },
  { level: 1, pointsRequired: 2203, name: "Aprendiz", icon: Level1Icon3D, color: "#60A5FA", description: "Primeiros passos dados!", bonusPoints: 50 },
  { level: 2, pointsRequired: 4406, name: "Praticante", icon: Level2Icon3D, color: "#06B6D4", description: "Você está no caminho certo!", bonusPoints: 75 },
  { level: 3, pointsRequired: 6609, name: "Especialista", icon: Level3Icon3D, color: "#FBBF24", description: "Você domina a prática!", bonusPoints: 100 },
  { level: 4, pointsRequired: 8812, name: "Mestre", icon: Level4Icon3D, color: "#FB923C", description: "Você é um verdadeiro mestre!", bonusPoints: 150 },
  { level: 5, pointsRequired: 11015, name: "Sábio", icon: Level5Icon3D, color: "#A78BFA", description: "A sabedoria guia seus passos!", bonusPoints: 200 },
  { level: 6, pointsRequired: 13218, name: "Lenda", icon: Level6Icon3D, color: "#F87171", description: "Você é uma lenda viva!", bonusPoints: 250 },
  { level: 7, pointsRequired: 15421, name: "Imortal", icon: Level7Icon3D, color: "#EC4899", description: "Imortal na memória!", bonusPoints: 300 },
  { level: 8, pointsRequired: 17624, name: "Divino", icon: Level8Icon3D, color: "#6366F1", description: "Você é quase um deus!", bonusPoints: 350 },
  { level: 9, pointsRequired: 22035, name: "Supremo", icon: Level9Icon3D, color: "#EC4899", description: "O pico máximo da excelência!", bonusPoints: 500 }
]

export const BADGES: Badge[] = [
  // ROTINA & ORGANIZAÇÃO
  { id: 'org_iniciante', name: 'Iniciante', description: '1º desafio de rotina & organização', icon: OrganizationInitiate3D, rarity: 'common', category: 'Rotina & Organização', requirement: 1, points: 25, color: '#3B82F6' },
  { id: 'org_praticante', name: 'Praticante', description: '30 desafios de rotina & organização', icon: OrganizationPractitioner3D, rarity: 'uncommon', category: 'Rotina & Organização', requirement: 30, points: 100, color: '#3B82F6' },
  { id: 'org_mestre', name: 'Mestre', description: '90 desafios de rotina & organização', icon: OrganizationMaster3D, rarity: 'epic', category: 'Rotina & Organização', requirement: 90, points: 300, color: '#3B82F6' },
  { id: 'org_suprema', name: 'Suprema', description: '120 desafios de rotina & organização', icon: OrganizationSuprema3D, rarity: 'legendary', category: 'Rotina & Organização', requirement: 120, points: 500, color: '#3B82F6' },

  // RELACIONAMENTOS & COMUNICAÇÃO
  { id: 'com_iniciante', name: 'Iniciante', description: '1º desafio de relacionamentos & comunicação', icon: CommunicationInitiate3D, rarity: 'common', category: 'Relacionamentos & Comunicação', requirement: 1, points: 25, color: '#EF4444' },
  { id: 'com_praticante', name: 'Praticante', description: '30 desafios de relacionamentos & comunicação', icon: CommunicationPractitioner3D, rarity: 'uncommon', category: 'Relacionamentos & Comunicação', requirement: 30, points: 100, color: '#EF4444' },
  { id: 'com_mestre', name: 'Mestre', description: '90 desafios de relacionamentos & comunicação', icon: CommunicationMaster3D, rarity: 'epic', category: 'Relacionamentos & Comunicação', requirement: 90, points: 300, color: '#EF4444' },
  { id: 'com_suprema', name: 'Suprema', description: '120 desafios de relacionamentos & comunicação', icon: CommunicationSuprema3D, rarity: 'legendary', category: 'Relacionamentos & Comunicação', requirement: 120, points: 500, color: '#EF4444' },

  // MINDFULNESS & EMOÇÕES
  { id: 'ie_iniciante', name: 'Iniciante', description: '1º desafio de mindfulness & emoções', icon: EmotionalInitiate3D, rarity: 'common', category: 'Mindfulness & Emoções', requirement: 1, points: 25, color: '#10B981' },
  { id: 'ie_praticante', name: 'Praticante', description: '30 desafios de mindfulness & emoções', icon: EmotionalPractitioner3D, rarity: 'uncommon', category: 'Mindfulness & Emoções', requirement: 30, points: 100, color: '#10B981' },
  { id: 'ie_mestre', name: 'Mestre', description: '90 desafios de mindfulness & emoções', icon: EmotionalMaster3D, rarity: 'epic', category: 'Mindfulness & Emoções', requirement: 90, points: 300, color: '#10B981' },
  { id: 'ie_suprema', name: 'Suprema', description: '120 desafios de mindfulness & emoções', icon: EmotionalSuprema3D, rarity: 'legendary', category: 'Mindfulness & Emoções', requirement: 120, points: 500, color: '#10B981' },

  // CARREIRA E DESENVOLVIMENTO PROFISSIONAL
  { id: 'lead_iniciante', name: 'Iniciante', description: '1º desafio de carreira & desenvolvimento profissional', icon: LeadershipInitiate3D, rarity: 'common', category: 'Carreira e Desenvolvimento Profissional', requirement: 1, points: 25, color: '#FBBF24' },
  { id: 'lead_praticante', name: 'Praticante', description: '30 desafios de carreira & desenvolvimento profissional', icon: LeadershipPractitioner3D, rarity: 'uncommon', category: 'Carreira e Desenvolvimento Profissional', requirement: 30, points: 100, color: '#FBBF24' },
  { id: 'lead_mestre', name: 'Mestre', description: '90 desafios de carreira & desenvolvimento profissional', icon: LeadershipMaster3D, rarity: 'epic', category: 'Carreira e Desenvolvimento Profissional', requirement: 90, points: 300, color: '#FBBF24' },
  { id: 'lead_suprema', name: 'Suprema', description: '120 desafios de carreira & desenvolvimento profissional', icon: LeadershipSuprema3D, rarity: 'legendary', category: 'Carreira e Desenvolvimento Profissional', requirement: 120, points: 500, color: '#FBBF24' },

  // DIGITAL DETOX
  { id: 'inov_iniciante', name: 'Iniciante', description: '1º desafio de digital detox', icon: InnovationInitiate3D, rarity: 'common', category: 'Digital Detox', requirement: 1, points: 25, color: '#A78BFA' },
  { id: 'inov_praticante', name: 'Praticante', description: '30 desafios de digital detox', icon: InnovationPractitioner3D, rarity: 'uncommon', category: 'Digital Detox', requirement: 30, points: 100, color: '#A78BFA' },
  { id: 'inov_mestre', name: 'Mestre', description: '90 desafios de digital detox', icon: InnovationMaster3D, rarity: 'epic', category: 'Digital Detox', requirement: 90, points: 300, color: '#A78BFA' },
  { id: 'inov_suprema', name: 'Suprema', description: '120 desafios de digital detox', icon: InnovationSuprema3D, rarity: 'legendary', category: 'Digital Detox', requirement: 120, points: 500, color: '#A78BFA' },

  // AUTOESTIMA & AUTOCUIDADO
  { id: 'rot_iniciante', name: 'Iniciante', description: '1º desafio de autoestima & autocuidado', icon: RoutineInitiate3D, rarity: 'common', category: 'Autoestima & Autocuidado', requirement: 1, points: 25, color: '#F97316' },
  { id: 'rot_praticante', name: 'Praticante', description: '30 desafios de autoestima & autocuidado', icon: RoutinePractitioner3D, rarity: 'uncommon', category: 'Autoestima & Autocuidado', requirement: 30, points: 100, color: '#F97316' },
  { id: 'rot_mestre', name: 'Mestre', description: '90 desafios de autoestima & autocuidado', icon: RoutineMaster3D, rarity: 'epic', category: 'Autoestima & Autocuidado', requirement: 90, points: 300, color: '#F97316' },
  { id: 'rot_suprema', name: 'Suprema', description: '120 desafios de autoestima & autocuidado', icon: RoutineSuprema3D, rarity: 'legendary', category: 'Autoestima & Autocuidado', requirement: 120, points: 500, color: '#F97316' },

  // CORPO & SAÚDE
  { id: 'saude_iniciante', name: 'Iniciante', description: '1º desafio de corpo & saúde', icon: HealthInitiate3D, rarity: 'common', category: 'Corpo & Saúde', requirement: 1, points: 25, color: '#EC4899' },
  { id: 'saude_praticante', name: 'Praticante', description: '30 desafios de corpo & saúde', icon: HealthPractitioner3D, rarity: 'uncommon', category: 'Corpo & Saúde', requirement: 30, points: 100, color: '#EC4899' },
  { id: 'saude_mestre', name: 'Mestre', description: '90 desafios de corpo & saúde', icon: HealthMaster3D, rarity: 'epic', category: 'Corpo & Saúde', requirement: 90, points: 300, color: '#EC4899' },
  { id: 'saude_suprema', name: 'Suprema', description: '120 desafios de corpo & saúde', icon: HealthSuprema3D, rarity: 'legendary', category: 'Corpo & Saúde', requirement: 120, points: 500, color: '#EC4899' },

  // GLOBAIS - BORBOLETA 🦋 (Metamorfose Transformacional)
  { id: 'global_ovo', name: 'Ovo', description: '1º desafio qualquer', icon: GlobalEgg3D, rarity: 'common', category: 'Global', requirement: 1, points: 10, color: '#D6E9FF' },
  { id: 'global_lagarta', name: 'Lagarta', description: '20 desafios no total', icon: GlobalCaterpillar3D, rarity: 'common', category: 'Global', requirement: 20, points: 50, color: '#BBF7D0' },
  { id: 'global_crisalida', name: 'Crisálida', description: '50 desafios no total', icon: GlobalChrysalis3D, rarity: 'uncommon', category: 'Global', requirement: 50, points: 100, color: '#FCD34D' },
  { id: 'global_borboleta_emergente', name: 'Borboleta Emergente', description: '100 desafios no total', icon: GlobalButterflyEmerging3D, rarity: 'rare', category: 'Global', requirement: 100, points: 200, color: '#EC4899' },
  { id: 'global_borboleta_radiante', name: 'Borboleta Radiante', description: '840 desafios no total', icon: GlobalButterflyRadiant3D, rarity: 'legendary', category: 'Global', requirement: 840, points: 500, color: '#FFD700' }
]

export const getRarityColor = (rarity: string): string => {
  const rarityMap = {
    'common': 'text-gray-400',
    'uncommon': 'text-green-400',
    'rare': 'text-blue-400',
    'epic': 'text-purple-400',
    'legendary': 'text-orange-400'
  };
  return rarityMap[rarity as keyof typeof rarityMap] || 'text-gray-400'
}

export const getRarityBg = (rarity: string): string => {
  const rarityMap = {
    'common': 'bg-gray-100',
    'uncommon': 'bg-green-100',
    'rare': 'bg-blue-100',
    'epic': 'bg-purple-100',
    'legendary': 'bg-orange-100'
  };
  return rarityMap[rarity as keyof typeof rarityMap] || 'bg-gray-100'
}

export const getBadgesByCategory = (category: string): Badge[] => {
  return BADGES.filter(badge => badge.category === category)
}

export const getAllCategories = (): string[] => {
  return [...new Set(BADGES.filter(b => b.category !== 'Global').map(b => b.category))]
}

// Maps badge_id text key → 3D React icon component (for enriching Supabase data)
export const BADGE_ICON_MAP: Record<string, FC> = {
  org_iniciante:   OrganizationInitiate3D,
  org_praticante:  OrganizationPractitioner3D,
  org_mestre:      OrganizationMaster3D,
  org_suprema:     OrganizationSuprema3D,
  com_iniciante:   CommunicationInitiate3D,
  com_praticante:  CommunicationPractitioner3D,
  com_mestre:      CommunicationMaster3D,
  com_suprema:     CommunicationSuprema3D,
  ie_iniciante:    EmotionalInitiate3D,
  ie_praticante:   EmotionalPractitioner3D,
  ie_mestre:       EmotionalMaster3D,
  ie_suprema:      EmotionalSuprema3D,
  lead_iniciante:  LeadershipInitiate3D,
  lead_praticante: LeadershipPractitioner3D,
  lead_mestre:     LeadershipMaster3D,
  lead_suprema:    LeadershipSuprema3D,
  inov_iniciante:  InnovationInitiate3D,
  inov_praticante: InnovationPractitioner3D,
  inov_mestre:     InnovationMaster3D,
  inov_suprema:    InnovationSuprema3D,
  rot_iniciante:   RoutineInitiate3D,
  rot_praticante:  RoutinePractitioner3D,
  rot_mestre:      RoutineMaster3D,
  rot_suprema:     RoutineSuprema3D,
  saude_iniciante:  HealthInitiate3D,
  saude_praticante: HealthPractitioner3D,
  saude_mestre:     HealthMaster3D,
  saude_suprema:    HealthSuprema3D,
  global_ovo:                 GlobalEgg3D,
  global_lagarta:             GlobalCaterpillar3D,
  global_crisalida:           GlobalChrysalis3D,
  global_borboleta_emergente: GlobalButterflyEmerging3D,
  global_borboleta_radiante:  GlobalButterflyRadiant3D,
}

// Maps level number → 3D React icon component (for enriching Supabase data)
export const LEVEL_ICON_MAP: Record<number, FC> = {
  0: Level0Icon3D,
  1: Level1Icon3D,
  2: Level2Icon3D,
  3: Level3Icon3D,
  4: Level4Icon3D,
  5: Level5Icon3D,
  6: Level6Icon3D,
  7: Level7Icon3D,
  8: Level8Icon3D,
  9: Level9Icon3D,
}
