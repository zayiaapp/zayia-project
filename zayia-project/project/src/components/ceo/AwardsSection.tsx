import React, { useState } from 'react'
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Calendar, 
  Users, 
  TrendingUp, 
  Shield, 
  Flame, 
  Gem, 
  Sparkles,
  Medal,
  ChevronRight,
  BarChart3,
  Clock,
  CheckCircle,
  Circle,
  Heart,
  Brain,
  Smartphone,
  MessageCircle,
  Dumbbell,
  Briefcase,
  Home,
  Eye,
  Filter,
  Hexagon,
  Diamond,
  Octagon,
  Pentagon,
  Square,
  Triangle
} from 'lucide-react'

// Tipos de dados
interface Badge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary'
  category: string
  requirement: number
  currentProgress: number
  totalUsers: number
  completedUsers: number
  completionRate: number
  averageTimeToComplete: number
  points: number
}

interface Level {
  level: number
  pointsRequired: number
  name: string
  icon: React.ComponentType<any>
  color: string
  usersAtLevel: number
  description: string
}

// Sistema de níveis com ícones profissionais
const levels: Level[] = [
  { level: 0, pointsRequired: 0, name: 'Iniciante', icon: Circle, color: 'from-gray-400 to-gray-600', usersAtLevel: 45, description: 'Começando a jornada' },
  { level: 1, pointsRequired: 168, name: 'Exploradora', icon: Eye, color: 'from-green-400 to-green-600', usersAtLevel: 89, description: 'Descobrindo novos caminhos' },
  { level: 2, pointsRequired: 336, name: 'Aprendiz', icon: Target, color: 'from-blue-400 to-blue-600', usersAtLevel: 156, description: 'Absorvendo conhecimento' },
  { level: 3, pointsRequired: 504, name: 'Praticante', icon: Zap, color: 'from-yellow-400 to-yellow-600', usersAtLevel: 134, description: 'Aplicando aprendizados' },
  { level: 4, pointsRequired: 672, name: 'Dedicada', icon: Shield, color: 'from-orange-400 to-orange-600', usersAtLevel: 98, description: 'Comprometida com crescimento' },
  { level: 5, pointsRequired: 840, name: 'Guerreira', icon: Award, color: 'from-red-400 to-red-600', usersAtLevel: 67, description: 'Enfrentando desafios' },
  { level: 6, pointsRequired: 1008, name: 'Sábia', icon: Brain, color: 'from-purple-400 to-purple-600', usersAtLevel: 45, description: 'Sabedoria conquistada' },
  { level: 7, pointsRequired: 1176, name: 'Inspiradora', icon: Sparkles, color: 'from-pink-400 to-pink-600', usersAtLevel: 23, description: 'Inspirando outras' },
  { level: 8, pointsRequired: 1344, name: 'Mestra', icon: Crown, color: 'from-indigo-400 to-indigo-600', usersAtLevel: 12, description: 'Dominando a arte' },
  { level: 9, pointsRequired: 1680, name: 'Lendária', icon: Diamond, color: 'from-violet-400 to-violet-600', usersAtLevel: 5, description: 'Lenda viva' }
]

