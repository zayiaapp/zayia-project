-- Create challenge_categories table
-- Represents all challenge categories (Corpo & Saúde, Carreira, etc.)

CREATE TABLE IF NOT EXISTS public.challenge_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.challenge_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access
CREATE POLICY "challenge_categories_public_read" ON public.challenge_categories
FOR SELECT USING (true);

-- RLS Policy: Admin only for insert/update/delete
CREATE POLICY "challenge_categories_admin_write" ON public.challenge_categories
FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "challenge_categories_admin_update" ON public.challenge_categories
FOR UPDATE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "challenge_categories_admin_delete" ON public.challenge_categories
FOR DELETE USING (
  (auth.jwt() ->> 'user_role'::text) = 'admin' OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Create index
CREATE INDEX idx_challenge_categories_display_order ON public.challenge_categories(display_order);
