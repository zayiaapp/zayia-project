-- Add granular notification preference columns to user_preferences
-- Replaces the single notifications_enabled flag with per-feature toggles

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS notify_challenges BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_medals BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_community BOOLEAN DEFAULT true;

-- Back-fill existing rows: inherit from notifications_enabled
UPDATE public.user_preferences
SET
  notify_challenges = notifications_enabled,
  notify_medals = notifications_enabled,
  notify_community = notifications_enabled
WHERE notify_challenges IS NULL;
