import React, { useState, useEffect } from 'react'
import { supabaseClient, type Medal } from '../../lib/supabase-client'
import { Trash2, Edit, Plus, X, AlertCircle, Search } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface CreateMedalState {
  name: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

interface EditMedalState extends CreateMedalState {
  id: string
}

const rarities = [
  { value: 'common' as const, label: 'Comum', color: 'from-slate-400 to-slate-600' },
  { value: 'uncommon' as const, label: 'Incomum', color: 'from-green-400 to-green-600' },
  { value: 'rare' as const, label: 'Raro', color: 'from-blue-400 to-blue-600' },
  { value: 'epic' as const, label: 'Épico', color: 'from-purple-400 to-purple-600' },
  { value: 'legendary' as const, label: 'Lendário', color: 'from-yellow-400 to-red-600' }
]

export function MedalsSection() {
  const [medals, setMedals] = useState<Medal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<EditMedalState | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<Medal | null>(null)

  // Form state
  const [createForm, setCreateForm] = useState<CreateMedalState>({
    name: '',
    description: '',
    icon: '🏆',
    rarity: 'common'
  })

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const medalsData = await supabaseClient.getGlobalMedals()
        setMedals(medalsData)
      } catch (error) {
        console.error('Error loading medals:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateMedal = async () => {
    if (!createForm.name || !createForm.icon) {
      alert('Por favor, preencha nome e ícone')
      return
    }

    try {
      const newMedal = await supabaseClient.createMedal(createForm)
      if (newMedal) {
        setMedals(prev => [...prev, newMedal])
        setShowCreateModal(false)
        setCreateForm({
          name: '',
          description: '',
          icon: '🏆',
          rarity: 'common'
        })
        alert('Medalha criada com sucesso!')
      }
    } catch (error) {
      console.error('Error creating medal:', error)
      alert('Erro ao criar medalha')
    }
  }

  const handleUpdateMedal = async () => {
    if (!showEditModal) return

    if (!showEditModal.name || !showEditModal.icon) {
      alert('Por favor, preencha nome e ícone')
      return
    }

    try {
      const updated = await supabaseClient.updateMedal(showEditModal.id, {
        name: showEditModal.name,
        description: showEditModal.description,
        icon: showEditModal.icon,
        rarity: showEditModal.rarity
      })
      if (updated) {
        setMedals(prev =>
          prev.map(m => (m.id === showEditModal.id ? updated : m))
        )
        setShowEditModal(null)
        alert('Medalha atualizada com sucesso!')
      }
    } catch (error) {
      console.error('Error updating medal:', error)
      alert('Erro ao atualizar medalha')
    }
  }

  const handleDeleteMedal = async () => {
    if (!showDeleteModal) return

    try {
      const success = await supabaseClient.deleteMedal(showDeleteModal.id)
      if (success) {
        setMedals(prev => prev.filter(m => m.id !== showDeleteModal.id))
        setShowDeleteModal(null)
        alert('Medalha deletada com sucesso!')
      }
    } catch (error) {
      console.error('Error deleting medal:', error)
      alert('Erro ao deletar medalha')
    }
  }

  // Filter medals
  const filteredMedals = medals.filter(medal => {
    const matchesSearch = medal.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRarity = selectedRarity === 'all' || medal.rarity === selectedRarity

    return matchesSearch && matchesRarity
  })

  // Calculate statistics
  const medalStats = {
    total: medals.length,
    common: medals.filter(m => m.rarity === 'common').length,
    uncommon: medals.filter(m => m.rarity === 'uncommon').length,
    rare: medals.filter(m => m.rarity === 'rare').length,
    epic: medals.filter(m => m.rarity === 'epic').length,
    legendary: medals.filter(m => m.rarity === 'legendary').length
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          🏆 Medalhas - Gerenciamento
        </h2>
        <p className="text-zayia-violet-gray">
          Gerenciar medalhas e conquistas do sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="zayia-card p-4">
          <div className="text-3xl font-bold zayia-gradient-text">{medalStats.total}</div>
          <div className="text-sm text-zayia-violet-gray">Total</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-slate-400">
          <div className="text-3xl font-bold text-slate-600">{medalStats.common}</div>
          <div className="text-sm text-zayia-violet-gray">Comum</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-green-400">
          <div className="text-3xl font-bold text-green-600">{medalStats.uncommon}</div>
          <div className="text-sm text-zayia-violet-gray">Incomum</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-blue-400">
          <div className="text-3xl font-bold text-blue-600">{medalStats.rare}</div>
          <div className="text-sm text-zayia-violet-gray">Raro</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-purple-400">
          <div className="text-3xl font-bold text-purple-600">{medalStats.epic}</div>
          <div className="text-sm text-zayia-violet-gray">Épico</div>
        </div>
      </div>

      {/* Controls */}
      <div className="zayia-card p-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="zayia-button px-4 py-2 text-white flex items-center gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          Criar Medalha
        </button>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-zayia-violet-gray" />
            <input
              type="text"
              placeholder="Buscar medalhas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
            />
          </div>

          <select
            value={selectedRarity}
            onChange={e => setSelectedRarity(e.target.value)}
            className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
          >
            <option value="all">Todas as Raridades</option>
            {rarities.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Medals List */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          Medalhas ({filteredMedals.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMedals.map(medal => {
            const rarityInfo = rarities.find(r => r.value === medal.rarity)
            return (
              <div
                key={medal.id}
                className="p-4 border-2 border-zayia-lilac/20 rounded-lg bg-zayia-lilac/10 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{medal.icon}</span>
                    <div>
                      <p className="font-semibold text-zayia-deep-violet">
                        {medal.name}
                      </p>
                      <p className="text-sm text-zayia-violet-gray">
                        {medal.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full text-white bg-gradient-to-r ${rarityInfo?.color}`}>
                      {rarityInfo?.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setShowEditModal(medal as EditMedalState)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar medalha"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(medal)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Deletar medalha"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/20">
              <h3 className="text-xl font-bold text-zayia-deep-violet">Criar Medalha</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Nome da medalha"
                value={createForm.name}
                onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <textarea
                placeholder="Descrição"
                value={createForm.description}
                onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none h-20"
              />
              <input
                type="text"
                placeholder="Ícone (emoji)"
                maxLength={2}
                value={createForm.icon}
                onChange={e => setCreateForm({ ...createForm, icon: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple text-center text-3xl"
              />
              <select
                value={createForm.rarity}
                onChange={e => setCreateForm({ ...createForm, rarity: e.target.value as any })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {rarities.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateMedal}
                className="flex-1 zayia-button px-4 py-2 text-white"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/20">
              <h3 className="text-xl font-bold text-zayia-deep-violet">Editar Medalha</h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Nome da medalha"
                value={showEditModal.name}
                onChange={e => setShowEditModal({ ...showEditModal, name: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <textarea
                placeholder="Descrição"
                value={showEditModal.description}
                onChange={e => setShowEditModal({ ...showEditModal, description: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none h-20"
              />
              <input
                type="text"
                placeholder="Ícone (emoji)"
                maxLength={2}
                value={showEditModal.icon}
                onChange={e => setShowEditModal({ ...showEditModal, icon: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple text-center text-3xl"
              />
              <select
                value={showEditModal.rarity}
                onChange={e => setShowEditModal({ ...showEditModal, rarity: e.target.value as any })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {rarities.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 px-4 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateMedal}
                className="flex-1 zayia-button px-4 py-2 text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-red-200 bg-red-50">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Deletar Medalha
              </h3>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="p-1 hover:bg-red-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-zayia-violet-gray">
                Tem certeza que deseja deletar "<strong>{showDeleteModal.name}</strong>"?
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteMedal}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
