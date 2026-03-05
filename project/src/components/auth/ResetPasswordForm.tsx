import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  onSuccess: () => void
}

export function ResetPasswordForm({ onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Senhas não conferem')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-zayia-deep-violet">Nova senha</h3>

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Nova senha (mínimo 6 caracteres)"
        className="w-full px-4 py-3 rounded-lg border border-zayia-lilac/50 focus:outline-none focus:border-zayia-soft-purple"
        minLength={6}
        required
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Confirmar nova senha"
        className="w-full px-4 py-3 rounded-lg border border-zayia-lilac/50 focus:outline-none focus:border-zayia-soft-purple"
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        style={{ backgroundColor: '#8B4FC1', color: 'white' }}
        className="w-full py-3 rounded-lg font-bold"
      >
        {isLoading ? 'Salvando...' : 'Salvar nova senha'}
      </button>
    </form>
  )
}
