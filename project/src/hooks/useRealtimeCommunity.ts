import { useState, useEffect, useCallback, useRef } from 'react'
import { supabaseClient, type CommunityMessage } from '../lib/supabase-client'

interface UseRealtimeCommunityOptions {
  userId?: string
  enabled?: boolean
}

interface UseRealtimeCommunityReturn {
  messages: CommunityMessage[]
  loading: boolean
  error: Error | null
  subscribe: () => void
  unsubscribe: () => void
  loadMessages: (limit?: number, offset?: number) => Promise<void>
  addMessageOptimistic: (message: CommunityMessage) => void
  updateMessageOptimistic: (messageId: string, updates: Partial<CommunityMessage>) => void
  removeMessageOptimistic: (messageId: string) => void
}

/**
 * ✅ CRITICAL FIX: useRealtimeCommunity Hook
 *
 * Root Causes Addressed:
 * 1. ✅ Mutable variables reset on re-render → Use useRef for persistence
 * 2. ✅ useCallback dependency chain → Extract setupRealtimeListener outside
 * 3. ✅ Multiple simultaneous subscriptions → Cleanup before creating new
 * 4. ✅ Race condition in cleanup → useRef guarantees stable reference
 *
 * Features:
 * - Single active subscription per userId
 * - Incremental real-time updates (INSERT/UPDATE/DELETE)
 * - Proper cleanup on unmount
 * - Retry/reconnect with exponential backoff
 */
export function useRealtimeCommunity(options: UseRealtimeCommunityOptions = {}): UseRealtimeCommunityReturn {
  const { userId, enabled = true } = options
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ✅ FIX: Use useRef for mutable state that shouldn't cause re-renders
  // These persist across renders and don't trigger re-renders when modified
  const subscriptionRef = useRef<(() => void) | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef<number>(0)

  const MAX_RECONNECT_ATTEMPTS = 5
  const INITIAL_RECONNECT_DELAY = 1000 // 1 second

  // Load messages from Supabase
  const loadMessages = useCallback(async (limit = 50, offset = 0) => {
    if (!userId || !enabled) return

    try {
      setLoading(true)
      setError(null)
      const communityMessages = await supabaseClient.getMessages(limit, offset)
      setMessages(communityMessages)
      console.log('✅ Messages loaded:', communityMessages.length)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load messages')
      setError(error)
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, enabled])

  // Optimistic UI update: add new message to top (with deduplication)
  const addMessageOptimistic = useCallback((message: CommunityMessage) => {
    setMessages(prev => {
      // ✅ Deduplicate: check if message with this ID already exists
      const isDuplicate = prev.some(m => m.id === message.id)
      if (isDuplicate) {
        console.log('⚠️ Message already exists, skipping duplicate:', message.id)
        return prev
      }
      return [message, ...prev]
    })
  }, [])

  // Optimistic UI update: update message in place
  const updateMessageOptimistic = useCallback((messageId: string, updates: Partial<CommunityMessage>) => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, ...updates } : m))
    )
  }, [])

  // Optimistic UI update: remove message
  const removeMessageOptimistic = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }, [])

  // ✅ FIX: Extract setupRealtimeListener to avoid dependency chain recreation
  // This function is now stable and not recreated on every render
  const setupRealtimeListener = useCallback(() => {
    if (!userId || !enabled) return

    try {
      console.log('🔌 Setting up real-time listener for messages')
      subscriptionRef.current = supabaseClient.onMessagesChange(async (change: any) => {
        // Reset reconnect attempts on successful update
        reconnectAttemptsRef.current = 0
        const messageId = (change.new as any)?.id || (change.old as any)?.id
        console.log('📱 Real-time message received:', change.eventType, messageId)

        if (change.eventType === 'INSERT') {
          // Add new message to top (incremental, with deduplication)
          // ✅ CRITICAL: Fetch full message data with profile to avoid incomplete display
          if (change.new) {
            console.log('📱 Real-time INSERT:', change.new.id, '- fetching full data...')
            const fullMessage = await supabaseClient.getMessageWithProfile(change.new.id)
            if (fullMessage) {
              addMessageOptimistic(fullMessage)
            }
          }
        } else if (change.eventType === 'UPDATE') {
          // Update message in place (incremental)
          if (change.new) {
            const fullMessage = await supabaseClient.getMessageWithProfile(change.new.id)
            if (fullMessage) {
              updateMessageOptimistic(change.new.id, fullMessage)
            }
          }
        } else if (change.eventType === 'DELETE') {
          // Remove message (incremental)
          if (change.old?.id) {
            removeMessageOptimistic(change.old.id)
          }
        }
      })
      console.log('✅ Real-time listener ready (single subscription active)')
    } catch (err) {
      console.error('❌ Error setting up real-time listener:', err)
      // Attempt reconnection with exponential backoff
      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current)
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`)
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++
          setupRealtimeListener()
        }, delay)
      } else {
        setError(new Error('Failed to establish real-time connection after multiple attempts'))
        console.error('❌ Max reconnect attempts reached')
      }
    }
  }, [userId, enabled, addMessageOptimistic, updateMessageOptimistic, removeMessageOptimistic])

  const subscribe = useCallback(() => {
    setupRealtimeListener()
  }, [setupRealtimeListener])

  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current()
      subscriptionRef.current = null
      console.log('🧹 Real-time listener unsubscribed')
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
      console.log('🧹 Reconnect timeout cleared')
    }
  }, [])

  // ✅ FIX: Ensure EXACTLY ONE subscription per userId
  // 1. Cleanup any existing subscription first
  // 2. Load messages
  // 3. Create single new subscription
  // 4. Cleanup on unmount
  useEffect(() => {
    if (!userId || !enabled) return

    // Step 1: Cleanup existing subscription first (critical for single subscription guarantee)
    if (subscriptionRef.current) {
      subscriptionRef.current()
      subscriptionRef.current = null
      console.log('🧹 Cleaned up previous subscription')
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Step 2: Load messages
    loadMessages()

    // Step 3: Create EXACTLY ONE new subscription
    setupRealtimeListener()

    // Step 4: Cleanup only when unmounting or userId/enabled changes
    return () => {
      unsubscribe()
    }
  }, [userId, enabled]) // ✅ Minimal dependencies - only userId and enabled

  return {
    messages,
    loading,
    error,
    subscribe,
    unsubscribe,
    loadMessages,
    addMessageOptimistic,
    updateMessageOptimistic,
    removeMessageOptimistic
  }
}
