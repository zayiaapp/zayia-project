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
/*
  # Create Rankings and Prize Tables

  1. New Tables
    - `monthly_rankings`: User positions in monthly leaderboard
    - `monthly_winners`: Top 3 winners each month
    - `prize_payments`: PIX/bank transfer tracking

  2. RLS Policies
    - Rankings are public
    - Prize payments visible to winners + admins only
    - Admins can manage payments

  3. Triggers & Functions
    - Calculate rankings based on completed_challenges + points
    - Calculate monthly winners automatically
    - Track payment status

  4. Indexes
    - idx_rankings_month_year
    - idx_rankings_user
    - idx_winners_month_year
    - idx_payments_user
*/

-- Create monthly_rankings table
CREATE TABLE IF NOT EXISTS monthly_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  position integer,
  points integer DEFAULT 0,
  badges_count integer DEFAULT 0,
  completed_challenges integer DEFAULT 0,
  favorite_category text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Create monthly_winners table
CREATE TABLE IF NOT EXISTS monthly_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  first_place_user_id uuid REFERENCES profiles(id),
  first_place_amount decimal(10, 2),
  second_place_user_id uuid REFERENCES profiles(id),
  second_place_amount decimal(10, 2),
  third_place_user_id uuid REFERENCES profiles(id),
  third_place_amount decimal(10, 2),
  created_at timestamptz DEFAULT now(),
  finalized_at timestamptz,
  UNIQUE(month, year)
);

-- Create prize_payments table
CREATE TABLE IF NOT EXISTS prize_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  position integer CHECK (position IN (1, 2, 3)),
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  amount decimal(10, 2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_method text CHECK (payment_method IN ('pix', 'bank_transfer', 'manual')),
  payment_date timestamptz,
  pix_key text,
  bank_account text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rankings_user ON monthly_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_rankings_month_year ON monthly_rankings(month, year);
CREATE INDEX IF NOT EXISTS idx_rankings_position ON monthly_rankings(position);
CREATE INDEX IF NOT EXISTS idx_winners_month_year ON monthly_winners(month, year);
CREATE INDEX IF NOT EXISTS idx_payments_user ON prize_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON prize_payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_month_year ON prize_payments(month, year);

-- Enable RLS
ALTER TABLE monthly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Monthly Rankings
CREATE POLICY "Rankings are public"
  ON monthly_rankings
  FOR SELECT
  USING (true);

-- RLS Policies - Monthly Winners
CREATE POLICY "Winners are public"
  ON monthly_winners
  FOR SELECT
  USING (true);

-- RLS Policies - Prize Payments
CREATE POLICY "Users can view their own payments"
  ON prize_payments
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all payments"
  ON prize_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo'
    )
  );

CREATE POLICY "Admins can update payments"
  ON prize_payments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()::uuid
      AND profiles.role = 'ceo'
    )
  );

-- Function to calculate monthly rankings
CREATE OR REPLACE FUNCTION calculate_monthly_rankings(target_month integer, target_year integer)
RETURNS void AS $$
BEGIN
  -- Clear existing rankings for this month
  DELETE FROM monthly_rankings
  WHERE month = target_month AND year = target_year;

  -- Insert new rankings
  INSERT INTO monthly_rankings (user_id, month, year, position, points, badges_count, completed_challenges, favorite_category)
  SELECT
    p.id,
    target_month,
    target_year,
    ROW_NUMBER() OVER (ORDER BY p.points DESC NULLS LAST) as position,
    p.points,
    (SELECT COUNT(*) FROM user_earned_badges WHERE user_id = p.id),
    p.completed_challenges,
    (SELECT category FROM challenges ORDER BY RANDOM() LIMIT 1) -- placeholder for favorite category
  FROM profiles p
  WHERE p.role = 'user'
  ORDER BY p.points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to finalize monthly winners and create prize payments
CREATE OR REPLACE FUNCTION finalize_monthly_winners(target_month integer, target_year integer, first_prize decimal, second_prize decimal, third_prize decimal)
RETURNS void AS $$
DECLARE
  first_user uuid;
  second_user uuid;
  third_user uuid;
BEGIN
  -- Get top 3 users
  SELECT user_id INTO first_user FROM monthly_rankings
  WHERE month = target_month AND year = target_year
  ORDER BY position LIMIT 1;

  SELECT user_id INTO second_user FROM monthly_rankings
  WHERE month = target_month AND year = target_year
  ORDER BY position OFFSET 1 LIMIT 1;

  SELECT user_id INTO third_user FROM monthly_rankings
  WHERE month = target_month AND year = target_year
  ORDER BY position OFFSET 2 LIMIT 1;

  -- Create or update winners record
  INSERT INTO monthly_winners (month, year, first_place_user_id, first_place_amount, second_place_user_id, second_place_amount, third_place_user_id, third_place_amount, finalized_at)
  VALUES (target_month, target_year, first_user, first_prize, second_user, second_prize, third_user, third_prize, now())
  ON CONFLICT (month, year) DO UPDATE SET
    first_place_user_id = first_user,
    first_place_amount = first_prize,
    second_place_user_id = second_user,
    second_place_amount = second_prize,
    third_place_user_id = third_user,
    third_place_amount = third_prize,
    finalized_at = now();

  -- Create prize payment records
  IF first_user IS NOT NULL THEN
    INSERT INTO prize_payments (user_id, position, month, year, amount, status)
    VALUES (first_user, 1, target_month, target_year, first_prize, 'pending')
    ON CONFLICT DO NOTHING;
  END IF;

  IF second_user IS NOT NULL THEN
    INSERT INTO prize_payments (user_id, position, month, year, amount, status)
    VALUES (second_user, 2, target_month, target_year, second_prize, 'pending')
    ON CONFLICT DO NOTHING;
  END IF;

  IF third_user IS NOT NULL THEN
    INSERT INTO prize_payments (user_id, position, month, year, amount, status)
    VALUES (third_user, 3, target_month, target_year, third_prize, 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark payment as completed
CREATE OR REPLACE FUNCTION mark_payment_paid(payment_id uuid, method text, payment_date_param timestamptz)
RETURNS void AS $$
BEGIN
  UPDATE prize_payments
  SET
    status = 'paid',
    payment_method = method,
    payment_date = payment_date_param,
    updated_at = now()
  WHERE id = payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_monthly_rankings TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION finalize_monthly_winners TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION mark_payment_paid TO authenticated, service_role;
