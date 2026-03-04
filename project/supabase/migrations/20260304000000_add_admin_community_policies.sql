/*
  # Add Admin Community Policies for Message Management

  The previous migration created RLS policies that only allow users to:
  - UPDATE their own messages
  - DELETE their own messages

  This prevents CEOs/admins from soft-deleting abusive messages.

  Changes:
  1. Modify SELECT policy to allow admins to see deleted messages too
  2. Add UPDATE policy for admins to soft-delete any message
  3. Add DELETE policy for admins to hard-delete any message
  4. Add UPDATE policy for admins to restore deleted messages

  This enables real-time deletion in AdminCommunitySection without RLS blocking.
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can update their own messages" ON community_messages;
DROP POLICY IF EXISTS "Users can soft-delete their own messages" ON community_messages;
DROP POLICY IF EXISTS "Messages are public unless deleted" ON community_messages;

-- Create new SELECT policy: Non-deleted for regular users, all for admins
CREATE POLICY "Messages visible: public if not deleted, admins see all"
  ON community_messages
  FOR SELECT
  USING (
    deleted_at IS NULL  -- Regular users see non-deleted
    OR
    EXISTS (SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo')  -- Admins see all including deleted
  );

-- Create UPDATE policy: Users update own, admins update any
CREATE POLICY "Users can update their own messages, admins can update any"
  ON community_messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::text = user_id::text  -- User updating own message
    OR
    EXISTS (SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo')  -- Admin updating any message
  )
  WITH CHECK (
    auth.uid()::text = user_id::text  -- User updating own message
    OR
    EXISTS (SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo')  -- Admin updating any message
  );

-- Create DELETE policy: Users delete own, admins delete any
CREATE POLICY "Users can soft-delete their own messages, admins can delete any"
  ON community_messages
  FOR DELETE
  TO authenticated
  USING (
    auth.uid()::text = user_id::text  -- User deleting own message
    OR
    EXISTS (SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo')  -- Admin deleting any message
  );

-- Note: Soft delete is done via UPDATE (setting deleted_at), not DELETE
-- Hard delete via DELETE statement is available but not currently used
-- Admin messages are updated with deleted_at timestamp and deleted_by_admin UUID
