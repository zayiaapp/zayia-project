import { useState, useEffect, useCallback } from 'react'
import { supabaseClient } from '../lib/supabase-client'

/**
 * Custom hook for fetching and managing community rules.
 * Fetches rules from Supabase community_rules table.
 *
 * Features:
 * - Load rules from database
 * - Update rules (admin only)
 * - Caching to avoid unnecessary fetches
 */
export function useRules(userId: string | undefined) {
  const [rules, setRules] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch rules from Supabase
  const loadRules = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const content = await supabaseClient.getCommunityRules()
      setRules(content || '')
      console.log('✅ Community rules loaded')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load rules')
      setError(error)
      console.error('Error loading community rules:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update rules (admin only)
  const updateRules = useCallback(
    async (content: string) => {
      if (!userId) return false

      try {
        const success = await supabaseClient.updateCommunityRules(content, userId)
        if (success) {
          setRules(content)
          console.log('✅ Community rules updated')
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating rules:', error)
        return false
      }
    },
    [userId]
  )

  // Load rules on mount
  useEffect(() => {
    loadRules()
  }, [loadRules])

  return {
    rules,
    loading,
    error,
    loadRules,
    updateRules
  }
}
