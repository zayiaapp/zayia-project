-- Migration: Add ON DELETE CASCADE to foreign keys
-- Purpose: Ensure clean deletion of users with cascading deletes to related data
-- Status: 7 FKs already have CASCADE, 6 need to be updated from NO ACTION to CASCADE

-- =============================================================================
-- FOREIGN KEYS THAT NEED CASCADE DELETE UPDATE (6 total)
-- =============================================================================

-- 1. community_messages.deleted_by_admin → profiles.id
-- When an admin is deleted, set deleted_by_admin to NULL (instead of blocking)
ALTER TABLE public.community_messages
DROP CONSTRAINT community_messages_deleted_by_admin_fkey;

ALTER TABLE public.community_messages
ADD CONSTRAINT community_messages_deleted_by_admin_fkey
FOREIGN KEY (deleted_by_admin) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- 2. community_rules.updated_by_admin → profiles.id
-- When an admin is deleted, set updated_by_admin to NULL (instead of blocking)
ALTER TABLE public.community_rules
DROP CONSTRAINT community_rules_updated_by_admin_fkey;

ALTER TABLE public.community_rules
ADD CONSTRAINT community_rules_updated_by_admin_fkey
FOREIGN KEY (updated_by_admin) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- 3. message_reports.reported_by → profiles.id
-- When a user is deleted, keep the report but set reported_by to NULL
ALTER TABLE public.message_reports
DROP CONSTRAINT message_reports_reported_by_fkey;

ALTER TABLE public.message_reports
ADD CONSTRAINT message_reports_reported_by_fkey
FOREIGN KEY (reported_by) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- 4. monthly_winners.first_place_user_id → profiles.id
-- When a user is deleted, set first_place_user_id to NULL
ALTER TABLE public.monthly_winners
DROP CONSTRAINT monthly_winners_first_place_user_id_fkey;

ALTER TABLE public.monthly_winners
ADD CONSTRAINT monthly_winners_first_place_user_id_fkey
FOREIGN KEY (first_place_user_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- 5. monthly_winners.second_place_user_id → profiles.id
-- When a user is deleted, set second_place_user_id to NULL
ALTER TABLE public.monthly_winners
DROP CONSTRAINT monthly_winners_second_place_user_id_fkey;

ALTER TABLE public.monthly_winners
ADD CONSTRAINT monthly_winners_second_place_user_id_fkey
FOREIGN KEY (second_place_user_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- 6. monthly_winners.third_place_user_id → profiles.id
-- When a user is deleted, set third_place_user_id to NULL
ALTER TABLE public.monthly_winners
DROP CONSTRAINT monthly_winners_third_place_user_id_fkey;

ALTER TABLE public.monthly_winners
ADD CONSTRAINT monthly_winners_third_place_user_id_fkey
FOREIGN KEY (third_place_user_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- =============================================================================
-- VERIFICATION: 7 FKs ALREADY HAVE CASCADE DELETE (no changes needed)
-- =============================================================================
-- 1. activity_log.user_id → profiles.id (CASCADE)
-- 2. community_bans.user_id → profiles.id (CASCADE)
-- 3. community_messages.user_id → profiles.id (CASCADE)
-- 4. message_reactions.user_id → profiles.id (CASCADE)
-- 5. monthly_rankings.user_id → profiles.id (CASCADE)
-- 6. prize_payments.user_id → profiles.id (CASCADE)
-- 7. user_earned_badges.user_id → profiles.id (CASCADE)

-- =============================================================================
-- DELETION BEHAVIOR SUMMARY
-- =============================================================================
-- When a user is deleted from profiles:
--
-- CASCADE DELETE (records deleted):
--   - activity_log records
--   - community_bans records
--   - community_messages (where user_id matches)
--   - message_reactions
--   - monthly_rankings
--   - prize_payments
--   - user_earned_badges
--
-- SET NULL (column set to NULL):
--   - community_messages.deleted_by_admin
--   - community_rules.updated_by_admin
--   - message_reports.reported_by
--   - monthly_winners.first_place_user_id
--   - monthly_winners.second_place_user_id
--   - monthly_winners.third_place_user_id
-- =============================================================================
