import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  Trophy, 
  Award, 
  Star, 
  Crown, 
  Target, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Flame, 
  Sparkles,
  Medal,
  ChevronRight,
  Lock,
  CheckCircle,
  Circle,
  Eye,
  Gift,
  Zap,
  Heart,
  Brain,
  Smartphone,
  MessageCircle,
  Dumbbell,
  Briefcase,
  Home
} from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary'
  category: string
  requirement: number
  currentProgress: number
  points: number
  unlocked: boolean
  unlockedAt?: string
}

interface Level {
  level: number
  pointsRequired: number
  name: string
  icon: React.ComponentType<any>
  color: string
  description: string
  unlocked: boolean
}

export function BadgesSection() {
  const { profile } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'levels' | 'badges'>('overview')

  // Sistema de níveis
  const levels: Level[] = [
    { level: 0, pointsRequired: 0, name: 'Iniciante', icon: Circle, color: 'from-gray-400 to-gray-600', description: 'Começando a jornada', unlocked: true },
    { level: 1, pointsRequired: 168, name: 'Exploradora', icon: Eye, color: 'from-green-400 to-green-600', description: 'Descobrindo novos caminhos', unlocked: (profile?.points || 0) >= 168 },
    { level: 2, pointsRequired: 336, name: 'Aprendiz', icon: Target, color: 'from-blue-400 to-blue-600', description: 'Absorvendo conhecimento', unlocked: (profile?.points || 0) >= 336 },
    { level: 3, pointsRequired: 504, name: 'Praticante', icon: Zap, color: 'from-yellow-400 to-yellow-600', description: 'Aplicando aprendizados', unlocked: (profile?.points || 0) >= 504 },
    { level: 4, pointsRequired: 672, name: 'Dedicada', icon: Shield, color: 'from-orange-400 to-orange-600', description: 'Comprometida com crescimento', unlocked: (profile?.points || 0) >= 672 },
    { level: 5, pointsRequired: 840, name: 'Guerreira', icon: Award, color: 'from-red-400 to-red-600', description: 'Enfrentando desafios', unlocked: (profile?.points || 0) >= 840 },
    { level: 6, pointsRequired: 1008, name: 'Sábia', icon: Brain, color: 'from-purple-400 to-purple-600', description: 'Sabedoria conquistada', unlocked: (profile?.points || 0) >= 1008 },
    { level: 7, pointsRequired: 1176, name: 'Inspiradora', icon: Sparkles, color: 'from-pink-400 to-pink-600', description: 'Inspirando outras', unlocked: (profile?.points || 0) >= 1176 },
    { level: 8, pointsRequired: 1344, name: 'Mestra', icon: Crown, color: 'from-indigo-400 to-indigo-600', description: 'Dominando a arte', unlocked: (profile?.points || 0) >= 1344 },
    { level: 9, pointsRequired: 1680, name: 'Lendária', icon: Star, color: 'from-violet-400 to-violet-600', description: 'Lenda viva', unlocked: (profile?.points || 0) >= 1680 }
  ]

  // Sistema de medalhas
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
      currentProgress: profile?.completed_challenges || 0,
      points: 50,
      unlocked: (profile?.completed_challenges || 0) >= 1,
      unlockedAt: '2024-01-15'
    },
    {
      id: 'primeira-semana',
      name: 'Primeira Semana',
      description: '7 dias seguidos de login',
      icon: Calendar,
      rarity: 'bronze',
      category: 'Início',
      requirement: 7,
      currentProgress: profile?.streak || 0,
      points: 100,
      unlocked: (profile?.streak || 0) >= 7,
      unlockedAt: '2024-01-22'
    },
    {
      id: 'exploradora',
      name: 'Exploradora',
      description: 'Acessou todas as 7 categorias',
      icon: Eye,
      rarity: 'bronze',
      category: 'Início',
      requirement: 7,
      currentProgress: 1, // Mock: acessou 1 categoria
      points: 150,
      unlocked: false
    },

    // Medalhas de Progresso
    {
      id: 'desafiante',
      name: 'Desafiante',
      description: '50 desafios concluídos',
      icon: Target,
      rarity: 'silver',
      category: 'Progresso',
      requirement: 50,
      currentProgress: profile?.completed_challenges || 0,
      points: 200,
      unlocked: (profile?.completed_challenges || 0) >= 50
    },
    {
      id: 'constante',
      name: 'Constante',
      description: '200 desafios concluídos',
      icon: Flame,
      rarity: 'gold',
      category: 'Progresso',
      requirement: 200,
      currentProgress: profile?.completed_challenges || 0,
      points: 500,
      unlocked: (profile?.completed_challenges || 0) >= 200
    },

    // Medalhas de Categoria
    {
      id: 'autoestima-mestre',
      name: 'Mestre da Autoestima',
      description: '120 desafios de Autoestima',
      icon: Heart,
      rarity: 'gold',
      category: 'Autoestima',
      requirement: 120,
      currentProgress: 45, // Mock
      points: 600,
      unlocked: false
    },
    {
      id: 'corpo-guerreira',
      name: 'Guerreira do Corpo',
      description: '120 desafios de Corpo & Saúde',
      icon: Dumbbell,
      rarity: 'gold',
      category: 'Corpo & Saúde',
      requirement: 120,
      currentProgress: 0,
      points: 600,
      unlocked: false
    }
  ]

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
    { id: 'inicio', label: 'Início', icon: Star, count: badges.filter(b => b.category === 'Início').length },
    { id: 'progresso', label: 'Progresso', icon: TrendingUp, count: badges.filter(b => b.category === 'Progresso').length },
    { id: 'autoestima', label: 'Autoestima', icon: Heart, count: badges.filter(b => b.category === 'Autoestima').length },
    { id: 'corpo-saude', label: 'Corpo & Saúde', icon: Dumbbell, count: badges.filter(b => b.category === 'Corpo & Saúde').length }
  ]

  const currentLevel = levels.find(l => l.unlocked && levels[levels.indexOf(l) + 1] && !levels[levels.indexOf(l) + 1].unlocked) || levels[levels.length - 1]
  const nextLevel = levels[levels.indexOf(currentLevel) + 1]

  const unlockedBadges = badges.filter(b => b.unlocked)
  const availableBadges = badges.filter(b => !b.unlocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-zayia-orchid to-zayia-amethyst rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Medalhas & Níveis 🏆
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Suas conquistas e progresso na jornada ZAYIA
        </p>
      </div>

      {/* Pontos Totais */}
      <div className="zayia-card p-6 text-center bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <Gift className="w-12 h-12 text-zayia-orchid mx-auto mb-3" />
        <div className="text-3xl font-bold zayia-gradient-text mb-2">
          {(profile?.points || 0).toLocaleString()}
        </div>
        <div className="text-sm text-zayia-violet-gray">Pontos Totais Acumulados</div>
      </div>

      {/* Nível Atual */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Seu Nível Atual
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center`}>
            <currentLevel.icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-zayia-deep-violet">
              Nível {currentLevel.level}: {currentLevel.name}
            </h4>
            <p className="text-sm text-zayia-violet-gray">{currentLevel.description}</p>
          </div>
        </div>

        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
              <span>Progresso para {nextLevel.name}</span>
              <span>
                {profile?.points || 0}/{nextLevel.pointsRequired} pontos
              </span>
            </div>
            <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${nextLevel.color} transition-all duration-1000`}
                style={{ 
                  width: `${Math.min(100, ((profile?.points || 0) / nextLevel.pointsRequired) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="text-xs text-zayia-violet-gray mt-1">
              Faltam {nextLevel.pointsRequired - (profile?.points || 0)} pontos
            </div>
          </div>
        )}
      </div>

      {/* Medalhas Conquistadas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Medalhas Conquistadas ({unlockedBadges.length})
        </h3>

        {unlockedBadges.length === 0 ? (
          <div className="text-center py-8">
            <Medal className="w-12 h-12 text-zayia-violet-gray mx-auto mb-3" />
            <p className="text-zayia-violet-gray text-sm">
              Complete desafios para conquistar suas primeiras medalhas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {unlockedBadges.map((badge) => {
              const IconComponent = badge.icon
              return (
                <div key={badge.id} className={`p-4 rounded-xl border-2 ${getRarityBg(badge.rarity)}`}>
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-zayia-deep-violet text-sm mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-zayia-violet-gray mb-2">
                      {badge.description}
                    </p>
                    <div className="text-xs font-bold text-zayia-soft-purple">
                      +{badge.points} pontos
                    </div>
                    {badge.unlockedAt && (
                      <div className="text-xs text-zayia-violet-gray mt-1">
                        {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Próximas Medalhas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Próximas Medalhas ({availableBadges.length})
        </h3>

        <div className="space-y-4">
          {availableBadges.slice(0, 5).map((badge) => {
            const IconComponent = badge.icon
            const progressPercentage = Math.min(100, (badge.currentProgress / badge.requirement) * 100)
            
            return (
              <div key={badge.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-700 mb-1">{badge.name}</h4>
                    <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Progresso: {badge.currentProgress}/{badge.requirement}
                        </span>
                        <span className="font-bold text-zayia-soft-purple">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600`}>
                        {badge.rarity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">+{badge.points} pontos</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Todos os Níveis */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Todos os Níveis
        </h3>

        <div className="space-y-3">
          {levels.map((level) => {
            const IconComponent = level.icon
            const isCurrentLevel = level.level === (profile?.level || 1)
            
            return (
              <div 
                key={level.level} 
                className={`p-4 rounded-xl border-2 transition-all ${
                  level.unlocked 
                    ? isCurrentLevel 
                      ? 'bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30 border-zayia-soft-purple' 
                      : 'bg-white border-zayia-lilac/30'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center relative`}>
                    <IconComponent className="w-6 h-6 text-white" />
                    {!level.unlocked && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-zayia-deep-violet">
                        Nível {level.level}: {level.name}
                      </h4>
                      {isCurrentLevel && (
                        <span className="px-2 py-1 bg-zayia-soft-purple text-white text-xs rounded-full">
                          ATUAL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zayia-violet-gray mb-2">
                      {level.description}
                    </p>
                    <div className="text-sm font-medium text-zayia-soft-purple">
                      {level.pointsRequired} pontos necessários
                    </div>
                  </div>

                  <div className="text-right">
                    {level.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Categorias de Medalhas */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
          Medalhas por Categoria
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            const categoryBadges = badges.filter(b => b.category === category.label)
            const unlockedCount = categoryBadges.filter(b => b.unlocked).length
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="zayia-card p-4 text-center hover:scale-105 transition-all"
              >
                <Icon className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
                <div className="font-semibold text-zayia-deep-violet text-sm mb-1">
                  {category.label}
                </div>
                <div className="text-xs text-zayia-violet-gray">
                  {unlockedCount}/{category.count} medalhas
                </div>
                <div className="w-full bg-zayia-lilac/30 rounded-full h-1 mt-2">
                  <div 
                    className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-1 rounded-full"
                    style={{ width: `${(unlockedCount / category.count) * 100}%` }}
                  ></div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Motivação */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-cream to-zayia-lilac/20">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-zayia-orchid mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">
            Continue Brilhando! ✨
          </h3>
          <p className="text-sm text-zayia-deep-violet">
            Cada medalha conquistada é uma prova da sua força e determinação. 
            Você está no caminho certo!
          </p>
        </div>
      </div>
    </div>
  )
}