import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabaseClient } from '../../../lib/supabase-client'
import { supabase } from '../../../lib/supabase'
import { Award, Filter, Search, Lock } from 'lucide-react'

interface Medal {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  isEarned: boolean
  earnedAt: string | null
  pointsValue?: number
}

export function AchievementsSection() {
  const { user } = useAuth()
  const [medals, setMedals] = useState<Medal[]>([])
  const [filteredMedals, setFilteredMedals] = useState<Medal[]>([])
  const [search, setSearch] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const initSubscription = async () => {
      await loadMedals()

      const subscription = supabase
        .channel(`badges-changes-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_earned_badges',
            filter: `user_id=eq.${user.id}`
          },
          () => loadMedals()
        )
        .subscribe()

      return () => subscription.unsubscribe()
    }

    initSubscription()
  }, [user?.id])

  useEffect(() => {
    filterMedals()
  }, [search, selectedRarity, medals])

  const loadMedals = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const allMedals = await supabaseClient.getAllBadgesWithUserStatus(user.id)
      setMedals(allMedals)
    } catch (error) {
      console.error('❌ Error loading medals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMedals = () => {
    let filtered = medals

    // Filter by search
    if (search) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by rarity
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(m => m.rarity === selectedRarity)
    }

    // Sort: earned first, then by rarity
    filtered.sort((a, b) => {
      if (a.isEarned !== b.isEarned) return a.isEarned ? -1 : 1
      const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common']
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
    })

    setFilteredMedals(filtered)
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'from-yellow-400 to-orange-500 text-white',
      epic: 'from-purple-500 to-pink-500 text-white',
      rare: 'from-blue-400 to-purple-400 text-white',
      uncommon: 'from-green-400 to-emerald-400 text-white',
      common: 'from-gray-300 to-gray-400 text-gray-800'
    }
    return colors[rarity] || colors.common
  }

  const getRarityLabel = (rarity: string) => {
    const labels: Record<string, string> = {
      legendary: '👑 Lendária',
      epic: '💎 Épica',
      rare: '⭐ Rara',
      uncommon: '💫 Incomum',
      common: '⭐ Comum'
    }
    return labels[rarity] || 'Desconhecida'
  }

  const earnedCount = medals.filter(m => m.isEarned).length
  const totalCount = medals.length

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin">
          <Award className="w-8 h-8 text-purple-600" />
        </div>
        <span className="ml-4 text-purple-600 font-medium">Carregando medalhas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Count */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Suas Conquistas
        </h2>
        <p className="text-purple-100">
          {earnedCount} de {totalCount} medalhas conquistadas
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Procurar medalhas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Rarity Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedRarity('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
              selectedRarity === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Filter className="inline w-4 h-4 mr-2" />
            Todas
          </button>
          {['legendary', 'epic', 'rare', 'uncommon', 'common'].map(rarity => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                selectedRarity === rarity
                  ? `bg-gradient-to-r ${getRarityColor(rarity)}`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getRarityLabel(rarity)}
            </button>
          ))}
        </div>
      </div>

      {/* Medals Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredMedals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma medalha encontrada</p>
          </div>
        ) : (
          filteredMedals.map(medal => (
            <button
              key={medal.id}
              onClick={() => setSelectedMedal(medal)}
              className={`relative p-4 rounded-lg transition transform hover:scale-105 cursor-pointer ${
                medal.isEarned
                  ? `bg-gradient-to-br ${getRarityColor(medal.rarity)} border-2 border-white shadow-lg`
                  : 'bg-gray-200 border-2 border-gray-300 opacity-60'
              }`}
            >
              {!medal.isEarned && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="text-4xl mb-2">{medal.icon}</div>
              <p className="text-xs font-bold truncate">{medal.name}</p>
              {medal.isEarned && medal.earnedAt && (
                <p className="text-xs opacity-75 mt-1">
                  {new Date(medal.earnedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </button>
          ))
        )}
      </div>

      {/* Medal Detail Modal */}
      {selectedMedal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedal(null)}
        >
          <div
            className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-6xl mx-auto mb-4 bg-gradient-to-br ${getRarityColor(selectedMedal.rarity)}`}>
                {selectedMedal.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedMedal.name}
              </h3>

              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-gradient-to-r ${getRarityColor(selectedMedal.rarity)}`}>
                {getRarityLabel(selectedMedal.rarity)}
              </div>

              <p className="text-gray-600 mb-4">{selectedMedal.description}</p>

              {selectedMedal.pointsValue && (
                <p className="text-lg font-bold text-purple-600 mb-4">
                  {selectedMedal.pointsValue} pontos
                </p>
              )}

              {selectedMedal.isEarned && selectedMedal.earnedAt ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-700">
                    ✓ Conquistada em {new Date(selectedMedal.earnedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    🔒 Você ainda não conquistou essa medalha
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedMedal(null)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
