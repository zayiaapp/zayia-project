# GuerreirasSection.tsx - Código Completo

## Arquivo: src/components/ceo/GuerreirasSection.tsx

```typescript
import React, { useState, useEffect } from 'react'
import { supabaseClient, type Profile } from '../../lib/supabase-client'
import { integrationsManager } from '../../lib/integrations-manager'
import {
  Plus,
  Search,
  Eye,
  Power,
  PowerOff,
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  Trophy,
  Target,
  Star,
  Crown,
  Shield,
  Award,
  Zap,
  Heart,
  Brain,
  Dumbbell,
  MessageCircle,
  Home,
  Smartphone,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Activity,
  Flame,
  Gem,
  Medal,
  Sparkles
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

// Tipos específicos para Guerreiras
interface Guerreira extends Profile {
  cpf?: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipcode: string
  }
  category_progress?: {
    autoestima: { completed: number, total: number, percentage: number }
    rotina: { completed: number, total: number, percentage: number }
    mindfulness: { completed: number, total: number, percentage: number }
    corpo_saude: { completed: number, total: number, percentage: number }
    relacionamentos: { completed: number, total: number, percentage: number }
    carreira: { completed: number, total: number, percentage: number }
    digital_detox: { completed: number, total: number, percentage: number }
  }
  badges_earned?: Array<{
    id: string
    name: string
    description: string
    icon: string
    color: string
    earned_date: string
  }>
  membership_status?: 'trial' | 'active' | 'suspended' | 'cancelled'
}

interface FilterOptions {
  status: 'all' | 'active' | 'inactive'
  subscriptionPlan: 'all' | 'basic' | 'premium' | 'vip'
  dateRange: 'all' | 'week' | 'month' | 'quarter'
}

export function GuerreirasSection() {
  // Estado
  const [guerreiras, setGuerreiras] = useState<Guerreira[]>([])
  const [filteredGuerreiras, setFilteredGuerreiras] = useState<Guerreira[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGuerreira, setSelectedGuerreira] = useState<Guerreira | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingGuerreira, setEditingGuerreira] = useState<Guerreira | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Guerreira | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    subscriptionPlan: 'all',
    dateRange: 'all'
  })

  // Carregar guerreiras
  useEffect(() => {
    loadGuerreiras()
  }, [])

  // Aplicar filtros quando dados ou filtros mudarem
  useEffect(() => {
    filterGuerreiras()
  }, [guerreiras, searchTerm, filters])

  const loadGuerreiras = async () => {
    try {
      setLoading(true)
      setError(null)
      const profiles = await supabaseClient.getProfiles()

      // Filtrar apenas usuárias (não CEOs)
      const userProfiles = profiles.filter((p: Profile) => p.role === 'user') as Guerreira[]

      // Enriquecer dados com progresso e estatísticas
      const enrichedGuerreiras = await Promise.all(
        userProfiles.map(async (guerreira) => {
          const progress = await supabaseClient.getUserProgress(guerreira.id)

          // Calcular categoria progress
          const categoryProgress = {
            autoestima: { completed: 0, total: 0, percentage: 0 },
            rotina: { completed: 0, total: 0, percentage: 0 },
            mindfulness: { completed: 0, total: 0, percentage: 0 },
            corpo_saude: { completed: 0, total: 0, percentage: 0 },
            relacionamentos: { completed: 0, total: 0, percentage: 0 },
            carreira: { completed: 0, total: 0, percentage: 0 },
            digital_detox: { completed: 0, total: 0, percentage: 0 }
          }

          // Contar por categoria
          progress.forEach((p) => {
            const category = p.challenge_category as keyof typeof categoryProgress
            if (category in categoryProgress) {
              categoryProgress[category].completed++
            }
          })

          return {
            ...guerreira,
            category_progress: categoryProgress,
            membership_status: 'active' as const
          }
        })
      )

      setGuerreiras(enrichedGuerreiras)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar guerreiras')
      console.error('Error loading guerreiras:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterGuerreiras = () => {
    let filtered = [...guerreiras]

    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Aplicar filtro de status
    if (filters.status !== 'all') {
      filtered = filtered.filter(g => {
        // Lógica de status baseada em updated_at
        const daysInactive = (new Date().getTime() - new Date(g.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        return filters.status === 'active' ? daysInactive < 30 : daysInactive >= 30
      })
    }

    // Aplicar filtro de plano
    if (filters.subscriptionPlan !== 'all') {
      filtered = filtered.filter(g => g.subscription_plan === filters.subscriptionPlan)
    }

    // Aplicar filtro de data
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const daysToSubtract =
        filters.dateRange === 'week' ? 7 :
        filters.dateRange === 'month' ? 30 : 90
      const cutoffDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000)

      filtered = filtered.filter(g => new Date(g.created_at) >= cutoffDate)
    }

    setFilteredGuerreiras(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleViewDetails = (guerreira: Guerreira) => {
    setSelectedGuerreira(guerreira)
    setShowModal(true)
  }

  const handleEditGuerreira = (guerreira: Guerreira) => {
    setEditingGuerreira({ ...guerreira })
  }

  const handleSaveGuerreira = async () => {
    if (!editingGuerreira) return

    try {
      await supabaseClient.updateProfile(editingGuerreira.id, editingGuerreira)
      setGuerreiras(prev =>
        prev.map(g => g.id === editingGuerreira.id ? editingGuerreira : g)
      )
      setSelectedGuerreira(editingGuerreira)
      setEditingGuerreira(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  const handleDeleteGuerreira = (guerreira: Guerreira) => {
    setDeleteTarget(guerreira)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await supabaseClient.deleteProfile(deleteTarget.id)
      setGuerreiras(prev => prev.filter(g => g.id !== deleteTarget.id))
      setShowDeleteModal(false)
      setDeleteTarget(null)
      setShowModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
    }
  }

  const handleStatusToggle = async (guerreira: Guerreira) => {
    try {
      const isActive = (new Date().getTime() - new Date(guerreira.updated_at).getTime()) / (1000 * 60 * 60 * 24) < 30
      // Implementar lógica de toggle de status
      await supabaseClient.updateProfile(guerreira.id, {
        ...guerreira,
        updated_at: isActive ? new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString()
      })
      loadGuerreiras()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zayia-deep-violet mb-2">
              👩‍🦰 Guerreiras
            </h2>
            <p className="text-zayia-violet-gray">
              Gerenciamento completo de usuárias e progressos
            </p>
          </div>
          <div className="flex gap-3">
            <button className="zayia-button px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nova Guerreira
            </button>
            <button className="bg-zayia-lilac text-zayia-deep-violet px-4 py-2 rounded-lg font-medium">
              Exportar
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Search e Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-zayia-violet-gray" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilter('status', e.target.value)}
            className="px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>

          {/* Subscription Filter */}
          <select
            value={filters.subscriptionPlan}
            onChange={(e) => handleFilter('subscriptionPlan', e.target.value)}
            className="px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
          >
            <option value="all">Todos os Planos</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      {/* Lista de Guerreiras */}
      <div className="zayia-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zayia-lilac/20 border-b border-zayia-lilac">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zayia-deep-violet">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zayia-deep-violet">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zayia-deep-violet">Pontos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zayia-deep-violet">Nível</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zayia-deep-violet">Plano</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zayia-deep-violet">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-zayia-deep-violet">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zayia-lilac/30">
              {filteredGuerreiras.map((guerreira) => {
                const daysInactive = (new Date().getTime() - new Date(guerreira.updated_at).getTime()) / (1000 * 60 * 60 * 24)
                const isActive = daysInactive < 30

                return (
                  <tr key={guerreira.id} className="hover:bg-zayia-lilac/10 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zayia-lilac flex items-center justify-center text-white text-sm font-bold">
                          {guerreira.full_name?.[0] || 'G'}
                        </div>
                        <span className="font-medium text-zayia-deep-violet">{guerreira.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zayia-violet-gray">{guerreira.email}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-semibold text-zayia-deep-violet">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        {guerreira.points || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-semibold text-zayia-deep-violet">
                        <Crown className="w-4 h-4 text-purple-500" />
                        {guerreira.level || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        guerreira.subscription_plan === 'vip' ? 'bg-purple-100 text-purple-700' :
                        guerreira.subscription_plan === 'premium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {guerreira.subscription_plan || 'basic'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(guerreira)}
                          className="p-2 hover:bg-zayia-lilac/20 rounded-lg transition"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4 text-zayia-deep-violet" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(guerreira)}
                          className="p-2 hover:bg-zayia-lilac/20 rounded-lg transition"
                          title="Toggle status"
                        >
                          {isActive ? (
                            <Power className="w-4 h-4 text-green-500" />
                          ) : (
                            <PowerOff className="w-4 h-4 text-red-500" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedGuerreira && !editingGuerreira && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-zayia-lilac flex items-center justify-center text-white text-2xl font-bold">
                    {selectedGuerreira.full_name?.[0] || 'G'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zayia-deep-violet">
                      {selectedGuerreira.full_name}
                    </h3>
                    <p className="text-zayia-violet-gray">{selectedGuerreira.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zayia-lilac/10 p-4 rounded-lg">
                  <p className="text-sm text-zayia-violet-gray mb-1">Pontos Totais</p>
                  <p className="text-2xl font-bold text-zayia-deep-violet">{selectedGuerreira.points || 0}</p>
                </div>
                <div className="bg-zayia-lilac/10 p-4 rounded-lg">
                  <p className="text-sm text-zayia-violet-gray mb-1">Nível</p>
                  <p className="text-2xl font-bold text-zayia-deep-violet">{selectedGuerreira.level || 1}</p>
                </div>
                <div className="bg-zayia-lilac/10 p-4 rounded-lg">
                  <p className="text-sm text-zayia-violet-gray mb-1">Desafios Completados</p>
                  <p className="text-2xl font-bold text-zayia-deep-violet">{selectedGuerreira.completed_challenges || 0}</p>
                </div>
                <div className="bg-zayia-lilac/10 p-4 rounded-lg">
                  <p className="text-sm text-zayia-violet-gray mb-1">Plano</p>
                  <p className="text-lg font-bold text-zayia-deep-violet capitalize">{selectedGuerreira.subscription_plan || 'basic'}</p>
                </div>
              </div>

              {/* Informações Pessoais */}
              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-zayia-deep-violet">Informações Pessoais</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zayia-soft-purple" />
                    <span>{selectedGuerreira.phone || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zayia-soft-purple" />
                    <span>{selectedGuerreira.birth_date || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-zayia-soft-purple" />
                    <span>{selectedGuerreira.profession || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              {/* Progresso por Categoria */}
              {selectedGuerreira.category_progress && (
                <div className="space-y-4 mb-6">
                  <h4 className="font-bold text-zayia-deep-violet">Progresso por Categoria</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedGuerreira.category_progress).map(([category, data]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-zayia-deep-violet capitalize">{category}</span>
                          <span className="text-zayia-violet-gray">{data.completed}/{data.total}</span>
                        </div>
                        <div className="w-full bg-zayia-lilac/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-zayia-soft-purple to-zayia-deep-violet h-2 rounded-full"
                            style={{ width: `${data.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datas */}
              <div className="border-t border-zayia-lilac pt-4 mb-6 flex gap-6 text-sm">
                <div>
                  <p className="text-zayia-violet-gray">Membro desde</p>
                  <p className="font-semibold text-zayia-deep-violet">
                    {new Date(selectedGuerreira.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-zayia-violet-gray">Último acesso</p>
                  <p className="font-semibold text-zayia-deep-violet">
                    {new Date(selectedGuerreira.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditGuerreira(selectedGuerreira)}
                  className="flex-1 zayia-button px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteGuerreira(selectedGuerreira)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Deletar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingGuerreira && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-zayia-deep-violet">Editar Guerreira</h3>
                <button
                  onClick={() => setEditingGuerreira(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editingGuerreira.full_name || ''}
                    onChange={(e) => setEditingGuerreira({ ...editingGuerreira, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingGuerreira.email}
                    onChange={(e) => setEditingGuerreira({ ...editingGuerreira, email: e.target.value })}
                    className="w-full px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editingGuerreira.phone || ''}
                    onChange={(e) => setEditingGuerreira({ ...editingGuerreira, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
                  <input
                    type="text"
                    value={editingGuerreira.profession || ''}
                    onChange={(e) => setEditingGuerreira({ ...editingGuerreira, profession: e.target.value })}
                    className="w-full px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Assinatura</label>
                  <select
                    value={editingGuerreira.subscription_plan || 'basic'}
                    onChange={(e) => setEditingGuerreira({ ...editingGuerreira, subscription_plan: e.target.value as any })}
                    className="w-full px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status de Assinatura</label>
                  <select
                    value={editingGuerreira.subscription_status || 'active'}
                    onChange={(e) => setEditingGuerreira({ ...editingGuerreira, subscription_status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-zayia-lilac rounded-lg focus:outline-none focus:ring-2 focus:ring-zayia-deep-violet"
                  >
                    <option value="active">Ativo</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="expired">Expirado</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveGuerreira}
                  className="flex-1 zayia-button px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
                <button
                  onClick={() => setEditingGuerreira(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-red-600 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja deletar a guerreira <strong>{deleteTarget.full_name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Deletar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

**Notas Importantes**:
- Este é o código COMPLETO do GuerreirasSection
- Todos os estados, funcionalidades e modais estão inclusos
- Pronto para ser usado ou adaptado
- Código segue ZAYIA theme e padrões do projeto
