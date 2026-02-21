/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text, default 'user')
      - `avatar_url` (text)
      - `phone` (text)
      - `birth_date` (date)
      - `location` (text)
      - `profession` (text)
      - `education` (text)
      - `bio` (text)
      - `streak` (integer, default 0)
      - `total_sessions` (integer, default 0)
      - `points` (integer, default 0)
      - `level` (integer, default 1)
      - `completed_challenges` (integer, default 0)
      - `subscription_plan` (text, default 'basic')
      - `subscription_status` (text, default 'active')
      - `notifications_enabled` (boolean, default true)
      - `community_access` (boolean, default true)
      - `mentor_status` (text, default 'none')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read/update their own profile
    - Add policy for CEO to read all profiles
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'ceo')),
  avatar_url text,
  phone text,
  birth_date date,
  location text,
  profession text,
  education text,
  bio text,
  streak integer DEFAULT 0,
  total_sessions integer DEFAULT 0,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  completed_challenges integer DEFAULT 0,
  subscription_plan text DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'vip')),
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  notifications_enabled boolean DEFAULT true,
  community_access boolean DEFAULT true,
  mentor_status text DEFAULT 'none' CHECK (mentor_status IN ('none', 'mentee', 'mentor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read/update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id);

-- Policy for CEO to read all profiles
CREATE POLICY "CEO can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();