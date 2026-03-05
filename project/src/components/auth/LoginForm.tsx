import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Eye, EyeOff, Mail, Lock, Sparkles, User } from 'lucide-react'
import { ForgotPasswordForm } from './ForgotPasswordForm'

interface LoginFormProps {
  onToggleForm: () => void
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const { signIn, quickCEOLogin, quickUserLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError('Email ou senha incorretos')
    }
    
    setLoading(false)
  }

  const handleCEOLogin = async () => {
    setLoading(true)
    setError('')
    await quickCEOLogin()
    setLoading(false)
  }

  const handleUserLogin = async () => {
    setLoading(true)
    setError('')
    await quickUserLogin()
    setLoading(false)
  }

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto">
        <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold zayia-gradient-text mb-2">
          Bem-vinda de volta! ✨
        </h2>
        <p className="text-zayia-violet-gray">
          Entre na sua conta e continue sua jornada de transformação
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="zayia-input w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="zayia-input w-full pl-10 pr-12 py-3 rounded-xl border-0 focus:outline-none"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray hover:text-zayia-soft-purple transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-zayia-soft-purple hover:text-zayia-deep-violet underline mt-1"
          >
            Esqueci minha senha
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="zayia-button w-full py-3 px-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zayia-lilac"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zayia-cream text-zayia-violet-gray">ou acesso rápido</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCEOLogin}
            disabled={loading}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            👑 CEO
          </button>
          
          <button
            onClick={handleUserLogin}
            disabled={loading}
            className="py-3 px-4 rounded-xl bg-zayia-lilac text-zayia-deep-violet font-semibold hover:bg-zayia-lavender transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <User className="w-4 h-4" />
            Usuária
          </button>
        </div>

        <div className="bg-zayia-lilac/20 border border-zayia-lilac/40 rounded-xl p-4 text-sm">
          <p className="font-semibold text-zayia-deep-violet mb-2">💡 Credenciais de Teste:</p>
          <div className="space-y-1 text-zayia-violet-gray text-xs">
            <p><strong>CEO:</strong> ceo@zayia.com / zayia2024</p>
            <p><strong>Usuária:</strong> user@zayia.com / demo2024</p>
          </div>
        </div>

        <p className="text-center text-sm text-zayia-violet-gray">
          Ainda não tem conta?{' '}
          <button
            onClick={onToggleForm}
            className="text-zayia-soft-purple hover:text-zayia-deep-violet font-semibold transition-colors"
          >
            Cadastre-se aqui
          </button>
        </p>
      </div>
    </div>
  )
}