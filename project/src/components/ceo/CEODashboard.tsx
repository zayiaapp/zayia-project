import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Logo } from '../ui/Logo'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import {
  BarChart3,
  Users,
  MessageSquare,
  LogOut,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Shield,
  Bell,
  Database,
  Mail,
  CreditCard,
  UserCheck,
  Crown,
  Zap,
  Calendar,
  Activity,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Brain,
  DollarSign
} from 'lucide-react'

// Import das seções
import { CommunitySection } from '../user/sections/CommunitySection'
import { ChallengesSection } from './ChallengesSection'
import { AwardsSection } from './AwardsSection'
import { PrizeManagementSection } from './PrizeManagementSection'
import { ComplianceSection } from './ComplianceSection'
import { NotificationsSection } from './NotificationsSection'
import IntegrationsSection from './IntegrationsSection'
import { Dashboard2Section } from './Dashboard2Section'
import { GuerreirasSection } from './GuerreirasSection'
import { QuizzSection } from './QuizzSection'
import { SubscriptionsSection } from './SubscriptionsSection'
import { supabase } from '../../lib/supabase'
import { supabaseClient, type Profile, type ActivityLogEntry, type DailyAnalytics } from '../../lib/supabase-client'

function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    'challenge_completed': 'Desafio completado',
    'badge_earned': 'Medalha conquistada',
    'level_up': 'Subiu de nível',
    'community_post': 'Nova mensagem na comunidade',
    'user_registered': 'Nova usuária cadastrada',
    'streak_milestone': 'Marco de sequência alcançado',
  }
  return labels[type] || 'Atividade'
}

