-- Challenge completions table
-- Tracks which challenges each user has completed (replaces localStorage)

CREATE TABLE IF NOT EXISTS public.challenge_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id text NOT NULL,
  category_id text NOT NULL,
  difficulty text CHECK (difficulty IN ('facil', 'dificil')),
  points_earned integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Add active_category_id to user_preferences (tracks which category user is working on)
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS active_category_id text;

-- Enable RLS
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own completions
CREATE POLICY "challenge_completions_read_own"
  ON public.challenge_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "challenge_completions_insert_own"
  ON public.challenge_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all completions (for analytics)
CREATE POLICY "challenge_completions_admin_read"
  ON public.challenge_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ceo'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_challenge_completions_user_id
  ON public.challenge_completions(user_id);

CREATE INDEX IF NOT EXISTS idx_challenge_completions_category
  ON public.challenge_completions(user_id, category_id);

CREATE INDEX IF NOT EXISTS idx_challenge_completions_date
  ON public.challenge_completions(user_id, completed_at DESC);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_completions;
