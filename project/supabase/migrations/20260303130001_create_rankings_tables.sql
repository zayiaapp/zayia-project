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
