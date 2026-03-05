import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import { Gift, Sparkles, Lock } from 'lucide-react'
import { getEarnedBadges } from '../../../lib/badges-storage'
import { BADGES, LEVELS } from '../../../lib/badges-data-mock'
import { MedalCarousel } from './badges/MedalCarousel'
import { MedalDetailModal } from '../modals/MedalDetailModal'

interface Medal {
  id: string
  name: string
  icon: string
  description?: string
  requirement?: number
  points?: number
  rarity?: 'comum' | 'incomum' | 'raro' | 'épico' | 'lendária'
  unlockDate?: string
  isEarned: boolean
}

// Same grouping as AwardsSection admin — uses badge id prefix
const medalsByCategory = {
  org:   BADGES.filter(b => b.id.startsWith('org_')),
  saude: BADGES.filter(b => b.id.startsWith('saude_')),
  ie:    BADGES.filter(b => b.id.startsWith('ie_')),
  com:   BADGES.filter(b => b.id.startsWith('com_')),
  rot:   BADGES.filter(b => b.id.startsWith('rot_')),
  lead:  BADGES.filter(b => b.id.startsWith('lead_')),
  inov:  BADGES.filter(b => b.id.startsWith('inov_')),
}

const globalMedals = BADGES.filter(b => b.category === 'Global')

const categories = [
  { key: 'org',   name: 'Rotina & Organização',                    icon: '📚', badges: medalsByCategory.org   },
  { key: 'saude', name: 'Corpo & Saúde',                           icon: '💪', badges: medalsByCategory.saude },
  { key: 'ie',    name: 'Mindfulness & Emoções',                   icon: '🧘', badges: medalsByCategory.ie    },
  { key: 'com',   name: 'Relacionamentos & Comunicação',           icon: '💬', badges: medalsByCategory.com   },
  { key: 'rot',   name: 'Autoestima & Autocuidado',                icon: '💎', badges: medalsByCategory.rot   },
  { key: 'lead',  name: 'Carreira e Desenvolvimento Profissional', icon: '💼', badges: medalsByCategory.lead  },
  { key: 'inov',  name: 'Digital Detox',                           icon: '📱', badges: medalsByCategory.inov  },
]

