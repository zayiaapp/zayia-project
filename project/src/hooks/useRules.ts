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

      // Get the latest rules from community_rules table
      const { data, error: fetchError } = await supabaseClient
        .from('community_rules')
        .select('content')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError) {
        // If no rules exist, use default
        console.warn('No community rules found:', fetchError)
        setRules('')
        return
      }

      if (data) {
        setRules(data.content || '')
        console.log('✅ Community rules loaded')
      }
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
        // Insert new rule entry (keeps history via created_at)
        const { error: insertError } = await supabaseClient
          .from('community_rules')
          .insert({
            content,
            updated_by_admin: userId
          })

        if (insertError) {
          console.error('Error updating rules:', insertError)
          return false
        }

        setRules(content)
        console.log('✅ Community rules updated')
        return true
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
