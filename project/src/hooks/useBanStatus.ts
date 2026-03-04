import { useState, useEffect, useCallback } from 'react'
import { supabaseClient } from '../lib/supabase-client'

interface BanStatusState {
  isBanned: boolean
  expiresAt?: string
}

interface UseBanStatusReturn {
  banStatus: BanStatusState
  banMessage: string
  checkBanStatus: () => Promise<void>
  subscribe: () => (() => void) | undefined
  unsubscribe: (unsubscribeFn: (() => void) | undefined) => void
  onBanStatusChanged?: (callback: (banStatus: BanStatusState) => void) => void
}

/**
 * Custom hook for tracking user ban status in the community.
 * Detects ban changes and provides formatted message.
 *
 * Features:
 * - Real-time ban status updates
 * - Automatic notification on ban/unban
 * - Formatted ban message with days remaining
 * - Proper cleanup on unmount
 */
export function useBanStatus(userId: string | undefined): UseBanStatusReturn {
  const [banStatus, setBanStatus] = useState<BanStatusState>({ isBanned: false })
  const [banMessage, setBanMessage] = useState('')
  let unsubscribeFn: (() => void) | undefined

  // Check user ban status from Supabase
  const checkBanStatus = useCallback(async () => {
    if (!userId) return

    try {
      const ban = await supabaseClient.getUserBanStatus(userId)
      const isBanned = ban !== null && ban.status === 'active'
      const expiresAt = ban?.expires_at

      setBanStatus(prevStatus => {
        // Detect state change for notifications
        if (!prevStatus.isBanned && isBanned) {
          // Just got banned
          const message = expiresAt
            ? `🚫 Você foi banida até ${new Date(expiresAt).toLocaleDateString('pt-BR')}`
            : '🚫 Você foi permanentemente banida da comunidade'
          return { isBanned, expiresAt }
        } else if (prevStatus.isBanned && !isBanned) {
          // Ban expired
          return { isBanned, expiresAt }
        }
        return { isBanned, expiresAt }
      })
    } catch (error) {
      console.error('Error checking ban status:', error)
    }
  }, [userId])

  // Setup real-time listener for ban changes
  const subscribe = useCallback(() => {
    if (!userId) return

    console.log('🔌 Setting up real-time listener for ban status')
    unsubscribeFn = supabaseClient.onUserBanChange(userId, () => {
      console.log('📱 Ban status changed')
      checkBanStatus()
    })
    return unsubscribeFn
  }, [userId, checkBanStatus])

  const unsubscribe = useCallback((unsubscribeFn: (() => void) | undefined) => {
    if (unsubscribeFn) {
      unsubscribeFn()
      console.log('🧹 Ban status listener unsubscribed')
    }
  }, [])

  // Format ban message for display
  useEffect(() => {
    if (banStatus.isBanned) {
      if (banStatus.expiresAt) {
        const expiresDate = new Date(banStatus.expiresAt)
        const daysRemaining = Math.ceil((expiresDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        setBanMessage(`Você está banida até ${expiresDate.toLocaleDateString('pt-BR')} (${daysRemaining} dias)`)
      } else {
        setBanMessage('Você foi permanentemente banida da comunidade')
      }
    } else {
      setBanMessage('')
    }
  }, [banStatus])

  // Auto-check ban status and setup listener on mount
  useEffect(() => {
    if (!userId) return

    checkBanStatus()
    const unsubscribeFn = subscribe()

    return () => {
      unsubscribe(unsubscribeFn)
    }
  }, [userId, checkBanStatus, subscribe, unsubscribe])

  return {
    banStatus,
    banMessage,
    checkBanStatus,
    subscribe,
    unsubscribe
  }
}
