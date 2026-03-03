import React, { useState, useEffect } from 'react'
import { supabaseClient } from '../../lib/supabase-client'
import { Trash2, Edit, Plus, X, AlertCircle, Search } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface Prize {
  id: string
  name: string
  description: string
  type: 'badge' | 'points' | 'discount'
  value: number
  is_active: boolean
  created_at: string
}

interface CreatePrizeState {
  name: string
  description: string
  type: 'badge' | 'points' | 'discount'
  value: number
}

interface EditPrizeState extends CreatePrizeState {
  id: string
}

const prizeTypes = [
  { value: 'badge' as const, label: 'Medalha', icon: '🏆' },
  { value: 'points' as const, label: 'Pontos', icon: '⭐' },
  { value: 'discount' as const, label: 'Desconto', icon: '🎁' }
]

export function PrizesSection() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<EditPrizeState | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<Prize | null>(null)

  // Form state
  const [createForm, setCreateForm] = useState<CreatePrizeState>({
    name: '',
    description: '',
    type: 'badge',
    value: 10
  })

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const prizesData = await supabaseClient.getPrizes()
        setPrizes(prizesData)
      } catch (error) {
        console.error('Error loading prizes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreatePrize = async () => {
    if (!createForm.name || createForm.value <= 0) {
      alert('Por favor, preencha nome e valor')
      return
    }

    try {
      const newPrize = await supabaseClient.createPrize(createForm)
      if (newPrize) {
        setPrizes(prev => [...prev, newPrize])
        setShowCreateModal(false)
        setCreateForm({
          name: '',
          description: '',
          type: 'badge',
          value: 10
        })
        alert('Prêmio criado com sucesso!')
      }
    } catch (error) {
      console.error('Error creating prize:', error)
      alert('Erro ao criar prêmio')
    }
  }

  const handleUpdatePrize = async () => {
    if (!showEditModal) return

    if (!showEditModal.name || showEditModal.value <= 0) {
      alert('Por favor, preencha nome e valor')
      return
    }

    try {
      const updated = await supabaseClient.updatePrize(showEditModal.id, {
        name: showEditModal.name,
        description: showEditModal.description,
        type: showEditModal.type,
        value: showEditModal.value
      })
      if (updated) {
        setPrizes(prev =>
          prev.map(p => (p.id === showEditModal.id ? updated : p))
        )
        setShowEditModal(null)
        alert('Prêmio atualizado com sucesso!')
      }
    } catch (error) {
      console.error('Error updating prize:', error)
      alert('Erro ao atualizar prêmio')
    }
  }

  const handleDeletePrize = async () => {
    if (!showDeleteModal) return

    try {
      const success = await supabaseClient.deletePrize(showDeleteModal.id)
      if (success) {
        setPrizes(prev => prev.filter(p => p.id !== showDeleteModal.id))
        setShowDeleteModal(null)
        alert('Prêmio deletado com sucesso!')
      }
    } catch (error) {
      console.error('Error deleting prize:', error)
      alert('Erro ao deletar prêmio')
    }
  }

  // Filter prizes
  const filteredPrizes = prizes.filter(prize => {
    const matchesSearch = prize.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || prize.type === selectedType

    return matchesSearch && matchesType
  })

  // Calculate statistics
  const prizeStats = {
    total: prizes.length,
    badge: prizes.filter(p => p.type === 'badge').length,
    points: prizes.filter(p => p.type === 'points').length,
    discount: prizes.filter(p => p.type === 'discount').length
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          🎁 Prêmios - Gerenciamento
        </h2>
        <p className="text-zayia-violet-gray">
          Gerenciar prêmios e recompensas do sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="zayia-card p-4">
          <div className="text-3xl font-bold zayia-gradient-text">{prizeStats.total}</div>
          <div className="text-sm text-zayia-violet-gray">Total</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-purple-400">
          <div className="text-3xl font-bold text-purple-600">{prizeStats.badge}</div>
          <div className="text-sm text-zayia-violet-gray">Medalhas</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-yellow-400">
          <div className="text-3xl font-bold text-yellow-600">{prizeStats.points}</div>
          <div className="text-sm text-zayia-violet-gray">Pontos</div>
        </div>
        <div className="zayia-card p-4 border-l-4 border-pink-400">
          <div className="text-3xl font-bold text-pink-600">{prizeStats.discount}</div>
          <div className="text-sm text-zayia-violet-gray">Descontos</div>
        </div>
      </div>

      {/* Controls */}
      <div className="zayia-card p-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="zayia-button px-4 py-2 text-white flex items-center gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          Criar Prêmio
        </button>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-zayia-violet-gray" />
            <input
              type="text"
              placeholder="Buscar prêmios..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
            />
          </div>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
          >
            <option value="all">Todos os Tipos</option>
            {prizeTypes.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prizes List */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          Prêmios ({filteredPrizes.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredPrizes.map(prize => {
            const typeInfo = prizeTypes.find(t => t.value === prize.type)
            return (
              <div
                key={prize.id}
                className="p-4 border-2 border-zayia-lilac/20 rounded-lg bg-zayia-lilac/10 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl">{typeInfo?.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-zayia-deep-violet">
                        {prize.name}
                      </p>
                      <p className="text-sm text-zayia-violet-gray">
                        {prize.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {typeInfo?.label}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {prize.type === 'points' ? `${prize.value} pts` : `${prize.value} un`}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setShowEditModal(prize as EditPrizeState)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar prêmio"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(prize)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Deletar prêmio"
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
              <h3 className="text-xl font-bold text-zayia-deep-violet">Criar Prêmio</h3>
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
                placeholder="Nome do prêmio"
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
              <select
                value={createForm.type}
                onChange={e => setCreateForm({ ...createForm, type: e.target.value as any })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {prizeTypes.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder={createForm.type === 'points' ? 'Valor em pontos' : 'Valor/Quantidade'}
                min="1"
                value={createForm.value}
                onChange={e => setCreateForm({ ...createForm, value: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePrize}
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
              <h3 className="text-xl font-bold text-zayia-deep-violet">Editar Prêmio</h3>
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
                placeholder="Nome do prêmio"
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
              <select
                value={showEditModal.type}
                onChange={e => setShowEditModal({ ...showEditModal, type: e.target.value as any })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {prizeTypes.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder={showEditModal.type === 'points' ? 'Valor em pontos' : 'Valor/Quantidade'}
                min="1"
                value={showEditModal.value}
                onChange={e => setShowEditModal({ ...showEditModal, value: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 px-4 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdatePrize}
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
                Deletar Prêmio
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
                onClick={handleDeletePrize}
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
