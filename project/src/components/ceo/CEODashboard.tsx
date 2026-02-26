import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Logo } from '../ui/Logo'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
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
import { SettingsSection } from './SettingsSection'
import { generateMockRankingUsers } from '../../lib/ranking-data-mock'

export function CEODashboard() {
  const { profile, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [rankingUsers] = useState(() => generateMockRankingUsers())

  const sections = [
    { id: 'dashboard2', label: 'Dashboard 2.0', icon: TrendingUp },
    { id: 'guerreiras', label: 'Guerreiras', icon: Award },
    { id: 'quizz', label: 'Quizz', icon: Brain },
    { id: 'community', label: 'Comunidade', icon: UserCheck },
    { id: 'challenges', label: 'Desafios', icon: Target },
    { id: 'awards', label: 'Medalhas', icon: Trophy },
    { id: 'prizes', label: 'Prêmios 💰', icon: DollarSign },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'integrations', label: 'Integrações', icon: Zap },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'settings', label: 'Configurações', icon: Settings }
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
              <p className="text-2xl font-bold text-zayia-deep-violet">1,247</p>
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
              <p className="text-2xl font-bold text-zayia-deep-violet">892</p>
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
              <p className="text-2xl font-bold text-zayia-deep-violet">156</p>
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
              <p className="text-2xl font-bold text-zayia-deep-violet">2,834</p>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="zayia-card p-6">
          <h3 className="text-lg font-semibold text-zayia-deep-violet mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-zayia-lilac/30 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zayia-deep-violet">Nova usuária cadastrada</p>
                <p className="text-xs text-zayia-violet-gray">Maria Silva - há 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zayia-lilac/30 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zayia-deep-violet">Medalha conquistada</p>
                <p className="text-xs text-zayia-violet-gray">Ana Costa - "Primeira Semana" - há 12 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zayia-lilac/30 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zayia-deep-violet">Nova pergunta SOS</p>
                <p className="text-xs text-zayia-violet-gray">Julia Santos - há 18 minutos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="zayia-card p-6">
          <h3 className="text-lg font-semibold text-zayia-deep-violet mb-4">Estatísticas do Dia</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zayia-violet-gray">Desafios Completados</span>
              <span className="text-lg font-bold text-zayia-deep-violet">156</span>
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
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia, index) => (
            <div key={dia} className="flex items-center gap-3">
              <span className="w-8 text-sm text-zayia-violet-gray">{dia}</span>
              <div className="flex-1 bg-zayia-lilac/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.random() * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-zayia-deep-violet">{Math.floor(Math.random() * 100)}</span>
            </div>
          ))}
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
      case 'integrations': return <IntegrationsSection />
      case 'compliance': return <ComplianceSection />
      case 'settings': return <SettingsSection />
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
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
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