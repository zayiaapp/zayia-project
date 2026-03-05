import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  DollarSign,
  Users,
  UserX,
  TrendingDown,
  Target,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import { supabaseClient } from '../../lib/supabase-client'
import { supabase } from '../../lib/supabase'

interface MetricsData {
  monthlyRevenue: number
  activeUsers: number
  cancelledUsers: number
  churnRate: number
  todayChallenges: number
  revenueTrend: number
  usersTrend: number
  cancellationsTrend: number
  churnTrend: number
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
    monthlyRevenue: 0,
    activeUsers: 0,
    cancelledUsers: 0,
    churnRate: 0,
    todayChallenges: 0,
    revenueTrend: 0,
    usersTrend: 0,
    cancellationsTrend: 0,
    churnTrend: 0
  })

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Fetch metrics for selected date with comparison
  useEffect(() => {
    const fetchDailyMetrics = async () => {
      try {
        setIsLoading(true)
        const stats = await supabaseClient.getDailyMetricsWithComparison(selectedDate)
        setMetrics({
          monthlyRevenue: stats.revenue,
          activeUsers: stats.activeUsers,
          cancelledUsers: stats.cancelledUsers,
          churnRate: stats.churnRate,
          todayChallenges: 0, // Not shown in daily view
          revenueTrend: stats.trending.revenuePercentage,
          usersTrend: stats.trending.activeUsersPercentage,
          cancellationsTrend: stats.trending.cancelledUsersPercentage,
          churnTrend: stats.trending.churnRatePercentage
        })
      } catch (error) {
        console.error('Error fetching daily metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDailyMetrics()
  }, [selectedDate])

  // Setup real-time subscription for daily analytics updates
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-daily-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_analytics'
        },
        () => {
          // When daily_analytics changes, refetch metrics for selected date
          supabaseClient.getDailyMetricsWithComparison(selectedDate)
            .then(stats => {
              setMetrics({
                monthlyRevenue: stats.revenue,
                activeUsers: stats.activeUsers,
                cancelledUsers: stats.cancelledUsers,
                churnRate: stats.churnRate,
                todayChallenges: 0,
                revenueTrend: stats.trending.revenuePercentage,
                usersTrend: stats.trending.activeUsersPercentage,
                cancellationsTrend: stats.trending.cancelledUsersPercentage,
                churnTrend: stats.trending.churnRatePercentage
              })
            })
            .catch(error => console.error('Error updating metrics on realtime:', error))
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
    }
  }, [selectedDate])

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

  // Calculate calendar position based on button position
  useEffect(() => {
    if (showCalendar && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCalendarPosition({
        top: rect.bottom + 8, // 8px gap below button
        right: window.innerWidth - rect.right
      })
    }
  }, [showCalendar])

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

  const getTrendingColor = (percentage: number): string => {
    if (percentage > 0) return 'text-green-500'
    if (percentage < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getTrendingIcon = (percentage: number) => {
    if (percentage > 0) return <TrendingUp className="w-4 h-4" />
    if (percentage < 0) return <TrendingDown className="w-4 h-4" />
    return <TrendingUp className="w-4 h-4 text-gray-500" />
  }

  const formatTrendingText = (percentage: number, label: string = '30 dias atrás'): string => {
    const sign = percentage > 0 ? '+' : ''
    return `${sign}${percentage}% vs ${label}`
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
          📊 Dashboard
        </h2>
        <p className="text-zayia-violet-gray">
          Métricas essenciais para tomada de decisão executiva
        </p>
      </div>

      {/* Data Selector */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-zayia-violet-gray">Data Selecionada</p>
            <p className="text-lg font-semibold text-zayia-deep-violet">
              {formatDate(selectedDate)}
            </p>
          </div>
          <div>
            <button
              ref={buttonRef}
              onClick={() => setShowCalendar(!showCalendar)}
              className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              Selecionar Data
            </button>

            {/* Calendário via Portal */}
            {showCalendar && createPortal(
              <>
                {/* Overlay - clica fora fecha o calendário */}
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 z-40"
                  onClick={() => setShowCalendar(false)}
                />

                {/* Calendário */}
                <div
                  className="fixed bg-white border-2 border-zayia-lilac rounded-xl shadow-2xl z-50 p-4 w-80"
                  style={{
                    top: `${calendarPosition.top}px`,
                    right: `${calendarPosition.right}px`
                  }}
                >
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
                    <span>💡 Clique em uma data para filtrar</span>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="text-zayia-soft-purple hover:text-zayia-deep-violet font-medium"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
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
            <span className={`w-4 h-4 ${getTrendingColor(metrics.revenueTrend)}`}>
              {getTrendingIcon(metrics.revenueTrend)}
            </span>
            <span className={`text-sm ${getTrendingColor(metrics.revenueTrend)}`}>
              {formatTrendingText(metrics.revenueTrend)}
            </span>
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
            <span className={`w-4 h-4 ${getTrendingColor(metrics.usersTrend)}`}>
              {getTrendingIcon(metrics.usersTrend)}
            </span>
            <span className={`text-sm ${getTrendingColor(metrics.usersTrend)}`}>
              {formatTrendingText(metrics.usersTrend)}
            </span>
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
            <span className={`w-4 h-4 ${getTrendingColor(metrics.cancellationsTrend)}`}>
              {getTrendingIcon(metrics.cancellationsTrend)}
            </span>
            <span className={`text-sm ${getTrendingColor(metrics.cancellationsTrend)}`}>
              {formatTrendingText(metrics.cancellationsTrend)}
            </span>
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
            <span className={`w-4 h-4 ${getTrendingColor(metrics.churnTrend)}`}>
              {getTrendingIcon(metrics.churnTrend)}
            </span>
            <span className={`text-sm ${getTrendingColor(metrics.churnTrend)}`}>
              {formatTrendingText(metrics.churnTrend)}
            </span>
          </div>
        </div>
      </div>

      {/* LINHA 2: Desafios de Hoje (Removido gráfico, ficou LINHA 2) */}
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

    </div>
  )
}