// Sistema de medalhas com ícones profissionais
const badges: Badge[] = [
  // Medalhas de Início
  {
    id: 'primeiro-passo',
    name: 'Primeiro Passo',
    description: 'Completou o 1º desafio',
    icon: CheckCircle,
    rarity: 'bronze',
    category: 'Início',
    requirement: 1,
    currentProgress: 1247,
    totalUsers: 1247,
    completedUsers: 1247,
    completionRate: 100,
    averageTimeToComplete: 0.5,
    points: 1
  },
  {
    id: 'primeira-semana',
    name: 'Primeira Semana',
    description: '7 dias seguidos de login',
    icon: Calendar,
    rarity: 'bronze',
    category: 'Início',
    requirement: 7,
    currentProgress: 892,
    totalUsers: 1247,
    completedUsers: 892,
    completionRate: 71.5,
    averageTimeToComplete: 7,
    points: 50
  },
  {
    id: 'exploradora',
    name: 'Exploradora',
    description: 'Acessou todas as 7 categorias ao menos 1 vez',
    icon: Eye,
    rarity: 'bronze',
    category: 'Início',
    requirement: 7,
    currentProgress: 756,
    totalUsers: 1247,
    completedUsers: 756,
    completionRate: 60.6,
    averageTimeToComplete: 3,
    points: 100
  },

  // Medalhas de Progresso Global
  {
    id: 'desafiante',
    name: 'Desafiante',
    description: '50 desafios concluídos',
    icon: Target,
    rarity: 'silver',
    category: 'Progresso Global',
    requirement: 50,
    currentProgress: 567,
    totalUsers: 1247,
    completedUsers: 567,
    completionRate: 45.5,
    averageTimeToComplete: 25,
    points: 200
  },
  {
    id: 'constante',
    name: 'Constante',
    description: '200 desafios concluídos',
    icon: Flame,
    rarity: 'gold',
    category: 'Progresso Global',
    requirement: 200,
    currentProgress: 234,
    totalUsers: 1247,
    completedUsers: 234,
    completionRate: 18.8,
    averageTimeToComplete: 90,
    points: 500
  },
  {
    id: 'executora',
    name: 'Executora',
    description: '500 desafios concluídos',
    icon: Zap,
    rarity: 'diamond',
    category: 'Progresso Global',
    requirement: 500,
    currentProgress: 89,
    totalUsers: 1247,
    completedUsers: 89,
    completionRate: 7.1,
    averageTimeToComplete: 200,
    points: 1000
  },
  {
    id: 'mestre-desafios',
    name: 'Mestre dos Desafios',
    description: '840 desafios concluídos (todos)',
    icon: Crown,
    rarity: 'legendary',
    category: 'Progresso Global',
    requirement: 840,
    currentProgress: 23,
    totalUsers: 1247,
    completedUsers: 23,
    completionRate: 1.8,
    averageTimeToComplete: 365,
    points: 2000
  },

  // Medalhas de Categoria
  {
    id: 'meia-categoria',
    name: 'Meia Categoria',
    description: '60 desafios concluídos na mesma categoria',
    icon: Medal,
    rarity: 'silver',
    category: 'Categorias',
    requirement: 60,
    currentProgress: 345,
    totalUsers: 1247,
    completedUsers: 345,
    completionRate: 27.7,
    averageTimeToComplete: 45,
    points: 300
  },
  {
    id: 'categoria-completa',
    name: 'Categoria Completa',
    description: '120 desafios concluídos na mesma categoria',
    icon: Trophy,
    rarity: 'gold',
    category: 'Categorias',
    requirement: 120,
    currentProgress: 156,
    totalUsers: 1247,
    completedUsers: 156,
    completionRate: 12.5,
    averageTimeToComplete: 90,
    points: 600
  },
  {
    id: 'tres-categorias',
    name: 'Três Categorias Completas',
    description: '3 categorias completas (3 × 120)',
    icon: Hexagon,
    rarity: 'diamond',
    category: 'Categorias',
    requirement: 360,
    currentProgress: 67,
    totalUsers: 1247,
    completedUsers: 67,
    completionRate: 5.4,
    averageTimeToComplete: 180,
    points: 1200
  },
  {
    id: 'todas-categorias',
    name: 'Todas as Categorias',
    description: '7 categorias completas (7 × 120)',
    icon: Star,
    rarity: 'legendary',
    category: 'Categorias',
    requirement: 840,
    currentProgress: 12,
    totalUsers: 1247,
    completedUsers: 12,
    completionRate: 1.0,
    averageTimeToComplete: 365,
    points: 2500
  },

  // Medalhas de Ciclos
  {
    id: 'primeiro-ciclo',
    name: 'Primeiro Ciclo',
    description: '1 ciclo de 30 dias concluído',
    icon: Circle,
    rarity: 'silver',
    category: 'Ciclos',
    requirement: 30,
    currentProgress: 456,
    totalUsers: 1247,
    completedUsers: 456,
    completionRate: 36.6,
    averageTimeToComplete: 30,
    points: 250
  },
  {
    id: 'tres-ciclos',
    name: 'Três Ciclos',
    description: '3 ciclos de 30 dias',
    icon: Triangle,
    rarity: 'gold',
    category: 'Ciclos',
    requirement: 90,
    currentProgress: 189,
    totalUsers: 1247,
    completedUsers: 189,
    completionRate: 15.2,
    averageTimeToComplete: 90,
    points: 750
  },
  {
    id: 'dez-ciclos',
    name: 'Dez Ciclos',
    description: '10 ciclos de 30 dias',
    icon: Octagon,
    rarity: 'legendary',
    category: 'Ciclos',
    requirement: 300,
    currentProgress: 34,
    totalUsers: 1247,
    completedUsers: 34,
    completionRate: 2.7,
    averageTimeToComplete: 300,
    points: 2000
  },

  // Medalhas de Streaks
  {
    id: 'chama-acesa',
    name: 'Chama Acesa',
    description: '14 dias seguidos',
    icon: Flame,
    rarity: 'silver',
    category: 'Streaks',
    requirement: 14,
    currentProgress: 378,
    totalUsers: 1247,
    completedUsers: 378,
    completionRate: 30.3,
    averageTimeToComplete: 14,
    points: 150
  },
  {
    id: 'resiliencia',
    name: 'Resiliência',
    description: '30 dias seguidos',
    icon: Shield,
    rarity: 'gold',
    category: 'Streaks',
    requirement: 30,
    currentProgress: 167,
    totalUsers: 1247,
    completedUsers: 167,
    completionRate: 13.4,
    averageTimeToComplete: 30,
    points: 400
  },
  {
    id: 'imparavel',
    name: 'Imparável',
    description: '60 dias seguidos',
    icon: TrendingUp,
    rarity: 'diamond',
    category: 'Streaks',
    requirement: 60,
    currentProgress: 78,
    totalUsers: 1247,
    completedUsers: 78,
    completionRate: 6.3,
    averageTimeToComplete: 60,
    points: 800
  },
  {
    id: 'guerreira-ano',
    name: 'Guerreira do Ano',
    description: '365 dias seguidos',
    icon: Crown,
    rarity: 'legendary',
    category: 'Streaks',
    requirement: 365,
    currentProgress: 8,
    totalUsers: 1247,
    completedUsers: 8,
    completionRate: 0.6,
    averageTimeToComplete: 365,
    points: 3000
  },

  // Medalhas de Conquistas Globais (Pontos)
  {
    id: 'bronze-points',
    name: 'Bronze',
    description: '168 pontos (10%)',
    icon: Medal,
    rarity: 'bronze',
    category: 'Conquistas Globais',
    requirement: 168,
    currentProgress: 892,
    totalUsers: 1247,
    completedUsers: 892,
    completionRate: 71.5,
    averageTimeToComplete: 15,
    points: 168
  },
  {
    id: 'silver-points',
    name: 'Prata',
    description: '420 pontos (25%)',
    icon: Award,
    rarity: 'silver',
    category: 'Conquistas Globais',
    requirement: 420,
    currentProgress: 567,
    totalUsers: 1247,
    completedUsers: 567,
    completionRate: 45.5,
    averageTimeToComplete: 35,
    points: 420
  },
  {
    id: 'gold-points',
    name: 'Ouro',
    description: '840 pontos (50%)',
    icon: Trophy,
    rarity: 'gold',
    category: 'Conquistas Globais',
    requirement: 840,
    currentProgress: 234,
    totalUsers: 1247,
    completedUsers: 234,
    completionRate: 18.8,
    averageTimeToComplete: 70,
    points: 840
  },
  {
    id: 'diamond-points',
    name: 'Diamante',
    description: '1260 pontos (75%)',
    icon: Diamond,
    rarity: 'diamond',
    category: 'Conquistas Globais',
    requirement: 1260,
    currentProgress: 89,
    totalUsers: 1247,
    completedUsers: 89,
    completionRate: 7.1,
    averageTimeToComplete: 120,
    points: 1260
  },
  {
    id: 'legendary-points',
    name: 'Lendária',
    description: '1680 pontos (100%)',
    icon: Star,
    rarity: 'legendary',
    category: 'Conquistas Globais',
    requirement: 1680,
    currentProgress: 23,
    totalUsers: 1247,
    completedUsers: 23,
    completionRate: 1.8,
    averageTimeToComplete: 200,
    points: 1680
  }
]

