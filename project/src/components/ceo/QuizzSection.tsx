import React, { useState, useEffect } from 'react'
import { supabaseClient, type QuizzQuestion } from '../../lib/supabase-client'
import { integrationsManager } from '../../lib/integrations-manager'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Filter,
  Brain,
  CheckCircle,
  Circle,
  AlertTriangle,
  Eye,
  BarChart3,
  Target,
  Clock,
  Award,
  Users,
  TrendingUp
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function QuizzSection() {
  const [questions, setQuestions] = useState<QuizzQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Estados para formulário
  const [formData, setFormData] = useState<Partial<QuizzQuestion>>({
    question: '',
    alternatives: [
      { id: 'a', text: '', is_correct: false },
      { id: 'b', text: '', is_correct: false }
    ],
    category: 'geral',
    difficulty: 'medio',
    points: 10,
    is_active: true
  })

  // Carregar perguntas
  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      // Tentar carregar do Supabase primeiro
      if (integrationsManager.isSupabaseConfigured()) {
        const questionsData = await supabaseClient.getQuizzQuestions()
        if (questionsData.length > 0) {
          setQuestions(questionsData)
        } else {
          // Se não há dados no Supabase, usar dados mock
          setQuestions(getMockQuestions())
        }
      } else {
        // Fallback para dados mock se Supabase não configurado
        setQuestions(getMockQuestions())
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      setQuestions(getMockQuestions())
    } finally {
      setLoading(false)
    }
  }

  // Dados mock das 21 perguntas
  const getMockQuestions = (): QuizzQuestion[] => [
    {
      id: '1',
      question: 'Quais são seus principais objetivos para os próximos 6 meses?',
      alternatives: [
        { id: 'a', text: 'Construir uma rotina mais saudável e produtiva', is_correct: false },
        { id: 'b', text: 'Melhorar minha autoestima e equilíbrio emocional', is_correct: false },
        { id: 'c', text: 'Alcançar metas profissionais ou financeiras', is_correct: false },
        { id: 'd', text: 'Fortalecer meus relacionamentos pessoais e afetivos', is_correct: false }
      ],
      category: 'objetivos',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      question: 'Qual área da sua vida mais precisa de mudança?',
      alternatives: [
        { id: 'a', text: 'Minha disciplina e constância nas tarefas', is_correct: false },
        { id: 'b', text: 'Meu bem-estar emocional e autocuidado', is_correct: false },
        { id: 'c', text: 'Minha vida profissional e financeira', is_correct: false },
        { id: 'd', text: 'Meus relacionamentos e conexões sociais', is_correct: false }
      ],
      category: 'autoconhecimento',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      question: 'Quais desafios você enfrenta no dia a dia?',
      alternatives: [
        { id: 'a', text: 'Falta de foco e organização', is_correct: false },
        { id: 'b', text: 'Dificuldade em manter uma rotina consistente', is_correct: false },
        { id: 'c', text: 'Emoções instáveis que afetam minha produtividade', is_correct: false },
        { id: 'd', text: 'Falta de apoio ou compreensão das pessoas ao redor', is_correct: false }
      ],
      category: 'desafios',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      question: 'O que mais drena sua motivação?',
      alternatives: [
        { id: 'a', text: 'Sentir que estou sempre atrasada com tudo', is_correct: false },
        { id: 'b', text: 'Perceber que não estou evoluindo como gostaria', is_correct: false },
        { id: 'c', text: 'Me comparar com outras pessoas o tempo todo', is_correct: false },
        { id: 'd', text: 'Viver no automático, sem propósito claro', is_correct: false }
      ],
      category: 'motivacao',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      question: 'Como organiza sua rotina diária?',
      alternatives: [
        { id: 'a', text: 'Anoto tudo e sigo um planejamento', is_correct: false },
        { id: 'b', text: 'Tenho uma lista mental do que preciso fazer', is_correct: false },
        { id: 'c', text: 'Vou fazendo conforme o que aparece', is_correct: false },
        { id: 'd', text: 'Sinto que minha rotina está completamente desorganizada', is_correct: false }
      ],
      category: 'rotina',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      question: 'Que estratégias já tentou aplicar?',
      alternatives: [
        { id: 'a', text: 'Listas de tarefas e planners', is_correct: false },
        { id: 'b', text: 'Técnicas de produtividade (como Pomodoro, por exemplo)', is_correct: false },
        { id: 'c', text: 'Bloquear distrações (celular, redes, etc.)', is_correct: false },
        { id: 'd', text: 'Ainda não encontrei algo que realmente funcione pra mim', is_correct: false }
      ],
      category: 'estrategias',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '7',
      question: 'De 0 a 10, como está sua motivação?',
      alternatives: [
        { id: 'a', text: 'Baixíssima (0 a 3) – Estou sem energia, sem direção', is_correct: false },
        { id: 'b', text: 'Instável (4 a 6) – Tem dias bons, outros péssimos', is_correct: false },
        { id: 'c', text: 'Razoável (7 a 8) – Consigo manter, mas oscila', is_correct: false },
        { id: 'd', text: 'Alta (9 a 10) – Estou focada e engajada comigo mesma', is_correct: false }
      ],
      category: 'motivacao',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '8',
      question: 'Quais sentimentos têm sido frequentes?',
      alternatives: [
        { id: 'a', text: 'Ansiedade, comparação e cobrança interna', is_correct: false },
        { id: 'b', text: 'Tristeza, sensação de estagnação', is_correct: false },
        { id: 'c', text: 'Motivação com medo de regredir', is_correct: false },
        { id: 'd', text: 'Esperança e desejo real de mudança', is_correct: false }
      ],
      category: 'emocoes',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '9',
      question: 'Você se sente apoiada pelas pessoas ao seu redor?',
      alternatives: [
        { id: 'a', text: 'Sim, tenho pessoas que me fortalecem', is_correct: false },
        { id: 'b', text: 'Às vezes, mas não posso contar sempre', is_correct: false },
        { id: 'c', text: 'Sinto que as pessoas não me entendem', is_correct: false },
        { id: 'd', text: 'Me sinto sozinha, mesmo estando cercada', is_correct: false }
      ],
      category: 'relacionamentos',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '10',
      question: 'Você se sente realizada profissionalmente?',
      alternatives: [
        { id: 'a', text: 'Sim, faço o que amo e me sinto reconhecida', is_correct: false },
        { id: 'b', text: 'Em partes, ainda falta sentido ou motivação', is_correct: false },
        { id: 'c', text: 'Não, mas tô tentando mudar isso', is_correct: false },
        { id: 'd', text: 'Não mesmo, me sinto presa e frustrada', is_correct: false }
      ],
      category: 'carreira',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '11',
      question: 'Como você avalia hoje sua disposição física?',
      alternatives: [
        { id: 'a', text: 'Me sinto com energia pra fazer o que preciso', is_correct: false },
        { id: 'b', text: 'Oscila bastante ao longo da semana', is_correct: false },
        { id: 'c', text: 'Ando cansada quase todos os dias', is_correct: false },
        { id: 'd', text: 'Me sinto exausta até pra coisas simples', is_correct: false }
      ],
      category: 'saude',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '12',
      question: 'Qual sua idade?',
      alternatives: [
        { id: 'a', text: 'Menos de 25 anos', is_correct: false },
        { id: 'b', text: 'Entre 25 e 34 anos', is_correct: false },
        { id: 'c', text: 'Entre 35 e 45 anos', is_correct: false },
        { id: 'd', text: 'Mais de 45 anos', is_correct: false }
      ],
      category: 'demografico',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '13',
      question: 'Você ainda menstrua?',
      alternatives: [
        { id: 'a', text: 'Sim, regularmente', is_correct: false },
        { id: 'b', text: 'Sim, mas de forma irregular', is_correct: false },
        { id: 'c', text: 'Não menstrua mais (menopausa)', is_correct: false },
        { id: 'd', text: 'Nunca menstruei ou outro motivo médico', is_correct: false }
      ],
      category: 'demografico',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '14',
      question: 'Como você se enxerga hoje?',
      alternatives: [
        { id: 'a', text: 'Uma mulher forte, mas cansada', is_correct: false },
        { id: 'b', text: 'Uma versão apagada de mim mesma', is_correct: false },
        { id: 'c', text: 'Ainda tô tentando me reconhecer', is_correct: false },
        { id: 'd', text: 'Não gosto da mulher que vejo no espelho', is_correct: false }
      ],
      category: 'autoestima',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '15',
      question: 'Você se sente culpada quando descansa?',
      alternatives: [
        { id: 'a', text: 'Sim, quase sempre', is_correct: false },
        { id: 'b', text: 'Um pouco, mas tento ignorar', is_correct: false },
        { id: 'c', text: 'Só quando tenho muita coisa pendente', is_correct: false },
        { id: 'd', text: 'Não, descanso é necessário', is_correct: false }
      ],
      category: 'autocuidado',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '16',
      question: 'Quando tá ansiosa ou triste, você costuma...',
      alternatives: [
        { id: 'a', text: 'Ir pras redes sociais', is_correct: false },
        { id: 'b', text: 'Comer algo que gosta', is_correct: false },
        { id: 'c', text: 'Se isolar e ficar em silêncio', is_correct: false },
        { id: 'd', text: 'Trabalhar ou se ocupar com tarefas', is_correct: false }
      ],
      category: 'emocoes',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '17',
      question: 'Qual aplicativo mais consome seu tempo hoje?',
      alternatives: [
        { id: 'a', text: 'Instagram ou TikTok', is_correct: false },
        { id: 'b', text: 'WhatsApp ou YouTube', is_correct: false },
        { id: 'c', text: 'Netflix / séries', is_correct: false },
        { id: 'd', text: 'Jogos ou outro app de distração', is_correct: false }
      ],
      category: 'digital',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '18',
      question: 'Teve algum momento recente que te fez querer mudar?',
      alternatives: [
        { id: 'a', text: 'Sim, um rompimento ou perda', is_correct: false },
        { id: 'b', text: 'Um dia comum que virou meu limite', is_correct: false },
        { id: 'c', text: 'Uma crise de ansiedade ou burnout', is_correct: false },
        { id: 'd', text: 'Ainda tô esperando esse estalo', is_correct: false }
      ],
      category: 'transformacao',
      difficulty: 'medio',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '19',
      question: 'Se nada mudar nos próximos 6 meses...',
      alternatives: [
        { id: 'a', text: 'Vou continuar me sabotando', is_correct: false },
        { id: 'b', text: 'Vou perder coisas importantes', is_correct: false },
        { id: 'c', text: 'Vou adoecer emocionalmente', is_correct: false },
        { id: 'd', text: 'Não quero nem imaginar isso', is_correct: false }
      ],
      category: 'futuro',
      difficulty: 'dificil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '20',
      question: 'Prefere um plano mais...',
      alternatives: [
        { id: 'a', text: 'Direto e desafiador', is_correct: false },
        { id: 'b', text: 'Leve e acolhedor', is_correct: false },
        { id: 'c', text: 'Misto: apoio e firmeza', is_correct: false },
        { id: 'd', text: 'Quero testar e ver na prática', is_correct: false }
      ],
      category: 'preferencias',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '21',
      question: 'Qual dessas áreas você quer focar primeiro no app?',
      alternatives: [
        { id: 'a', text: 'Rotina & Organização', is_correct: false },
        { id: 'b', text: 'Corpo & Saúde', is_correct: false },
        { id: 'c', text: 'Mindfulness & Emoções', is_correct: false },
        { id: 'd', text: 'Relacionamentos & Comunicação', is_correct: false },
        { id: 'e', text: 'Autoestima & Autocuidado', is_correct: false },
        { id: 'f', text: 'Carreira & Desenvolvimento Profissional', is_correct: false },
        { id: 'g', text: 'Digital Detox', is_correct: false }
      ],
      category: 'foco',
      difficulty: 'facil',
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // Filtrar perguntas
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Categorias únicas
  const categories = Array.from(new Set(questions.map(q => q.category)))

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      question: '',
      alternatives: [
        { id: 'a', text: '', is_correct: false },
        { id: 'b', text: '', is_correct: false }
      ],
      category: 'geral',
      difficulty: 'medio',
      points: 10,
      is_active: true
    })
  }

  // Adicionar alternativa
  const addAlternative = () => {
    const nextId = String.fromCharCode(97 + (formData.alternatives?.length || 0)) // a, b, c, d...
    setFormData(prev => ({
      ...prev,
      alternatives: [
        ...(prev.alternatives || []),
        { id: nextId, text: '', is_correct: false }
      ]
    }))
  }

  // Remover alternativa
  const removeAlternative = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alternatives: prev.alternatives?.filter((_, i) => i !== index) || []
    }))
  }

  // Atualizar alternativa
  const updateAlternative = (index: number, field: 'text' | 'is_correct', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      alternatives: prev.alternatives?.map((alt, i) => 
        i === index ? { ...alt, [field]: value } : alt
      ) || []
    }))
  }

  // Salvar pergunta
  const saveQuestion = async () => {
    if (!formData.question?.trim() || !formData.alternatives?.length) return

    setIsSaving(true)
    try {
      if (showEditModal) {
        // Editar pergunta existente
        if (integrationsManager.isSupabaseConfigured()) {
          const updated = await supabaseClient.updateQuizzQuestion(showEditModal, formData)
          if (updated) {
            setQuestions(prev => prev.map(q => q.id === showEditModal ? updated : q))
          }
        } else {
          // Fallback localStorage
          setQuestions(prev => prev.map(q => 
            q.id === showEditModal 
              ? { ...q, ...formData, updated_at: new Date().toISOString() }
              : q
          ))
        }
        setShowEditModal(null)
      } else {
        // Criar nova pergunta
        if (integrationsManager.isSupabaseConfigured()) {
          const created = await supabaseClient.createQuizzQuestion(formData as Omit<QuizzQuestion, 'id' | 'created_at' | 'updated_at'>)
          if (created) {
            setQuestions(prev => [created, ...prev])
          }
        } else {
          // Fallback localStorage
          const newQuestion: QuizzQuestion = {
            id: Date.now().toString(),
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as QuizzQuestion
          setQuestions(prev => [newQuestion, ...prev])
        }
        setShowAddModal(false)
      }
      
      resetForm()
    } catch (error) {
      console.error('Error saving question:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Excluir pergunta
  const deleteQuestion = async (id: string) => {
    try {
      if (integrationsManager.isSupabaseConfigured()) {
        const success = await supabaseClient.deleteQuizzQuestion(id)
        if (success) {
          setQuestions(prev => prev.filter(q => q.id !== id))
        }
      } else {
        // Fallback localStorage
        setQuestions(prev => prev.filter(q => q.id !== id))
      }
      setShowDeleteModal(null)
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  // Abrir modal de edição
  const openEditModal = (question: QuizzQuestion) => {
    setFormData(question)
    setShowEditModal(question.id)
  }

  // Obter cor da dificuldade
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'bg-green-100 text-green-700'
      case 'medio': return 'bg-yellow-100 text-yellow-700'
      case 'dificil': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Obter estatísticas
  const getStats = () => {
    const total = questions.length
    const active = questions.filter(q => q.is_active).length
    const byDifficulty = {
      facil: questions.filter(q => q.difficulty === 'facil').length,
      medio: questions.filter(q => q.difficulty === 'medio').length,
      dificil: questions.filter(q => q.difficulty === 'dificil').length
    }
    const byCategory = categories.reduce((acc, cat) => {
      acc[cat] = questions.filter(q => q.category === cat).length
      return acc
    }, {} as { [key: string]: number })

    return { total, active, byDifficulty, byCategory }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              🧠 Quizz de Autoconhecimento
            </h2>
            <p className="text-zayia-violet-gray">
              Gerencie as perguntas do questionário de perfil das usuárias
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="zayia-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Pergunta
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Brain className="w-8 h-8 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{stats.total}</div>
            <div className="text-sm text-zayia-violet-gray">Total de Perguntas</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <CheckCircle className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{stats.active}</div>
            <div className="text-sm text-zayia-violet-gray">Perguntas Ativas</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Target className="w-8 h-8 text-zayia-lavender mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{categories.length}</div>
            <div className="text-sm text-zayia-violet-gray">Categorias</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Award className="w-8 h-8 text-zayia-orchid mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {questions.reduce((sum, q) => sum + q.points, 0)}
            </div>
            <div className="text-sm text-zayia-violet-gray">Pontos Totais</div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="zayia-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar pergunta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="zayia-input w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:outline-none"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
          >
            <option value="all">Todas as Dificuldades</option>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-zayia-violet-gray">
          Mostrando {filteredQuestions.length} de {questions.length} perguntas
        </div>
      </div>

      {/* Lista de Perguntas */}
      {loading ? (
        <div className="zayia-card p-12 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando perguntas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuestions.map((question, index) => (
            <div key={question.id} className="zayia-card p-6">
              {/* Header da Pergunta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-zayia-deep-violet">#{index + 1}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-zayia-lilac/20 text-zayia-deep-violet rounded-full text-xs">
                      {question.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-zayia-deep-violet mb-3">
                    {question.question}
                  </h3>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(question)}
                    className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors p-2 hover:bg-zayia-lilac/20 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(question.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alternativas */}
              <div className="space-y-2">
                {question.alternatives.map((alternative, altIndex) => (
                  <div key={alternative.id} className="flex items-center gap-3 p-3 bg-zayia-lilac/10 rounded-lg">
                    <span className="w-6 h-6 bg-zayia-lilac text-zayia-deep-violet rounded-full flex items-center justify-center text-sm font-bold">
                      {alternative.id.toUpperCase()}
                    </span>
                    <span className="text-sm text-zayia-deep-violet flex-1">
                      {alternative.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-zayia-lilac/30 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-zayia-violet-gray">
                  <span>{question.alternatives.length} alternativas</span>
                  <span>+{question.points} pontos</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${question.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Adicionar/Editar */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-zayia-deep-violet">
                  {showEditModal ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Pergunta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pergunta *
                  </label>
                  <textarea
                    value={formData.question || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Digite a pergunta..."
                  />
                </div>

                {/* Configurações */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <select
                      value={formData.category || 'geral'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                    >
                      <option value="geral">Geral</option>
                      <option value="objetivos">Objetivos</option>
                      <option value="autoconhecimento">Autoconhecimento</option>
                      <option value="desafios">Desafios</option>
                      <option value="motivacao">Motivação</option>
                      <option value="rotina">Rotina</option>
                      <option value="estrategias">Estratégias</option>
                      <option value="emocoes">Emoções</option>
                      <option value="relacionamentos">Relacionamentos</option>
                      <option value="carreira">Carreira</option>
                      <option value="saude">Saúde</option>
                      <option value="demografico">Demográfico</option>
                      <option value="autoestima">Autoestima</option>
                      <option value="autocuidado">Autocuidado</option>
                      <option value="digital">Digital</option>
                      <option value="transformacao">Transformação</option>
                      <option value="futuro">Futuro</option>
                      <option value="preferencias">Preferências</option>
                      <option value="foco">Foco</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
                    <select
                      value={formData.difficulty || 'medio'}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as unknown }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                    >
                      <option value="facil">Fácil</option>
                      <option value="medio">Médio</option>
                      <option value="dificil">Difícil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pontos</label>
                    <input
                      type="number"
                      value={formData.points || 10}
                      onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                      className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                {/* Alternativas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Alternativas * (mínimo 2)
                    </label>
                    <button
                      onClick={addAlternative}
                      className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Alternativa
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.alternatives?.map((alternative, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-zayia-lilac/30 rounded-xl">
                        <span className="w-8 h-8 bg-zayia-lilac text-zayia-deep-violet rounded-full flex items-center justify-center text-sm font-bold">
                          {alternative.id.toUpperCase()}
                        </span>
                        <input
                          type="text"
                          value={alternative.text}
                          onChange={(e) => updateAlternative(index, 'text', e.target.value)}
                          className="flex-1 zayia-input px-3 py-2 rounded-lg border-0 focus:outline-none"
                          placeholder="Digite a alternativa..."
                        />
                        {formData.alternatives && formData.alternatives.length > 2 && (
                          <button
                            onClick={() => removeAlternative(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Ativo */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-zayia-lilac"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Pergunta ativa (visível para usuárias)
                  </label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-zayia-lilac/30">
                <button
                  onClick={saveQuestion}
                  disabled={isSaving || !formData.question?.trim() || !formData.alternatives?.length || formData.alternatives.length < 2}
                  className="zayia-button px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Salvando...' : showEditModal ? 'Salvar Alterações' : 'Criar Pergunta'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(null)
                    resetForm()
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              {(() => {
                const question = questions.find(q => q.id === showDeleteModal)
                if (!question) return null

                return (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Excluir Pergunta?
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Esta ação não pode ser desfeita. A pergunta será removida permanentemente.
                      </p>
                      
                      <div className="bg-gray-50 p-4 rounded-xl text-left">
                        <div className="text-sm font-medium text-gray-700 mb-2">Pergunta a ser excluída:</div>
                        <div className="text-sm text-gray-900">{question.question}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {question.alternatives.length} alternativas • Categoria: {question.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteModal(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => deleteQuestion(showDeleteModal)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                      >
                        Sim, Excluir
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Mensagem quando não há perguntas */}
      {!loading && filteredQuestions.length === 0 && (
        <div className="zayia-card p-12 text-center">
          <Brain className="w-16 h-16 text-zayia-violet-gray mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' 
              ? 'Nenhuma pergunta encontrada' 
              : 'Nenhuma pergunta criada ainda'
            }
          </h3>
          <p className="text-zayia-violet-gray mb-6">
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira pergunta do quizz'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && selectedDifficulty === 'all' && (
            <button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="zayia-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Criar Primeira Pergunta
            </button>
          )}
        </div>
      )}
    </div>
  )
}