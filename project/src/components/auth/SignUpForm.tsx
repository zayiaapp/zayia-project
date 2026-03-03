import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react'

interface SignUpFormProps {
  onToggleForm: () => void
}

export function SignUpForm({ onToggleForm }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações
    if (!formData.acceptTerms) {
      setError('Você deve aceitar a Política de Privacidade e Termos de Uso para continuar')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await signUp(formData.email, formData.password, formData.fullName)
    
    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email já está cadastrado')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="text-green-600 text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Conta criada com sucesso!
          </h3>
          <p className="text-green-600 text-sm">
            Você já pode fazer login e começar sua jornada com a ZAYIA.
          </p>
        </div>
        
        <button
          onClick={onToggleForm}
          className="zayia-button w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Fazer Login
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold zayia-gradient-text mb-2">
          Junte-se à ZAYIA! 💜
        </h2>
        <p className="text-zayia-violet-gray">
          Crie sua conta e comece sua transformação pessoal hoje mesmo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="zayia-input w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:outline-none"
              placeholder="Seu nome completo"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="zayia-input w-full pl-10 pr-12 py-3 rounded-xl border-0 focus:outline-none"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray hover:text-zayia-soft-purple transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mt-6 mb-6">
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-300">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-5 h-5 mt-0.5 rounded border border-purple-400 bg-white text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer accent-purple-600"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 flex-1 cursor-pointer leading-relaxed">
              Aceito a{' '}
              <a
                href="http://localhost:5176/politica-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold underline transition"
                onClick={(e) => e.stopPropagation()}
              >
                Ler Política de Privacidade
              </a>
              {' '}e os{' '}
              <a
                href="http://localhost:5176/termos-uso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-semibold underline transition"
                onClick={(e) => e.stopPropagation()}
              >
                Ler Termos de Uso
              </a>
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.acceptTerms}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition ${
            formData.acceptTerms && !loading
              ? 'zayia-button hover:opacity-90 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-zayia-violet-gray">
          Já tem uma conta?{' '}
          <button
            onClick={onToggleForm}
            className="text-zayia-soft-purple hover:text-zayia-deep-violet font-semibold transition-colors"
          >
            Faça login aqui
          </button>
        </p>
      </div>
    </div>
  )
}