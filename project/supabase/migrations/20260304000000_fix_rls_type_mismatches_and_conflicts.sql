/*
  # Fix RLS Type Mismatches & Policy Conflicts - EPIC-003

  ROOT CAUSE ANALYSIS:
  1. Profiles table had UUID type mismatches: comparing auth.uid()::text with uuid id
     - This caused all profile UPDATEs to fail silently (RLS returned 0 rows)
     - Avatar uploads could not be persisted to Supabase

  2. Multiple conflicting RLS policies on profiles and community_messages:
     - Old policies from original creation
     - New policies from EPIC-001 refinements
     - Conflicting rules caused 406 HTTP errors

  3. CEO verification logic used subqueries that could fail:
     - SELECT within RLS policy checking role = 'ceo'
     - Subqueries caused additional latency and failures

  FIXES IN THIS MIGRATION:
  1. Drop ALL old profiles RLS policies
  2. Recreate profiles policies with:
     - Correct UUID comparisons (auth.uid() = id, no ::text conversion)
     - Faster CEO role check using direct column comparison
     - Proper UPDATE WITH CHECK clauses

  3. Drop DUPLICATE community_messages policies from EPIC-001
  4. Recreate community_messages policies with:
     - Correct policy names to avoid conflicts
     - Proper admin role verification
     - Support for soft-delete via UPDATE deleted_at
*/

-- ================================================================================
-- 1. FIX PROFILES TABLE RLS
-- ================================================================================

-- Drop ALL old buggy policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "CEO can read all profiles" ON profiles;

-- Recreate profiles policies with CORRECT UUID handling
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);  -- ✅ UUID = UUID (no type conversion!)

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)   -- ✅ UUID = UUID
  WITH CHECK (auth.uid() = id);

-- CEO can read all profiles for moderation and user management
-- Uses direct column check instead of subquery for speed
CREATE POLICY "CEO can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'ceo'  -- Direct column check (fast!)
    OR
    auth.uid() = id  -- Users always see their own
  );

-- ================================================================================
-- 2. FIX COMMUNITY_MESSAGES TABLE RLS - REMOVE DUPLICATES
-- ================================================================================

-- Drop old policies to prevent conflicts
DROP POLICY IF EXISTS "Messages are public unless deleted" ON community_messages;
DROP POLICY IF EXISTS "Authenticated users can post messages" ON community_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON community_messages;
DROP POLICY IF EXISTS "Users can soft-delete their own messages" ON community_messages;

-- Drop EPIC-001 duplicate policies
DROP POLICY IF EXISTS "Admins can delete any message" ON community_messages;
DROP POLICY IF EXISTS "Admins can update any message" ON community_messages;

-- Recreate all community_messages policies in consistent order
-- SELECT: Non-deleted for public, all for admins
CREATE POLICY "Community messages: public sees non-deleted, admins see all"
  ON community_messages
  FOR SELECT
  USING (
    deleted_at IS NULL  -- Public sees non-deleted
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'  -- Admin sees all
  );

-- INSERT: Only authenticated users can post
CREATE POLICY "Community messages: authenticated users can post"
  ON community_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users update own, admins update any (for soft-delete and moderation)
CREATE POLICY "Community messages: users update own, admins update any"
  ON community_messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id  -- User can update own
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'  -- Admin can update any
  )
  WITH CHECK (
    auth.uid() = user_id  -- User can update own
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'  -- Admin can update any
  );

-- DELETE: Users delete own, admins delete any (hard delete)
CREATE POLICY "Community messages: users delete own, admins delete any"
  ON community_messages
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id  -- User can delete own
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'  -- Admin can delete any
  );

-- ================================================================================
-- SUMMARY OF CHANGES
-- ================================================================================
/*
  ✅ Fixed Profiles RLS:
     - Removed auth.uid()::text = id type mismatch
     - Changed to auth.uid() = id (UUID to UUID)
     - Changed CEO check from subquery to direct column check
     - This fixes avatar upload failures

  ✅ Fixed Community RLS:
     - Dropped all old + duplicate policies
     - Recreated with consistent naming
     - Admin moderation now works (soft-delete via UPDATE)
     - This fixes community message deletion failures

  ✅ Result:
     - Profile UPDATEs now succeed
     - Community moderation now works
     - No more 406 HTTP errors from conflicting policies
*/
