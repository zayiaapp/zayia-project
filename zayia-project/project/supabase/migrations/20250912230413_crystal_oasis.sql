/*
  # Create questions and SOS system tables

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `question` (text)
      - `context` (text)
      - `is_sos` (boolean, default false)
      - `status` (text, default 'pending')
      - `ai_response` (text)
      - `response_time_seconds` (integer)
      - `satisfaction_rating` (integer)
      - `created_at` (timestamp)
      - `resolved_at` (timestamp)

  2. Security
    - Enable RLS on `questions` table
    - Add policy for users to read/insert their own questions
    - Add policy for CEO to read all questions
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  question text NOT NULL,
  context text,
  is_sos boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'resolved')),
  ai_response text,
  response_time_seconds integer,
  satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own questions
CREATE POLICY "Users can read own questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Policy for users to insert their own questions
CREATE POLICY "Users can insert own questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

-- Policy for users to update their own questions (for ratings)
CREATE POLICY "Users can update own questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Policy for CEO to read all questions
CREATE POLICY "CEO can read all questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to update questions (for AI responses)
CREATE POLICY "CEO can update questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_is_sos ON questions(is_sos);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);