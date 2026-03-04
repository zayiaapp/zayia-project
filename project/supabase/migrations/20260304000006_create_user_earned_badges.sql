-- Create user_earned_badges table
-- Tracks which badges each user has earned

CREATE TABLE IF NOT EXISTS public.user_earned_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Prevent duplicate badge awards for same user
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_earned_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users see only their own earned badges
CREATE POLICY "user_earned_badges_read_own" ON public.user_earned_badges
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Admins see all earned badges
CREATE POLICY "user_earned_badges_admin_read" ON public.user_earned_badges
FOR SELECT USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policy: Users can only award badges to themselves
CREATE POLICY "user_earned_badges_insert" ON public.user_earned_badges
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Badge history is immutable (no updates/deletes)
-- Users and admins cannot modify earned badges once awarded

-- Create indexes
CREATE INDEX idx_user_earned_badges_user_id ON public.user_earned_badges(user_id);
CREATE INDEX idx_user_earned_badges_badge_id ON public.user_earned_badges(badge_id);
CREATE INDEX idx_user_earned_badges_earned_at ON public.user_earned_badges(earned_at);
