import React, { useState } from 'react'
import { Logo } from '../ui/Logo'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zayia-cream via-zayia-lilac/30 to-zayia-pearl flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" />
          <p className="text-zayia-violet-gray text-lg">
            Sua jornada de transformação pessoal começa aqui ✨
          </p>
        </div>

        {/* Auth Form */}
        <div className="zayia-card p-8 rounded-2xl">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-zayia-violet-gray">
          <p>
            Feito com 💜 pela equipe ZAYIA
          </p>
        </div>
      </div>
    </div>
  )
}