-- Create challenges table
-- Represents individual challenges within each category

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.challenge_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  difficulty TEXT NOT NULL DEFAULT 'easy',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Validate points are in expected range
  CONSTRAINT valid_points CHECK (points IN (5, 10, 15, 20, 25)),
  -- Validate difficulty enum
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access (only active challenges)
CREATE POLICY "challenges_public_read" ON public.challenges
FOR SELECT USING (is_active = true);

-- RLS Policy: Admin see all challenges (including inactive)
CREATE POLICY "challenges_admin_read" ON public.challenges
FOR SELECT USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- RLS Policy: Admin only for write operations
CREATE POLICY "challenges_admin_write" ON public.challenges
FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "challenges_admin_update" ON public.challenges
FOR UPDATE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "challenges_admin_delete" ON public.challenges
FOR DELETE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create indexes
CREATE INDEX idx_challenges_category_id ON public.challenges(category_id);
CREATE INDEX idx_challenges_is_active ON public.challenges(is_active);
CREATE INDEX idx_challenges_difficulty ON public.challenges(difficulty);
CREATE INDEX idx_challenges_display_order ON public.challenges(display_order);
