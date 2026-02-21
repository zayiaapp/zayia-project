import React, { useState } from 'react'
import { 
  Target, 
  Trophy, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Filter,
  Eye,
  Plus,
  Heart,
  Brain,
  Smartphone,
  MessageCircle,
  Dumbbell,
  Calendar,
  Briefcase
} from 'lucide-react'
import { RelationshipsIcon, DigitalDetoxIcon, HealthIcon } from '../ui/CustomIcons'

// Import dos dados de desafios
import autoestimaData from '../../data/autoestima.json'
import rotinaData from '../../data/rotina.json'
import digitalDetoxData from '../../data/digital_detox.json'
import mindfulnessData from '../../data/mindfulness.json'
import relacionamentosData from '../../data/relacionamentos.json'
import corpoSaudeData from '../../data/corpo_saude.json'
import carreiraData from '../../data/carreira.json'

interface ChallengeCategory {
  id: string
  label: string
  icon: string
  color: string
  data: any
  iconComponent: React.ComponentType<any>
}

// Mock de dados de métricas para cada categoria
const mockMetrics = {
  autoestima: {
    totalCompletions: 1247,
    weeklyGrowth: 12.5,
    avgDifficulty: 'Médio',
    topUsers: 89,
    completionRate: 78.3,
    avgTimeSpent: 15
  },
  rotina: {
    totalCompletions: 2156,
    weeklyGrowth: 8.7,
    avgDifficulty: 'Fácil',
    topUsers: 156,
    completionRate: 85.2,
    avgTimeSpent: 12
  },
  digital_detox: {
    totalCompletions: 892,
    weeklyGrowth: 23.1,
    avgDifficulty: 'Difícil',
    topUsers: 67,
    completionRate: 65.4,
    avgTimeSpent: 45
  },
  mindfulness: {
    totalCompletions: 1834,
    weeklyGrowth: 15.3,
    avgDifficulty: 'Médio',
    topUsers: 134,
    completionRate: 72.8,
    avgTimeSpent: 18
  },
  relacionamentos: {
    totalCompletions: 1456,
    weeklyGrowth: 9.8,
    avgDifficulty: 'Médio',
    topUsers: 98,
    completionRate: 81.7,
    avgTimeSpent: 20
  },
  corpo_saude: {
    totalCompletions: 1923,
    weeklyGrowth: 18.4,
    avgDifficulty: 'Médio',
    topUsers: 145,
    completionRate: 76.9,
    avgTimeSpent: 25
  },
  carreira: {
    totalCompletions: 1089,
    weeklyGrowth: 14.2,
    avgDifficulty: 'Difícil',
    topUsers: 78,
    completionRate: 69.5,
    avgTimeSpent: 35
  }
}

