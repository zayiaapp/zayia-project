import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  Target, 
  Lock, 
  CheckCircle, 
  Clock, 
  Play, 
  Upload, 
  Camera, 
  Video, 
  Mic,
  X,
  Star,
  Heart,
  Calendar,
  Brain,
  MessageCircle,
  Dumbbell,
  Briefcase,
  Smartphone,
  Trophy,
  Gift,
  Zap
} from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'

// Import dos dados de desafios
import autoestimaData from '../../../data/autoestima.json'
import rotinaData from '../../../data/rotina.json'
import digitalDetoxData from '../../../data/digital_detox.json'
import mindfulnessData from '../../../data/mindfulness.json'
import relacionamentosData from '../../../data/relacionamentos.json'
import corpoSaudeData from '../../../data/corpo_saude.json'
import carreiraData from '../../../data/carreira.json'

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  duration: number
  category: string
  difficulty: 'facil' | 'dificil'
}

interface DailyChallenge {
  easy: Challenge
  hard: Challenge
  date: string
  easyCompleted: boolean
  hardCompleted: boolean
}

interface CategoryProgress {
  categoryId: string
  completed: number
  total: number
  isActive: boolean
  canChange: boolean
}

export function ChallengesSection() {
  const { profile, updateProfile } = useAuth()
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge | null>(null)
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([])
  const [showChallengeModal, setShowChallengeModal] = useState<Challenge | null>(null)
  const [showProofModal, setShowProofModal] = useState<Challenge | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    {
      id: 'autoestima',
      label: 'Autoestima & Autocuidado',
      icon: Heart,
      color: 'from-pink-400 to-purple-600',
      data: autoestimaData,
      emoji: '💜'
    },
    {
      id: 'rotina',
      label: 'Rotina & Organização',
      icon: Calendar,
      color: 'from-green-400 to-green-600',
      data: rotinaData,
      emoji: '📋'
    },
    {
      id: 'mindfulness',
      label: 'Mindfulness & Emoções',
      icon: Brain,
      color: 'from-indigo-400 to-purple-600',
      data: mindfulnessData,
      emoji: '🧘‍♀️'
    },
    {
      id: 'relacionamentos',
      label: 'Relacionamentos & Comunicação',
      icon: MessageCircle,
      color: 'from-rose-400 to-pink-600',
      data: relacionamentosData,
      emoji: '💬'
    },
    {
      id: 'corpo_saude',
      label: 'Corpo & Saúde',
      icon: Dumbbell,
      color: 'from-green-400 to-emerald-600',
      data: corpoSaudeData,
      emoji: '💪'
    },
    {
      id: 'carreira',
      label: 'Carreira & Desenvolvimento',
      icon: Briefcase,
      color: 'from-blue-400 to-blue-600',
      data: carreiraData,
      emoji: '💼'
    },
    {
      id: 'digital_detox',
      label: 'Digital Detox',
      icon: Smartphone,
      color: 'from-red-400 to-red-600',
      data: digitalDetoxData,
      emoji: '📱'
    }
  ]

  useEffect(() => {
    initializeCategoryProgress()
    loadDailyChallenges()
  }, [])

  const initializeCategoryProgress = () => {
    const progress = categories.map((category, index) => ({
      categoryId: category.id,
      completed: index === 0 ? 45 : 0, // Primeira categoria com progresso
      total: 120,
      isActive: index === 0, // Primeira categoria ativa
      canChange: index === 0 ? false : true // Pode mudar se completou 120
    }))
    
    setCategoryProgress(progress)
    
    // Definir categoria ativa
    const activeCategory = progress.find(p => p.isActive)
    if (activeCategory) {
      setSelectedCategory(activeCategory.categoryId)
    }
  }

  const loadDailyChallenges = () => {
    if (!selectedCategory) return

    const category = categories.find(c => c.id === selectedCategory)
    if (!category) return

    // Pegar desafios aleatórios para hoje
    const easyChallenge = category.data.facil[Math.floor(Math.random() * category.data.facil.length)]
    const hardChallenge = category.data.dificil[Math.floor(Math.random() * category.data.dificil.length)]

    setDailyChallenges({
      easy: easyChallenge,
      hard: hardChallenge,
      date: new Date().toISOString().split('T')[0],
      easyCompleted: false,
      hardCompleted: false
    })
  }

  const handleCategorySelect = (categoryId: string) => {
    const progress = categoryProgress.find(p => p.categoryId === categoryId)
    if (!progress?.canChange) return

    // Desativar categoria atual
    setCategoryProgress(prev => prev.map(p => ({ ...p, isActive: false })))
    
    // Ativar nova categoria
    setCategoryProgress(prev => prev.map(p => 
      p.categoryId === categoryId ? { ...p, isActive: true, canChange: false } : p
    ))
    
    setSelectedCategory(categoryId)
    loadDailyChallenges()
  }

  const handleStartChallenge = (challenge: Challenge) => {
    setShowChallengeModal(challenge)
  }

  const handleSubmitProof = () => {
    setShowChallengeModal(null)
    setShowProofModal(showChallengeModal)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleCompleteChallenge = async () => {
    if (!showProofModal || !uploadedFile) return

    setIsSubmitting(true)

    // Simular upload e validação
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Marcar desafio como completo
    if (dailyChallenges) {
      const isEasy = showProofModal.difficulty === 'facil'
      setDailyChallenges(prev => prev ? {
        ...prev,
        easyCompleted: isEasy ? true : prev.easyCompleted,
        hardCompleted: !isEasy ? true : prev.hardCompleted
      } : null)

      // Atualizar pontos do usuário
      const pointsToAdd = showProofModal.points
      await updateProfile({
        points: (profile?.points || 0) + pointsToAdd,
        completed_challenges: (profile?.completed_challenges || 0) + 1
      })

      // Atualizar progresso da categoria
      setCategoryProgress(prev => prev.map(p => 
        p.categoryId === selectedCategory 
          ? { ...p, completed: p.completed + 1, canChange: p.completed + 1 >= 120 }
          : p
      ))
    }

    setIsSubmitting(false)
    setShowProofModal(null)
    setUploadedFile(null)
  }

  const getProofType = (challenge: Challenge) => {
    // Determinar tipo de prova baseado no desafio
    if (challenge.title.toLowerCase().includes('foto') || 
        challenge.title.toLowerCase().includes('selfie') ||
        challenge.description.toLowerCase().includes('foto')) {
      return 'photo'
    }
    if (challenge.title.toLowerCase().includes('vídeo') || 
        challenge.title.toLowerCase().includes('grave')) {
      return 'video'
    }
    if (challenge.title.toLowerCase().includes('áudio') || 
        challenge.title.toLowerCase().includes('grave um áudio')) {
      return 'audio'
    }
    return 'photo' // Padrão
  }

  const currentCategoryProgress = categoryProgress.find(p => p.categoryId === selectedCategory)
  const currentCategory = categories.find(c => c.id === selectedCategory)

  // Se não há categoria selecionada, mostrar seleção
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
            Escolha sua Categoria
          </h2>
          <p className="text-zayia-violet-gray text-sm px-4">
            Selecione uma categoria para começar sua jornada de 120 desafios
          </p>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            const progress = categoryProgress.find(p => p.categoryId === category.id)
            const isLocked = !progress?.canChange && !progress?.isActive
            
            return (
              <button
                key={category.id}
                onClick={() => !isLocked && handleCategorySelect(category.id)}
                disabled={isLocked}
                className={`zayia-card p-6 text-left transition-all ${
                  isLocked 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center relative`}>
                    <Icon className="w-8 h-8 text-white" />
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{category.emoji}</span>
                      <h3 className="text-lg font-bold text-zayia-deep-violet">
                        {category.label}
                      </h3>
                    </div>
                    
                    {progress && (
                      <div className="space-y-2">
                        <div className="text-sm text-zayia-violet-gray">
                          Progresso: {progress.completed}/120 desafios
                        </div>
                        <div className="w-full bg-zayia-lilac/30 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${category.color} transition-all duration-1000`}
                            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                          ></div>
                        </div>
                        {progress.isActive && (
                          <div className="text-xs text-zayia-soft-purple font-medium">
                            ✨ Categoria Ativa
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Informação sobre o Sistema */}
        <div className="zayia-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Gift className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">💡 Como Funciona:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complete 120 desafios em uma categoria</li>
                <li>• Receba 2 desafios novos todos os dias</li>
                <li>• Envie comprovação para ganhar pontos</li>
                <li>• Desbloqueie a próxima categoria</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da Categoria Ativa */}
      <div className="zayia-card p-6 bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {currentCategory && (
              <>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentCategory.color} flex items-center justify-center`}>
                  <currentCategory.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zayia-deep-violet">
                    {currentCategory.emoji} {currentCategory.label}
                  </h2>
                  <p className="text-sm text-zayia-violet-gray">Categoria Ativa</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors text-sm font-medium"
          >
            Trocar →
          </button>
        </div>

        {/* Progresso da Categoria */}
        {currentCategoryProgress && (
          <div>
            <div className="flex justify-between text-sm text-zayia-violet-gray mb-2">
              <span>Progresso da Categoria</span>
              <span>{currentCategoryProgress.completed}/120 desafios</span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-4">
              <div 
                className={`h-4 rounded-full bg-gradient-to-r ${currentCategory?.color} transition-all duration-1000 relative overflow-hidden`}
                style={{ width: `${(currentCategoryProgress.completed / currentCategoryProgress.total) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <div className="text-xs text-zayia-violet-gray mt-1">
              {120 - currentCategoryProgress.completed} desafios restantes para completar
            </div>
          </div>
        )}
      </div>

      {/* Desafios de Hoje (PRIMEIRA LINHA - MAIS IMPORTANTE) */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Desafios de Hoje
        </h3>

        {dailyChallenges ? (
          <div className="grid grid-cols-1 gap-4">
            {/* Desafio Fácil */}
            <div className={`p-4 rounded-xl border-2 transition-all ${
              dailyChallenges.easyCompleted 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-zayia-lilac/30 hover:border-zayia-soft-purple'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    dailyChallenges.easyCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {dailyChallenges.easyCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-green-700">DESAFIO FÁCIL</div>
                    <div className="text-xs text-green-600">+{dailyChallenges.easy.points} ponto</div>
                  </div>
                </div>
                <div className="text-xs text-green-600 font-bold">
                  {dailyChallenges.easyCompleted ? 'CONCLUÍDO' : 'DISPONÍVEL'}
                </div>
              </div>

              <h4 className="font-semibold text-zayia-deep-violet mb-2 text-sm">
                {dailyChallenges.easy.title}
              </h4>
              <p className="text-xs text-zayia-violet-gray mb-3">
                {dailyChallenges.easy.description.substring(0, 80)}...
              </p>

              {!dailyChallenges.easyCompleted ? (
                <button
                  onClick={() => handleStartChallenge(dailyChallenges.easy)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Começar Desafio
                </button>
              ) : (
                <div className="w-full bg-green-100 text-green-700 py-3 rounded-xl font-semibold text-center">
                  ✅ Desafio Concluído!
                </div>
              )}
            </div>

            {/* Desafio Difícil */}
            <div className={`p-4 rounded-xl border-2 transition-all ${
              dailyChallenges.hardCompleted 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-white border-zayia-lilac/30 hover:border-zayia-soft-purple'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    dailyChallenges.hardCompleted 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {dailyChallenges.hardCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Trophy className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-orange-700">DESAFIO DIFÍCIL</div>
                    <div className="text-xs text-orange-600">+{dailyChallenges.hard.points} pontos</div>
                  </div>
                </div>
                <div className="text-xs text-orange-600 font-bold">
                  {dailyChallenges.hardCompleted ? 'CONCLUÍDO' : 'DISPONÍVEL'}
                </div>
              </div>

              <h4 className="font-semibold text-zayia-deep-violet mb-2 text-sm">
                {dailyChallenges.hard.title}
              </h4>
              <p className="text-xs text-zayia-violet-gray mb-3">
                {dailyChallenges.hard.description.substring(0, 80)}...
              </p>

              {!dailyChallenges.hardCompleted ? (
                <button
                  onClick={() => handleStartChallenge(dailyChallenges.hard)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Começar Desafio
                </button>
              ) : (
                <div className="w-full bg-orange-100 text-orange-700 py-3 rounded-xl font-semibold text-center">
                  ✅ Desafio Concluído!
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-zayia-violet-gray mx-auto mb-3" />
            <p className="text-zayia-violet-gray">Carregando desafios de hoje...</p>
          </div>
        )}
      </div>

      {/* Lista de Todos os Desafios */}
      {currentCategory && (
        <div className="zayia-card p-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">
            Todos os Desafios - {currentCategory.label}
          </h3>

          {/* Tabs Fácil/Difícil */}
          <div className="flex bg-zayia-lilac/20 rounded-xl p-1 mb-4">
            <div className="flex-1 text-center py-2 bg-zayia-sunset text-white rounded-lg font-medium text-sm">
              Fáceis ({currentCategory.data.facil.length})
            </div>
            <div className="flex-1 text-center py-2 text-zayia-violet-gray font-medium text-sm">
              Difíceis ({currentCategory.data.dificil.length})
            </div>
          </div>

          {/* Lista de Desafios Fáceis (primeiros 10) */}
          <div className="space-y-3">
            {currentCategory.data.facil.slice(0, 10).map((challenge: Challenge, index: number) => (
              <div key={challenge.id} className="p-3 border border-zayia-lilac/30 rounded-xl bg-green-50/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-zayia-deep-violet text-sm">
                    {index + 1}. {challenge.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      +{challenge.points} pt
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {challenge.duration}min
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zayia-violet-gray mb-3">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Status: {index < 2 ? 'Disponível' : 'Bloqueado'}
                  </span>
                  {index < 2 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-sm text-zayia-violet-gray">
            +{currentCategory.data.facil.length - 10} desafios fáceis adicionais...
          </div>
        </div>
      )}

      {/* Modal do Desafio */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-zayia-deep-violet">Desafio</h3>
                <button
                  onClick={() => setShowChallengeModal(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Tipo e Pontos */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    showChallengeModal.difficulty === 'facil' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {showChallengeModal.difficulty === 'facil' ? 'FÁCIL' : 'DIFÍCIL'}
                  </span>
                  <span className="text-lg font-bold text-zayia-soft-purple">
                    +{showChallengeModal.points} {showChallengeModal.points === 1 ? 'ponto' : 'pontos'}
                  </span>
                </div>

                {/* Título e Descrição */}
                <div>
                  <h4 className="text-lg font-bold text-zayia-deep-violet mb-3">
                    {showChallengeModal.title}
                  </h4>
                  <p className="text-sm text-zayia-violet-gray leading-relaxed">
                    {showChallengeModal.description}
                  </p>
                </div>

                {/* Tempo Estimado */}
                <div className="flex items-center gap-2 p-3 bg-zayia-lilac/20 rounded-xl">
                  <Clock className="w-4 h-4 text-zayia-soft-purple" />
                  <span className="text-sm text-zayia-deep-violet">
                    Tempo estimado: {showChallengeModal.duration} minutos
                  </span>
                </div>

                {/* Tipo de Comprovação */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    {getProofType(showChallengeModal) === 'photo' && <Camera className="w-4 h-4 text-blue-600" />}
                    {getProofType(showChallengeModal) === 'video' && <Video className="w-4 h-4 text-blue-600" />}
                    {getProofType(showChallengeModal) === 'audio' && <Mic className="w-4 h-4 text-blue-600" />}
                    <span className="text-sm font-medium text-blue-800">
                      Comprovação Necessária:
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {getProofType(showChallengeModal) === 'photo' && 'Envie uma foto comprovando que realizou o desafio'}
                    {getProofType(showChallengeModal) === 'video' && 'Grave um vídeo curto mostrando a atividade'}
                    {getProofType(showChallengeModal) === 'audio' && 'Grave um áudio relatando como foi a experiência'}
                  </p>
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="mt-6">
                <button
                  onClick={handleSubmitProof}
                  className="w-full zayia-button py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Enviar Comprovação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upload de Prova */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-zayia-deep-violet">Enviar Comprovação</h3>
                <button
                  onClick={() => {
                    setShowProofModal(null)
                    setUploadedFile(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Desafio Info */}
                <div className="p-3 bg-zayia-lilac/20 rounded-xl">
                  <div className="font-semibold text-zayia-deep-violet text-sm mb-1">
                    {showProofModal.title}
                  </div>
                  <div className="text-xs text-zayia-violet-gray">
                    +{showProofModal.points} {showProofModal.points === 1 ? 'ponto' : 'pontos'}
                  </div>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-zayia-lilac rounded-xl p-6 text-center">
                  {uploadedFile ? (
                    <div className="space-y-3">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                      <div className="text-sm font-medium text-green-700">
                        Arquivo selecionado: {uploadedFile.name}
                      </div>
                      <div className="text-xs text-green-600">
                        Tamanho: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-zayia-violet-gray mx-auto" />
                      <div className="text-sm text-zayia-violet-gray">
                        {getProofType(showProofModal) === 'photo' && 'Toque para selecionar uma foto'}
                        {getProofType(showProofModal) === 'video' && 'Toque para selecionar um vídeo'}
                        {getProofType(showProofModal) === 'audio' && 'Toque para selecionar um áudio'}
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept={
                      getProofType(showProofModal) === 'photo' ? 'image/*' :
                      getProofType(showProofModal) === 'video' ? 'video/*' :
                      'audio/*'
                    }
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Botão de Conclusão */}
                <button
                  onClick={handleCompleteChallenge}
                  disabled={!uploadedFile || isSubmitting}
                  className="w-full zayia-button py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Marcar como Concluído
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}