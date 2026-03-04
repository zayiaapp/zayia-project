-- Create user_point_history table for audit trail
-- Tracks all point transactions (challenges, medals, adjustments, etc.)

CREATE TABLE IF NOT EXISTS public.user_point_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('challenge_complete', 'medal_unlock', 'level_bonus', 'admin_adjust')),
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_point_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users see only their own history
CREATE POLICY "user_point_history_read_own" ON public.user_point_history
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Admins see all history
CREATE POLICY "user_point_history_admin_read" ON public.user_point_history
FOR SELECT USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policy: System only (functions) for INSERT
-- Users cannot directly insert; only database functions can
CREATE POLICY "user_point_history_insert_system_only" ON public.user_point_history
FOR INSERT WITH CHECK (FALSE);

-- History is immutable - no updates or deletes
-- (No UPDATE or DELETE policies = operations blocked)

-- Create indexes for efficient queries
CREATE INDEX idx_user_point_history_user_id ON public.user_point_history(user_id);
CREATE INDEX idx_user_point_history_created_at ON public.user_point_history(created_at DESC);
CREATE INDEX idx_user_point_history_user_created ON public.user_point_history(user_id, created_at DESC);
CREATE INDEX idx_user_point_history_reason ON public.user_point_history(reason);
