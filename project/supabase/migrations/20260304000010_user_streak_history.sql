-- Create user_streak_history table for audit trail
-- Records streak changes and history (for analytics and debugging only)

CREATE TABLE IF NOT EXISTS public.user_streak_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_value INTEGER NOT NULL CHECK (streak_value >= 0),
  break_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_streak_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users see only their own history
CREATE POLICY "user_streak_history_read_own" ON public.user_streak_history
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Admins see all history
CREATE POLICY "user_streak_history_admin_read" ON public.user_streak_history
FOR SELECT USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policy: System only (functions) for INSERT
-- Users cannot directly insert; only database functions can
CREATE POLICY "user_streak_history_insert_system_only" ON public.user_streak_history
FOR INSERT WITH CHECK (FALSE);

-- History is immutable - no updates or deletes
-- (No UPDATE or DELETE policies = operations blocked)

-- Create indexes for efficient queries
CREATE INDEX idx_user_streak_history_user_id ON public.user_streak_history(user_id);
CREATE INDEX idx_user_streak_history_created_at ON public.user_streak_history(created_at DESC);
CREATE INDEX idx_user_streak_history_user_created ON public.user_streak_history(user_id, created_at DESC);
