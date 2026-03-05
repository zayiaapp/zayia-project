import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: Props) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Digite seu email')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        // Supabase vai enviar um email com link para esta URL
        // A URL deve existir no app — usuário clica → abre ResetPasswordForm
        redirectTo: `${window.location.origin}/?reset=true`,
      })

      if (resetError) throw resetError

      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h3 className="text-lg font-bold text-zayia-deep-violet">Email enviado!</h3>
        <p className="text-sm text-zayia-violet-gray">
          Verifique sua caixa de entrada e clique no link para redefinir sua senha.
        </p>
        <button
          onClick={onBack}
          className="text-sm text-zayia-soft-purple hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-1">Redefinir senha</h3>
        <p className="text-sm text-zayia-violet-gray">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="w-full px-4 py-3 rounded-lg border border-zayia-lilac/50 focus:outline-none focus:border-zayia-soft-purple"
        disabled={isLoading}
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        style={{ backgroundColor: '#8B4FC1', color: 'white' }}
        className="w-full py-3 rounded-lg font-bold"
      >
        {isLoading ? 'Enviando...' : 'Enviar link de redefinição'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-zayia-violet-gray hover:text-zayia-deep-violet"
      >
        Voltar ao login
      </button>
    </form>
  )
}
