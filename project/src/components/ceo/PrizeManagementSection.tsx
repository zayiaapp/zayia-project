import React, { useState, useEffect } from 'react'
import { supabaseClient } from '../../lib/supabase-client'
import {
  Trophy,
  Calendar,
  DollarSign,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Download,
  Settings,
  TrendingUp,
  Users,
  Award,
  Zap,
  Copy,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  Flag
} from 'lucide-react'
import {
  RankingUser,
  MonthlyWinner,
  PrizePayment,
  RankingConfig,
  generateMockMonthlyWinners,
  defaultRankingConfig,
  formatCurrency,
  getPrizeMedal,
  getDaysLeftInMonth,
  getMonthStartDate,
  getMonthEndDate
} from '../../lib/ranking-data-mock'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { AnalyticsSection } from './AnalyticsSection'

interface TabType {
  id: 'current' | 'history' | 'manage' | 'analytics'
  label: string
  icon: React.ComponentType<any>
}

const tabs: TabType[] = [
  { id: 'current', label: 'Ranking Atual', icon: Trophy },
  { id: 'history', label: 'Histórico de Vencedoras', icon: Calendar },
  { id: 'manage', label: 'Gerenciar Prêmios', icon: DollarSign },
  { id: 'analytics', label: 'Analytics & Relatórios', icon: BarChart3 }
]

interface PrizeManagementSectionProps {
  users: RankingUser[]
  onRefreshRanking: () => Promise<void>
  onFinalizeMonth: () => Promise<void>
}

