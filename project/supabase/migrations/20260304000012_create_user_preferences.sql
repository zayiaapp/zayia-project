-- Create user_preferences table
-- Stores user preference settings (notifications, theme, language, goals, etc.)

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_goal INTEGER DEFAULT 5 CHECK (daily_goal >= 1 AND daily_goal <= 20),
  notifications_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  theme TEXT DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'pt' CHECK (language IN ('pt', 'en')),
  email_frequency TEXT DEFAULT 'weekly' CHECK (email_frequency IN ('daily', 'weekly', 'never')),
  marketing_emails BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users see only their own preferences
CREATE POLICY "user_preferences_read_own" ON public.user_preferences
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Admins see all preferences (for analytics)
CREATE POLICY "user_preferences_admin_read" ON public.user_preferences
FOR SELECT USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policy: Users can insert/update own preferences
CREATE POLICY "user_preferences_write_own" ON public.user_preferences
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_own" ON public.user_preferences
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Preferences are immutable via DELETE (no removal)
-- (No DELETE policy = operations blocked)

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_created_at ON public.user_preferences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON public.user_preferences(language);
CREATE INDEX IF NOT EXISTS idx_user_preferences_theme ON public.user_preferences(theme);
