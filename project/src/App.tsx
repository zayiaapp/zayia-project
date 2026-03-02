import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PlansProvider } from './contexts/PlansContext'
import { AuthPage } from './components/auth/AuthPage'
import { CEODashboard } from './components/ceo/CEODashboard'
import { MobileUserDashboard } from './components/user/MobileUserDashboard'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

function AppContent() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zayia-cream via-zayia-lilac/20 to-zayia-pearl flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando ZAYIA...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <AuthPage />
  }

  if (profile.role === 'ceo') {
    return <CEODashboard />
  }

  return <MobileUserDashboard />
}

function App() {
  return (
    <AuthProvider>
      <PlansProvider>
        <AppContent />
      </PlansProvider>
    </AuthProvider>
  )
}

export default App