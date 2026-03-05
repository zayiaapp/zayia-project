-- Migration: Create activity_log and daily_analytics tables
-- EPIC-005, STORY-005.001
-- Applied: 2026-03-05
-- Idempotent: IF NOT EXISTS on tables/indexes; DROP POLICY IF EXISTS before CREATE POLICY

-- ============================================================
-- 1. CREATE activity_log TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'challenge_completed',
    'badge_earned',
    'level_up',
    'community_post',
    'subscription_changed',
    'user_registered',
    'streak_milestone'
  )),
  action_data JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for frequent CEO Dashboard queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON public.activity_log(action_type);

-- RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Drop before create for idempotency (CREATE POLICY IF NOT EXISTS requires PG17)
DROP POLICY IF EXISTS "CEO can read all activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can read own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.activity_log;

-- CEO reads all activity
CREATE POLICY "CEO can read all activity" ON public.activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- User reads own activity only
CREATE POLICY "Users can read own activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- User inserts own activity (system also via service role — bypasses RLS)
CREATE POLICY "Users can insert own activity" ON public.activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- No DELETE policy = nobody can delete (audit trail is permanent)

COMMENT ON TABLE public.activity_log IS 'Audit trail of all user actions. Used by CEO Dashboard for recent activity feed.';
COMMENT ON COLUMN public.activity_log.action_data IS 'JSON with action-specific data. e.g. {challenge_id, points_earned, badge_name}';
COMMENT ON COLUMN public.activity_log.action_type IS 'Enum of known action types. Constrained by CHECK for data integrity.';

-- ============================================================
-- 2. CREATE daily_analytics TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  active_users INT DEFAULT 0 NOT NULL,
  new_users INT DEFAULT 0 NOT NULL,
  challenges_completed INT DEFAULT 0 NOT NULL,
  community_posts INT DEFAULT 0 NOT NULL,
  badges_earned INT DEFAULT 0 NOT NULL,
  revenue_brl DECIMAL(10,2) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON public.daily_analytics(date DESC);

-- RLS
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- Drop before create for idempotency
DROP POLICY IF EXISTS "CEO can read analytics" ON public.daily_analytics;

-- Only CEO can read analytics
CREATE POLICY "CEO can read analytics" ON public.daily_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ceo')
  );

-- INSERT/UPDATE via service role only (no user-level policy needed)

COMMENT ON TABLE public.daily_analytics IS 'Daily aggregated metrics. Populated on demand or by job. Used in CEO Dashboard charts.';
COMMENT ON COLUMN public.daily_analytics.revenue_brl IS 'Total revenue in BRL for the day. Populated manually or via payment webhook.';
