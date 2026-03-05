-- User streak milestones table
-- Tracks when users reach streak milestones (7, 14, 30, 50, 100 days)

CREATE TABLE IF NOT EXISTS public.user_streak_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_days integer NOT NULL,
  achieved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, milestone_days)
);

-- Enable RLS
ALTER TABLE public.user_streak_milestones ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own milestones
CREATE POLICY "user_streak_milestones_read_own"
  ON public.user_streak_milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_streak_milestones_insert_own"
  ON public.user_streak_milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all milestones (for analytics)
CREATE POLICY "user_streak_milestones_admin_read"
  ON public.user_streak_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'ceo'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_streak_milestones_user_id
  ON public.user_streak_milestones(user_id);

CREATE INDEX IF NOT EXISTS idx_user_streak_milestones_milestone
  ON public.user_streak_milestones(user_id, milestone_days);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_streak_milestones;
