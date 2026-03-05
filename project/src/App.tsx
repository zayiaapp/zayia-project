import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PlansProvider } from './contexts/PlansContext'
import { AuthPage } from './components/auth/AuthPage'
import { CEODashboard } from './components/ceo/CEODashboard'
import { MobileUserDashboard } from './components/user/MobileUserDashboard'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ResetPasswordForm } from './components/auth/ResetPasswordForm'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [showResetPassword, setShowResetPassword] = useState(false)

  useEffect(() => {
    // Supabase injeta o token no hash fragment ao redirecionar
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (hashParams.get('type') === 'recovery') {
      setShowResetPassword(true)
      // Limpa o hash da URL sem recarregar a página
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

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

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zayia-cream via-zayia-lilac/20 to-zayia-pearl flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm onSuccess={() => setShowResetPassword(false)} />
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