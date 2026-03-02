import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Trophy, 
  Target,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'

// Tipos de dados
interface ChallengeData {
  date: string
  completed: number
  type: 'mindfulness' | 'fitness' | 'learning' | 'creativity' | 'social'
  week?: number
  month?: string
}

interface WeeklyData {
  week: string
  completed: number
  growth: number
}

interface MonthlyData {
  month: string
  completed: number
  growth: number
}

// Dados mock para demonstração
const generateMockData = (): ChallengeData[] => {
  const data: ChallengeData[] = []
  const types: ChallengeData['type'][] = ['mindfulness', 'fitness', 'learning', 'creativity', 'social']
  
  // Últimos 6 meses de dados
  for (let i = 180; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const completed = Math.floor(Math.random() * 15) + 5 // 5-20 desafios por dia
    const type = types[Math.floor(Math.random() * types.length)]
    
    data.push({
      date: date.toISOString().split('T')[0],
      completed,
      type
    })
  }
  
  return data
}

export function ChallengesStatsWidget() {
  const [data, setData] = useState<ChallengeData[]>([])
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Simular WebSocket/Polling para atualizações em tempo real
  useEffect(() => {
    // Carregar dados iniciais
    setData(generateMockData())

    // Simular atualizações em tempo real a cada 30 segundos
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData]
        // Atualizar último dia com novos desafios
        if (newData.length > 0) {
          newData[newData.length - 1].completed += Math.floor(Math.random() * 3)
        }
        return newData
      })
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Processar dados para visualização semanal
  const getWeeklyData = (): WeeklyData[] => {
    const weeks: { [key: string]: number } = {}
    const today = new Date()
    
    // Últimas 4 semanas
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - (today.getDay() + 7 * i))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      const weekKey = `Semana ${4 - i}`
      weeks[weekKey] = 0
      
      data.forEach(item => {
        const itemDate = new Date(item.date)
        if (itemDate >= weekStart && itemDate <= weekEnd) {
          weeks[weekKey] += item.completed
        }
      })
    }
    
    return Object.entries(weeks).map(([week, completed], index) => ({
      week,
      completed,
      growth: index > 0 ? Math.floor(Math.random() * 30) - 10 : 0
    }))
  }

  // Processar dados para visualização mensal
  const getMonthlyData = (): MonthlyData[] => {
    const months: { [key: string]: number } = {}
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = monthNames[date.getMonth()]
      months[monthKey] = 0
    }
    
    data.forEach(item => {
      const itemDate = new Date(item.date)
      const monthKey = monthNames[itemDate.getMonth()]
      if (months.hasOwnProperty(monthKey)) {
        months[monthKey] += item.completed
      }
    })
    
    return Object.entries(months).map(([month, completed], index) => ({
      month,
      completed,
      growth: index > 0 ? Math.floor(Math.random() * 25) - 5 : 0
    }))
  }

  // Calcular estatísticas gerais
  const getTotalStats = () => {
    const total = data.reduce((sum, item) => sum + item.completed, 0)
    const today = data.filter(item => item.date === new Date().toISOString().split('T')[0])
    const todayTotal = today.reduce((sum, item) => sum + item.completed, 0)
    
    return {
      total,
      today: todayTotal,
      average: Math.floor(total / Math.max(data.length, 1)),
      streak: Math.floor(Math.random() * 15) + 5 // Mock streak
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setData(generateMockData())
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const weeklyData = getWeeklyData()
  const monthlyData = getMonthlyData()
  const stats = getTotalStats()
  const currentData = viewMode === 'weekly' ? weeklyData : monthlyData

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="zayia-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              📊 Estatísticas de Desafios
            </h2>
            <p className="text-zayia-violet-gray text-sm">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </p>
          </div>
          
          <div className="flex gap-3">
            {/* Toggle de visualização */}
            <div className="flex bg-zayia-lilac/20 rounded-xl p-1">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-zayia-sunset text-white shadow-md'
                    : 'text-zayia-violet-gray hover:text-zayia-deep-violet'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Semanal
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'monthly'
                    ? 'bg-zayia-sunset text-white shadow-md'
                    : 'text-zayia-violet-gray hover:text-zayia-deep-violet'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Mensal
              </button>
            </div>
            
            {/* Botão de refresh */}
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="zayia-button px-4 py-2 rounded-xl text-white font-medium disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="zayia-card p-4 text-center">
          <Trophy className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.total}</div>
          <div className="text-sm text-zayia-violet-gray">Total Completos</div>
        </div>
        
        <div className="zayia-card p-4 text-center">
          <Target className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.today}</div>
          <div className="text-sm text-zayia-violet-gray">Hoje</div>
        </div>
        
        <div className="zayia-card p-4 text-center">
          <TrendingUp className="w-8 h-8 text-zayia-lavender mx-auto mb-2" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.average}</div>
          <div className="text-sm text-zayia-violet-gray">Média Diária</div>
        </div>
        
        <div className="zayia-card p-4 text-center">
          <Clock className="w-8 h-8 text-zayia-periwinkle mx-auto mb-2" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.streak}</div>
          <div className="text-sm text-zayia-violet-gray">Dias Seguidos</div>
        </div>
      </div>

      {/* Gráfico principal */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zayia-deep-violet">
            Desafios Completados - {viewMode === 'weekly' ? 'Últimas 4 Semanas' : 'Últimos 6 Meses'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-zayia-violet-gray">
            <div className="w-3 h-3 bg-zayia-sunset rounded-full"></div>
            Desafios Completados
          </div>
        </div>
        
        {/* Gráfico de barras customizado */}
        <div className="space-y-4">
          {currentData.map((item, index) => {
            const maxValue = Math.max(...currentData.map(d => d.completed))
            const percentage = (item.completed / maxValue) * 100
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zayia-deep-violet">
                    {viewMode === 'weekly' ? item.week : item.month}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-zayia-deep-violet">
                      {item.completed}
                    </span>
                    {item.growth !== 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.growth > 0 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {item.growth > 0 ? '+' : ''}{item.growth}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="w-full bg-zayia-lilac/30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full transition-all duration-1000 ease-out progress-shimmer"
                    style={{ 
                      width: `${percentage}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Breakdown por tipo de desafio */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-semibold text-zayia-deep-violet mb-4">
          Desafios por Categoria (Últimos 30 dias)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { type: 'mindfulness', label: 'Mindfulness', icon: '🧘‍♀️', color: 'from-purple-400 to-purple-600', count: 45 },
            { type: 'fitness', label: 'Fitness', icon: '💪', color: 'from-green-400 to-green-600', count: 38 },
            { type: 'learning', label: 'Aprendizado', icon: '📚', color: 'from-blue-400 to-blue-600', count: 52 },
            { type: 'creativity', label: 'Criatividade', icon: '🎨', color: 'from-pink-400 to-pink-600', count: 29 },
            { type: 'social', label: 'Social', icon: '👥', color: 'from-orange-400 to-orange-600', count: 33 }
          ].map((category, index) => (
            <div key={category.type} className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-xl font-bold text-zayia-deep-violet mb-1">
                {category.count}
              </div>
              <div className="text-sm text-zayia-violet-gray">
                {category.label}
              </div>
              <div className="mt-2 w-full bg-white rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000`}
                  style={{ 
                    width: `${(category.count / 52) * 100}%`,
                    animationDelay: `${index * 0.2}s`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de tempo real */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-zayia-violet-gray bg-zayia-lilac/20 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Atualizações em tempo real ativas
        </div>
      </div>
    </div>
  )
}