import React, { useState, useEffect } from 'react'
import {
  Target,
  Trophy,
  TrendingUp,
  Users,
  BarChart3,
  Heart,
  Brain,
  Smartphone,
  MessageCircle,
  Dumbbell,
  Calendar,
  Briefcase
} from 'lucide-react'
import { CategoriesList, ChallengesListByCategory } from './challenges-section'
import { type ChallengeCategory } from '../../lib/challenges-data-mock'
import { supabaseClient } from '../../lib/supabase-client'

// Helper function to map icon components
const getIconComponentForCategory = (categoryId: string): React.ComponentType<any> => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    autoestima: Heart,
    rotina: Calendar,
    digital_detox: Smartphone,
    mindfulness: Brain,
    relacionamentos: MessageCircle,
    corpo_saude: Dumbbell,
    carreira: Briefcase,
  }
  return iconMap[categoryId] || Heart
}

// Map Supabase category to mock's ChallengeCategory format
function toUiCategory(cat: any): ChallengeCategory {
  return {
    id: cat.id,
    label: cat.name || cat.label || '',
    icon: cat.icon || '📌',
    color: cat.color || 'from-gray-400 to-gray-600',
    description: cat.description,
    area: cat.area,
    easyCount: 0,
    hardCount: 0,
    completionRate: 0,
  }
}

