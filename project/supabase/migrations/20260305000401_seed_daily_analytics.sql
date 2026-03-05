-- Migration: Seed daily_analytics with last 30 days of real data
-- EPIC-005, STORY-005.001 (AC3)
-- Applied: 2026-03-05
-- Idempotent: ON CONFLICT (date) DO UPDATE — safe to run multiple times

INSERT INTO public.daily_analytics (date, active_users, new_users, challenges_completed, badges_earned)
SELECT
  d.date,
  COALESCE(cc.active_users, 0) AS active_users,
  COALESCE(p.new_users, 0) AS new_users,
  COALESCE(cc.challenges_count, 0) AS challenges_completed,
  COALESCE(b.badges_count, 0) AS badges_earned
FROM
  generate_series(
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE,
    '1 day'
  ) AS d(date)
LEFT JOIN (
  SELECT
    DATE(completed_at) AS day,
    COUNT(DISTINCT user_id) AS active_users,
    COUNT(*) AS challenges_count
  FROM public.challenge_completions
  WHERE completed_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(completed_at)
) cc ON cc.day = d.date
LEFT JOIN (
  SELECT
    DATE(created_at) AS day,
    COUNT(*) AS new_users
  FROM public.profiles
  WHERE role = 'user' AND created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(created_at)
) p ON p.day = d.date
LEFT JOIN (
  SELECT
    DATE(earned_at) AS day,
    COUNT(*) AS badges_count
  FROM public.user_earned_badges
  WHERE earned_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(earned_at)
) b ON b.day = d.date
ON CONFLICT (date) DO UPDATE SET
  active_users = EXCLUDED.active_users,
  new_users = EXCLUDED.new_users,
  challenges_completed = EXCLUDED.challenges_completed,
  badges_earned = EXCLUDED.badges_earned,
  updated_at = NOW();
