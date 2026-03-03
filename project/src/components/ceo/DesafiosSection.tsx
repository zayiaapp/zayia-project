import React, { useState, useEffect } from 'react'
import { supabaseClient, type Challenge, type ChallengeCategory } from '../../lib/supabase-client'
import { Trash2, Edit, Plus, X, AlertCircle, Search } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface CreateChallengeState {
  title: string
  description: string
  category_id: string
  points_easy: number
  points_hard: number
  difficulty: 'facil' | 'dificil'
  duration_minutes?: number
}

interface EditChallengeState extends CreateChallengeState {
  id: string
}

const difficulties = [
  { value: 'facil' as const, label: 'Fácil' },
  { value: 'dificil' as const, label: 'Difícil' }
]

export function DesafiosSection() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [categories, setCategories] = useState<ChallengeCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<EditChallengeState | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<Challenge | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  // Form states
  const [createForm, setCreateForm] = useState<CreateChallengeState>({
    title: '',
    description: '',
    category_id: '',
    points_easy: 10,
    points_hard: 20,
    difficulty: 'facil',
    duration_minutes: 30
  })

  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🎯',
    color: 'from-purple-400 to-pink-600'
  })

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [challengesData, categoriesData] = await Promise.all([
          supabaseClient.getChallenges(),
          supabaseClient.getChallengeCategories()
        ])
        setChallenges(challengesData)
        setCategories(categoriesData)
        if (categoriesData.length > 0) {
          setCreateForm(prev => ({ ...prev, category_id: categoriesData[0].id }))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateChallenge = async () => {
    if (!createForm.title || !createForm.category_id || createForm.points_easy <= 0 || createForm.points_hard <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      const newChallenge = await supabaseClient.createChallenge(createForm)
      if (newChallenge) {
        setChallenges(prev => [...prev, newChallenge])
        setShowCreateModal(false)
        setCreateForm({
          title: '',
          description: '',
          category_id: categories[0]?.id || '',
          points_easy: 10,
          points_hard: 20,
          difficulty: 'facil',
          duration_minutes: 30
        })
        alert('Desafio criado com sucesso!')
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      alert('Erro ao criar desafio')
    }
  }

  const handleUpdateChallenge = async () => {
    if (!showEditModal) return

    if (!showEditModal.title || !showEditModal.category_id || showEditModal.points_easy <= 0 || showEditModal.points_hard <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      const updated = await supabaseClient.updateChallenge(showEditModal.id, {
        title: showEditModal.title,
        description: showEditModal.description,
        category_id: showEditModal.category_id,
        points_easy: showEditModal.points_easy,
        points_hard: showEditModal.points_hard,
        difficulty: showEditModal.difficulty,
        duration_minutes: showEditModal.duration_minutes
      })
      if (updated) {
        setChallenges(prev =>
          prev.map(c => (c.id === showEditModal.id ? updated : c))
        )
        setShowEditModal(null)
        alert('Desafio atualizado com sucesso!')
      }
    } catch (error) {
      console.error('Error updating challenge:', error)
      alert('Erro ao atualizar desafio')
    }
  }

  const handleDeleteChallenge = async () => {
    if (!showDeleteModal) return

    try {
      const success = await supabaseClient.deleteChallenge(showDeleteModal.id)
      if (success) {
        setChallenges(prev => prev.filter(c => c.id !== showDeleteModal.id))
        setShowDeleteModal(null)
        alert('Desafio deletado com sucesso!')
      }
    } catch (error) {
      console.error('Error deleting challenge:', error)
      alert('Erro ao deletar desafio')
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      alert('Por favor, nomeie a categoria')
      return
    }

    try {
      const category = await supabaseClient.createChallengeCategory(newCategory)
      if (category) {
        setCategories(prev => [...prev, category])
        setNewCategory({ name: '', icon: '🎯', color: 'from-purple-400 to-pink-600' })
        setShowCategoryModal(false)
        alert('Categoria criada com sucesso!')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Erro ao criar categoria')
    }
  }

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (challenge.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || challenge.category_id === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Calculate statistics
  const totalPoints = challenges.reduce((sum, c) => sum + c.points_easy + c.points_hard, 0)
  const avgPoints = challenges.length > 0 ? Math.round(totalPoints / (challenges.length * 2)) : 0

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          🎯 Desafios - Gerenciamento
        </h2>
        <p className="text-zayia-violet-gray">
          Gerenciar desafios e categorias da plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="zayia-card p-4">
          <div className="text-3xl font-bold zayia-gradient-text">{challenges.length}</div>
          <div className="text-sm text-zayia-violet-gray">Total de Desafios</div>
        </div>
        <div className="zayia-card p-4">
          <div className="text-3xl font-bold text-zayia-soft-purple">{categories.length}</div>
          <div className="text-sm text-zayia-violet-gray">Categorias</div>
        </div>
        <div className="zayia-card p-4">
          <div className="text-3xl font-bold text-zayia-lavender">{totalPoints}</div>
          <div className="text-sm text-zayia-violet-gray">Pontos Totais</div>
        </div>
        <div className="zayia-card p-4">
          <div className="text-3xl font-bold text-zayia-orchid">{avgPoints}</div>
          <div className="text-sm text-zayia-violet-gray">Média de Pontos</div>
        </div>
      </div>

      {/* Controls */}
      <div className="zayia-card p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="zayia-button px-4 py-2 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Desafio
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="zayia-button px-4 py-2 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Categoria
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-zayia-violet-gray" />
            <input
              type="text"
              placeholder="Buscar desafios..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
            >
              <option value="all">Todas as Dificuldades</option>
              {difficulties.map(d => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          Desafios ({filteredChallenges.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredChallenges.map(challenge => {
            const category = categories.find(c => c.id === challenge.category_id)
            return (
              <div
                key={challenge.id}
                className="p-4 border-2 border-zayia-lilac/20 rounded-lg bg-zayia-lilac/10 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-zayia-deep-violet">
                    {challenge.title}
                  </p>
                  <p className="text-sm text-zayia-violet-gray mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {category?.name || 'Sem categoria'}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Fácil: {challenge.points_easy} pts
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      Difícil: {challenge.points_hard} pts
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      challenge.difficulty === 'facil'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {difficulties.find(d => d.value === challenge.difficulty)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setShowEditModal(challenge as EditChallengeState)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar desafio"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(challenge)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Deletar desafio"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/20">
              <h3 className="text-xl font-bold text-zayia-deep-violet">Criar Novo Desafio</h3>
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
                placeholder="Título do desafio"
                value={createForm.title}
                onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <textarea
                placeholder="Descrição"
                value={createForm.description}
                onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none h-24"
              />
              <select
                value={createForm.category_id}
                onChange={e => setCreateForm({ ...createForm, category_id: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Pontos Fácil"
                  min="1"
                  value={createForm.points_easy}
                  onChange={e => setCreateForm({ ...createForm, points_easy: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                />
                <input
                  type="number"
                  placeholder="Pontos Difícil"
                  min="1"
                  value={createForm.points_hard}
                  onChange={e => setCreateForm({ ...createForm, points_hard: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                />
              </div>
              <input
                type="number"
                placeholder="Duração (minutos)"
                min="1"
                value={createForm.duration_minutes}
                onChange={e => setCreateForm({ ...createForm, duration_minutes: parseInt(e.target.value) || 30 })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <select
                value={createForm.difficulty}
                onChange={e => setCreateForm({ ...createForm, difficulty: e.target.value as any })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {difficulties.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label}
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
                onClick={handleCreateChallenge}
                className="flex-1 zayia-button px-4 py-2 text-white"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Challenge Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/20">
              <h3 className="text-xl font-bold text-zayia-deep-violet">Editar Desafio</h3>
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
                placeholder="Título do desafio"
                value={showEditModal.title}
                onChange={e => setShowEditModal({ ...showEditModal, title: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <textarea
                placeholder="Descrição"
                value={showEditModal.description}
                onChange={e => setShowEditModal({ ...showEditModal, description: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple resize-none h-24"
              />
              <select
                value={showEditModal.category_id}
                onChange={e => setShowEditModal({ ...showEditModal, category_id: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Pontos Fácil"
                  min="1"
                  value={showEditModal.points_easy}
                  onChange={e => setShowEditModal({ ...showEditModal, points_easy: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                />
                <input
                  type="number"
                  placeholder="Pontos Difícil"
                  min="1"
                  value={showEditModal.points_hard}
                  onChange={e => setShowEditModal({ ...showEditModal, points_hard: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
                />
              </div>
              <input
                type="number"
                placeholder="Duração (minutos)"
                min="1"
                value={showEditModal.duration_minutes}
                onChange={e => setShowEditModal({ ...showEditModal, duration_minutes: parseInt(e.target.value) || 30 })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <select
                value={showEditModal.difficulty}
                onChange={e => setShowEditModal({ ...showEditModal, difficulty: e.target.value as any })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                {difficulties.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label}
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
                onClick={handleUpdateChallenge}
                className="flex-1 zayia-button px-4 py-2 text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-red-200 bg-red-50">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Deletar Desafio
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
                Tem certeza que deseja deletar "<strong>{showDeleteModal.title}</strong>"?
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
                onClick={handleDeleteChallenge}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-zayia-lilac/20">
              <h3 className="text-xl font-bold text-zayia-deep-violet">Criar Categoria</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Nome da categoria"
                value={newCategory.name}
                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <input
                type="text"
                placeholder="Ícone (emoji)"
                value={newCategory.icon}
                onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              />
              <select
                value={newCategory.color}
                onChange={e => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full p-2 border-2 border-zayia-lilac rounded-lg focus:outline-none focus:border-zayia-soft-purple"
              >
                <option value="from-purple-400 to-pink-600">Roxo → Rosa</option>
                <option value="from-blue-400 to-cyan-600">Azul → Ciano</option>
                <option value="from-green-400 to-emerald-600">Verde → Esmeralda</option>
                <option value="from-orange-400 to-red-600">Laranja → Vermelho</option>
              </select>
            </div>
            <div className="flex gap-3 p-6 border-t border-zayia-lilac/20">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 text-zayia-deep-violet border-2 border-zayia-lilac rounded-lg hover:bg-zayia-lilac/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCategory}
                className="flex-1 zayia-button px-4 py-2 text-white"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
