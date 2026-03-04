import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getGreeting } from '../../lib/utils'
import {
  Home,
  Trophy,
  Target,
  Award,
  Users,
  CreditCard,
  User,
  X,
  ChevronRight,
  Menu,
  Bell,
  Settings
} from 'lucide-react'

// Import das seções
import { DashboardOverviewSection } from './sections/DashboardOverviewSection'
import { RankingSection } from './sections/RankingSection'
import { ChallengesSection } from './sections/ChallengesSection'
import { AchievementsSection } from './sections/AchievementsSection'
import { UserCommunitySection } from './sections/UserCommunitySection'
import { SubscriptionSection } from './sections/SubscriptionSection'
import { ProfileSection } from './sections/ProfileSection'
import { SettingsSection } from './sections/SettingsSection'

export function MobileUserDashboard() {
  const { profile, signOut } = useAuth()
  const greeting = getGreeting()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false) // CLOSED by default

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Visão geral do seu progresso' },
    { id: 'ranking', label: 'Ranking', icon: Trophy, description: 'Sua posição entre as guerreiras' },
    { id: 'challenges', label: 'Desafios', icon: Target, description: 'Desafios diários de transformação' },
    { id: 'badges', label: 'Medalhas', icon: Award, description: 'Conquistas e níveis alcançados' },
    { id: 'community', label: 'Comunidade', icon: Users, description: 'Grupos WhatsApp da ZAYIA' },
    { id: 'subscription', label: 'Assinatura', icon: CreditCard, description: 'Gerenciar seu plano' },
    { id: 'profile', label: 'Perfil', icon: User, description: 'Suas informações pessoais' },
    { id: 'settings', label: 'Configurações', icon: Settings, description: 'Personalize sua experiência' }
  ]

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsDrawerOpen(false) // Close drawer after selection
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  // ✅ Listen for navigate to medals event
  useEffect(() => {
    const handleNavigateToMedals = (event: any) => {
      setActiveSection('badges')
      setIsDrawerOpen(false)
      console.log('🎖️ Navegando para aba de Medalhas...')
    }

    window.addEventListener('navigateToMedalTab', handleNavigateToMedals)
    return () => window.removeEventListener('navigateToMedalTab', handleNavigateToMedals)
  }, [])

  // ✅ Listen for navigate to dashboard event
  useEffect(() => {
    const handleNavigateToDashboard = (event: any) => {
      setActiveSection('dashboard')
      setIsDrawerOpen(false)
      console.log('🏠 Navegando para Dashboard...')
    }

    window.addEventListener('navigateToDashboard', handleNavigateToDashboard)
    return () => window.removeEventListener('navigateToDashboard', handleNavigateToDashboard)
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverviewSection />
      case 'ranking': return <RankingSection />
      case 'challenges': return <ChallengesSection />
      case 'badges': return <AchievementsSection />
      case 'community': return <UserCommunitySection />
      case 'subscription': return <SubscriptionSection />
      case 'profile': return <ProfileSection />
      case 'settings': return <SettingsSection />
      default: return <DashboardOverviewSection />
    }
  }

  const currentSection = sections.find(s => s.id === activeSection)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zayia-cream via-zayia-lilac/20 to-zayia-pearl relative">
      {/* Overlay para fechar drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer Lateral - FIXED FUNCTIONALITY */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl`}>
        
        {/* Header do Drawer - FIXED STYLING */}
        <div className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Menu ZAYIA</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Perfil da Usuária no Drawer */}
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'}
              alt="Perfil"
              className="w-12 h-12 rounded-full border-2 border-white/40"
            />
            <div>
              <p className="font-semibold">{profile?.full_name || 'Usuária ZAYIA'}</p>
              <p className="text-white/80 text-sm">Nível {profile?.level || 1} • {profile?.points || 0} pontos</p>
            </div>
          </div>
        </div>

        {/* Lista de Seções - FIXED SCROLLING */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-zayia-soft-purple scrollbar-track-zayia-lilac/20">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 touch-manipulation active:scale-95 ${
                    isActive
                      ? 'bg-zayia-sunset text-white'
                      : 'text-zayia-deep-violet hover:bg-zayia-lilac/30 active:bg-zayia-lilac/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{section.label}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-zayia-violet-gray'}`}>
                      {section.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer do Drawer - FIXED POSITIONING */}
        <div className="flex-shrink-0 p-4 border-t border-zayia-lilac/30 bg-white">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all duration-200 touch-manipulation active:scale-95"
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Sair da Conta</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm min-h-screen flex flex-col">
        {/* Header com botão do menu - FIXED TRIGGER */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-zayia-lilac/30 sticky top-0 z-30 flex-shrink-0">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Menu Hambúrguer - FIXED BUTTON */}
              <button
                onClick={toggleDrawer}
                className="p-3 hover:bg-zayia-lilac/20 active:bg-zayia-lilac/30 rounded-xl transition-all duration-200 touch-manipulation active:scale-95"
                aria-label="Abrir menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
                  <div className="w-5 h-0.5 bg-zayia-deep-violet rounded-full transition-all duration-200"></div>
                  <div className="w-5 h-0.5 bg-zayia-deep-violet rounded-full transition-all duration-200"></div>
                  <div className="w-5 h-0.5 bg-zayia-deep-violet rounded-full transition-all duration-200"></div>
                </div>
              </button>
              
              {/* Logo e Saudação */}
              <div className="flex items-center gap-3 flex-1 justify-center">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-zayia-sunset rounded-xl rotate-45 animate-pulse-slow"></div>
                  <div className="absolute inset-1 bg-white rounded-lg rotate-45"></div>
                  <div className="absolute inset-2 bg-zayia-glow rounded-md rotate-45 animate-float"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs rotate-45 z-10">Z</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-zayia-deep-violet">
                    {greeting}
                  </p>
                  <p className="text-xs text-zayia-deep-violet/70">
                    {profile?.full_name?.split(' ')[0] || 'Usuária'}
                  </p>
                </div>
              </div>

              {/* Notificações */}
              <div className="flex items-center">
                <button className="relative p-3 hover:bg-zayia-lilac/20 active:bg-zayia-lilac/30 rounded-xl transition-all duration-200 touch-manipulation active:scale-95">
                  <Bell className="w-5 h-5 text-zayia-deep-violet" />
                  <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Breadcrumb da Seção Atual - FIXED POSITIONING */}
        <div className="px-4 py-2 bg-zayia-lilac/10 border-b border-zayia-lilac/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            {currentSection && (
              <>
                <currentSection.icon className="w-4 h-4 text-zayia-soft-purple" />
                <span className="text-sm font-medium text-zayia-deep-violet">
                  {currentSection.label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Content - FIXED SCROLLING */}
        <main className="flex-1 overflow-y-auto p-4 pb-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}