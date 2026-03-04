-- Add points and streak tracking columns to profiles table
-- This migration is idempotent: safe to run multiple times

-- Add columns if they don't exist (for profiles table)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE,
ADD COLUMN IF NOT EXISTS points_earned_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_earned_this_week INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_earned_this_month INTEGER DEFAULT 0;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON public.profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_current_streak ON public.profiles(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_best_streak ON public.profiles(best_streak DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity_date ON public.profiles(last_activity_date DESC);

-- Add constraints to ensure non-negative values
ALTER TABLE public.profiles
ADD CONSTRAINT check_total_points_non_negative CHECK (total_points >= 0),
ADD CONSTRAINT check_current_streak_non_negative CHECK (current_streak >= 0),
ADD CONSTRAINT check_best_streak_non_negative CHECK (best_streak >= 0),
ADD CONSTRAINT check_points_earned_today_non_negative CHECK (points_earned_today >= 0),
ADD CONSTRAINT check_points_earned_this_week_non_negative CHECK (points_earned_this_week >= 0),
ADD CONSTRAINT check_points_earned_this_month_non_negative CHECK (points_earned_this_month >= 0);
