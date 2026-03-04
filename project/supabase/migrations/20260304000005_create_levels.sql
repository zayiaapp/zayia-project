-- Create levels table
-- Represents user progression levels (0-9)

CREATE TABLE IF NOT EXISTS public.levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  bonus_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Validate level range
  CONSTRAINT valid_level_number CHECK (level_number >= 0 AND level_number <= 9)
);

-- Enable RLS
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access (all users can see level definitions)
CREATE POLICY "levels_public_read" ON public.levels
FOR SELECT USING (true);

-- RLS Policy: Admin only for write operations
CREATE POLICY "levels_admin_write" ON public.levels
FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "levels_admin_update" ON public.levels
FOR UPDATE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "levels_admin_delete" ON public.levels
FOR DELETE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create indexes
CREATE INDEX idx_levels_level_number ON public.levels(level_number);
CREATE INDEX idx_levels_points_required ON public.levels(points_required);