export function ChallengesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

  const categories: ChallengeCategory[] = [
    {
      id: 'autoestima',
      label: autoestimaData.label,
      icon: autoestimaData.icon,
      color: autoestimaData.color,
      data: autoestimaData,
      iconComponent: Heart
    },
    {
      id: 'rotina',
      label: rotinaData.label,
      icon: rotinaData.icon,
      color: rotinaData.color,
      data: rotinaData,
      iconComponent: Calendar
    },
    {
      id: 'digital_detox',
      label: digitalDetoxData.label,
      icon: digitalDetoxData.icon,
      color: 'from-red-400 to-red-600',
      data: digitalDetoxData,
      iconComponent: Smartphone
    },
    {
      id: 'mindfulness',
      label: mindfulnessData.label,
      icon: mindfulnessData.icon,
      color: mindfulnessData.color,
      data: mindfulnessData,
      iconComponent: Brain
    },
    {
      id: 'relacionamentos',
      label: relacionamentosData.label,
      icon: relacionamentosData.icon,
      color: 'from-yellow-400 to-yellow-600',
      data: relacionamentosData,
      iconComponent: RelationshipsIcon
    },
    {
      id: 'corpo_saude',
      label: corpoSaudeData.label,
      icon: corpoSaudeData.icon,
      color: 'from-teal-400 to-teal-600',
      data: corpoSaudeData,
      iconComponent: HealthIcon
    },
    {
      id: 'carreira',
      label: carreiraData.label,
      icon: carreiraData.icon,
      color: carreiraData.color,
      data: carreiraData,
      iconComponent: Briefcase
    }
  ]

  const getTotalMetrics = () => {
    const total = Object.values(mockMetrics).reduce((acc, metric) => ({
      completions: acc.completions + metric.totalCompletions,
      users: acc.users + metric.topUsers,
      iconComponent: DigitalDetoxIcon
    }), { completions: 0, users: 0, avgCompletion: 0 })

    return {
      ...total,
      avgCompletion: total.avgCompletion / categories.length
    }
  }

  const totalMetrics = getTotalMetrics()

  const renderCategoryCard = (category: ChallengeCategory) => {
    console.log('Category ID:', category.id)
console.log('Category Label:', category.label)
    
    // DEBUG: Verificar qual ícone está sendo usado
    let IconComponent
    if (category.id === 'autoestima') {
      IconComponent = Heart
      console.log('USANDO Heart para autoestima')
    } else if (category.id === 'rotina') {
      IconComponent = Calendar
      console.log('USANDO Calendar para rotina')
    } else if (category.id === 'digital_detox') {
      IconComponent = Smartphone
      console.log('USANDO Smartphone para digital_detox')
    } else if (category.id === 'mindfulness') {
      IconComponent = Brain
      console.log('USANDO Brain para mindfulness')
    } else if (category.id === 'relacionamentos') {
      IconComponent = MessageCircle
      console.log('USANDO MessageCircle para relacionamentos')
    } else if (category.id === 'corpo_saude') {
      IconComponent = Dumbbell
      console.log('USANDO Dumbbell para corpo_saude')
    } else if (category.id === 'carreira') {
      IconComponent = Briefcase
      console.log('USANDO Briefcase para carreira')
    } else {
      IconComponent = Heart
      console.log('USANDO Heart como fallback para:', category.id)
    }
    
    console.log('IconComponent final:', IconComponent)
    const metrics = mockMetrics[category.id as keyof typeof mockMetrics]
    
    return (
      <div 
        key={category.id}
        className="zayia-card p-6 cursor-pointer hover:scale-105 transition-all duration-300"
        onClick={() => setSelectedCategory(category.id)}
      >
        {/* Header da Categoria */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zayia-deep-violet">{category.label}</h3>
              <p className="text-sm text-zayia-violet-gray">
                {category.data.facil.length + category.data.dificil.length} desafios
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-zayia-soft-purple">
              {metrics.totalCompletions.toLocaleString()}
            </div>
            <div className="text-xs text-zayia-violet-gray">Completados</div>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-zayia-lilac/20 rounded-lg">
            <div className="text-lg font-bold text-zayia-deep-violet">{metrics.completionRate}%</div>
            <div className="text-xs text-zayia-violet-gray">Taxa Conclusão</div>
          </div>
          <div className="text-center p-2 bg-zayia-lilac/20 rounded-lg">
            <div className="text-lg font-bold text-zayia-soft-purple">{metrics.topUsers}</div>
            <div className="text-xs text-zayia-violet-gray">Usuárias Ativas</div>
          </div>
          <div className="text-center p-2 bg-zayia-lilac/20 rounded-lg">
            <div className="text-lg font-bold text-zayia-lavender">{metrics.avgTimeSpent}min</div>
            <div className="text-xs text-zayia-violet-gray">Tempo Médio</div>
          </div>
        </div>

        {/* Crescimento */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zayia-violet-gray">Crescimento Semanal</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-600">+{metrics.weeklyGrowth}%</span>
          </div>
        </div>

        {/* Preview de Desafios */}
        <div className="mt-4 pt-4 border-t border-zayia-lilac/30">
          <div className="text-xs text-zayia-violet-gray mb-2">Exemplos de Desafios:</div>
          <div className="space-y-1">
            <div className="text-xs text-zayia-deep-violet">
              • {category.data.facil[0]?.title.substring(0, 40)}...
            </div>
            <div className="text-xs text-zayia-deep-violet">
              • {category.data.dificil[0]?.title.substring(0, 40)}...
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDetailedView = () => {
    const category = categories.find(c => c.id === selectedCategory)
    if (!category) return null

    const metrics = mockMetrics[selectedCategory as keyof typeof mockMetrics]
    const IconComponent = category.iconComponent

    return (
      <div className="space-y-6">
        {/* Header Detalhado */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zayia-deep-violet">{category.label}</h2>
                <p className="text-zayia-violet-gray">
                  {category.data.facil.length} desafios fáceis • {category.data.dificil.length} desafios difíceis
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="zayia-button px-4 py-2 rounded-xl text-white font-medium"
            >
              ← Voltar
            </button>
          </div>

          {/* Métricas Detalhadas */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-deep-violet">
                {metrics.totalCompletions.toLocaleString()}
              </div>
              <div className="text-sm text-zayia-violet-gray">Total Completados</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-soft-purple">{metrics.completionRate}%</div>
              <div className="text-sm text-zayia-violet-gray">Taxa de Conclusão</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-lavender">{metrics.topUsers}</div>
              <div className="text-sm text-zayia-violet-gray">Usuárias Ativas</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-orchid">+{metrics.weeklyGrowth}%</div>
              <div className="text-sm text-zayia-violet-gray">Crescimento</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-periwinkle">{metrics.avgTimeSpent}min</div>
              <div className="text-sm text-zayia-violet-gray">Tempo Médio</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-amethyst">{metrics.avgDifficulty}</div>
              <div className="text-sm text-zayia-violet-gray">Dificuldade Média</div>
            </div>
          </div>
        </div>

        {/* Desafios Fáceis */}
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
            Desafios Fáceis ({category.data.facil.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {category.data.facil.slice(0, 20).map((challenge: any, index: number) => (
              <div key={challenge.id} className="p-4 border border-zayia-lilac/30 rounded-xl bg-green-50/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-zayia-deep-violet text-sm">
                    {index + 1}. {challenge.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {challenge.points} pts
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {challenge.duration}min
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zayia-violet-gray">
                  {challenge.description}
                </p>
              </div>
            ))}
          </div>
          {category.data.facil.length > 20 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-zayia-violet-gray">
                +{category.data.facil.length - 20} desafios adicionais...
              </span>
            </div>
          )}
        </div>

        {/* Desafios Difíceis */}
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
            Desafios Difíceis ({category.data.dificil.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {category.data.dificil.slice(0, 20).map((challenge: any, index: number) => (
              <div key={challenge.id} className="p-4 border border-zayia-lilac/30 rounded-xl bg-orange-50/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-zayia-deep-violet text-sm">
                    {index + 1}. {challenge.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {challenge.points} pts
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {challenge.duration}min
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zayia-violet-gray">
                  {challenge.description}
                </p>
              </div>
            ))}
          </div>
          {category.data.dificil.length > 20 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-zayia-violet-gray">
                +{category.data.dificil.length - 20} desafios adicionais...
              </span>
            </div>
          )}
        </div>

        {/* Análise de Popularidade */}
        <div className="zayia-card p-6">
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
            Análise de Popularidade
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Desafios Fáceis</span>
                <span>{Math.round((metrics.completionRate + 15))}% de conclusão</span>
              </div>
              <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                  style={{ width: `${metrics.completionRate + 15}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Desafios Difíceis</span>
                <span>{Math.round((metrics.completionRate - 10))}% de conclusão</span>
              </div>
              <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full"
                  style={{ width: `${metrics.completionRate - 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedCategory) {
    return renderDetailedView()
  }

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              📊 Sistema de Desafios ZAYIA
            </h2>
            <p className="text-zayia-violet-gray">
              Análise completa das 7 categorias de transformação pessoal
            </p>
          </div>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Target className="w-8 h-8 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {totalMetrics.completions.toLocaleString()}
            </div>
            <div className="text-sm text-zayia-violet-gray">Total de Completados</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Users className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{totalMetrics.users}</div>
            <div className="text-sm text-zayia-violet-gray">Usuárias Engajadas</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Trophy className="w-8 h-8 text-zayia-lavender mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {Math.round(totalMetrics.avgCompletion)}%
            </div>
            <div className="text-sm text-zayia-violet-gray">Taxa Média de Conclusão</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <BarChart3 className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">7</div>
            <div className="text-sm text-zayia-violet-gray">Categorias Ativas</div>
          </div>
        </div>
      </div>

      {/* Ranking de Categorias */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          🏆 Ranking de Popularidade
        </h3>
        <div className="space-y-3">
          {categories
            .sort((a, b) => mockMetrics[b.id as keyof typeof mockMetrics].totalCompletions - mockMetrics[a.id as keyof typeof mockMetrics].totalCompletions)
            .map((category, index) => {
              const metrics = mockMetrics[category.id as keyof typeof mockMetrics]
              const IconComponent = category.iconComponent
              
              return (
                <div key={category.id} className="flex items-center gap-4 p-3 bg-zayia-lilac/10 rounded-xl">
                  <div className="text-2xl font-bold text-zayia-soft-purple w-8">
                    #{index + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-zayia-deep-violet">{category.label}</div>
                    <div className="text-sm text-zayia-violet-gray">
                      {metrics.totalCompletions.toLocaleString()} completados • {metrics.topUsers} usuárias ativas
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-zayia-soft-purple">{metrics.completionRate}%</div>
                    <div className="text-xs text-zayia-violet-gray">Taxa de Conclusão</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-600">+{metrics.weeklyGrowth}%</span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Grid de Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map(renderCategoryCard)}
      </div>

      {/* Insights e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorias Mais Populares */}
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
            📈 Tendências da Semana
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Maior Crescimento</span>
              </div>
              <span className="text-green-700 font-bold">Digital Detox (+23.1%)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Mais Completada</span>
              </div>
              <span className="text-blue-700 font-bold">Rotina & Organização</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Mais Engajamento</span>
              </div>
              <span className="text-purple-700 font-bold">Corpo & Saúde</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horários de Maior Atividade */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          ⏰ Horários de Maior Atividade
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-3xl mb-2">🌅</div>
            <div className="text-lg font-bold text-zayia-deep-violet">7h - 9h</div>
            <div className="text-sm text-zayia-violet-gray">Manhã (35% das atividades)</div>
            <div className="text-xs text-yellow-700 mt-2">Rotina & Corpo & Saúde</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-3xl mb-2">🌞</div>
            <div className="text-lg font-bold text-zayia-deep-violet">12h - 14h</div>
            <div className="text-sm text-zayia-violet-gray">Almoço (25% das atividades)</div>
            <div className="text-xs text-orange-700 mt-2">Mindfulness & Digital Detox</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl mb-2">🌙</div>
            <div className="text-lg font-bold text-zayia-deep-violet">20h - 22h</div>
            <div className="text-sm text-zayia-violet-gray">Noite (40% das atividades)</div>
            <div className="text-xs text-purple-700 mt-2">Autoestima & Relacionamentos</div>
          </div>
        </div>
      </div>
    </div>
  )
}