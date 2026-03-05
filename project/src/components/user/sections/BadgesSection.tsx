import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import { Gift, Sparkles } from 'lucide-react'
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

// Maps DB category values to display labels + icons
const CATEGORY_DISPLAY: Record<string, { name: string; icon: string }> = {
  autoestima: { name: 'Autoestima & Autocuidado', icon: '💎' },
  rotina: { name: 'Rotina & Organização', icon: '📚' },
  corpo_saude: { name: 'Corpo & Saúde', icon: '💪' },
  mindfulness: { name: 'Mindfulness & Emoções', icon: '🧘' },
  relacionamentos: { name: 'Relacionamentos & Comunicação', icon: '💬' },
  carreira: { name: 'Carreira & Desenvolvimento', icon: '💼' },
  digital_detox: { name: 'Digital Detox', icon: '📱' },
  compliance: { name: 'Compliance', icon: '✅' },
  lideranca: { name: 'Liderança', icon: '👑' },
  inovacao: { name: 'Inovação', icon: '🚀' },
  Global: { name: 'Medalhas Especiais', icon: '🦋' },
}

export function BadgesSection() {
  const { profile } = useAuth()
  const [badges, setBadges] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set())
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isLoadingBadges, setIsLoadingBadges] = useState(true)

  const [rarityFilter, setRarityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'locked'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name')

  const currentPoints = profile?.points || 0

  // Load badges, levels, and earned badge IDs from Supabase
  useEffect(() => {
    if (!profile?.id) return

    const loadData = async () => {
      try {
        setIsLoadingBadges(true)
        const [badgesData, levelsData, earnedData] = await Promise.all([
          supabaseClient.getAllBadges(),
          supabaseClient.getAllLevels(),
          supabaseClient.getUserEarnedMedals(profile.id)
        ])
        setBadges(badgesData)
        setLevels(levelsData)
        // earnedData is an array of { badge_id } or { id } records
        const ids = new Set<string>(earnedData.map((e: any) => e.badge_id || e.id))
        setEarnedBadgeIds(ids)
      } catch (error) {
        console.error('❌ Error loading badges:', error)
        setBadges([])
        setLevels([])
      } finally {
        setIsLoadingBadges(false)
      }
    }

    loadData()
  }, [profile?.id])

  // Real-time listener: update earned badges when new ones are unlocked
  useEffect(() => {
    if (!profile?.id) return

    const subscription = supabase
      .channel(`badges-earned-${profile.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_earned_badges', filter: `user_id=eq.${profile.id}` },
        (payload) => {
          const badgeId = payload.new?.badge_id
          if (badgeId) {
            setEarnedBadgeIds(prev => new Set([...prev, badgeId]))
          }
        }
      )
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [profile?.id])

  // Listen for medal unlock events from ChallengesSection
  useEffect(() => {
    const handler = async () => {
      if (!profile?.id) return
      try {
        const earnedData = await supabaseClient.getUserEarnedMedals(profile.id)
        const ids = new Set<string>(earnedData.map((e: any) => e.badge_id || e.id))
        setEarnedBadgeIds(ids)
      } catch { /* ignore */ }
    }
    window.addEventListener('medalsUpdated', handler)
    return () => window.removeEventListener('medalsUpdated', handler)
  }, [profile?.id])

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

  // Save filter preferences
  useEffect(() => {
    localStorage.setItem('medals-filter-rarity', rarityFilter)
    localStorage.setItem('medals-filter-status', statusFilter)
    localStorage.setItem('medals-sort-by', sortBy)
  }, [rarityFilter, statusFilter, sortBy])

  useEffect(() => {
    setRarityFilter(localStorage.getItem('medals-filter-rarity') || 'all')
    setStatusFilter((localStorage.getItem('medals-filter-status') || 'all') as 'all' | 'earned' | 'locked')
    setSortBy((localStorage.getItem('medals-sort-by') || 'name') as 'name' | 'date')
  }, [])

  // Group badges by category field from DB (not by ID prefix)
  const badgesByCategory = badges.reduce<Record<string, any[]>>((acc, badge) => {
    const cat = badge.category || 'Outros'
    if (cat === 'Global') return acc // handled separately
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(badge)
    return acc
  }, {})

  const globalMedals = badges.filter(b => b.category === 'Global')

  if (isLoadingBadges) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zayia-purple"></div>
          <p className="text-zayia-violet-gray mt-4">Carregando medalhas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MedalDetailModal isOpen={showDetailModal} medal={selectedMedal} onClose={() => setShowDetailModal(false)} />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">Medalhas & Níveis 🏆</h2>
        <p className="text-zayia-violet-gray text-sm px-4">Suas conquistas e progresso na jornada ZAYIA</p>
      </div>

      {/* Filters */}
      <div className="zayia-card p-4 bg-zayia-lilac/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">Raridade</label>
            <select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple">
              <option value="all">Todas</option>
              <option value="comum">Comum</option>
              <option value="incomum">Incomum</option>
              <option value="raro">Raro</option>
              <option value="épico">Épico</option>
              <option value="lendária">Lendária</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'earned' | 'locked')}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple">
              <option value="all">Todas</option>
              <option value="earned">Desbloqueadas</option>
              <option value="locked">Bloqueadas</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">Ordenar</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple">
              <option value="name">Nome (A-Z)</option>
              <option value="date">Data Desbloqueio</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setRarityFilter('all'); setStatusFilter('all'); setSortBy('name') }}
              className="w-full px-3 py-2 bg-zayia-soft-purple/20 hover:bg-zayia-soft-purple/30 text-zayia-purple font-semibold rounded-lg transition text-sm">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Total Points */}
      <div className="zayia-card p-6 text-center bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <Gift className="w-12 h-12 text-zayia-orchid mx-auto mb-3" />
        <div className="text-3xl font-bold zayia-gradient-text mb-2">{currentPoints.toLocaleString()}</div>
        <div className="text-sm text-zayia-violet-gray">Pontos Totais Acumulados</div>
      </div>

      {/* Levels carousel */}
      <MedalCarousel
        medals={levels.map(level => ({
          id: `level-${level.level_number}`,
          name: level.name,
          icon: level.icon,
          requirement: level.level_number,
          points: level.points_required,
          levelNumber: level.level_number,
          isEarned: currentPoints >= level.points_required,
        }))}
        categoryName="Todos os Níveis"
        categoryIcon="👑"
        onMedalClick={(medal) => handleMedalClick(medal, medal.isEarned)}
      />

      {/* Badges by category (dynamic from DB) */}
      {Object.keys(badgesByCategory).length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-zayia-deep-violet mb-6">🎨 Medalhas por Categoria</h2>
          {Object.entries(badgesByCategory).map(([cat, catBadges]) => {
            const display = CATEGORY_DISPLAY[cat] || { name: cat, icon: '🏅' }
            const sorted = [...catBadges].sort((a, b) => (a.requirement || 0) - (b.requirement || 0))
            return (
              <MedalCarousel
                key={cat}
                medals={sorted.map((badge: any) => ({
                  id: badge.id,
                  name: badge.name,
                  icon: badge.icon,
                  requirement: badge.requirement || 0,
                  points: badge.points || 50,
                  isEarned: earnedBadgeIds.has(badge.id),
                }))}
                categoryName={display.name}
                categoryIcon={display.icon}
                onMedalClick={(medal) => {
                  const badge = catBadges.find(b => b.id === medal.id)
                  if (badge) handleMedalClick(badge, earnedBadgeIds.has(medal.id))
                }}
              />
            )
          })}
        </div>
      )}

      {/* Global medals */}
      {globalMedals.length > 0 && (
        <MedalCarousel
          medals={globalMedals.map((medal: any) => ({
            id: medal.id,
            name: medal.name,
            icon: medal.icon,
            requirement: medal.requirement || 0,
            points: medal.points || 50,
            isEarned: earnedBadgeIds.has(medal.id),
          }))}
          categoryName="Medalhas Especiais"
          categoryIcon="🦋"
          onMedalClick={(medal) => {
            const badge = globalMedals.find(b => b.id === medal.id)
            if (badge) handleMedalClick(badge, earnedBadgeIds.has(medal.id))
          }}
        />
      )}

      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-cream to-zayia-lilac/20">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-zayia-orchid mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">Continue Brilhando! ✨</h3>
          <p className="text-sm text-zayia-deep-violet">
            Cada medalha conquistada é uma prova da sua força e determinação. Você está no caminho certo!
          </p>
        </div>
      </div>
    </div>
  )
}
