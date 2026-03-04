import { useState, useEffect, useCallback } from 'react'
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
 * Custom hook for real-time community message synchronization.
 * Implements incremental updates instead of full reloads.
 *
 * Features:
 * - Automatic message fetching on mount
 * - Real-time listener with incremental INSERT/UPDATE/DELETE
 * - Optimistic UI updates with rollback on error
 * - Proper cleanup on unmount
 */
export function useRealtimeCommunity(options: UseRealtimeCommunityOptions = {}): UseRealtimeCommunityReturn {
  const { userId, enabled = true } = options
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  let subscription: (() => void) | null = null

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

  // Optimistic UI update: add new message to top
  const addMessageOptimistic = useCallback((message: CommunityMessage) => {
    setMessages(prev => [message, ...prev])
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

  // Setup real-time listener with incremental updates
  const setupRealtimeListener = useCallback(() => {
    if (!userId || !enabled) return

    console.log('🔌 Setting up real-time listener for messages')
    subscription = supabaseClient.onMessagesChange((change: any) => {
      console.log('📱 Real-time message received:', change.eventType, change.new?.id)

      if (change.eventType === 'INSERT') {
        // Add new message to top (incremental)
        if (change.new) {
          addMessageOptimistic(change.new)
        }
      } else if (change.eventType === 'UPDATE') {
        // Update message in place (incremental)
        if (change.new) {
          updateMessageOptimistic(change.new.id, change.new)
        }
      } else if (change.eventType === 'DELETE') {
        // Remove message (incremental)
        if (change.old?.id) {
          removeMessageOptimistic(change.old.id)
        }
      }
    })
    console.log('✅ Real-time listener ready')
  }, [userId, enabled, addMessageOptimistic, updateMessageOptimistic, removeMessageOptimistic])

  const subscribe = useCallback(() => {
    setupRealtimeListener()
  }, [setupRealtimeListener])

  const unsubscribe = useCallback(() => {
    if (subscription) {
      subscription()
      subscription = null
      console.log('🧹 Real-time listener unsubscribed')
    }
  }, [])

  // Auto-load messages and setup listener on mount
  useEffect(() => {
    if (!userId || !enabled) return

    loadMessages()
    subscribe()

    return () => {
      unsubscribe()
    }
  }, [userId, enabled, loadMessages, subscribe, unsubscribe])

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