export function AwardsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'levels' | 'badges'>('overview')

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'from-orange-400 to-orange-600'
      case 'silver': return 'from-gray-400 to-gray-600'
      case 'gold': return 'from-yellow-400 to-yellow-600'
      case 'diamond': return 'from-blue-400 to-blue-600'
      case 'legendary': return 'from-purple-400 to-purple-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'bg-orange-50 border-orange-200'
      case 'silver': return 'bg-gray-50 border-gray-200'
      case 'gold': return 'bg-yellow-50 border-yellow-200'
      case 'diamond': return 'bg-blue-50 border-blue-200'
      case 'legendary': return 'bg-purple-50 border-purple-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const categories = [
    { id: 'inicio', label: 'Início', count: 3, icon: Star },
    { id: 'progresso-global', label: 'Progresso Global', count: 4, icon: TrendingUp },
    { id: 'categorias', label: 'Categorias', count: 4, icon: Target },
    { id: 'ciclos', label: 'Ciclos', count: 3, icon: Calendar },
    { id: 'streaks', label: 'Streaks', count: 4, icon: Flame },
    { id: 'conquistas-globais', label: 'Conquistas Globais', count: 5, icon: Crown }
  ]

  const getBadgesByCategory = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'inicio': 'Início',
      'progresso-global': 'Progresso Global',
      'categorias': 'Categorias',
      'ciclos': 'Ciclos',
      'streaks': 'Streaks',
      'conquistas-globais': 'Conquistas Globais'
    }
    
    return badges.filter(badge => badge.category === categoryMap[category])
  }

  const getTotalStats = () => {
    const totalBadges = badges.length
    const totalLevels = levels.length
    const totalUsers = 1247
    const avgCompletionRate = badges.reduce((acc, badge) => acc + badge.completionRate, 0) / badges.length

    return {
      totalBadges,
      totalLevels,
      totalUsers,
      avgCompletionRate: Math.round(avgCompletionRate)
    }
  }

  const stats = getTotalStats()

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="zayia-card p-6 text-center">
          <Trophy className="w-8 h-8 text-zayia-orchid mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.totalBadges}</div>
          <div className="text-sm text-zayia-violet-gray">Total de Medalhas</div>
        </div>
        <div className="zayia-card p-6 text-center">
          <Crown className="w-8 h-8 text-zayia-soft-purple mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.totalLevels}</div>
          <div className="text-sm text-zayia-violet-gray">Níveis Disponíveis</div>
        </div>
        <div className="zayia-card p-6 text-center">
          <Users className="w-8 h-8 text-zayia-lavender mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-zayia-violet-gray">Usuárias Ativas</div>
        </div>
        <div className="zayia-card p-6 text-center">
          <BarChart3 className="w-8 h-8 text-zayia-periwinkle mx-auto mb-3" />
          <div className="text-2xl font-bold text-zayia-deep-violet">{stats.avgCompletionRate}%</div>
          <div className="text-sm text-zayia-violet-gray">Taxa Média de Conquista</div>
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex gap-4">
        <button
          onClick={() => setViewMode('levels')}
          className="zayia-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Crown className="w-5 h-5" />
          Ver Sistema de Níveis
        </button>
        <button
          onClick={() => setViewMode('badges')}
          className="bg-zayia-lilac text-zayia-deep-violet px-6 py-3 rounded-xl font-semibold hover:bg-zayia-lavender transition-colors flex items-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          Ver Todas as Medalhas
        </button>
      </div>

      {/* Categorias de Medalhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          const categoryBadges = getBadgesByCategory(category.id)
          const avgCompletion = categoryBadges.reduce((acc, badge) => acc + badge.completionRate, 0) / categoryBadges.length
          
          return (
            <div 
              key={category.id}
              className="zayia-card p-6 cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zayia-deep-violet">{category.label}</h3>
                    <p className="text-sm text-zayia-violet-gray">{category.count} medalhas</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zayia-violet-gray" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Taxa Média de Conquista</span>
                  <span className="font-bold text-zayia-soft-purple">{Math.round(avgCompletion)}%</span>
                </div>
                <div className="w-full bg-zayia-lilac/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-2 rounded-full"
                    style={{ width: `${avgCompletion}%` }}
                  ></div>
                </div>
              </div>

              {/* Preview das medalhas */}
              <div className="mt-4 flex gap-2">
                {categoryBadges.slice(0, 3).map((badge) => {
                  const IconComponent = badge.icon
                  return (
                    <div key={badge.id} className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  )
                })}
                {categoryBadges.length > 3 && (
                  <span className="text-sm text-zayia-violet-gray">+{categoryBadges.length - 3}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Medalhas Mais Populares */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">🏆 Medalhas Mais Conquistadas</h3>
        <div className="space-y-4">
          {badges
            .sort((a, b) => b.completedUsers - a.completedUsers)
            .slice(0, 5)
            .map((badge, index) => {
              const IconComponent = badge.icon
              return (
                <div key={badge.id} className="flex items-center gap-4 p-4 bg-zayia-lilac/10 rounded-xl">
                  <div className="text-2xl font-bold text-zayia-soft-purple w-8">
                    #{index + 1}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-zayia-deep-violet">{badge.name}</div>
                    <div className="text-sm text-zayia-violet-gray">{badge.description}</div>
                    <div className="text-xs text-zayia-soft-purple font-medium">+{badge.points} pontos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-zayia-soft-purple">
                      {badge.completedUsers.toLocaleString()}
                    </div>
                    <div className="text-xs text-zayia-violet-gray">usuárias</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{badge.completionRate}%</div>
                    <div className="text-xs text-zayia-violet-gray">taxa</div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )

  const renderLevels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold zayia-gradient-text">👑 Sistema de Níveis</h2>
        <button
          onClick={() => setViewMode('overview')}
          className="zayia-button px-4 py-2 rounded-xl text-white font-medium"
        >
          ← Voltar
        </button>
      </div>

      {/* Distribuição de Usuárias por Nível */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">📊 Distribuição de Usuárias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {levels.map((level) => {
            const IconComponent = level.icon
            return (
              <div key={level.level} className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-zayia-deep-violet">{level.name}</div>
                <div className="text-sm text-zayia-violet-gray mb-2">{level.description}</div>
                <div className="text-lg font-bold text-zayia-soft-purple">{level.usersAtLevel}</div>
                <div className="text-xs text-zayia-violet-gray">usuárias</div>
                <div className="text-xs text-zayia-violet-gray mt-1 font-medium">
                  {level.pointsRequired} pts
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progressão Detalhada */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-6">📈 Progressão Detalhada</h3>
        <div className="space-y-4">
          {levels.map((level, index) => {
            const nextLevel = levels[index + 1]
            const percentage = level.usersAtLevel / 1247 * 100
            const IconComponent = level.icon
            
            return (
              <div key={level.level} className="p-4 border border-zayia-lilac/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-zayia-deep-violet">
                        Nível {level.level}: {level.name}
                      </div>
                      <div className="text-sm text-zayia-violet-gray">
                        {level.pointsRequired} pontos
                        {nextLevel && ` → ${nextLevel.pointsRequired} pontos`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-zayia-soft-purple">
                      {level.usersAtLevel}
                    </div>
                    <div className="text-sm text-zayia-violet-gray">
                      {percentage.toFixed(1)}% das usuárias
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${level.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderBadges = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold zayia-gradient-text">🏆 Sistema de Medalhas</h2>
        <button
          onClick={() => setViewMode('overview')}
          className="zayia-button px-4 py-2 rounded-xl text-white font-medium"
        >
          ← Voltar
        </button>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-zayia-sunset text-white'
              : 'bg-zayia-lilac/20 text-zayia-deep-violet hover:bg-zayia-lilac/40'
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-zayia-sunset text-white'
                : 'bg-zayia-lilac/20 text-zayia-deep-violet hover:bg-zayia-lilac/40'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Lista de Medalhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(selectedCategory ? getBadgesByCategory(selectedCategory) : badges).map((badge) => {
          const IconComponent = badge.icon
          return (
            <div key={badge.id} className={`p-6 rounded-xl border-2 ${getRarityBg(badge.rarity)}`}>
              {/* Header da Medalha */}
              <div className="text-center mb-4">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-zayia-deep-violet">{badge.name}</h4>
                <p className="text-sm text-zayia-violet-gray">{badge.description}</p>
                <div className="text-lg font-bold text-zayia-soft-purple mt-2">+{badge.points} pontos</div>
              </div>

              {/* Raridade */}
              <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity.toUpperCase()}
                </span>
              </div>

              {/* Estatísticas */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Usuárias que conquistaram:</span>
                  <span className="font-bold">{badge.completedUsers.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Taxa de conquista:</span>
                  <span className="font-bold text-green-600">{badge.completionRate}%</span>
                </div>
                
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)}`}
                    style={{ width: `${badge.completionRate}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tempo médio:</span>
                  <span className="font-bold">{badge.averageTimeToComplete} dias</span>
                </div>
                
                <div className="text-center mt-4">
                  <div className="text-xs text-zayia-violet-gray">Categoria: {badge.category}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderCategoryDetail = () => {
    const category = categories.find(c => c.id === selectedCategory)
    if (!category) return null

    const categoryBadges = getBadgesByCategory(selectedCategory!)
    const Icon = category.icon

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zayia-deep-violet">{category.label}</h2>
              <p className="text-zayia-violet-gray">{category.count} medalhas disponíveis</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="zayia-button px-4 py-2 rounded-xl text-white font-medium"
          >
            ← Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryBadges.map((badge) => {
            const IconComponent = badge.icon
            return (
              <div key={badge.id} className={`p-6 rounded-xl border-2 ${getRarityBg(badge.rarity)}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-zayia-deep-violet mb-2">{badge.name}</h4>
                    <p className="text-sm text-zayia-violet-gray mb-2">{badge.description}</p>
                    <div className="text-lg font-bold text-zayia-soft-purple mb-4">+{badge.points} pontos</div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-zayia-violet-gray">Conquistaram:</div>
                        <div className="font-bold text-zayia-deep-violet">
                          {badge.completedUsers.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-zayia-violet-gray">Taxa:</div>
                        <div className="font-bold text-green-600">{badge.completionRate}%</div>
                      </div>
                      <div>
                        <div className="text-zayia-violet-gray">Tempo médio:</div>
                        <div className="font-bold text-zayia-soft-purple">{badge.averageTimeToComplete}d</div>
                      </div>
                      <div>
                        <div className="text-zayia-violet-gray">Raridade:</div>
                        <div className={`font-bold bg-gradient-to-r ${getRarityColor(badge.rarity)} bg-clip-text text-transparent`}>
                          {badge.rarity.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (selectedCategory && viewMode === 'overview') {
    return renderCategoryDetail()
  }

  if (viewMode === 'levels') {
    return renderLevels()
  }

  if (viewMode === 'badges') {
    return renderBadges()
  }

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              🏆 Sistema de Prêmios ZAYIA
            </h2>
            <p className="text-zayia-violet-gray">
              Análise completa de níveis, medalhas e conquistas das usuárias
            </p>
          </div>
        </div>

        {/* Resumo do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Target className="w-8 h-8 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">1.680</div>
            <div className="text-sm text-zayia-violet-gray">Pontos Máximos</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <BarChart3 className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">1:3</div>
            <div className="text-sm text-zayia-violet-gray">Proporção Fácil:Difícil</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Medal className="w-8 h-8 text-zayia-lavender mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">5</div>
            <div className="text-sm text-zayia-violet-gray">Tipos de Raridade</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Star className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
            <div className="text-xl font-bold text-zayia-deep-violet">840</div>
            <div className="text-sm text-zayia-violet-gray">Desafios Totais</div>
          </div>
        </div>
      </div>

      {renderOverview()}
    </div>
  )
}