export function BadgesSection() {
  const { profile } = useAuth()
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([])
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Filters
  const [rarityFilter, setRarityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'locked'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name')

  const currentPoints = profile?.points || 0

  // Load earned badge IDs from localStorage (synced from Supabase via medals-unlock)
  useEffect(() => {
    setEarnedBadgeIds(getEarnedBadges())
  }, [profile?.points])

  // Listener: update when medals change locally
  useEffect(() => {
    const handler = () => setEarnedBadgeIds(getEarnedBadges())
    window.addEventListener('medalsUpdated', handler)
    return () => window.removeEventListener('medalsUpdated', handler)
  }, [])

  // Sync earned medals from Supabase + real-time listener
  useEffect(() => {
    if (!profile?.id) return
    let subscription: any = null

    const initSync = async () => {
      try {
        await supabaseClient.getUserEarnedMedals(profile.id)
      } catch (error) {
        console.error('Error syncing badges from Supabase:', error)
      }

      subscription = supabase
        .channel(`badges-changes-${profile.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_earned_badges',
          filter: `user_id=eq.${profile.id}`,
        }, () => {
          setEarnedBadgeIds(getEarnedBadges())
        })
        .subscribe()
    }

    initSync()
    return () => { if (subscription) subscription.unsubscribe() }
  }, [profile?.id])

  // Listener: update points display
  useEffect(() => {
    const handler = () => setEarnedBadgeIds(getEarnedBadges())
    window.addEventListener('pointsUpdated', handler)
    return () => window.removeEventListener('pointsUpdated', handler)
  }, [])

  // Load filters from localStorage on mount
  useEffect(() => {
    setRarityFilter(localStorage.getItem('medals-filter-rarity') || 'all')
    setStatusFilter((localStorage.getItem('medals-filter-status') || 'all') as 'all' | 'earned' | 'locked')
    setSortBy((localStorage.getItem('medals-sort-by') || 'name') as 'name' | 'date')
  }, [])

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('medals-filter-rarity', rarityFilter)
    localStorage.setItem('medals-filter-status', statusFilter)
    localStorage.setItem('medals-sort-by', sortBy)
  }, [rarityFilter, statusFilter, sortBy])

  const handleMedalClick = (badge: any, earned: boolean) => {
    setSelectedMedal({
      id: badge.id,
      name: badge.name,
      icon: badge.icon,
      description: badge.description,
      requirement: badge.requirement,
      points: badge.points,
      rarity: badge.rarity,
      isEarned: earned,
      unlockDate: earned ? new Date().toLocaleDateString('pt-BR') : undefined,
    })
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      <MedalDetailModal
        isOpen={showDetailModal}
        medal={selectedMedal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Medalhas & Níveis 🏆
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Suas conquistas e progresso na jornada ZAYIA
        </p>
      </div>

      {/* Filters */}
      <div className="zayia-card p-4 bg-zayia-lilac/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">Raridade</label>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple"
            >
              <option value="all">Todas</option>
              <option value="common">Comum</option>
              <option value="uncommon">Incomum</option>
              <option value="rare">Raro</option>
              <option value="epic">Épico</option>
              <option value="legendary">Lendária</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'earned' | 'locked')}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple"
            >
              <option value="all">Todas</option>
              <option value="earned">Desbloqueadas</option>
              <option value="locked">Bloqueadas</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">Ordenar</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="date">Data Desbloqueio</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setRarityFilter('all'); setStatusFilter('all'); setSortBy('name') }}
              className="w-full px-3 py-2 bg-zayia-soft-purple/20 hover:bg-zayia-soft-purple/30 text-zayia-purple font-semibold rounded-lg transition text-sm"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Pontos Totais */}
      <div className="zayia-card p-6 text-center bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <Gift className="w-12 h-12 text-zayia-orchid mx-auto mb-3" />
        <div className="text-3xl font-bold zayia-gradient-text mb-2">
          {currentPoints.toLocaleString()}
        </div>
        <div className="text-sm text-zayia-violet-gray">Pontos Totais Acumulados</div>
      </div>

      {/* ===== CARROSSEL: NÍVEIS (10) ===== */}
      <MedalCarousel
        medals={LEVELS.map(level => ({
          id: `level-${level.level}`,
          name: level.name,
          icon: level.icon,
          requirement: level.level,
          points: level.pointsRequired,
          levelNumber: level.level,
          isEarned: currentPoints >= level.pointsRequired,
        }))}
        categoryName="Todos os Níveis"
        categoryIcon="👑"
        onMedalClick={(medal) => handleMedalClick(medal, medal.isEarned)}
      />

      {/* ===== MEDALHAS POR CATEGORIA (7 × 4 = 28) ===== */}
      <div>
        <h2 className="text-xl font-bold text-zayia-deep-violet mb-6">
          🎨 Medalhas por Categoria
        </h2>
        {categories.map(({ key, name, icon, badges }) => (
          <MedalCarousel
            key={key}
            medals={badges.map(medal => ({
              id: medal.id,
              name: medal.name,
              icon: medal.icon,
              requirement: medal.requirement,
              points: medal.points,
              isEarned: earnedBadgeIds.includes(medal.id),
            }))}
            categoryName={name}
            categoryIcon={icon}
            onMedalClick={(medal) => {
              const badge = badges.find(b => b.id === medal.id)
              if (badge) handleMedalClick(badge, earnedBadgeIds.includes(medal.id))
            }}
          />
        ))}
      </div>

      {/* ===== MEDALHAS GLOBAIS (5) ===== */}
      <MedalCarousel
        medals={globalMedals.map(medal => ({
          id: medal.id,
          name: medal.name,
          icon: medal.icon,
          requirement: medal.requirement,
          points: medal.points,
          isEarned: earnedBadgeIds.includes(medal.id),
        }))}
        categoryName="Medalhas Especiais"
        categoryIcon="🦋"
        onMedalClick={(medal) => {
          const badge = globalMedals.find(b => b.id === medal.id)
          if (badge) handleMedalClick(badge, earnedBadgeIds.includes(medal.id))
        }}
      />

      {/* Motivação */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-cream to-zayia-lilac/20">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-zayia-orchid mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">
            Continue Brilhando! ✨
          </h3>
          <p className="text-sm text-zayia-deep-violet">
            Cada medalha conquistada é uma prova da sua força e determinação.
            Você está no caminho certo!
          </p>
        </div>
      </div>
    </div>
  )
}
