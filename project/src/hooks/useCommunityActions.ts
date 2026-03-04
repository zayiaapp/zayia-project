import { useCallback } from 'react'
import { supabaseClient, type CommunityMessage } from '../lib/supabase-client'

export interface UseCommunityActionsOptions {
  userId?: string
  userRole?: 'user' | 'ceo'
  onOptimisticAdd?: (message: CommunityMessage) => void
  onOptimisticUpdate?: (messageId: string, updates: Partial<CommunityMessage>) => void
  onOptimisticRemove?: (messageId: string) => void
}

/**
 * Custom hook for community CRUD operations.
 * Handles messages, reactions, bans, and reports.
 *
 * Features:
 * - Post, delete, edit messages
 * - Add/remove reactions
 * - Ban/unban users
 * - Report messages
 * - Optimistic UI updates for instant feedback
 */
export function useCommunityActions(options: UseCommunityActionsOptions = {}) {
  const { userId, userRole, onOptimisticAdd, onOptimisticUpdate, onOptimisticRemove } = options

  // Post a new message
  const postMessage = useCallback(
    async (content: string, userProfile: any) => {
      if (!userId) return null

      try {
        // Check if user is banned first
        const ban = await supabaseClient.getUserBanStatus(userId)
        if (ban && ban.status === 'active') {
          throw new Error('🚫 Você não pode enviar mensagens enquanto está banida')
        }

        // Post to Supabase
        const newMessage = await supabaseClient.postMessage(userId, content)
        if (newMessage) {
          // Optimistic UI update
          const messageWithProfile: CommunityMessage = {
            ...newMessage,
            user_profile: {
              id: userId,
              email: userProfile.email,
              full_name: userProfile.full_name,
              role: userProfile.role,
              avatar_url: userProfile.avatar_url,
              created_at: userProfile.created_at,
              updated_at: userProfile.updated_at
            }
          }
          onOptimisticAdd?.(messageWithProfile)
          console.log('✅ Message posted:', newMessage.id)
          return newMessage
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to post message'
        console.error('Error posting message:', error)
        throw new Error(message)
      }
      return null
    },
    [userId, onOptimisticAdd]
  )

  // Delete a message
  const deleteMessage = useCallback(
    async (messageId: string, reason: string) => {
      if (!userId || !userRole) return false

      try {
        const success = await supabaseClient.deleteMessage(messageId, userId, userRole, reason)
        if (success) {
          // Optimistic UI update
          onOptimisticUpdate?.(messageId, {
            deleted_at: new Date().toISOString(),
            deleted_by_admin: userId,
            deletion_reason: reason
          })
          console.log('✅ Message deleted:', messageId)
          return true
        }
      } catch (error) {
        console.error('Error deleting message:', error)
      }
      return false
    },
    [userId, userRole, onOptimisticUpdate]
  )

  // Add emoji reaction to message
  const addReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!userId) return false

      try {
        const success = await supabaseClient.addReaction(messageId, userId, emoji)
        if (success) {
          console.log('✅ Reaction added:', emoji)
          return true
        }
      } catch (error) {
        console.error('Error adding reaction:', error)
      }
      return false
    },
    [userId]
  )

  // Remove emoji reaction from message
  const removeReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!userId) return false

      try {
        const success = await supabaseClient.removeReaction(messageId, userId, emoji)
        if (success) {
          console.log('✅ Reaction removed:', emoji)
          return true
        }
      } catch (error) {
        console.error('Error removing reaction:', error)
      }
      return false
    },
    [userId]
  )

  // Ban a user (admin only)
  const banUser = useCallback(
    async (targetUserId: string, duration: '1_day' | '7_days' | 'permanent', reason: string) => {
      if (!userId || userRole !== 'ceo') {
        throw new Error('Only admins can ban users')
      }

      try {
        await supabaseClient.banUser(targetUserId, duration, reason)
        console.log('✅ User banned:', targetUserId)
        return true
      } catch (error) {
        console.error('Error banning user:', error)
      }
      return false
    },
    [userId, userRole]
  )

  // Report a message
  const reportMessage = useCallback(
    async (
      messageId: string,
      reason: 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other',
      description: string,
      anonymous?: boolean
    ) => {
      if (!userId) return false

      try {
        const success = await supabaseClient.reportMessage(
          messageId,
          anonymous ? undefined : userId,
          reason,
          description
        )
        if (success) {
          console.log('✅ Report submitted:', messageId)
          return true
        }
      } catch (error) {
        console.error('Error reporting message:', error)
      }
      return false
    },
    [userId]
  )

  return {
    postMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    banUser,
    reportMessage
  }
}
