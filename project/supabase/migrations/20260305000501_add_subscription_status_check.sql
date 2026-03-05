-- Migration: Add check constraint for subscription_status values
-- Purpose: Ensure subscription_status only contains valid values
-- Values: 'trial' (active trial), 'active' (paid subscription), 'cancelled', 'expired'

-- Add check constraint for valid subscription_status values
ALTER TABLE public.profiles
ADD CONSTRAINT check_subscription_status_valid
CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')) NOT VALID;

-- Validate existing data against the constraint (non-blocking)
ALTER TABLE public.profiles VALIDATE CONSTRAINT check_subscription_status_valid;

-- Create index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status
ON public.profiles(subscription_status)
WHERE subscription_status IN ('trial', 'active');

-- Update comment to reflect all valid values
COMMENT ON COLUMN public.profiles.subscription_status IS 'Subscription status: trial (in active trial period), active (paid subscription), cancelled (user cancelled subscription), expired (trial or subscription expired)';
