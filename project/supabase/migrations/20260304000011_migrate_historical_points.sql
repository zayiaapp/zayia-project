-- Migrate historical points from localStorage to Supabase
-- This is a data migration that runs AFTER tables are created
-- It reads from profiles.points (if set) and ensures total_points is synced

-- Initialize total_points for all users who have points
-- This runs AFTER the schema migrations, so the columns exist
UPDATE public.profiles
SET total_points = COALESCE(points, 0)
WHERE total_points = 0 AND points IS NOT NULL AND points > 0;

-- Create initial history entries for migrated points
-- This records that points were migrated (audit trail)
INSERT INTO public.user_point_history (user_id, amount, reason, created_at)
SELECT
  id,
  COALESCE(total_points, 0),
  'admin_adjust'::text,
  created_at
FROM public.profiles
WHERE total_points > 0
  AND NOT EXISTS (
    SELECT 1 FROM public.user_point_history
    WHERE user_id = profiles.id
      AND reason = 'admin_adjust'
      AND EXTRACT(EPOCH FROM (created_at - user_point_history.created_at)) < 60
  )
ON CONFLICT DO NOTHING;

-- Initialize best_streak and current_streak from localStorage data
-- Since we can't read localStorage directly in SQL, admins will need to
-- migrate this data via the app's migration script
-- For now, just ensure columns are set to default values
UPDATE public.profiles
SET
  current_streak = COALESCE(current_streak, 0),
  best_streak = COALESCE(best_streak, 0)
WHERE current_streak IS NULL OR best_streak IS NULL;
