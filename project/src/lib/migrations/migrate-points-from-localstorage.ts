/**
 * Migrate user points and streak data from localStorage to Supabase
 * Called once during app initialization (Task 1.9.2)
 *
 * Process:
 * 1. Read localStorage user_points
 * 2. For current user, sync to Supabase profiles.total_points
 * 3. Create history entry in user_point_history
 * 4. Mark migration complete in localStorage to prevent re-runs
 */

import { supabase } from '../supabase'
import { supabaseClient } from '../supabase-client'

const MIGRATION_KEY = 'points_migration_completed_v1'
const POINTS_STORAGE_KEY = 'user_points'
const STREAK_STORAGE_KEY = 'user_streak'

export async function migratePointsFromLocalStorage(userId: string): Promise<{ success: boolean; pointsMigrated: number; message: string }> {
  try {
    // Check if already migrated
    if (localStorage.getItem(MIGRATION_KEY)) {
      console.log('✅ Points already migrated from localStorage')
      return {
        success: true,
        pointsMigrated: 0,
        message: 'Migration already completed'
      }
    }

    // Read points from localStorage
    const localPoints = parseInt(localStorage.getItem(POINTS_STORAGE_KEY) || '0', 10)
    const localStreak = parseInt(localStorage.getItem(STREAK_STORAGE_KEY) || '0', 10)

    if (localPoints === 0 && localStreak === 0) {
      console.log('✅ No points or streak to migrate')
      // Mark as completed anyway
      localStorage.setItem(MIGRATION_KEY, 'true')
      return {
        success: true,
        pointsMigrated: 0,
        message: 'No data to migrate'
      }
    }

    console.log(`🔄 Migrating ${localPoints} points and ${localStreak} streak days to Supabase...`)

    // Get current profile to check what's already in Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('total_points, current_streak')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    const currentSupabasePoints = profileData?.total_points || 0
    const currentSupabaseStreak = profileData?.current_streak || 0

    // Only migrate if localStorage has MORE data than Supabase
    const shouldMigratePoints = localPoints > currentSupabasePoints
    const shouldMigrateStreak = localStreak > currentSupabaseStreak

    let migrationCount = 0

    // Update profile if needed
    if (shouldMigratePoints || shouldMigrateStreak) {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (shouldMigratePoints) {
        updateData.total_points = localPoints
        migrationCount = localPoints - currentSupabasePoints
      }

      if (shouldMigrateStreak) {
        updateData.current_streak = localStreak
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      if (updateError) throw updateError

      console.log(`✅ Migrated ${migrationCount} points and ${shouldMigrateStreak ? localStreak : 0} streak to Supabase`)
    }

    // Create history entry for the migration
    if (shouldMigratePoints && migrationCount > 0) {
      const { error: historyError } = await supabase
        .from('user_point_history')
        .insert({
          user_id: userId,
          amount: migrationCount,
          reason: 'admin_adjust',
          created_at: new Date().toISOString()
        })

      if (historyError) {
        console.warn('❌ Warning: History entry failed (points still updated):', historyError)
      }
    }

    // Mark migration complete
    localStorage.setItem(MIGRATION_KEY, 'true')

    return {
      success: true,
      pointsMigrated: migrationCount,
      message: `Migration complete: ${migrationCount} points transferred`
    }
  } catch (error) {
    console.error('❌ Error migrating points from localStorage:', error)
    return {
      success: false,
      pointsMigrated: 0,
      message: error instanceof Error ? error.message : 'Migration failed'
    }
  }
}

/**
 * Call this in AuthContext useEffect after user logs in
 * Ensures points are synced to Supabase on first login
 */
export async function syncPointsOnLogin(userId: string): Promise<void> {
  try {
    await migratePointsFromLocalStorage(userId)
  } catch (error) {
    console.error('❌ Error syncing points on login:', error)
    // Don't throw - app should continue even if sync fails
  }
}
