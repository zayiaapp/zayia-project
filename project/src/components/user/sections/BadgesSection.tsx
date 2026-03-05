import { useState, useEffect } from 'react'
import { FC } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient, BADGE_ICON_MAP, LEVEL_ICON_MAP } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import { Gift, Sparkles } from 'lucide-react'
// Icon maps agora importados de supabase-client
import { MedalCarousel } from './badges/MedalCarousel'
import { MedalDetailModal } from '../modals/MedalDetailModal'

interface Medal {
  id: string
  name: string
  icon: string | FC
  description?: string
  requirement?: number
  points?: number
  rarity?: string
  unlockDate?: string
  isEarned: boolean
  levelNumber?: number
}

// Category grouping by badge_id prefix
const CATEGORY_PREFIXES: { key: string; prefix: string; name: string; icon: string }[] = [
  { key: 'org',   prefix: 'org_',   name: 'Rotina & Organização',                    icon: '📚' },
  { key: 'saude', prefix: 'saude_', name: 'Corpo & Saúde',                           icon: '💪' },
  { key: 'ie',    prefix: 'ie_',    name: 'Mindfulness & Emoções',                   icon: '🧘' },
  { key: 'com',   prefix: 'com_',   name: 'Relacionamentos & Comunicação',           icon: '💬' },
  { key: 'rot',   prefix: 'rot_',   name: 'Autoestima & Autocuidado',                icon: '💎' },
  { key: 'lead',  prefix: 'lead_',  name: 'Carreira e Desenvolvimento Profissional', icon: '💼' },
  { key: 'inov',  prefix: 'inov_',  name: 'Digital Detox',                           icon: '📱' },
]

export function BadgesSection() {
  const { profile } = useAuth()
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([])
  const [allBadges, setAllBadges] = useState<any[]>([])
  const [allLevels, setAllLevels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Filters
  const [rarityFilter, setRarityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'locked'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name')

  const currentPoints = profile?.points || 0

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

  // Load badges + levels from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [badges, levels] = await Promise.all([
          supabaseClient.getAllBadges(),
          supabaseClient.getAllLevels(),
        ])
        setAllBadges(badges)
        setAllLevels(levels)
      } catch (error) {
        console.error('Error loading badges/levels:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Load earned badge IDs from Supabase
  useEffect(() => {
    if (!profile?.id) return
    supabaseClient.getUserEarnedMedals(profile.id).then(setEarnedBadgeIds)
  }, [profile?.id])

  // Real-time listener for earned badges changes
  useEffect(() => {
    if (!profile?.id) return
    const subscription = supabase
      .channel(`badges-changes-${profile.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_earned_badges',
        filter: `user_id=eq.${profile.id}`,
      }, () => {
        supabaseClient.getUserEarnedMedals(profile.id).then(setEarnedBadgeIds)
      })
      .subscribe()
    return () => { subscription.unsubscribe() }
  }, [profile?.id])

  // Listener: refresh earned badges when medals/points update
  useEffect(() => {
    if (!profile?.id) return
    const handler = () => {
      supabaseClient.getUserEarnedMedals(profile.id).then(setEarnedBadgeIds)
    }
    window.addEventListener('medalsUpdated', handler)
    window.addEventListener('pointsUpdated', handler)
    return () => {
      window.removeEventListener('medalsUpdated', handler)
      window.removeEventListener('pointsUpdated', handler)
    }
  }, [profile?.id])

  // Enrich a Supabase badge row with 3D icon
  const enrichBadge = (b: any): Medal => ({
    id: b.badge_id,
    name: b.name,
    icon: BADGE_ICON_MAP[b.badge_id] || '🏅',
    description: b.description,
    requirement: b.requirement,
    points: b.points,
    rarity: b.rarity,
    isEarned: earnedBadgeIds.includes(b.badge_id),
  })

  // Enrich a Supabase level row with 3D icon
  const enrichLevel = (l: any): Medal => ({
    id: `level-${l.level_number}`,
    name: l.name,
    icon: LEVEL_ICON_MAP[l.level_number] || '⭐',
    requirement: l.level_number,
    points: l.points_required,
    levelNumber: l.level_number,
    isEarned: currentPoints >= l.points_required,
  })

  const handleMedalClick = (medal: Medal) => {
    setSelectedMedal({
      ...medal,
      unlockDate: medal.isEarned ? new Date().toLocaleDateString('pt-BR') : undefined,
    })
    setShowDetailModal(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zayia-purple" />
          <p className="text-zayia-violet-gray mt-4">Carregando medalhas...</p>
        </div>
      </div>
    )
  }

  const levelMedals = allLevels.map(enrichLevel)
  const globalMedals = allBadges.filter(b => b.badge_id?.startsWith('global_')).map(enrichBadge)

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
        medals={levelMedals}
        categoryName="Todos os Níveis"
        categoryIcon="👑"
        onMedalClick={handleMedalClick}
      />

      {/* ===== MEDALHAS POR CATEGORIA (7 × 4 = 28) ===== */}
      <div>
        <h2 className="text-xl font-bold text-zayia-deep-violet mb-6">
          🎨 Medalhas por Categoria
        </h2>
        {CATEGORY_PREFIXES.map(({ key, prefix, name, icon }) => {
          const badges = allBadges
            .filter(b => b.badge_id?.startsWith(prefix))
            .map(enrichBadge)
          return (
            <MedalCarousel
              key={key}
              medals={badges}
              categoryName={name}
              categoryIcon={icon}
              onMedalClick={handleMedalClick}
            />
          )
        })}
      </div>

      {/* ===== MEDALHAS GLOBAIS (5) ===== */}
      <MedalCarousel
        medals={globalMedals}
        categoryName="Medalhas Especiais"
        categoryIcon="🦋"
        onMedalClick={handleMedalClick}
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
