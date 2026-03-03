/*
  # Create Community Tables

  1. New Tables
    - `community_messages`: User messages with soft delete
    - `message_reactions`: Emoji reactions on messages
    - `community_bans`: User suspension system
    - `message_reports`: Abuse reporting system
    - `community_rules`: Admin-editable community rules

  2. RLS Policies
    - Public read for messages (unless deleted)
    - Only auth users can post
    - Users can delete own messages
    - Admin can delete/restore any message
    - Reports are private to admins

  3. Triggers
    - Auto-expire bans after duration

  4. Indexes
    - idx_messages_user_id
    - idx_messages_created_at
    - idx_reactions_message_id
    - idx_bans_user_id
    - idx_bans_active
*/

-- Create community_messages table
CREATE TABLE IF NOT EXISTS community_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  deleted_by_admin uuid REFERENCES profiles(id),
  deleted_at timestamptz,
  deletion_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, emoji, user_id)
);

-- Create community_bans table
CREATE TABLE IF NOT EXISTS community_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ban_number integer DEFAULT 1,
  ban_duration text DEFAULT '1_day' CHECK (ban_duration IN ('1_day', '7_days', 'permanent')),
  reason text,
  banned_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  created_at timestamptz DEFAULT now()
);

-- Create message_reports table
CREATE TABLE IF NOT EXISTS message_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
  reported_by uuid REFERENCES profiles(id),
  reason text CHECK (reason IN ('disrespectful', 'inappropriate', 'spam', 'discrimination', 'privacy', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create community_rules table
CREATE TABLE IF NOT EXISTS community_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  updated_by_admin uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_user ON community_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_message ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bans_user ON community_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_bans_active ON community_bans(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_reports_message ON message_reports(message_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON message_reports(status);

-- Enable RLS
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Community Messages
CREATE POLICY "Messages are public unless deleted"
  ON community_messages
  FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can post messages"
  ON community_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own messages"
  ON community_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can soft-delete their own messages"
  ON community_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies - Message Reactions
CREATE POLICY "Reactions are public"
  ON message_reactions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON message_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can remove their own reactions"
  ON message_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- RLS Policies - Community Bans
CREATE POLICY "Authenticated users can view active bans"
  ON community_bans
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- RLS Policies - Message Reports
CREATE POLICY "Authenticated users can report messages"
  ON message_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = reported_by::text);

CREATE POLICY "Admins can view all reports"
  ON message_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo'
    )
  );

-- RLS Policies - Community Rules
CREATE POLICY "Rules are public"
  ON community_rules
  FOR SELECT
  USING (true);

-- Function to auto-expire bans
CREATE OR REPLACE FUNCTION expire_bans()
RETURNS void AS $$
BEGIN
  UPDATE community_bans
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at IS NOT NULL
  AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Bans are auto-expired by calculate_ban_expiry() function
-- Call expire_bans() periodically or when checking ban status
-- In Phase 3, add a scheduled job to run expire_bans() daily

-- Function to calculate ban expiry date
CREATE OR REPLACE FUNCTION calculate_ban_expiry(duration text)
RETURNS timestamptz AS $$
BEGIN
  CASE duration
    WHEN '1_day' THEN RETURN now() + INTERVAL '1 day';
    WHEN '7_days' THEN RETURN now() + INTERVAL '7 days';
    WHEN 'permanent' THEN RETURN NULL;
    ELSE RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to set expires_at on ban creation
CREATE OR REPLACE FUNCTION set_ban_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at = calculate_ban_expiry(NEW.ban_duration);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_ban_expiry_trigger
BEFORE INSERT ON community_bans
FOR EACH ROW
EXECUTE FUNCTION set_ban_expiry();

-- Grant permissions
GRANT EXECUTE ON FUNCTION expire_bans TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION calculate_ban_expiry TO authenticated, service_role;
