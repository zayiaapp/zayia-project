-- Create badges table
-- Represents all available badges/medals that users can earn

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  rarity TEXT DEFAULT 'common',
  color TEXT,
  requirement JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Validate rarity enum
  CONSTRAINT valid_rarity CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary'))
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access (all users can see badge definitions)
CREATE POLICY "badges_public_read" ON public.badges
FOR SELECT USING (is_active = true);

-- RLS Policy: Admin only for write operations
CREATE POLICY "badges_admin_write" ON public.badges
FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "badges_admin_update" ON public.badges
FOR UPDATE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "badges_admin_delete" ON public.badges
FOR DELETE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create indexes
CREATE INDEX idx_badges_category ON public.badges(category);
CREATE INDEX idx_badges_is_active ON public.badges(is_active);
CREATE INDEX idx_badges_badge_id ON public.badges(badge_id);
