-- Seed user_preferences for all existing users
-- This migration is idempotent: safe to run multiple times

-- Create default preferences for all users who don't have preferences yet
INSERT INTO public.user_preferences (user_id, daily_goal, notifications_enabled, theme, language, email_frequency, marketing_emails)
SELECT
  u.id,
  5 as daily_goal,
  true as notifications_enabled,
  'auto' as theme,
  'pt' as language,
  'weekly' as email_frequency,
  true as marketing_emails
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_preferences
  WHERE user_id = u.id
)
ON CONFLICT DO NOTHING;
