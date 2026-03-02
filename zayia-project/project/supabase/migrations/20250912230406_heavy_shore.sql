/*
  # Create user progress tracking table

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `challenge_id` (text)
      - `challenge_category` (text)
      - `challenge_difficulty` (text)
      - `points_earned` (integer)
      - `duration_minutes` (integer)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_progress` table
    - Add policy for users to read/insert their own progress
    - Add policy for CEO to read all progress
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  challenge_category text NOT NULL,
  challenge_difficulty text NOT NULL CHECK (challenge_difficulty IN ('facil', 'dificil')),
  points_earned integer NOT NULL DEFAULT 0,
  duration_minutes integer NOT NULL DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Policy for users to insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

-- Policy for CEO to read all progress
CREATE POLICY "CEO can read all progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_category ON user_progress(challenge_category);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON user_progress(completed_at);