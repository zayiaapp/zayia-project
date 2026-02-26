import React, { useState } from 'react'
import { Challenge, ChallengeCategory } from '../../../../lib/challenges-data-mock'
import ChallengesDataMock from '../../../../lib/challenges-data-mock'
import { ChallengeCardDaily } from './ChallengeCardDaily'

interface DailyChallengesViewProps {
  userId: string
  category: ChallengeCategory
  completedChallengeIds: Set<string>
  onChallengeCompleted: (challengeId: string, proofFile?: File) => void
}

export const DailyChallengesView: React.FC<DailyChallengesViewProps> = ({
  userId,
  category,
  completedChallengeIds,
  onChallengeCompleted,
}) => {
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>(() => {
    const today = new Date().toISOString().split('T')[0]
    return ChallengesDataMock.getDailyChallenges(category.id, today)
  })

  const totalChallenges = 120
  const totalCompleted = completedChallengeIds.size
  const progressPercent = (totalCompleted / totalChallenges) * 100

  const easyChallenges = dailyChallenges.filter(c => c.difficulty === 'facil')
  const hardChallenges = dailyChallenges.filter(c => c.difficulty === 'dificil')

  // Calculate points for today
  const todayPoints =
    easyChallenges.filter(c => !completedChallengeIds.has(c.id)).length * 10 +
    hardChallenges.filter(c => !completedChallengeIds.has(c.id)).length * 25

  const handleProofSubmitted = (challengeId: string, proofFile: File) => {
    // TODO: Upload arquivo para storage (Supabase/Firebase)
    // TODO: Marcar como validado com timestamp

    // Marcar como completo
    ChallengesDataMock.completeChallenge(challengeId, userId)
    onChallengeCompleted(challengeId, proofFile)

    // Toast de sucesso
    console.log(`✅ Desafio ${challengeId} validado com prova: ${proofFile.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Header com progresso */}
      <div className="bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 p-6 rounded-xl border border-zayia-lilac/50">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">{category.label}</h3>
        <p className="text-zayia-violet-gray mb-4">Categoria Ativa • {totalCompleted}/120 desafios completados</p>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-zayia-deep-violet">{totalCompleted}/120</span>
            <span className="text-zayia-violet-gray">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-zayia-lilac/30 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-zayia-violet-gray">
            {totalChallenges - totalCompleted} desafios restantes
          </p>
        </div>

        {/* 🧪 DEBUG: Botão para avançar dia (APENAS EM DEVELOPMENT) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => {
              const today = new Date()
              today.setDate(today.getDate() + 1)
              const nextDayStr = today.toISOString().split('T')[0]

              const newChallenges = ChallengesDataMock.getDailyChallenges(category.id, nextDayStr)
              setDailyChallenges(newChallenges)

              console.log(`🧪 TESTE: Avançando para ${nextDayStr}`)
              console.log(`🧪 Novos desafios carregados:`, newChallenges)
            }}
            style={{ backgroundColor: '#FBBF24', color: '#1F2937' }}
            className="mt-4 px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 w-fit cursor-pointer"
          >
            🧪 Avançar Dia (Teste)
          </button>
        )}
      </div>

      {/* Desafios de Hoje */}
      <div>
        <h4 className="text-lg font-bold text-zayia-deep-violet mb-4">⚡ Desafios de Hoje</h4>

        {dailyChallenges.length === 0 ? (
          <p className="text-center text-zayia-violet-gray py-8">
            Nenhum desafio disponível para hoje
          </p>
        ) : (
          <>
            {/* Fáceis */}
            {easyChallenges.length > 0 && (
              <div className="mb-6">
                <h5 className="text-sm font-bold text-zayia-deep-violet mb-3">
                  😊 Desafios Fáceis ({easyChallenges.length} desafios, 10pts cada)
                </h5>
                <div className="space-y-3">
                  {easyChallenges.map(challenge => (
                    <ChallengeCardDaily
                      key={challenge.id}
                      challenge={challenge}
                      isCompleted={completedChallengeIds.has(challenge.id)}
                      onComplete={handleProofSubmitted}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Difíceis */}
            {hardChallenges.length > 0 && (
              <div>
                <h5 className="text-sm font-bold text-zayia-deep-violet mb-3">
                  💪 Desafios Difíceis ({hardChallenges.length} desafios, 25pts cada)
                </h5>
                <div className="space-y-3">
                  {hardChallenges.map(challenge => (
                    <ChallengeCardDaily
                      key={challenge.id}
                      challenge={challenge}
                      isCompleted={completedChallengeIds.has(challenge.id)}
                      onComplete={handleProofSubmitted}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Total pontos de hoje */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700">Pontos possíveis hoje:</p>
        <p className="text-3xl font-bold text-blue-600">{todayPoints}pts</p>
      </div>
    </div>
  )
}
