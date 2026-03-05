import React, { useState, useEffect } from 'react'

interface DailyChallenge {
  id: string
  title: string
  description: string
  difficulty: 'facil' | 'dificil'
  points: number
  duration: number
}

type ChallengeState = 'blocked' | 'in_progress' | 'timer_expired' | 'completed'

interface ChallengeCardDailyProps {
  challenge: DailyChallenge
  isCompleted: boolean
  onComplete: (challengeId: string, proofFile: File) => void
  isUploading?: boolean
}

export const ChallengeCardDaily: React.FC<ChallengeCardDailyProps> = ({
  challenge,
  isCompleted,
  onComplete,
  isUploading = false,
}) => {
  const [state, setState] = useState<ChallengeState>('blocked')
  const [secondsRemaining, setSecondsRemaining] = useState(60)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Timer effect
  useEffect(() => {
    if (state !== 'in_progress') return

    if (secondsRemaining === 0) {
      setState('timer_expired')
      return
    }

    const timer = setTimeout(() => {
      setSecondsRemaining(secondsRemaining - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [state, secondsRemaining])

  const handleStartChallenge = () => {
    setState('in_progress')
    setSecondsRemaining(60)
    setSelectedFile(null)
  }

  const handleCancel = () => {
    setState('blocked')
    setSecondsRemaining(60)
    setSelectedFile(null)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmitProof = () => {
    if (selectedFile) {
      onComplete(challenge.id, selectedFile)
      setState('completed')
    }
  }

  // Format timer: MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // STATE: COMPLETED ✅
  if (isCompleted) {
    return (
      <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h6 className="font-bold text-green-700">✅ {challenge.title}</h6>
            <p className="text-sm text-green-600 mt-1">Desafio Concluído</p>
          </div>
          <div className="text-green-600 text-2xl">✅</div>
        </div>
      </div>
    )
  }

  // STATE: BLOCKED 🔒
  if (state === 'blocked') {
    return (
      <div className="p-4 rounded-lg border-2 border-zayia-lilac/30 bg-white hover:border-zayia-soft-purple/50 transition">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h6 className="font-bold text-zayia-deep-violet">{challenge.title}</h6>
            <p className="text-sm text-zayia-violet-gray mt-1 line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center text-sm text-zayia-violet-gray mb-4">
          <span>⏱️ {challenge.duration}min</span>
          <span>⭐ {challenge.points}pts</span>
        </div>

        <button
          onClick={handleStartChallenge}
          style={{ backgroundColor: '#8B4FC1', color: 'white' }}
          className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          🚀 Começar Desafio
        </button>
      </div>
    )
  }

  // STATE: IN PROGRESS ⏱️
  if (state === 'in_progress') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-zayia-deep-violet mb-2">
              {challenge.title}
            </h3>
            <p className="text-zayia-violet-gray">{challenge.description}</p>
          </div>

          {/* TIMER GRANDE E VISÍVEL */}
          <div className="bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30 rounded-xl p-8 mb-6 text-center border-2 border-zayia-soft-purple/50">
            <div className="text-5xl font-bold text-zayia-purple tabular-nums mb-2">
              ⏱️ {formatTime(secondsRemaining)}
            </div>
            <p className="text-sm text-zayia-violet-gray">
              Complete o desafio enquanto o timer passa
            </p>
          </div>

          {/* Info do Desafio */}
          <div className="bg-zayia-lilac/20 p-4 rounded-lg mb-6 border border-zayia-lilac/50">
            <p className="text-sm text-zayia-deep-violet font-medium">
              ✋ Quando o timer chegar a 00:00, você poderá enviar a foto como prova
            </p>
          </div>

          {/* Botão Cancelar */}
          <button
            onClick={handleCancel}
            style={{ backgroundColor: '#6B7280', color: 'white' }}
            className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            ❌ Cancelar Desafio
          </button>
        </div>
      </div>
    )
  }

  // STATE: TIMER EXPIRED ⏰
  if (state === 'timer_expired') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-zayia-deep-violet mb-2">
              {challenge.title}
            </h3>
            <p className="text-zayia-violet-gray">{challenge.description}</p>
          </div>

          {/* TIMER FINALIZADO */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-8 mb-6 text-center border-2 border-green-300">
            <div className="text-5xl font-bold text-green-600 mb-2">✅ 00:00</div>
            <p className="text-sm text-green-700 font-semibold">
              Pronto! Agora envie a prova
            </p>
          </div>

          {/* UPLOAD DE ARQUIVO */}
          {!selectedFile ? (
            <div className="mb-6">
              <label className="block border-2 border-dashed border-zayia-lilac rounded-lg p-6 text-center cursor-pointer hover:bg-zayia-lilac/10 transition">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-medium text-zayia-deep-violet mb-1">
                  Clique para selecionar
                </p>
                <p className="text-xs text-zayia-violet-gray">
                  Foto ou vídeo como prova
                </p>
              </label>
            </div>
          ) : (
            <div className="bg-zayia-lilac/20 p-4 rounded-lg mb-6 border-2 border-zayia-soft-purple/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zayia-deep-violet">Arquivo Selecionado</p>
                  <p className="text-xs text-zayia-violet-gray truncate">{selectedFile.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-xs text-zayia-soft-purple hover:text-zayia-deep-violet font-semibold mt-2"
              >
                Trocar arquivo
              </button>
            </div>
          )}

          {/* BOTÃO ENVIAR (só ativa se tem arquivo) */}
          <button
            onClick={handleSubmitProof}
            disabled={!selectedFile || isUploading}
            style={selectedFile && !isUploading ? { backgroundColor: '#8B4FC1', color: 'white' } : { backgroundColor: '#6B7280', color: '#D1D5DB' }}
            className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                📤 Enviar Prova e Validar
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return null
}
