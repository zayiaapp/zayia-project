import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import { Gift, Sparkles, Lock } from 'lucide-react'
import { BADGES, LEVELS } from '../../../lib/badges-data-mock'
import { getEarnedBadges } from '../../../lib/badges-storage'
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

export function BadgesSection() {
  const { profile } = useAuth()
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([])
  const [currentPoints, setCurrentPoints] = useState(0)
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Filters
  const [rarityFilter, setRarityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'locked'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name')

  // Carregar dados ao montar
  useEffect(() => {
    const earned = getEarnedBadges()
    setEarnedBadgeIds(earned)
    setCurrentPoints(profile?.points || parseInt(localStorage.getItem('user_points') || '0', 10))
  }, [profile?.points])

  // ✅ Listener para atualizar quando medalhas mudam (local)
  useEffect(() => {
    const handleMedalsUpdated = () => {
      const earned = getEarnedBadges()
      setEarnedBadgeIds(earned)
    }
    window.addEventListener('medalsUpdated', handleMedalsUpdated)
    return () => window.removeEventListener('medalsUpdated', handleMedalsUpdated)
  }, [])

  // ✅ Sincronizar medalhas com Supabase em tempo real
  useEffect(() => {
    if (!profile?.id) return

    let subscription: any = null

    const initSync = async () => {
      try {
        const medals = await supabaseClient.getUserEarnedMedals(profile.id)
        if (medals.length > 0) {
          console.log('✅ Badges synced from Supabase:', medals)
        }
      } catch (error) {
        console.error('Error syncing badges from Supabase:', error)
      }

      // Setup real-time listener
      subscription = supabase
        .channel(`badges-changes-${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_earned_badges',
            filter: `user_id=eq.${profile.id}`
          },
          async () => {
            try {
              await supabaseClient.getUserEarnedMedals(profile.id)
              console.log('🔄 Badges real-time update triggered')
            } catch (error) {
              console.error('Error updating badges:', error)
            }
          }
        )
        .subscribe()
    }

    initSync()

    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [profile?.id])

  // ✅ Listener para atualizar quando pontos mudam
  useEffect(() => {
    const handlePointsUpdated = () => {
      setCurrentPoints(parseInt(localStorage.getItem('user_points') || '0', 10))
    }
    window.addEventListener('pointsUpdated', handlePointsUpdated)
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdated)
  }, [])

  // Handle medal click to show detail modal
  const handleMedalClick = (badge: any, earned: boolean) => {
    const medal: Medal = {
      id: badge.id,
      name: badge.name,
      icon: badge.icon,
      description: badge.description,
      requirement: badge.requirement,
      points: badge.points,
      rarity: badge.rarity,
      isEarned: earned,
      unlockDate: earned ? new Date().toLocaleDateString('pt-BR') : undefined,
    }
    setSelectedMedal(medal)
    setShowDetailModal(true)
  }

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('medals-filter-rarity', rarityFilter)
    localStorage.setItem('medals-filter-status', statusFilter)
    localStorage.setItem('medals-sort-by', sortBy)
  }, [rarityFilter, statusFilter, sortBy])

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedRarity = localStorage.getItem('medals-filter-rarity') || 'all'
    const savedStatus = (localStorage.getItem('medals-filter-status') || 'all') as 'all' | 'earned' | 'locked'
    const savedSort = (localStorage.getItem('medals-sort-by') || 'name') as 'name' | 'date'
    setRarityFilter(savedRarity)
    setStatusFilter(savedStatus)
    setSortBy(savedSort)
  }, [])

  // ✅ Agrupar medalhas por CATEGORIA REAL
  const medalsByCategory = {
    'org_iniciante': BADGES.filter(b => b.id?.includes('org_')),
    'saude': BADGES.filter(b => b.id?.includes('saude_')),
    'ie_': BADGES.filter(b => b.id?.includes('ie_')),
    'com_': BADGES.filter(b => b.id?.includes('com_')),
    'rot_': BADGES.filter(b => b.id?.includes('rot_')),
    'lead_': BADGES.filter(b => b.id?.includes('lead_')),
    'inov_': BADGES.filter(b => b.id?.includes('inov_')),
  }

  // ✅ Separar medalhas globais
  const globalMedals = BADGES.filter(b => b.category === 'Global')

  // ✅ Mapear categorias com ícones e nomes
  const categories = [
    { key: 'org_iniciante', name: 'Rotina & Organização', icon: '📚', badges: medalsByCategory['org_iniciante'] },
    { key: 'saude', name: 'Corpo & Saúde', icon: '💪', badges: medalsByCategory['saude'] },
    { key: 'ie_', name: 'Mindfulness & Emoções', icon: '🧘', badges: medalsByCategory['ie_'] },
    { key: 'com_', name: 'Relacionamentos & Comunicação', icon: '💬', badges: medalsByCategory['com_'] },
    { key: 'rot_', name: 'Autoestima & Autocuidado', icon: '💎', badges: medalsByCategory['rot_'] },
    { key: 'lead_', name: 'Carreira e Desenvolvimento Profissional', icon: '💼', badges: medalsByCategory['lead_'] },
    { key: 'inov_', name: 'Digital Detox', icon: '📱', badges: medalsByCategory['inov_'] },
  ]

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

      {/* Filters and Sort */}
      <div className="zayia-card p-4 bg-zayia-lilac/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Rarity Filter */}
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">
              Raridade
            </label>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple"
            >
              <option value="all">Todas</option>
              <option value="comum">Comum</option>
              <option value="incomum">Incomum</option>
              <option value="raro">Raro</option>
              <option value="épico">Épico</option>
              <option value="lendária">Lendária</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">
              Status
            </label>
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

          {/* Sort By */}
          <div>
            <label className="text-xs font-semibold text-zayia-violet-gray block mb-2">
              Ordenar
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              className="w-full px-3 py-2 border border-zayia-lilac/30 rounded-lg text-sm bg-white text-zayia-deep-violet focus:outline-none focus:border-zayia-purple"
            >
              <option value="name">Nome (A-Z)</option>
              <option value="date">Data Desbloqueio</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setRarityFilter('all')
                setStatusFilter('all')
                setSortBy('name')
              }}
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
          {(profile?.points || 0).toLocaleString()}
        </div>
        <div className="text-sm text-zayia-violet-gray">Pontos Totais Acumulados</div>
      </div>

      {/* ===== CARROSSEL: TODOS OS NÍVEIS ===== */}
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

      {/* ===== SEÇÃO: MEDALHAS POR CATEGORIA ===== */}
      <div>
        <h2 className="text-xl font-bold text-zayia-deep-violet mb-6">
          🎨 Medalhas por Categoria
        </h2>

        {categories.map(({ key, name, icon, badges }) => {
          const sortedMedals = badges.sort((a: any, b: any) => (a.requirement || 0) - (b.requirement || 0))

          return sortedMedals.length > 0 ? (
            <MedalCarousel
              key={key}
              medals={sortedMedals.map((medal: any) => ({
                id: medal.id,
                name: medal.name,
                icon: medal.icon,
                requirement: medal.requirement || 0,
                points: medal.points || 50,
                isEarned: earnedBadgeIds.includes(medal.id),
              }))}
              categoryName={name}
              categoryIcon={icon}
              onMedalClick={(medal) => {
                const badge = badges.find(b => b.id === medal.id)
                if (badge) {
                  handleMedalClick(badge, earnedBadgeIds.includes(medal.id))
                }
              }}
            />
          ) : null
        })}
      </div>

      {/* ===== SEÇÃO: MEDALHAS ESPECIAIS (GLOBAIS) - CARROSSEL ===== */}
      {globalMedals.length > 0 && (
        <MedalCarousel
          medals={globalMedals.map((medal: any) => ({
            id: medal.id,
            name: medal.name,
            icon: medal.icon,
            requirement: medal.requirement || 0,
            points: medal.points || 50,
            isEarned: earnedBadgeIds.includes(medal.id),
          }))}
          categoryName="Medalhas Especiais"
          categoryIcon="🦋"
          onMedalClick={(medal) => {
            const badge = globalMedals.find(b => b.id === medal.id)
            if (badge) {
              handleMedalClick(badge, earnedBadgeIds.includes(medal.id))
            }
          }}
        />
      )}

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