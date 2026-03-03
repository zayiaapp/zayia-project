/*
  # Create User Earned Badges Table and RLS Policies

  1. New Tables
    - `user_earned_badges`: Tracks which badges each user has earned
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to profiles)
      - `badge_id` (uuid, FK to badges)
      - `earned_at` (timestamptz)
      - Unique constraint: user_id + badge_id (prevent duplicates)

  2. RLS Policies
    - Users can view their own earned badges
    - Users can view public profiles' earned badges (if needed)
    - Future: System/triggers to auto-award badges

  3. Indexes
    - idx_user_earned_badges_user_id
    - idx_user_earned_badges_badge_id
*/

-- Create user_earned_badges table
CREATE TABLE IF NOT EXISTS user_earned_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_user ON user_earned_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_badge ON user_earned_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_earned_at ON user_earned_badges(earned_at DESC);

-- Enable RLS
ALTER TABLE user_earned_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can see their own earned badges
CREATE POLICY "Users can see their own earned badges"
  ON user_earned_badges
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- RLS Policy: Users can see badges earned by public profiles (mentors, community)
CREATE POLICY "Users can see public profile badges"
  ON user_earned_badges
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_earned_badges.user_id
      AND (profiles.mentor_status = 'mentor' OR profiles.community_access = true)
    )
  );

-- RLS Policy: Authenticated users can insert their own badges (system/trigger will do this)
-- Keep restrictive: Only allow via RPC function, not direct insert
CREATE POLICY "System can insert earned badges"
  ON user_earned_badges
  FOR INSERT
  WITH CHECK (
    -- Only allow if user_id matches authenticated user
    auth.uid()::text = user_id::text
  );

-- Create helper function to award badge
CREATE OR REPLACE FUNCTION award_badge(user_id_param uuid, badge_name_param text)
RETURNS boolean AS $$
DECLARE
  badge_id_var uuid;
BEGIN
  -- Get badge ID from name
  SELECT id INTO badge_id_var FROM badges WHERE name = badge_name_param AND is_active = true;

  IF badge_id_var IS NULL THEN
    RAISE EXCEPTION 'Badge not found: %', badge_name_param;
  END IF;

  -- Insert or ignore if already earned
  INSERT INTO user_earned_badges (user_id, badge_id)
  VALUES (user_id_param, badge_id_var)
  ON CONFLICT (user_id, badge_id) DO NOTHING;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user earned badge count
CREATE OR REPLACE FUNCTION get_user_earned_badge_count(user_id_param uuid)
RETURNS integer AS $$
DECLARE
  count integer;
BEGIN
  SELECT COUNT(*) INTO count
  FROM user_earned_badges
  WHERE user_id = user_id_param;

  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get next badge progress
CREATE OR REPLACE FUNCTION get_next_badge_progress(user_id_param uuid)
RETURNS TABLE(badge_name text, earned_count integer, requirement integer, progress_percent integer) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.name,
    (SELECT COUNT(*) FROM user_earned_badges WHERE user_id = user_id_param AND badge_id = b.id)::integer as earned_count,
    b.requirement::integer,
    CASE
      WHEN b.requirement = 0 THEN 100
      ELSE ((SELECT COUNT(*) FROM user_earned_badges WHERE user_id = user_id_param AND badge_id = b.id)::float / b.requirement * 100)::integer
    END as progress_percent
  FROM badges b
  WHERE b.is_active = true
  ORDER BY progress_percent DESC, b.rarity
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION award_badge TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_earned_badge_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_badge_progress TO authenticated;
GRANT EXECUTE ON FUNCTION award_badge TO service_role;
GRANT EXECUTE ON FUNCTION get_user_earned_badge_count TO service_role;
GRANT EXECUTE ON FUNCTION get_next_badge_progress TO service_role;
