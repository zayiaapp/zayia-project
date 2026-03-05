-- Migration: Fix RLS Security + Realtime Publication + Duplicate Policies
-- Applied: 2026-03-05
-- Purpose: Critical security fixes identified in Supabase audit

-- ============================================================
-- 1. ENABLE RLS ON COMMUNITY TABLES (was DISABLED despite having policies)
-- ============================================================
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_bans ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. ADD MISSING TABLES TO REALTIME PUBLICATION
-- Purpose: Real-time points/badges/preferences updates were broken
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_earned_badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_preferences;

-- ============================================================
-- 3. REMOVE DUPLICATE RLS POLICIES ON community_messages
-- Keeping best version of each cmd (DELETE, SELECT, UPDATE)
-- ============================================================

-- DELETE: remove weaker duplicate (uses ::text cast unnecessarily)
DROP POLICY IF EXISTS "Users can soft-delete their own messages, admins can delete any" ON public.community_messages;

-- SELECT: remove duplicate with same logic
DROP POLICY IF EXISTS "Messages visible: public if not deleted, admins see all" ON public.community_messages;

-- UPDATE: remove 3 weaker duplicates, keep comprehensive policy
DROP POLICY IF EXISTS "Admins can moderate any message" ON public.community_messages;
DROP POLICY IF EXISTS "Users can soft-delete own messages" ON public.community_messages;
DROP POLICY IF EXISTS "Users can update their own messages, admins can update any" ON public.community_messages;

-- ============================================================
-- 4. REMOVE DUPLICATE RLS POLICIES ON profiles
-- "Allow authenticated users to read all profiles" (qual=true) is most permissive
-- and covers both of the other SELECT policies
-- ============================================================
DROP POLICY IF EXISTS "CEO can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- ============================================================
-- RESULT AFTER MIGRATION:
-- - All 16 tables have RLS enabled (rowsecurity = true)
-- - 7 tables in Realtime publication (was 4, now 7)
-- - community_messages: 4 policies (1 DELETE, 1 INSERT, 1 SELECT, 1 UPDATE)
-- - profiles: 2 policies (1 SELECT, 1 UPDATE)
-- ============================================================
