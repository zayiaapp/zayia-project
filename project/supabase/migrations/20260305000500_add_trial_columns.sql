-- Migration: Add trial columns to profiles table
-- Purpose: Support trial functionality with start date, duration, and active status
-- Safety: Uses IF NOT EXISTS to make migration idempotent (safe to run multiple times)

-- Add trial columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_active BOOLEAN DEFAULT true;

-- Create indexes for performance on trial-related queries
CREATE INDEX IF NOT EXISTS idx_profiles_trial_started_at
ON public.profiles(trial_started_at)
WHERE trial_started_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_trial_active
ON public.profiles(trial_active)
WHERE trial_active = true;

-- Add check constraint to ensure valid trial_days values
ALTER TABLE public.profiles
ADD CONSTRAINT check_trial_days_valid
CHECK (trial_days IS NULL OR trial_days > 0) NOT VALID;

-- Validate existing data against the constraint (non-blocking)
ALTER TABLE public.profiles VALIDATE CONSTRAINT check_trial_days_valid;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.trial_started_at IS 'Timestamp when trial period started. NULL for non-trial users.';
COMMENT ON COLUMN public.profiles.trial_days IS 'Number of days in trial period (7, 15, 30). NULL for non-trial users.';
COMMENT ON COLUMN public.profiles.trial_active IS 'Boolean indicating if trial is still active. Use trial_started_at + trial_days to determine expiration.';

-- Document subscription_status values
COMMENT ON COLUMN public.profiles.subscription_status IS 'Status of subscription: trial (in active trial), active (paid subscription), cancelled (user cancelled), expired (trial or subscription expired)';
