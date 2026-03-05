import React, { useState, useEffect } from 'react'
import {
  DollarSign,
  Users,
  UserX,
  TrendingDown,
  Target,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Download
} from 'lucide-react'
import { supabaseClient } from '../../lib/supabase-client'

interface MetricsData {
  monthlyRevenue: number
  activeUsers: number
  cancelledUsers: number
  churnRate: number
  todayChallenges: number
}

interface ChartData {
  date: string
  revenue: number
  activeUsers: number
  challenges: number
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
  hasData: boolean
}

export function Dashboard2Section() {
  const [metrics, setMetrics] = useState<MetricsData>({
    monthlyRevenue: 127340,
    activeUsers: 1247,
    cancelledUsers: 89,
    churnRate: 3.2,
    todayChallenges: 156
  })

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly')
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real data from supabase on component mount
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        const stats = await supabaseClient.getAdminStatistics(month, year)
        setMetrics({
          monthlyRevenue: stats.revenue,
          activeUsers: stats.activeUsers,
          cancelledUsers: stats.cancelledUsers,
          churnRate: stats.churnRate,
          todayChallenges: stats.todayChallengesCount
        })
      } catch (error) {
        console.error('Error fetching admin statistics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminStats()
  }, [])


  // Carregar dados do gráfico via Supabase
  useEffect(() => {
    const loadChartData = async () => {
      const analytics = await supabaseClient.getDailyAnalytics(30)
      const mapped: ChartData[] = analytics.map(a => ({
        date: a.date,
        revenue: a.revenue_brl || 0,
        activeUsers: a.active_users || 0,
        challenges: a.challenges_completed || 0
      }))
      setChartData(mapped)
    }
    loadChartData()
  }, [])

  // Atualizar desafios de hoje a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()
      supabaseClient.getAdminStatistics(month, year).then(stats => {
        setMetrics(prev => ({
          ...prev,
          todayChallenges: stats.todayChallengesCount
        }))
      })
    }, 60000) // A cada 1 minuto

    return () => clearInterval(interval)
  }, [])

  // Gerar calendário
  const generateCalendar = (): CalendarDay[] => {
    const year = currentCalendarMonth.getFullYear()
    const month = currentCalendarMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Começar no domingo
    
    const days: CalendarDay[] = []
    const today = new Date()
    
    for (let i = 0; i < 42; i++) { // 6 semanas
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isSelected: date.toDateString() === selectedDate.toDateString(),
        isToday: date.toDateString() === today.toDateString(),
        hasData: date <= today // Só tem dados até hoje
      })
    }
    
    return days
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setShowCalendar(false)
  }

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentCalendarMonth)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentCalendarMonth(newDate)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const exportToCSV = () => {
    try {
      // Prepare CSV content
      const headers = ['Data', 'Receita', 'Usuárias Ativas', 'Desafios']
      const rows = chartData.map(item => [
        item.date,
        item.revenue.toString(),
        item.activeUsers.toString(),
        item.challenges.toString()
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      // Create and download file
      const element = document.createElement('a')
      const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      element.href = URL.createObjectURL(file)
      element.download = `dashboard_${new Date().toISOString().split('T')[0]}.csv`
      element.click()
      URL.revokeObjectURL(element.href)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Erro ao exportar CSV')
    }
  }

  const calendarDays = generateCalendar()
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          📊 Dashboard 2.0 - Visão Estratégica
        </h2>
        <p className="text-zayia-violet-gray">
          Métricas essenciais para tomada de decisão executiva
        </p>
      </div>

      {/* LINHA 1: Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Mensal */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zayia-violet-gray">Receita Mensal</p>
              <p className="text-3xl font-bold text-zayia-deep-violet">
                {formatCurrency(metrics.monthlyRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">+18% este mês</span>
          </div>
        </div>

        {/* Usuárias Ativas */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zayia-violet-gray">Usuárias Ativas</p>
              <p className="text-3xl font-bold text-zayia-deep-violet">
                {metrics.activeUsers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-zayia-soft-purple" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">+12% este mês</span>
          </div>
        </div>

        {/* Usuárias Canceladas */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zayia-violet-gray">Cancelamentos</p>
              <p className="text-3xl font-bold text-zayia-deep-violet">
                {metrics.cancelledUsers}
              </p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-500">+5% este mês</span>
          </div>
        </div>

        {/* Taxa de Churn */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zayia-violet-gray">Taxa de Churn</p>
              <p className="text-3xl font-bold text-zayia-deep-violet">
                {metrics.churnRate}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-500">+0.3% este mês</span>
          </div>
        </div>
      </div>

      {/* LINHA 2: Gráfico Principal com Seletor de Data */}
      <div className="zayia-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">
              Evolução de Receita e Usuárias
            </h3>
            <p className="text-zayia-violet-gray">
              Dados a partir de: {formatDate(selectedDate)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Seletor de Período */}
            <div className="flex bg-zayia-lilac/20 rounded-xl p-1">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'daily'
                    ? 'bg-zayia-sunset text-white shadow-md'
                    : 'text-zayia-violet-gray hover:text-zayia-deep-violet'
                }`}
              >
                Diário
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'monthly'
                    ? 'bg-zayia-sunset text-white shadow-md'
                    : 'text-zayia-violet-gray hover:text-zayia-deep-violet'
                }`}
              >
                Mensal
              </button>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
              title="Exportar dados para CSV"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>

            {/* Seletor de Data */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                Selecionar Data
              </button>

              {/* Calendário Dropdown */}
              {showCalendar && (
                <div className="absolute top-12 right-0 bg-white border-2 border-zayia-lilac rounded-xl shadow-xl z-50 p-4 w-80">
                  {/* Header do Calendário */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateCalendar('prev')}
                      className="p-2 hover:bg-zayia-lilac/20 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-zayia-deep-violet" />
                    </button>
                    
                    <h4 className="text-lg font-bold text-zayia-deep-violet">
                      {monthNames[currentCalendarMonth.getMonth()]} {currentCalendarMonth.getFullYear()}
                    </h4>
                    
                    <button
                      onClick={() => navigateCalendar('next')}
                      className="p-2 hover:bg-zayia-lilac/20 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-zayia-deep-violet" />
                    </button>
                  </div>

                  {/* Dias da Semana */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-zayia-violet-gray p-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Dias do Calendário */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day.hasData && handleDateSelect(day.date)}
                        disabled={!day.hasData}
                        className={`
                          p-2 text-sm rounded-lg transition-all
                          ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                          ${day.isToday ? 'bg-blue-100 text-blue-600 font-bold' : ''}
                          ${day.isSelected ? 'bg-zayia-sunset text-white font-bold' : ''}
                          ${day.hasData && !day.isSelected && !day.isToday ? 'hover:bg-zayia-lilac/30 text-zayia-deep-violet' : ''}
                          ${!day.hasData ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        `}
                      >
                        {day.date.getDate()}
                      </button>
                    ))}
                  </div>

                  {/* Footer do Calendário */}
                  <div className="mt-4 pt-3 border-t border-zayia-lilac/30">
                    <div className="flex items-center justify-between text-xs text-zayia-violet-gray">
                      <span>💡 Clique em uma data para ver os dados</span>
                      <button
                        onClick={() => setShowCalendar(false)}
                        className="text-zayia-soft-purple hover:text-zayia-deep-violet font-medium"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="space-y-4">
          {/* Legenda */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              <span className="text-sm text-zayia-violet-gray">Receita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full"></div>
              <span className="text-sm text-zayia-violet-gray">Usuárias Ativas</span>
            </div>
          </div>

          {/* Área do Gráfico */}
          <div className="h-64 relative">
            {chartData.length > 0 ? (
              <div className="space-y-3 h-full overflow-y-auto">
                {chartData.map((item, index) => {
                  const maxRevenue = Math.max(...chartData.map(d => d.revenue))
                  const maxUsers = Math.max(...chartData.map(d => d.activeUsers))
                  const revenuePercentage = (item.revenue / maxRevenue) * 100
                  const usersPercentage = (item.activeUsers / maxUsers) * 100
                  
                  const displayDate = viewMode === 'daily' 
                    ? new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                    : new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-zayia-deep-violet w-16">
                          {displayDate}
                        </span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            {formatCurrency(item.revenue)}
                          </span>
                          <span className="text-zayia-soft-purple font-medium">
                            {item.activeUsers} usuárias
                          </span>
                        </div>
                      </div>
                      
                      {/* Barras do Gráfico */}
                      <div className="space-y-1">
                        {/* Barra de Receita */}
                        <div className="w-full bg-green-100 rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${revenuePercentage}%`,
                              animationDelay: `${index * 0.1}s`
                            }}
                          ></div>
                        </div>
                        
                        {/* Barra de Usuárias */}
                        <div className="w-full bg-zayia-lilac/30 rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${usersPercentage}%`,
                              animationDelay: `${index * 0.1 + 0.05}s`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-zayia-violet-gray mx-auto mb-2" />
                  <p className="text-zayia-violet-gray">Carregando dados do gráfico...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LINHA 3: Desafios de Hoje */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zayia-violet-gray">Desafios Cumpridos Hoje</p>
            <p className="text-4xl font-bold text-zayia-deep-violet">
              {metrics.todayChallenges}
            </p>
            <p className="text-sm text-zayia-violet-gray mt-1">
              Atualizado em tempo real • {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <div className="text-center">
            <Target className="w-12 h-12 text-zayia-orchid mx-auto mb-2" />
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto"></div>
          </div>
        </div>
        
        {/* Barra de Progresso da Meta Diária */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
            <span>Meta diária: 200 desafios</span>
            <span>{Math.round((metrics.todayChallenges / 200) * 100)}%</span>
          </div>
          <div className="w-full bg-zayia-lilac/30 rounded-full h-4">
            <div 
              className="h-4 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${Math.min(100, (metrics.todayChallenges / 200) * 100)}%` }}
            >
              {/* Efeito shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de Tempo Real */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-zayia-violet-gray bg-zayia-lilac/20 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Dashboard atualizado em tempo real
          <span className="text-zayia-soft-purple">•</span>
          Próxima atualização em {60 - new Date().getSeconds()}s
        </div>
      </div>
    </div>
  )
}