import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Trophy, DollarSign, Users } from 'lucide-react'

interface AnalyticsSectionProps {
  monthlyWinnersState?: any[]
}

export function AnalyticsSection({ monthlyWinnersState = [] }: AnalyticsSectionProps) {
  // Estados
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  // Dados mockados (depois integra com monthlyWinnersState)
  const mockAllWinners = [
    {
      id: 'user1',
      name: 'Ana Silva',
      month: 2,
      year: 2024,
      position: 1,
      amount: 500,
      date: '2024-02-26'
    },
    {
      id: 'user2',
      name: 'Maria Santos',
      month: 2,
      year: 2024,
      position: 2,
      amount: 300,
      date: '2024-02-26'
    },
    {
      id: 'user3',
      name: 'Julia Costa',
      month: 2,
      year: 2024,
      position: 3,
      amount: 100,
      date: '2024-02-26'
    },
    {
      id: 'user1',
      name: 'Ana Silva',
      month: 1,
      year: 2024,
      position: 1,
      amount: 500,
      date: '2024-01-31'
    },
    {
      id: 'user4',
      name: 'Helena Rodrigues',
      month: 1,
      year: 2024,
      position: 2,
      amount: 300,
      date: '2024-01-31'
    },
    {
      id: 'user5',
      name: 'Larissa Martins',
      month: 1,
      year: 2024,
      position: 3,
      amount: 100,
      date: '2024-01-31'
    }
  ]

  // Transformar monthlyWinnersState se disponível
  const allWinners = useMemo(() => {
    if (monthlyWinnersState && monthlyWinnersState.length > 0) {
      return monthlyWinnersState.flatMap(month => [
        {
          id: month.firstPlaceUserId,
          name: month.firstPlaceName,
          month: month.month,
          year: month.year,
          position: 1,
          amount: month.firstPlaceAmount || 0,
          date: month.firstPlacePaymentDate || new Date().toISOString()
        },
        {
          id: month.secondPlaceUserId,
          name: month.secondPlaceName,
          month: month.month,
          year: month.year,
          position: 2,
          amount: month.secondPlaceAmount || 0,
          date: month.secondPlacePaymentDate || new Date().toISOString()
        },
        {
          id: month.thirdPlaceUserId,
          name: month.thirdPlaceName,
          month: month.month,
          year: month.year,
          position: 3,
          amount: month.thirdPlaceAmount || 0,
          date: month.thirdPlacePaymentDate || new Date().toISOString()
        }
      ])
    }
    return mockAllWinners
  }, [monthlyWinnersState])

  // Filtrar por ano e mês selecionados
  const filteredWinners = useMemo(() => {
    return allWinners.filter(w =>
      w.year === selectedYear && w.month === selectedMonth
    )
  }, [selectedYear, selectedMonth, allWinners])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalPrize = filteredWinners.reduce((sum, w) => sum + w.amount, 0)
    const uniqueWinners = new Set(filteredWinners.map(w => w.id)).size
    const avgPrize = uniqueWinners > 0 ? totalPrize / uniqueWinners : 0
    const monthWinner = filteredWinners.find(w => w.position === 1)

    return {
      totalPrize,
      uniqueWinners,
      avgPrize,
      monthWinner: monthWinner?.name || 'Nenhuma'
    }
  }, [filteredWinners])

  // Dados para gráfico
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {}

    filteredWinners.forEach(winner => {
      if (!grouped[winner.name]) {
        grouped[winner.name] = 0
      }
      grouped[winner.name] += winner.amount
    })

    return Object.entries(grouped).map(([name, total]) => ({
      name,
      premios: total
    }))
  }, [filteredWinners])

  // Dados para tabela (agregados por vencedora)
  const tableData = useMemo(() => {
    const grouped: Record<string, unknown> = {}

    filteredWinners.forEach(winner => {
      if (!grouped[winner.id]) {
        grouped[winner.id] = {
          id: winner.id,
          name: winner.name,
          wins: 0,
          totalAmount: 0,
          positions: [],
          date: winner.date
        }
      }
      grouped[winner.id].wins += 1
      grouped[winner.id].totalAmount += winner.amount
      grouped[winner.id].positions.push(winner.position)
    })

    return Object.values(grouped).sort((a, b) => b.totalAmount - a.totalAmount)
  }, [filteredWinners])

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-zayia-deep-violet flex items-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Analytics & Relatórios
        </h2>
      </div>

      {/* FILTROS */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">Filtros</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Filtro Ano */}
          <div>
            <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
              Ano
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>

          {/* Filtro Mês */}
          <div>
            <label className="block text-sm font-semibold text-zayia-deep-violet mb-2">
              Mês
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full border border-zayia-lilac/30 rounded p-2 focus:outline-none focus:ring-2 focus:ring-zayia-soft-purple"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total de Prêmios */}
        <div className="zayia-card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zayia-violet-gray font-semibold">Total de Prêmios</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-2xl font-bold text-green-600">
            R$ {stats.totalPrize.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Número de Vencedoras */}
        <div className="zayia-card p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zayia-violet-gray font-semibold">Vencedoras</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {stats.uniqueWinners}
          </span>
        </div>

        {/* Prêmio Médio */}
        <div className="zayia-card p-6 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zayia-violet-gray font-semibold">Prêmio Médio</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-2xl font-bold text-purple-600">
            R$ {stats.avgPrize.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Vencedora do Mês */}
        <div className="zayia-card p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zayia-violet-gray font-semibold">Campeã do Mês</span>
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-lg font-bold text-amber-600 truncate">
            {stats.monthWinner}
          </span>
        </div>
      </div>

      {/* GRÁFICO */}
      {chartData.length > 0 ? (
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
            Prêmios por Vencedora - {monthNames[selectedMonth - 1]} {selectedYear}
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis
                dataKey="name"
                stroke="rgba(139, 92, 246, 0.6)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="rgba(139, 92, 246, 0.6)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                contentStyle={{
                  backgroundColor: '#f3f0ff',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar
                dataKey="premios"
                fill="rgba(139, 92, 246, 0.8)"
                name="Total de Prêmios (R$)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="zayia-card p-6 text-center">
          <p className="text-zayia-violet-gray">Nenhum dado disponível para o período selecionado</p>
        </div>
      )}

      {/* TABELA DE DETALHES */}
      {tableData.length > 0 ? (
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
            Detalhes - {monthNames[selectedMonth - 1]} {selectedYear}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zayia-lilac/30 bg-zayia-lilac/10">
                  <th className="text-left py-3 px-4 font-semibold text-zayia-deep-violet">
                    Vencedora
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">
                    Posições
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">
                    Vezes Campeã
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-zayia-deep-violet">
                    Prêmio Individual (R$)
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-zayia-deep-violet">
                    Total em Prêmios (R$)
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-zayia-deep-violet">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((winner) => (
                  <tr
                    key={winner.id}
                    className="border-b border-zayia-lilac/20 hover:bg-zayia-lilac/5 transition"
                  >
                    {/* Nome */}
                    <td className="py-3 px-4 font-semibold text-zayia-deep-violet">
                      {winner.name}
                    </td>

                    {/* Posições */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        {winner.positions.map((pos: number, i: number) => (
                          <span
                            key={i}
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              pos === 1
                                ? 'bg-yellow-100 text-yellow-800'
                                : pos === 2
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {pos}º
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Vezes Campeã */}
                    <td className="py-3 px-4 text-center font-semibold text-zayia-soft-purple">
                      {winner.wins}
                    </td>

                    {/* Prêmio Individual */}
                    <td className="py-3 px-4 text-right text-zayia-violet-gray">
                      R$ {(winner.totalAmount / winner.wins).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Total em Prêmios */}
                    <td className="py-3 px-4 text-right font-bold text-green-600">
                      R$ {winner.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Data */}
                    <td className="py-3 px-4 text-center text-zayia-violet-gray text-xs">
                      {new Date(winner.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="zayia-card p-6 text-center">
          <p className="text-zayia-violet-gray">Nenhum registro disponível para o período selecionado</p>
        </div>
      )}
    </div>
  )
}