function formatRelativeTime(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (seconds < 60) return 'agora'
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`
  return `há ${Math.floor(seconds / 86400)}d`
}

export function CEODashboard() {
  const { profile, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    todayChallenges: 0,
    totalBadgesEarned: 0,
  })
  const [activityFeed, setActivityFeed] = useState<ActivityLogEntry[]>([])
  const [rankingUsers, setRankingUsers] = useState<Profile[]>([])
  const [weeklyData, setWeeklyData] = useState<DailyAnalytics[]>([])

  useEffect(() => {
    const loadMetrics = async () => {
      const today = new Date().toISOString().split('T')[0]
      const [
        { count: total },
        { count: active },
        { count: todayCh },
        { count: badges },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user').eq('subscription_status', 'active'),
        supabase.from('challenge_completions').select('*', { count: 'exact', head: true }).gte('completed_at', today),
        supabase.from('user_earned_badges').select('*', { count: 'exact', head: true }),
      ])
      setMetrics({
        totalUsers: total || 0,
        activeUsers: active || 0,
        todayChallenges: todayCh || 0,
        totalBadgesEarned: badges || 0,
      })
    }
    loadMetrics()
  }, [])

  useEffect(() => {
    const loadRanking = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, points, level, subscription_plan')
        .eq('role', 'user')
        .order('points', { ascending: false })
        .limit(50)
      setRankingUsers((data as Profile[]) || [])
    }
    loadRanking()
  }, [])

  useEffect(() => {
    const loadActivity = async () => {
      const feed = await supabaseClient.getActivityLog(10)
      setActivityFeed(feed)
    }
    loadActivity()
  }, [])

  useEffect(() => {
    const loadWeekly = async () => {
      const data = await supabaseClient.getDailyAnalytics(7)
      setWeeklyData(data)
    }
    loadWeekly()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    // setIsLoggingOut(false) não é necessário — componente desmonta após signOut
  }

  const sections = [
    { id: 'dashboard2', label: 'Dashboard 2.0', icon: TrendingUp },
    { id: 'guerreiras', label: 'Guerreiras', icon: Award },
    { id: 'quizz', label: 'Quizz', icon: Brain },
    { id: 'community', label: 'Comunidade', icon: UserCheck },
    { id: 'challenges', label: 'Desafios', icon: Target },
    { id: 'awards', label: 'Medalhas', icon: Trophy },
    { id: 'prizes', label: 'Prêmios 💰', icon: DollarSign },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
    { id: 'integrations', label: 'Integrações', icon: Zap },
    { id: 'compliance', label: 'Compliance', icon: Shield }
  ]

  const handleRefreshRanking = async () => {
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.reload()
  }

  const handleFinalizeMonth = async () => {
    if (!confirm('Finalizar mês? Isso vai salvar o ranking e criar prêmios pendentes!')) {
      return
    }
    // Simular finalize
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('Mês finalizado! Prêmios criados como PENDENTES')
    window.location.reload()
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bem-vinda, CEO! 👑
            </h1>
            <p className="text-white/90 text-lg">
              Painel executivo da ZAYIA - Sua plataforma de transformação feminina
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="zayia-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-zayia-violet-gray">Total de Usuárias</p>
              <p className="text-2xl font-bold text-zayia-deep-violet">{metrics.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="zayia-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-zayia-violet-gray">Usuárias Ativas</p>
              <p className="text-2xl font-bold text-zayia-deep-violet">{metrics.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="zayia-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-zayia-violet-gray">Desafios Hoje</p>
              <p className="text-2xl font-bold text-zayia-deep-violet">{metrics.todayChallenges.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="zayia-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-zayia-violet-gray">Medalhas Conquistadas</p>
              <p className="text-2xl font-bold text-zayia-deep-violet">{metrics.totalBadgesEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="zayia-card p-6">
          <h3 className="text-lg font-semibold text-zayia-deep-violet mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {activityFeed.length === 0 ? (
              <p className="text-sm text-zayia-violet-gray text-center py-4">
                Nenhuma atividade recente.
              </p>
            ) : activityFeed.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 p-3 bg-zayia-lilac/30 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zayia-deep-violet">
                    {getActivityLabel(entry.action_type)}
                  </p>
                  <p className="text-xs text-zayia-violet-gray">
                    {entry.user_profile?.full_name || 'Usuária'} — {formatRelativeTime(entry.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="zayia-card p-6">
          <h3 className="text-lg font-semibold text-zayia-deep-violet mb-4">Estatísticas do Dia</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zayia-violet-gray">Desafios Completados</span>
              <span className="text-lg font-bold text-zayia-deep-violet">{metrics.todayChallenges}</span>
            </div>
            <div className="w-full bg-zayia-lilac/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-zayia-violet-gray">Novas Usuárias</span>
              <span className="text-lg font-bold text-zayia-deep-violet">23</span>
            </div>
            <div className="w-full bg-zayia-lilac/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-zayia-violet-gray">Engajamento</span>
              <span className="text-lg font-bold text-zayia-deep-violet">87%</span>
            </div>
            <div className="w-full bg-zayia-lilac/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Crescimento */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-semibold text-zayia-deep-violet mb-4">Crescimento dos Últimos 7 Dias</h3>
        <div className="space-y-3">
          {weeklyData.length === 0 ? (
            <p className="text-sm text-zayia-violet-gray text-center py-4">Nenhum dado disponível.</p>
          ) : weeklyData.map((day, index) => {
            const maxChallenges = Math.max(...weeklyData.map(d => d.challenges_completed), 1)
            const pct = Math.round((day.challenges_completed / maxChallenges) * 100)
            const label = new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 text-sm text-zayia-violet-gray">{label}</span>
                <div className="flex-1 bg-zayia-lilac/30 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-zayia-deep-violet">{day.challenges_completed}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard()
      case 'dashboard2': return <Dashboard2Section />
      case 'guerreiras': return <GuerreirasSection />
      case 'quizz': return <QuizzSection />
      case 'community': return <CommunitySection />
      case 'challenges': return <ChallengesSection />
      case 'awards': return <AwardsSection />
      case 'prizes': return (
        <PrizeManagementSection
          users={rankingUsers}
          onRefreshRanking={handleRefreshRanking}
          onFinalizeMonth={handleFinalizeMonth}
        />
      )
      case 'notifications': return <NotificationsSection />
      case 'subscriptions': return <SubscriptionsSection />
      case 'integrations': return <IntegrationsSection />
      case 'compliance': return <ComplianceSection />
      default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zayia-cream via-zayia-lilac/20 to-zayia-pearl">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-zayia-lilac/30 min-h-screen p-6">
          <Logo size="md" className="mb-8" />
          
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <img 
                src={profile?.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'} 
                alt="CEO" 
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div>
                <p className="font-semibold text-zayia-deep-violet">{profile?.full_name || 'CEO ZAYIA'}</p>
                <p className="text-sm text-zayia-violet-gray">Administradora</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-zayia-sunset text-white'
                      : 'text-zayia-violet-gray hover:bg-zayia-lilac/30 hover:text-zayia-deep-violet'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-zayia-lilac/30">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}