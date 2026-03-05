import React, { useState } from 'react'
import { ChallengeCategory } from '../../../../lib/challenges-data-mock'
import { ChallengeCardDaily } from './ChallengeCardDaily'
import { compressImage, validateImageFile } from '../../../../lib/photo-compression'
import { supabaseClient } from '../../../../lib/supabase-client'

interface DailyChallenge {
  id: string
  title: string
  description: string
  difficulty: 'facil' | 'dificil'
  points: number
  duration: number
}

interface DailyChallengesViewProps {
  userId: string
  category: ChallengeCategory
  completedChallengeIds: Set<string>
  onChallengeCompleted: (challengeId: string, points: number, difficulty: 'facil' | 'dificil', proofFile?: File) => void
}

export const DailyChallengesView: React.FC<DailyChallengesViewProps> = ({
  userId,
  category,
  completedChallengeIds,
  onChallengeCompleted,
}) => {
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isChallengesLoading, setIsChallengesLoading] = useState(true)

  // Load challenges from Supabase on mount or when category changes
  React.useEffect(() => {
    const loadChallenges = async () => {
      try {
        setIsChallengesLoading(true)
        const challenges = await supabaseClient.getChallengesByCategory(category.id)
        // Map Supabase structure to local interface
        const mappedChallenges: DailyChallenge[] = challenges.map((ch: any) => {
          const difficulty = ch.difficulty === 'easy' ? 'facil' : 'dificil'
          return {
            id: ch.id,
            title: ch.title,
            description: ch.description || '',
            difficulty,
            points: difficulty === 'dificil' ? (ch.points_hard || 25) : (ch.points_easy || 10),
            duration: ch.duration_minutes || 5,
          }
        })
        setDailyChallenges(mappedChallenges)
      } catch (error) {
        console.error('❌ Error loading challenges:', error)
        setDailyChallenges([])
      } finally {
        setIsChallengesLoading(false)
      }
    }

    loadChallenges()
  }, [category.id])

  const totalChallenges = dailyChallenges.length || 1 // evita divisão por zero
  const totalCompleted = completedChallengeIds.size
  const progressPercent = (totalCompleted / totalChallenges) * 100

  const easyChallenges = dailyChallenges.filter(c => c.difficulty === 'facil')
  const hardChallenges = dailyChallenges.filter(c => c.difficulty === 'dificil')

  // Calculate points for today
  const todayPoints =
    easyChallenges.filter(c => !completedChallengeIds.has(c.id)).length * 10 +
    hardChallenges.filter(c => !completedChallengeIds.has(c.id)).length * 25

  const handleProofSubmitted = async (challengeId: string, proofFile: File) => {
    setIsUploading(true)
    try {
      // 1. Find challenge metadata
      const challenge = dailyChallenges.find(c => c.id === challengeId)
      const points = challenge?.points ?? 10
      const difficulty = challenge?.difficulty ?? 'facil'

      // 2. Validate file
      validateImageFile(proofFile)

      // 3. Compress image
      console.log(`📸 Compressing image: ${proofFile.name}...`)
      const compressedBlob = await compressImage(proofFile)

      // 4. Upload proof to Supabase Storage
      console.log(`📤 Uploading proof to Supabase...`)
      const proofUrl = await supabaseClient.uploadProof(userId, challengeId, compressedBlob)
      console.log(`✅ Proof uploaded: ${proofUrl}`)

      // 5. Notify parent with points and difficulty for calculation
      onChallengeCompleted(challengeId, points, difficulty, proofFile)

      console.log(`✅ Challenge submitted with proof URL: ${proofUrl}`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`❌ Error submitting proof: ${errorMsg}`)
      window.dispatchEvent(
        new CustomEvent('notificationUpdate', {
          detail: {
            type: 'error',
            message: errorMsg
          }
        })
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com progresso */}
      <div className="bg-gradient-to-br from-zayia-lilac/30 to-zayia-lavender/30 p-6 rounded-xl border border-zayia-lilac/50">
        <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">{category.label}</h3>
        <p className="text-zayia-violet-gray mb-4">Categoria Ativa • {totalCompleted}/{totalChallenges} desafios completados</p>

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

        {/* 🧪 DEBUG: Botão para recarregar desafios (APENAS EM DEVELOPMENT) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={async () => {
              try {
                setIsChallengesLoading(true)
                const challenges = await supabaseClient.getChallengesByCategory(category.id)
                const mappedChallenges: DailyChallenge[] = challenges.map((ch: any) => {
                  const difficulty = ch.difficulty === 'easy' ? 'facil' : 'dificil'
                  return {
                    id: ch.id,
                    title: ch.title,
                    description: ch.description || '',
                    difficulty,
                    points: difficulty === 'dificil' ? (ch.points_hard || 25) : (ch.points_easy || 10),
                    duration: ch.duration_minutes || 5,
                  }
                })
                setDailyChallenges(mappedChallenges)
                console.log(`🧪 TESTE: Desafios recarregados`)
                console.log(`🧪 Total de desafios:`, mappedChallenges.length)
              } catch (error) {
                console.error('❌ Error reloading challenges:', error)
              } finally {
                setIsChallengesLoading(false)
              }
            }}
            style={{ backgroundColor: '#FBBF24', color: '#1F2937' }}
            className="mt-4 px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 w-fit cursor-pointer"
          >
            🧪 Recarregar Desafios (Teste)
          </button>
        )}
      </div>

      {/* Desafios de Hoje */}
      <div>
        <h4 className="text-lg font-bold text-zayia-deep-violet mb-4">⚡ Desafios de Hoje</h4>

        {isChallengesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-zayia-purple"></div>
              <p className="text-zayia-violet-gray mt-2">Carregando desafios...</p>
            </div>
          </div>
        ) : dailyChallenges.length === 0 ? (
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
                      isUploading={isUploading}
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
                      isUploading={isUploading}
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
