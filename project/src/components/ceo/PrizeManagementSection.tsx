import React, { useState, useEffect } from 'react'
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

  const itemsPerPage = 20

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMonthlyWinners(generateMockMonthlyWinners())

      // Mock pagamentos
      const mockPayments: PrizePayment[] = [
        {
          id: 'payment-1',
          winnerId: 'user-1',
          position: 1,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          prizeAmount: 500,
          status: 'pending',
          paymentMethod: 'pix',
          pixKey: '(11) 98765-4321',
          badgeEarned: 'winner-gold-2024',
          badgeEarnedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin-ceo'
        }
      ]
      setPayments(mockPayments)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
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

        {/* Top 3 Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.slice(0, 3).map((user, index) => {
            const medalColor = [
              'from-yellow-400 to-orange-500 border-yellow-300',
              'from-gray-300 to-gray-400 border-gray-300',
              'from-orange-400 to-red-500 border-orange-300'
            ][index]

            const bgColor = [
              'from-yellow-50 to-orange-50',
              'from-gray-50 to-slate-50',
              'from-orange-50 to-red-50'
            ][index]

            return (
              <div
                key={user.id}
                className={`zayia-card p-6 text-center bg-gradient-to-br ${bgColor} border-2 ${medalColor}`}
              >
                <div className="relative mb-4">
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                    }}
                  />
                  <div className="absolute -top-2 -right-2 text-3xl">
                    {getPrizeMedal(user.position)}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-zayia-deep-violet mb-1">{user.name}</h3>
                <p className="text-sm text-zayia-violet-gray mb-4">{user.email}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Pontos:</span>
                    <span className="font-bold text-zayia-soft-purple">{user.points.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Prêmio:</span>
                    <span className="font-bold text-green-600">{formatCurrency(user.prizeAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <select
                      value={user.prizeStatus || 'pending'}
                      onChange={(e) => {
                        // Handler para mudança de status
                      }}
                      className="zayia-input px-2 py-1 text-xs rounded border-0 focus:outline-none"
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-zayia-lilac text-zayia-deep-violet px-3 py-2 rounded-lg font-medium hover:bg-zayia-lavender transition text-sm">
                  Gerenciar Prêmio
                </button>
              </div>
            )
          })}
        </div>

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
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Badges</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Zona</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-zayia-deep-violet">Ação</th>
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
                    <td className="py-3 px-4 text-right text-sm text-zayia-lavender">{user.badges_count}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          user.zone === 'prize'
                            ? 'bg-yellow-100 text-yellow-800'
                            : user.zone === 'attention'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.zone === 'prize' ? '🏆 Prêmio' : user.zone === 'attention' ? '⚠️ Atenção' : 'Neutra'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-zayia-soft-purple hover:text-zayia-deep-violet transition text-sm font-medium">
                        Editar
                      </button>
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
      </div>
    )
  }

  // ========================================================================
  // TAB 2: HISTÓRICO DE VENCEDORAS
  // ========================================================================

  const renderHistory = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all')

    const filteredWinners = monthlyWinners.filter(w => w.year === selectedYear)

    return (
      <div className="space-y-6">
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-zayia-deep-violet flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Histórico de Vencedoras
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="zayia-input px-4 py-2 rounded-xl border-0 focus:outline-none"
            >
              {[2024, 2023, 2022, 2021].map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs de Status */}
          <div className="flex gap-2 mb-4 border-b border-zayia-lilac/30">
            {(['all', 'pending', 'paid', 'cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 font-medium text-sm transition border-b-2 ${
                  filterStatus === status
                    ? 'border-zayia-soft-purple text-zayia-soft-purple'
                    : 'border-transparent text-zayia-violet-gray hover:text-zayia-deep-violet'
                }`}
              >
                {status === 'all'
                  ? 'Todos'
                  : status === 'pending'
                  ? 'Pendentes'
                  : status === 'paid'
                  ? 'Pagos'
                  : 'Cancelados'}
              </button>
            ))}
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zayia-lilac/30">
                  <th className="text-left py-3 px-4 font-semibold text-zayia-deep-violet">Mês/Ano</th>
                  <th className="text-left py-3 px-4 font-semibold text-zayia-deep-violet">1º Lugar</th>
                  <th className="text-left py-3 px-4 font-semibold text-zayia-deep-violet">2º Lugar</th>
                  <th className="text-left py-3 px-4 font-semibold text-zayia-deep-violet">3º Lugar</th>
                  <th className="text-right py-3 px-4 font-semibold text-zayia-deep-violet">Prêmios (R$)</th>
                  <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredWinners.map((winner) => (
                  <tr
                    key={winner.id}
                    className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/10 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium text-zayia-deep-violet">
                      {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][winner.month - 1]} {winner.year}
                    </td>
                    <td className="py-3 px-4 text-zayia-violet-gray">
                      <div className="flex items-center gap-1">
                        <span>🥇</span>
                        <span>{winner.firstPlaceUserId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zayia-violet-gray">
                      <div className="flex items-center gap-1">
                        <span>🥈</span>
                        <span>{winner.secondPlaceUserId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zayia-violet-gray">
                      <div className="flex items-center gap-1">
                        <span>🥉</span>
                        <span>{winner.thirdPlaceUserId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-zayia-soft-purple">
                      {formatCurrency(
                        config.first_place_prize + config.second_place_prize + config.third_place_prize
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pendente</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-zayia-soft-purple hover:text-zayia-deep-violet transition text-sm font-medium">
                        Expandir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ========================================================================
  // TAB 3: GERENCIAR PRÊMIOS
  // ========================================================================

  const renderManagePrizes = () => {
    const pending = payments.filter(p => p.status === 'pending')
    const paid = payments.filter(p => p.status === 'paid')

    return (
      <div className="space-y-6">
        {/* Seção A: Pendentes */}
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            💰 Pagamentos Pendentes ({pending.length})
          </h3>

          {pending.length === 0 ? (
            <p className="text-center py-8 text-zayia-violet-gray">Nenhum pagamento pendente! 🎉</p>
          ) : (
            <div className="space-y-4">
              {pending.map(payment => (
                <div
                  key={payment.id}
                  className="p-4 bg-orange-50 border border-orange-200 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-bold text-zayia-deep-violet">{payment.winnerId}</div>
                      <div className="text-sm text-zayia-violet-gray">
                        {['', '1º Lugar 🥇', '2º Lugar 🥈', '3º Lugar 🥉'][payment.position]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(payment.prizeAmount)}</div>
                      <div className="text-xs text-zayia-violet-gray">
                        {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][payment.month - 1]} {payment.year}
                      </div>
                    </div>
                  </div>

                  {showPaymentForm === payment.id ? (
                    <div className="space-y-4 bg-white p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                          Valor (R$)
                        </label>
                        <input
                          type="number"
                          defaultValue={payment.prizeAmount}
                          className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                          placeholder="0,00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                          Método de Pagamento
                        </label>
                        <select className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none">
                          <option value="pix">PIX</option>
                          <option value="transfer">Transferência Bancária</option>
                          <option value="other">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                          Chave PIX (Telefone/Email)
                        </label>
                        <input
                          type="text"
                          defaultValue={payment.pixKey}
                          className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                          placeholder="(11) 9xxxx-xxxx ou email@exemplo.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                          Data do Pagamento
                        </label>
                        <input type="date" className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                          Upload Comprovante
                        </label>
                        <div className="border-2 border-dashed border-zayia-lilac rounded-lg p-4 text-center cursor-pointer hover:bg-zayia-lilac/10 transition">
                          <Upload className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
                          <p className="text-sm text-zayia-violet-gray">Clique para fazer upload ou arraste o arquivo</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                          Notas (Opcional)
                        </label>
                        <textarea
                          className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                          rows={3}
                          placeholder="Adicione anotações sobre o pagamento..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Marcar Pago
                        </button>
                        <button
                          onClick={() => setShowPaymentForm(null)}
                          className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPaymentForm(payment.id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Marcar Pago
                      </button>
                      <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm">
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção B: Histórico */}
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
            <Check className="w-6 h-6 text-green-500" />
            ✅ Pagamentos Realizados ({paid.length})
          </h3>

          {paid.length === 0 ? (
            <p className="text-center py-8 text-zayia-violet-gray">Nenhum pagamento realizado ainda</p>
          ) : (
            <div className="space-y-2">
              {paid.map(payment => (
                <div key={payment.id} className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zayia-deep-violet">{payment.winnerId}</div>
                    <div className="text-sm text-zayia-violet-gray">
                      Pago em {new Date(payment.paymentDate || '').toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{formatCurrency(payment.prizeAmount)}</div>
                    {payment.paymentProofUrl && (
                      <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Ver Comprovante
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção C: Configurações */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-zayia-deep-violet flex items-center gap-2">
              <Settings className="w-6 h-6" />
              ⚙️ Configurar Prêmios
            </h3>
            {editingConfig && (
              <button
                onClick={() => setEditingConfig(false)}
                className="text-sm text-zayia-soft-purple font-medium hover:text-zayia-deep-violet transition"
              >
                Pronto
              </button>
            )}
          </div>

          {editingConfig ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  1º Lugar (R$)
                </label>
                <input
                  type="number"
                  defaultValue={config.first_place_prize}
                  className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  2º Lugar (R$)
                </label>
                <input
                  type="number"
                  defaultValue={config.second_place_prize}
                  className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  3º Lugar (R$)
                </label>
                <input
                  type="number"
                  defaultValue={config.third_place_prize}
                  className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zayia-deep-violet mb-2">
                  <input type="checkbox" defaultChecked={config.auto_reset_enabled} className="rounded" />
                  Reset automático
                </label>
              </div>

              {config.auto_reset_enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                      Dia do Reset (28-31)
                    </label>
                    <input
                      type="number"
                      min="28"
                      max="31"
                      defaultValue={config.reset_day}
                      className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                      Hora (HH:MM)
                    </label>
                    <input
                      type="time"
                      defaultValue={config.reset_time}
                      className="zayia-input w-full px-4 py-2 rounded-lg border-0 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <button className="w-full bg-zayia-lilac text-zayia-deep-violet px-4 py-2 rounded-lg font-medium hover:bg-zayia-lavender transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                💾 SALVAR CONFIGURAÇÕES
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-zayia-lilac/20 rounded-lg">
                <span className="text-zayia-deep-violet font-medium">1º Lugar:</span>
                <span className="text-zayia-soft-purple font-bold">{formatCurrency(config.first_place_prize)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zayia-lilac/20 rounded-lg">
                <span className="text-zayia-deep-violet font-medium">2º Lugar:</span>
                <span className="text-zayia-soft-purple font-bold">{formatCurrency(config.second_place_prize)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zayia-lilac/20 rounded-lg">
                <span className="text-zayia-deep-violet font-medium">3º Lugar:</span>
                <span className="text-zayia-soft-purple font-bold">{formatCurrency(config.third_place_prize)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zayia-lilac/20 rounded-lg">
                <span className="text-zayia-deep-violet font-medium">Auto-reset:</span>
                <span className="text-zayia-soft-purple font-bold">{config.auto_reset_enabled ? 'Ligado' : 'Desligado'}</span>
              </div>

              <button
                onClick={() => setEditingConfig(true)}
                className="w-full bg-zayia-lilac text-zayia-deep-violet px-4 py-2 rounded-lg font-medium hover:bg-zayia-lavender transition flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Configurações
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ========================================================================
  // TAB 4: ANALYTICS & RELATÓRIOS
  // ========================================================================

  const renderAnalytics = () => {
    const totalSpent = monthlyWinners.reduce(
      (sum, w) => sum + config.first_place_prize + config.second_place_prize + config.third_place_prize,
      0
    )
    const monthsActive = monthlyWinners.length
    const averageSpent = Math.floor(totalSpent / monthsActive)

    return (
      <div className="space-y-6">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="zayia-card p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{formatCurrency(totalSpent)}</div>
            <div className="text-sm text-zayia-violet-gray">Gasto Total 2024</div>
          </div>

          <div className="zayia-card p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{monthsActive}</div>
            <div className="text-sm text-zayia-violet-gray">Meses Ativos</div>
          </div>

          <div className="zayia-card p-6 text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{formatCurrency(averageSpent)}</div>
            <div className="text-sm text-zayia-violet-gray">Gasto Médio</div>
          </div>

          <div className="zayia-card p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">8</div>
            <div className="text-sm text-zayia-violet-gray">Vencedoras Únicas</div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">Gastos por Mês (2024)</h3>
          <div className="h-64 bg-zayia-lilac/10 rounded-lg flex items-end justify-around p-4">
            {monthlyWinners
              .filter(w => w.year === 2024)
              .sort((a, b) => a.month - b.month)
              .map((winner, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="bg-gradient-to-t from-zayia-soft-purple to-zayia-lavender rounded-t-lg"
                    style={{
                      height: `${(totalSpent / monthlyWinners.length / 100) * 1.5}px`,
                      minHeight: '20px'
                    }}
                  />
                  <div className="text-xs text-zayia-violet-gray mt-2">
                    {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][winner.month - 1]}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Vencedoras */}
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            🏆 Top Vencedoras de 2024
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zayia-lilac/30">
                <th className="text-left py-3 px-4 font-semibold text-zayia-deep-violet">Nome</th>
                <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">Vezes</th>
                <th className="text-right py-3 px-4 font-semibold text-zayia-deep-violet">Total (R$)</th>
                <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">Melhor Pos</th>
                <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">Mês Recente</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/10">
                <td className="py-3 px-4 font-medium text-zayia-deep-violet">Ana Silva</td>
                <td className="py-3 px-4 text-center text-zayia-soft-purple font-bold">3</td>
                <td className="py-3 px-4 text-right text-green-600 font-bold">{formatCurrency(1300)}</td>
                <td className="py-3 px-4 text-center text-zayia-violet-gray">1º 🥇</td>
                <td className="py-3 px-4 text-center text-zayia-violet-gray">Novembro</td>
              </tr>
              <tr className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/10">
                <td className="py-3 px-4 font-medium text-zayia-deep-violet">Maria Santos</td>
                <td className="py-3 px-4 text-center text-zayia-soft-purple font-bold">2</td>
                <td className="py-3 px-4 text-right text-green-600 font-bold">{formatCurrency(800)}</td>
                <td className="py-3 px-4 text-center text-zayia-violet-gray">2º 🥈</td>
                <td className="py-3 px-4 text-center text-zayia-violet-gray">Outubro</td>
              </tr>
              <tr className="hover:bg-zayia-lilac/10">
                <td className="py-3 px-4 font-medium text-zayia-deep-violet">Julia Costa</td>
                <td className="py-3 px-4 text-center text-zayia-soft-purple font-bold">2</td>
                <td className="py-3 px-4 text-right text-green-600 font-bold">{formatCurrency(700)}</td>
                <td className="py-3 px-4 text-center text-zayia-violet-gray">1º 🥇</td>
                <td className="py-3 px-4 text-center text-zayia-violet-gray">Setembro</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="zayia-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-600">
            <div className="text-lg font-bold text-green-800 mb-1">Ana Silva foi 1º lugar 3 vezes em 2024</div>
            <div className="text-sm text-green-700">Maior campeã do ano</div>
          </div>

          <div className="zayia-card p-6 bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-orange-600">
            <div className="text-lg font-bold text-orange-800 mb-1">Fevereiro foi o mês com maior prêmio</div>
            <div className="text-sm text-orange-700">Total: {formatCurrency(1200)}</div>
          </div>

          <div className="zayia-card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-600">
            <div className="text-lg font-bold text-blue-800 mb-1">5 novas vencedoras em 2024</div>
            <div className="text-sm text-blue-700">+67% vs 2023 (3 vencedoras)</div>
          </div>
        </div>
      </div>
    )
  }

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
          {activeTab === 'analytics' && renderAnalytics()}
        </>
      )}
    </div>
  )
}