export function PrizeManagementSection({
  users,
  onRefreshRanking,
  onFinalizeMonth
}: PrizeManagementSectionProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'manage' | 'analytics'>('current')
  const [loading, setLoading] = useState(false)
  const [monthlyWinners, setMonthlyWinners] = useState<MonthlyWinner[]>([])
  const [config, setConfig] = useState<RankingConfig>(defaultRankingConfig)
  const [payments, setPayments] = useState<PrizePayment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [editingConfig, setEditingConfig] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null)
  const [prizeModalOpen, setPrizeModalOpen] = useState(false)
  const [selectedPrizeUserId, setSelectedPrizeUserId] = useState<string | null>(null)
  const [prizeAmount, setPrizeAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [pixKey, setPixKey] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [statusChanges, setStatusChanges] = useState<Record<string, string>>({})
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [monthlyWinnersState, setMonthlyWinnersState] = useState<MonthlyWinner[]>([])
  const [prizeConfig, setPrizeConfig] = useState({
    firstPlace: 500,
    secondPlace: 300,
    thirdPlace: 100
  })
  const [isEditingPrizeConfig, setIsEditingPrizeConfig] = useState(false)

  const itemsPerPage = 20

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setMonthlyWinnersState(monthlyWinners)
  }, [monthlyWinners])

  useEffect(() => {
    // Listener para evento de atualização de prêmios
    const handlePrizeUpdate = () => {
      console.log('✅ Evento prizeUpdated capturado - Cards atualizando...')
      // O setState acima já dispara re-render, isso é só para logging
    }

    const handlePrizeConfigUpdate = () => {
      console.log('✅ Configuração de prêmios atualizada - Cards re-renderizando')
    }

    window.addEventListener('prizeUpdated', handlePrizeUpdate)
    window.addEventListener('prizeConfigUpdated', handlePrizeConfigUpdate)
    return () => {
      window.removeEventListener('prizeUpdated', handlePrizeUpdate)
      window.removeEventListener('prizeConfigUpdated', handlePrizeConfigUpdate)
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()

      // Load winners from Supabase (monthly_rankings top 3)
      // getMonthlyWinners returns { ranking, prize }[] objects
      const rawWinners = await supabaseClient.getMonthlyWinners(month, year)
      const winners = rawWinners as unknown as Array<{ ranking: { user_id: string; points: number; user_profile?: { full_name?: string; email?: string } }; prize: { status?: string; amount?: number; payment_method?: string; pix_key?: string; payment_date?: string } | null }>
      if (winners.length > 0) {
        const w = (i: number) => winners[i]?.ranking
        const p = (i: number) => winners[i]?.prize
        const mapped: MonthlyWinner = {
          id: `${month}-${year}`,
          month,
          year,
          firstPlaceUserId: w(0)?.user_id || '',
          firstPlaceName: w(0)?.user_profile?.full_name || '',
          firstPlaceEmail: w(0)?.user_profile?.email || '',
          firstPlacePoints: w(0)?.points || 0,
          firstPlaceStatus: (p(0)?.status as 'pending' | 'paid' | 'cancelled') || 'pending',
          firstPlaceAmount: p(0)?.amount,
          secondPlaceUserId: w(1)?.user_id || '',
          secondPlaceName: w(1)?.user_profile?.full_name || '',
          secondPlaceEmail: w(1)?.user_profile?.email || '',
          secondPlacePoints: w(1)?.points || 0,
          secondPlaceStatus: (p(1)?.status as 'pending' | 'paid' | 'cancelled') || 'pending',
          secondPlaceAmount: p(1)?.amount,
          thirdPlaceUserId: w(2)?.user_id || '',
          thirdPlaceName: w(2)?.user_profile?.full_name || '',
          thirdPlaceEmail: w(2)?.user_profile?.email || '',
          thirdPlacePoints: w(2)?.points || 0,
          thirdPlaceStatus: (p(2)?.status as 'pending' | 'paid' | 'cancelled') || 'pending',
          thirdPlaceAmount: p(2)?.amount,
          createdAt: now.toISOString(),
          finalizedAt: now.toISOString()
        }
        setMonthlyWinners([mapped])
        setMonthlyWinnersState([mapped])
      }

      // Load prize payments from Supabase
      const dbPayments = await supabaseClient.getPrizePayments(month, year)
      const mappedPayments: PrizePayment[] = dbPayments.map((p: any) => ({
        id: p.id,
        winnerId: p.user_id,
        position: p.position,
        month: p.month,
        year: p.year,
        prizeAmount: Number(p.amount),
        status: p.status as 'pending' | 'paid' | 'cancelled',
        paymentMethod: (p.payment_method === 'bank_transfer' ? 'transfer' : p.payment_method) as 'pix' | 'transfer' | 'other',
        pixKey: p.pix_key || undefined,
        paymentDate: p.payment_date || undefined,
        badgeEarned: '',
        badgeEarnedAt: p.created_at,
        updatedAt: p.updated_at,
        updatedBy: 'admin-ceo'
      }))
      setPayments(mappedPayments)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  const handleOpenPrizeModal = (userId: string) => {
    setSelectedPrizeUserId(userId)
    setPrizeModalOpen(true)

    // Pre-fill form with existing data if available
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const monthData = monthlyWinnersState.find(m =>
      m.month === currentMonth && m.year === currentYear
    )

    if (monthData) {
      if (monthData.firstPlaceUserId === userId) {
        setPrizeAmount(monthData.firstPlaceAmount?.toString() || '')
        setPaymentMethod(monthData.firstPlaceMethod || 'pix')
        setPixKey(monthData.firstPlacePixKey || '')
        setPaymentDate(monthData.firstPlacePaymentDate || '')
      } else if (monthData.secondPlaceUserId === userId) {
        setPrizeAmount(monthData.secondPlaceAmount?.toString() || '')
        setPaymentMethod(monthData.secondPlaceMethod || 'pix')
        setPixKey(monthData.secondPlacePixKey || '')
        setPaymentDate(monthData.secondPlacePaymentDate || '')
      } else if (monthData.thirdPlaceUserId === userId) {
        setPrizeAmount(monthData.thirdPlaceAmount?.toString() || '')
        setPaymentMethod(monthData.thirdPlaceMethod || 'pix')
        setPixKey(monthData.thirdPlacePixKey || '')
        setPaymentDate(monthData.thirdPlacePaymentDate || '')
      }
    }
  }

  const handleSavePrize = async () => {
    if (!selectedPrizeUserId || !prizeAmount) {
      alert('Por favor, preencha Usuária e Valor do Prêmio')
      return
    }

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Determinar posição do vencedor
    const monthData = monthlyWinnersState.find(m => m.month === currentMonth && m.year === currentYear)
    let position = 0
    if (monthData?.firstPlaceUserId === selectedPrizeUserId) position = 1
    else if (monthData?.secondPlaceUserId === selectedPrizeUserId) position = 2
    else if (monthData?.thirdPlaceUserId === selectedPrizeUserId) position = 3

    // Salvar no Supabase
    const result = await supabaseClient.savePrizePayment({
      userId: selectedPrizeUserId,
      position,
      month: currentMonth,
      year: currentYear,
      amount: Number(prizeAmount),
      paymentMethod,
      pixKey: pixKey || undefined,
      paymentDate: paymentDate || undefined,
      notes: proofFile?.name ? `Comprovante: ${proofFile.name}` : undefined
    })

    if (!result.success) {
      alert('❌ Erro ao salvar prêmio. Tente novamente.')
      return
    }

    // Atualizar estado local do histórico
    const updatedWinners: MonthlyWinner[] = monthlyWinnersState.map(m => {
      if (m.month !== currentMonth || m.year !== currentYear) return m
      if (m.firstPlaceUserId === selectedPrizeUserId) {
        return { ...m, firstPlaceAmount: Number(prizeAmount), firstPlaceStatus: 'paid' as const, firstPlaceMethod: paymentMethod as 'pix' | 'transfer' | 'stripe', firstPlacePixKey: pixKey || undefined, firstPlacePaymentDate: paymentDate || undefined }
      }
      if (m.secondPlaceUserId === selectedPrizeUserId) {
        return { ...m, secondPlaceAmount: Number(prizeAmount), secondPlaceStatus: 'paid' as const, secondPlaceMethod: paymentMethod as 'pix' | 'transfer' | 'stripe', secondPlacePixKey: pixKey || undefined, secondPlacePaymentDate: paymentDate || undefined }
      }
      if (m.thirdPlaceUserId === selectedPrizeUserId) {
        return { ...m, thirdPlaceAmount: Number(prizeAmount), thirdPlaceStatus: 'paid' as const, thirdPlaceMethod: paymentMethod as 'pix' | 'transfer' | 'stripe', thirdPlacePixKey: pixKey || undefined, thirdPlacePaymentDate: paymentDate || undefined }
      }
      return m
    })
    setMonthlyWinners(updatedWinners)
    setMonthlyWinnersState(updatedWinners)

    // Limpar formulário
    setPrizeAmount('')
    setPixKey('')
    setPaymentDate('')
    setPaymentMethod('pix')
    setProofFile(null)
    setPrizeModalOpen(false)

    alert('✅ Prêmio marcado como PAGO e salvo no banco de dados!')
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    // Atualizar estado local do objeto statusChanges
    setStatusChanges({
      ...statusChanges,
      [userId]: newStatus
    })

    console.log(`Status de ${userId} mudou para ${newStatus} e foi salvo no histórico`)
    // TODO: Integrar com Supabase para salvar status de pagamento
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // ========================================================================
  // TAB 1: RANKING ATUAL
  // ========================================================================

  const renderCurrentRanking = () => {
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const currentDay = now.getDate()
    const daysLeft = getDaysLeftInMonth()

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold zayia-gradient-text mb-2">
                🏆 Ranking Atual
              </h3>
              <p className="text-zayia-violet-gray">
                {currentDay}/{daysInMonth} dias | Faltam <strong>{daysLeft}</strong> dias para fim do mês
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onRefreshRanking}
                disabled={loading}
                className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>

              <button
                onClick={onFinalizeMonth}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2 hover:from-red-600 hover:to-pink-600 transition disabled:opacity-50"
              >
                <Flag className="w-4 h-4" />
                Finalizar Mês
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <Users className="w-6 h-6 text-zayia-deep-violet mx-auto mb-2" />
              <div className="text-xl font-bold text-zayia-deep-violet">{users.length}</div>
              <div className="text-xs text-zayia-violet-gray">Usuárias Ativas</div>
            </div>

            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <Trophy className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
              <div className="text-xl font-bold text-zayia-deep-violet">
                {users.reduce((sum, u) => sum + u.points, 0).toLocaleString()}
              </div>
              <div className="text-xs text-zayia-violet-gray">Pontos Distribuídos</div>
            </div>

            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-zayia-lavender mx-auto mb-2" />
              <div className="text-xl font-bold text-zayia-deep-violet">
                {formatCurrency(config.first_place_prize + config.second_place_prize + config.third_place_prize)}
              </div>
              <div className="text-xs text-zayia-violet-gray">Prêmio Total</div>
            </div>

            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <Zap className="w-6 h-6 text-zayia-orchid mx-auto mb-2" />
              <div className="text-xl font-bold text-zayia-deep-violet">30s</div>
              <div className="text-xs text-zayia-violet-gray">Próxima Atualização</div>
            </div>
          </div>
        </div>

        {/* Top 3 Destaque - Renderizado direto do monthlyWinnersState */}
        {(() => {
          const now = new Date()
          const currentMonth = now.getMonth() + 1
          const currentYear = now.getFullYear()
          const monthData = monthlyWinnersState.find(m =>
            m.month === currentMonth && m.year === currentYear
          )

          const topThree = [
            {
              position: 1,
              name: monthData?.firstPlaceName || 'Não preenchido',
              email: monthData?.firstPlaceEmail || '-',
              points: monthData?.firstPlacePoints || 0,
              amount: prizeConfig.firstPlace || monthData?.firstPlaceAmount || 0,
              status: monthData?.firstPlaceStatus || 'pending',
              icon: '🥇',
              userId: monthData?.firstPlaceUserId || '',
              bgGradient: 'from-yellow-50 to-orange-50',
              borderGradient: 'from-yellow-400 to-orange-500 border-yellow-300'
            },
            {
              position: 2,
              name: monthData?.secondPlaceName || 'Não preenchido',
              email: monthData?.secondPlaceEmail || '-',
              points: monthData?.secondPlacePoints || 0,
              amount: prizeConfig.secondPlace || monthData?.secondPlaceAmount || 0,
              status: monthData?.secondPlaceStatus || 'pending',
              icon: '🥈',
              userId: monthData?.secondPlaceUserId || '',
              bgGradient: 'from-gray-50 to-slate-50',
              borderGradient: 'from-gray-300 to-gray-400 border-gray-300'
            },
            {
              position: 3,
              name: monthData?.thirdPlaceName || 'Não preenchido',
              email: monthData?.thirdPlaceEmail || '-',
              points: monthData?.thirdPlacePoints || 0,
              amount: prizeConfig.thirdPlace || monthData?.thirdPlaceAmount || 0,
              status: monthData?.thirdPlaceStatus || 'pending',
              icon: '🥉',
              userId: monthData?.thirdPlaceUserId || '',
              bgGradient: 'from-orange-50 to-red-50',
              borderGradient: 'from-orange-400 to-red-500 border-orange-300'
            }
          ]

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {topThree.map((winner) => {
                const statusColor = winner.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : winner.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'

                const statusText = winner.status === 'paid'
                  ? '✅ Pago'
                  : winner.status === 'pending'
                  ? '⏳ Pendente'
                  : '❌ Cancelado'

                return (
                  <div
                    key={winner.position}
                    className={`zayia-card p-6 border-2 border-zayia-lilac/30 bg-gradient-to-br ${winner.bgGradient}`}
                  >
                    {/* Ícone posição */}
                    <div className="text-4xl mb-3">{winner.icon}</div>

                    {/* Nome e email */}
                    <h3 className="text-lg font-bold text-zayia-deep-violet mb-1">
                      {winner.name}
                    </h3>
                    <p className="text-sm text-zayia-violet-gray mb-4">
                      {winner.email}
                    </p>

                    {/* Pontos */}
                    <div className="flex justify-between text-sm mb-3 pb-3 border-b border-zayia-lilac/20">
                      <span className="text-zayia-violet-gray">Pontos:</span>
                      <span className="font-semibold text-zayia-deep-violet">
                        {winner.points.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {/* Prêmio */}
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-zayia-violet-gray">Prêmio:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(winner.amount)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-zayia-violet-gray">Status:</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Botão Gerenciar Prêmio */}
                    <button
                      onClick={() => handleOpenPrizeModal(winner.userId)}
                      className="w-full bg-zayia-lilac text-zayia-deep-violet px-3 py-2 rounded-lg font-medium hover:bg-zayia-lavender transition text-sm"
                    >
                      Gerenciar Prêmio →
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Lista Completa */}
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">Ranking Completo</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zayia-lilac/30">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Posição</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Email</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Pontos</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Hoje</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">1º Desafio</th>
                </tr>
              </thead>
              <tbody>
                {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user, idx) => (
                  <tr key={user.id} className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/10 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zayia-soft-purple">#{user.position}</span>
                        {user.positionChange === 'up' && (
                          <ChevronUp className="w-4 h-4 text-green-600" />
                        )}
                        {user.positionChange === 'down' && (
                          <ChevronDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-zayia-deep-violet">{user.name}</td>
                    <td className="py-3 px-4 text-sm text-zayia-violet-gray">{user.email}</td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-zayia-soft-purple">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-zayia-violet-gray">{user.completed_today}/4</td>
                    <td className="py-3 px-4 text-center text-xs text-zayia-violet-gray">
                      {new Date(user.firstChallengeTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-zayia-lilac/20 text-zayia-deep-violet disabled:opacity-50"
            >
              ← Anterior
            </button>
            <span className="px-3 py-2 text-sm text-zayia-violet-gray">
              Página {currentPage} de {Math.ceil(users.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= users.length}
              className="px-3 py-2 rounded-lg bg-zayia-lilac/20 text-zayia-deep-violet disabled:opacity-50"
            >
              Próxima →
            </button>
          </div>
        </div>

        {/* Modal Gerenciar Prêmio */}
        {prizeModalOpen && selectedPrizeUserId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-zayia-deep-violet mb-4">Gerenciar Prêmio</h2>

              {/* Nome da Usuária */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Usuária</label>
                <p className="text-sm text-zayia-violet-gray p-2 bg-zayia-lilac/20 rounded">
                  {users.find(u => u.id === selectedPrizeUserId)?.name}
                </p>
              </div>

              {/* Valor do Prêmio */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Valor Prêmio (R$)</label>
                <input
                  type="number"
                  value={prizeAmount}
                  onChange={(e) => setPrizeAmount(e.target.value)}
                  placeholder="500.00"
                  className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                />
              </div>

              {/* Método de Pagamento */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Método</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                >
                  <option value="pix">PIX</option>
                  <option value="transfer">Transferência Bancária</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              {/* Chave PIX (se PIX selecionado) */}
              {paymentMethod === 'pix' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Chave PIX</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="CPF, email ou chave aleatória"
                    className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple text-sm"
                  />
                </div>
              )}

              {/* Data do Pagamento */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Data do Pagamento</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                />
              </div>

              {/* Upload Comprovante */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Comprovante (Opcional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full border border-zayia-lilac/30 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                />
                {proofFile && <p className="text-xs text-green-600 mt-1">✅ {proofFile.name}</p>}
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPrizeModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-zayia-lilac/30 text-zayia-deep-violet rounded-lg font-medium hover:bg-zayia-lilac/10 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePrize}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                >
                  Marcar Pago ✅
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========================================================================
  // TAB 2: HISTÓRICO DE VENCEDORAS
  // ========================================================================

  const renderHistory = () => {
    // Filtrar por ano E mês
    const filteredWinners = monthlyWinnersState.filter(w => {
      const yearMatch = w.year === selectedYear
      const monthMatch = selectedMonth === null || w.month === selectedMonth
      return yearMatch && monthMatch
    })

    return (
      <div className="space-y-6">
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6" />
            Histórico de Vencedoras
          </h3>

          {/* Filtros de Ano e Mês */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Filtrar por Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value))
                  setSelectedMonth(null)
                }}
                className="w-full border border-zayia-lilac/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">Filtrar por Mês</label>
              <select
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-zayia-lilac/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
              >
                <option value="">Todos os meses</option>
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>
          </div>

          {/* Tabela */}
          {filteredWinners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zayia-violet-gray">Nenhum resultado para o período selecionado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-zayia-lilac/30 bg-zayia-lilac/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Mês/Ano</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Posição</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Vencedora</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Email</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Prêmio (R$)</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Data Pgto</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Método</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Comprovante</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWinners.map((winner) => (
                    <React.Fragment key={winner.id}>
                      {/* 1º Lugar */}
                      <tr className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/5">
                        <td className="py-3 px-4 font-semibold text-zayia-deep-violet">
                          {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][winner.month - 1]} {winner.year}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-lg font-bold">🥇 1º</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-zayia-deep-violet">{winner.firstPlaceName}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-zayia-violet-gray">{winner.firstPlaceEmail}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          {formatCurrency(winner.firstPlaceAmount || 0)}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-zayia-violet-gray">
                          {winner.firstPlacePaymentDate || '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-zayia-violet-gray">
                          {winner.firstPlaceMethod?.toUpperCase() || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            winner.firstPlaceStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : winner.firstPlaceStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {winner.firstPlaceStatus === 'paid' ? '✅ Pago' : winner.firstPlaceStatus === 'pending' ? '⏳ Pendente' : '❌ Cancelado'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {(() => {
                            const storageKey = `zayia_proof_${winner.firstPlaceUserId}_${winner.month}_${winner.year}`
                            const proofData = localStorage.getItem(storageKey)

                            if (proofData) {
                              try {
                                const proof = JSON.parse(proofData)
                                return (
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = proof.base64
                                      link.download = proof.name
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                    }}
                                    className="text-zayia-soft-purple hover:text-zayia-deep-violet text-sm font-medium transition"
                                    title={`Baixar: ${proof.name}`}
                                  >
                                    📥 {proof.name.split('.').pop()?.toUpperCase()}
                                  </button>
                                )
                              } catch {
                                return <span className="text-red-500 text-sm">❌ Erro</span>
                              }
                            }

                            return <span className="text-zayia-violet-gray text-sm">-</span>
                          })()}
                        </td>
                      </tr>

                      {/* 2º Lugar */}
                      <tr className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/5">
                        <td className="py-3 px-4 font-semibold text-zayia-deep-violet">
                          {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][winner.month - 1]} {winner.year}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-lg font-bold">🥈 2º</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-zayia-deep-violet">{winner.secondPlaceName}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-zayia-violet-gray">{winner.secondPlaceEmail}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          {formatCurrency(winner.secondPlaceAmount || 0)}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-zayia-violet-gray">
                          {winner.secondPlacePaymentDate || '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-zayia-violet-gray">
                          {winner.secondPlaceMethod?.toUpperCase() || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            winner.secondPlaceStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : winner.secondPlaceStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {winner.secondPlaceStatus === 'paid' ? '✅ Pago' : winner.secondPlaceStatus === 'pending' ? '⏳ Pendente' : '❌ Cancelado'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {(() => {
                            const storageKey = `zayia_proof_${winner.secondPlaceUserId}_${winner.month}_${winner.year}`
                            const proofData = localStorage.getItem(storageKey)

                            if (proofData) {
                              try {
                                const proof = JSON.parse(proofData)
                                return (
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = proof.base64
                                      link.download = proof.name
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                    }}
                                    className="text-zayia-soft-purple hover:text-zayia-deep-violet text-sm font-medium transition"
                                    title={`Baixar: ${proof.name}`}
                                  >
                                    📥 {proof.name.split('.').pop()?.toUpperCase()}
                                  </button>
                                )
                              } catch {
                                return <span className="text-red-500 text-sm">❌ Erro</span>
                              }
                            }

                            return <span className="text-zayia-violet-gray text-sm">-</span>
                          })()}
                        </td>
                      </tr>

                      {/* 3º Lugar */}
                      <tr className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/5">
                        <td className="py-3 px-4 font-semibold text-zayia-deep-violet">
                          {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][winner.month - 1]} {winner.year}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-lg font-bold">🥉 3º</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-zayia-deep-violet">{winner.thirdPlaceName}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-zayia-violet-gray">{winner.thirdPlaceEmail}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          {formatCurrency(winner.thirdPlaceAmount || 0)}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-zayia-violet-gray">
                          {winner.thirdPlacePaymentDate || '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-zayia-violet-gray">
                          {winner.thirdPlaceMethod?.toUpperCase() || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            winner.thirdPlaceStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : winner.thirdPlaceStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {winner.thirdPlaceStatus === 'paid' ? '✅ Pago' : winner.thirdPlaceStatus === 'pending' ? '⏳ Pendente' : '❌ Cancelado'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {(() => {
                            const storageKey = `zayia_proof_${winner.thirdPlaceUserId}_${winner.month}_${winner.year}`
                            const proofData = localStorage.getItem(storageKey)

                            if (proofData) {
                              try {
                                const proof = JSON.parse(proofData)
                                return (
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = proof.base64
                                      link.download = proof.name
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                    }}
                                    className="text-zayia-soft-purple hover:text-zayia-deep-violet text-sm font-medium transition"
                                    title={`Baixar: ${proof.name}`}
                                  >
                                    📥 {proof.name.split('.').pop()?.toUpperCase()}
                                  </button>
                                )
                              } catch {
                                return <span className="text-red-500 text-sm">❌ Erro</span>
                              }
                            }

                            return <span className="text-zayia-violet-gray text-sm">-</span>
                          })()}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ========================================================================
  // TAB 3: GERENCIAR PRÊMIOS
  // ========================================================================

  const handleSavePrizeConfig = () => {
    if (!prizeConfig.firstPlace || !prizeConfig.secondPlace || !prizeConfig.thirdPlace) {
      alert('Por favor, preencha todos os valores dos prêmios')
      return
    }

    // 🔥 ATUALIZAR monthlyWinnersState com novos valores
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const updatedWinners = monthlyWinnersState.map(month => {
      if (month.month === currentMonth && month.year === currentYear) {
        return {
          ...month,
          firstPlaceAmount: Number(prizeConfig.firstPlace),
          secondPlaceAmount: Number(prizeConfig.secondPlace),
          thirdPlaceAmount: Number(prizeConfig.thirdPlace)
        }
      }
      return month
    })

    // Atualizar estado
    setMonthlyWinnersState(updatedWinners)

    // Disparar evento de atualização
    setTimeout(() => {
      window.dispatchEvent(new Event('prizeConfigUpdated'))
    }, 100)

    console.log('✅ Prêmios atualizados:', {
      firstPlace: prizeConfig.firstPlace,
      secondPlace: prizeConfig.secondPlace,
      thirdPlace: prizeConfig.thirdPlace
    })

    alert('✅ Configurações de prêmios salvas com sucesso!')
  }

  const renderManagePrizes = () => {
    return (
      <div className="space-y-6">
        {/* CONFIGURAR PRÊMIOS */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zayia-deep-violet flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurar Prêmios
            </h3>
          </div>

          {!isEditingPrizeConfig ? (
            // ========================================================================
            // VIEW: VISUALIZAÇÃO (Quando NÃO está editando)
            // ========================================================================
            <div className="space-y-4">
              {/* 1º Lugar */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <label className="text-sm font-semibold text-zayia-deep-violet">
                    1º Lugar:
                  </label>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">
                    R$ {Number(prizeConfig.firstPlace).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* 2º Lugar */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-zayia-deep-violet">
                    2º Lugar:
                  </label>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">
                    R$ {Number(prizeConfig.secondPlace).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <label className="text-sm font-semibold text-zayia-deep-violet">
                    3º Lugar:
                  </label>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">
                    R$ {Number(prizeConfig.thirdPlace).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Auto-reset */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <label className="text-sm font-semibold text-zayia-deep-violet">
                    Auto-reset:
                  </label>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-zayia-violet-gray">
                    Desligado
                  </span>
                </div>
              </div>

              {/* Botão Editar */}
              <button
                onClick={() => setIsEditingPrizeConfig(true)}
                className="w-full bg-zayia-soft-purple text-white py-3 rounded-lg font-bold hover:bg-zayia-deep-violet transition"
              >
                ✏️ Editar Configurações
              </button>
            </div>
          ) : (
            // ========================================================================
            // VIEW: EDIÇÃO (Quando está editando)
            // ========================================================================
            <div className="space-y-4">
              {/* 1º Lugar Input */}
              <div>
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
                  1º Lugar (R$)
                </label>
                <input
                  type="number"
                  value={prizeConfig.firstPlace}
                  onChange={(e) =>
                    setPrizeConfig({
                      ...prizeConfig,
                      firstPlace: Number(e.target.value) || 0
                    })
                  }
                  className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                />
              </div>

              {/* 2º Lugar Input */}
              <div>
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
                  2º Lugar (R$)
                </label>
                <input
                  type="number"
                  value={prizeConfig.secondPlace}
                  onChange={(e) =>
                    setPrizeConfig({
                      ...prizeConfig,
                      secondPlace: Number(e.target.value) || 0
                    })
                  }
                  className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                />
              </div>

              {/* 3º Lugar Input */}
              <div>
                <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
                  3º Lugar (R$)
                </label>
                <input
                  type="number"
                  value={prizeConfig.thirdPlace}
                  onChange={(e) =>
                    setPrizeConfig({
                      ...prizeConfig,
                      thirdPlace: Number(e.target.value) || 0
                    })
                  }
                  className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
                />
              </div>

              {/* Auto-reset Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoReset"
                  className="w-4 h-4 rounded border-zayia-lilac/30"
                />
                <label
                  htmlFor="autoReset"
                  className="text-sm font-semibold text-zayia-deep-violet"
                >
                  Reset automático
                </label>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                {/* Cancelar */}
                <button
                  onClick={() => setIsEditingPrizeConfig(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  ✕ Cancelar
                </button>

                {/* Salvar */}
                <button
                  onClick={() => {
                    handleSavePrizeConfig()
                    setIsEditingPrizeConfig(false)
                  }}
                  className="flex-1 bg-zayia-soft-purple text-white py-3 rounded-lg font-bold hover:bg-zayia-deep-violet transition"
                >
                  ↓ Salvar Configurações
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ========================================================================
  // TAB 4: ANALYTICS & RELATÓRIOS
  // ========================================================================

  // ========================================================================
  // RENDER PRINCIPAL
  // ========================================================================

  return (
    <div className="space-y-6">
      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-zayia-soft-purple border-zayia-soft-purple'
                  : 'text-zayia-violet-gray border-transparent hover:text-zayia-deep-violet'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando dados...</p>
        </div>
      ) : (
        <>
          {activeTab === 'current' && renderCurrentRanking()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'manage' && renderManagePrizes()}
          {activeTab === 'analytics' && <AnalyticsSection monthlyWinnersState={monthlyWinnersState} />}
        </>
      )}
    </div>
  )
}