export function ChallengesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'metrics' | 'gerenciar' | 'challenges'>('metrics')
  const [selectedCategoryForChallenges, setSelectedCategoryForChallenges] = useState<ChallengeCategory | null>(null)
  const [categories, setCategories] = useState<ChallengeCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Detail view: challenges for the selected category card
  const [detailChallenges, setDetailChallenges] = useState<any[]>([])
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const loadCategories = async () => {
    try {
      const data = await supabaseClient.getChallengeCategories()
      setCategories(data.map(toUiCategory))
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    loadCategories().finally(() => setIsLoading(false))
  }, [])

  // Load challenges when a category is selected for detail view
  useEffect(() => {
    if (!selectedCategory) {
      setDetailChallenges([])
      return
    }
    setIsDetailLoading(true)
    supabaseClient.getChallengesByCategory(selectedCategory)
      .then(setDetailChallenges)
      .catch(() => setDetailChallenges([]))
      .finally(() => setIsDetailLoading(false))
  }, [selectedCategory])

  const handleTabChange = (tab: 'metrics' | 'gerenciar' | 'challenges') => {
    setActiveTab(tab)
    if (tab === 'metrics') loadCategories()
  }

  const handleViewChallenges = (category: ChallengeCategory) => {
    setSelectedCategoryForChallenges(category)
    handleTabChange('challenges')
  }

  const handleBack = () => {
    setSelectedCategoryForChallenges(null)
    handleTabChange('metrics')
  }

  const easyChallenges = detailChallenges.filter(c => c.difficulty === 'facil' || c.difficulty === 'easy')
  const hardChallenges = detailChallenges.filter(c => c.difficulty === 'dificil' || c.difficulty === 'hard')

  const renderDetailedView = () => {
    const category = categories.find(c => c.id === selectedCategory)
    if (!category) return null
    const IconComponent = getIconComponentForCategory(selectedCategory || '')

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="zayia-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zayia-deep-violet">{category.label}</h2>
                {isDetailLoading ? (
                  <p className="text-zayia-violet-gray">Carregando...</p>
                ) : (
                  <p className="text-zayia-violet-gray">
                    {easyChallenges.length} desafios fáceis • {hardChallenges.length} desafios difíceis
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="zayia-button px-4 py-2 rounded-xl text-white font-medium"
            >
              ← Voltar
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-deep-violet">{easyChallenges.length + hardChallenges.length}</div>
              <div className="text-sm text-zayia-violet-gray">Total de Desafios</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{easyChallenges.length}</div>
              <div className="text-sm text-zayia-violet-gray">Fáceis</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{hardChallenges.length}</div>
              <div className="text-sm text-zayia-violet-gray">Difíceis</div>
            </div>
            <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
              <div className="text-2xl font-bold text-zayia-orchid">{category.icon}</div>
              <div className="text-sm text-zayia-violet-gray">Ícone</div>
            </div>
          </div>
        </div>

        {isDetailLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zayia-purple" />
          </div>
        ) : (
          <>
            {/* Easy Challenges */}
            {easyChallenges.length > 0 && (
              <div className="zayia-card p-6">
                <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
                  Desafios Fáceis ({easyChallenges.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {easyChallenges.slice(0, 20).map((ch: any, index: number) => (
                    <div key={ch.id} className="p-4 border border-zayia-lilac/30 rounded-xl bg-green-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-zayia-deep-violet text-sm">
                          {index + 1}. {ch.title}
                        </h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {ch.points_easy ?? 10}pts
                        </span>
                      </div>
                      <p className="text-xs text-zayia-violet-gray">{ch.description}</p>
                    </div>
                  ))}
                </div>
                {easyChallenges.length > 20 && (
                  <p className="mt-4 text-center text-sm text-zayia-violet-gray">
                    +{easyChallenges.length - 20} desafios adicionais...
                  </p>
                )}
              </div>
            )}

            {/* Hard Challenges */}
            {hardChallenges.length > 0 && (
              <div className="zayia-card p-6">
                <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
                  Desafios Difíceis ({hardChallenges.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {hardChallenges.slice(0, 20).map((ch: any, index: number) => (
                    <div key={ch.id} className="p-4 border border-zayia-lilac/30 rounded-xl bg-orange-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-zayia-deep-violet text-sm">
                          {index + 1}. {ch.title}
                        </h4>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          {ch.points_hard ?? 25}pts
                        </span>
                      </div>
                      <p className="text-xs text-zayia-violet-gray">{ch.description}</p>
                    </div>
                  ))}
                </div>
                {hardChallenges.length > 20 && (
                  <p className="mt-4 text-center text-sm text-zayia-violet-gray">
                    +{hardChallenges.length - 20} desafios adicionais...
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Show challenges list if selected
  if (selectedCategoryForChallenges && activeTab === 'challenges') {
    return (
      <ChallengesListByCategory
        category={selectedCategoryForChallenges}
        onBack={handleBack}
        categories={categories}
      />
    )
  }

  // Show categories management
  if (activeTab === 'gerenciar') {
    return (
      <div className="space-y-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => handleTabChange('metrics')}
            className="px-4 py-3 text-gray-700 hover:text-purple-600 font-semibold border-b-2 border-transparent hover:border-purple-600 transition"
          >
            📊 Métricas
          </button>
          <button
            onClick={() => handleTabChange('gerenciar')}
            className="px-4 py-3 text-purple-600 font-semibold border-b-2 border-purple-600"
          >
            ⚙️ Gerenciar Categorias
          </button>
        </div>
        <CategoriesList onViewChallenges={handleViewChallenges} onCategoryUpdated={loadCategories} />
      </div>
    )
  }

  if (selectedCategory) {
    return renderDetailedView()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => handleTabChange('metrics')}
          className="px-4 py-3 text-purple-600 font-semibold border-b-2 border-purple-600"
        >
          📊 Métricas
        </button>
        <button
          onClick={() => handleTabChange('gerenciar')}
          className="px-4 py-3 text-gray-700 hover:text-purple-600 font-semibold border-b-2 border-transparent hover:border-purple-600 transition"
        >
          ⚙️ Gerenciar Categorias
        </button>
      </div>

      {/* Header Principal */}
      <div className="zayia-card p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
            📊 Sistema de Desafios ZAYIA
          </h2>
          <p className="text-zayia-violet-gray">
            Análise completa das {categories.length} categorias de transformação pessoal
          </p>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Target className="w-8 h-8 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{categories.length}</div>
            <div className="text-sm text-zayia-violet-gray">Categorias Ativas</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <Users className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">—</div>
            <div className="text-sm text-zayia-violet-gray">Ver Analytics para Métricas</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl">
            <BarChart3 className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">120</div>
            <div className="text-sm text-zayia-violet-gray">Desafios por Categoria</div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="zayia-card p-6">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-4">
          🏆 Categorias Disponíveis
        </h3>
        <div className="space-y-3">
          {categories.map((category) => {
            const IconComponent = getIconComponentForCategory(category.id)
            return (
              <div
                key={category.id}
                className="flex items-center gap-4 p-3 bg-zayia-lilac/10 rounded-xl cursor-pointer hover:bg-zayia-lilac/20 transition"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-zayia-deep-violet">{category.label}</div>
                  {category.description && (
                    <div className="text-sm text-zayia-violet-gray">{category.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-zayia-soft-purple" />
                  <span className="text-sm text-zayia-violet-gray">Ver detalhes →</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
