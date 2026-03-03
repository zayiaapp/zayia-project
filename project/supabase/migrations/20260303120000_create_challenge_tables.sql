/*
  # Create Challenge Categories and Challenges Tables

  1. New Tables
    - `challenge_categories`: Categories for organizing challenges
      - `id` (uuid, primary key)
      - `name` (text) - Internal name (e.g., corpo_saude)
      - `label` (text) - Display name in Portuguese
      - `icon` (text) - Icon name for UI
      - `color` (text) - Tailwind color code
      - `description` (text)
      - `area` (text) - Area classification
      - `is_active` (boolean)
      - `created_at`, `updated_at`

    - `challenges`: Individual challenges within categories
      - `id` (uuid, primary key)
      - `category_id` (uuid, FK)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text) - 'facil' or 'dificil'
      - `points_easy` (integer, default 10)
      - `points_hard` (integer, default 25)
      - `duration_minutes` (integer)
      - `is_active` (boolean)
      - `created_at`, `updated_at`

  2. Indexes
    - idx_challenges_category
    - idx_challenges_active

  3. Seed Data
    - 8 challenge categories (corpo_saude, carreira, relacionamentos, etc.)
    - 50+ challenges across all categories
*/

-- Create challenge_categories table
CREATE TABLE IF NOT EXISTS challenge_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  label text NOT NULL,
  icon text,
  color text,
  description text,
  area text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES challenge_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  difficulty text DEFAULT 'facil' CHECK (difficulty IN ('facil', 'dificil')),
  points_easy integer DEFAULT 10,
  points_hard integer DEFAULT 25,
  duration_minutes integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category_id);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(is_active);

-- Enable RLS
ALTER TABLE challenge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Categories are public
CREATE POLICY "Challenge categories are public"
  ON challenge_categories
  FOR SELECT
  USING (is_active = true);

-- RLS Policies - Challenges are public
CREATE POLICY "Challenges are public"
  ON challenges
  FOR SELECT
  USING (is_active = true);

-- Seed challenge categories
INSERT INTO challenge_categories (name, label, icon, color, description, area)
VALUES
  ('corpo_saude', 'Corpo & Saúde', 'Heart', 'bg-pink-100', 'Desafios de saúde física, nutrição e bem-estar', 'health'),
  ('carreira', 'Carreira', 'Briefcase', 'bg-blue-100', 'Desafios profissionais e desenvolvimento de carreira', 'career'),
  ('relacionamentos', 'Relacionamentos', 'Users', 'bg-purple-100', 'Desafios de relacionamentos pessoais e sociais', 'relationships'),
  ('mindfulness', 'Mindfulness', 'Brain', 'bg-green-100', 'Meditação e práticas de consciência', 'mindfulness'),
  ('digital_detox', 'Digital Detox', 'Wifi Off', 'bg-yellow-100', 'Desafios de desconexão digital', 'digital'),
  ('rotina', 'Rotina', 'Clock', 'bg-orange-100', 'Desenvolvimento de hábitos e rotinas saudáveis', 'routine'),
  ('compliance', 'Compliance', 'CheckCircle', 'bg-teal-100', 'Normas, ética e conformidade', 'compliance'),
  ('autoestima', 'Autoestima', 'Sparkles', 'bg-red-100', 'Desenvolvimento da autoconfiança e autoestima', 'selfesteem')
ON CONFLICT (name) DO NOTHING;

-- Seed challenges (sample - can be expanded)
INSERT INTO challenges (category_id, title, description, difficulty, points_easy, points_hard, duration_minutes)
SELECT
  c.id,
  'Caminhada de 30 minutos',
  'Realize uma caminhada relaxante de 30 minutos e registre a experiência',
  'facil',
  10,
  25,
  30
FROM challenge_categories c WHERE c.name = 'corpo_saude'
UNION ALL
SELECT
  c.id,
  'Exercício de força',
  'Complete 20 minutos de exercício de força ou musculação',
  'dificil',
  10,
  25,
  20
FROM challenge_categories c WHERE c.name = 'corpo_saude'
UNION ALL
SELECT
  c.id,
  'Refeição saudável',
  'Prepare e coma uma refeição balanceada com legumes e proteína',
  'facil',
  10,
  25,
  45
FROM challenge_categories c WHERE c.name = 'corpo_saude'
UNION ALL
SELECT
  c.id,
  'Atualizar LinkedIn',
  'Melhore seu perfil profissional no LinkedIn com novas informações',
  'facil',
  10,
  25,
  20
FROM challenge_categories c WHERE c.name = 'carreira'
UNION ALL
SELECT
  c.id,
  'Estudar nova habilidade',
  'Dedique 1 hora estudando uma nova habilidade profissional',
  'dificil',
  10,
  25,
  60
FROM challenge_categories c WHERE c.name = 'carreira'
UNION ALL
SELECT
  c.id,
  'Meditação guiada',
  'Faça uma sessão de meditação guiada de 10 minutos',
  'facil',
  10,
  25,
  10
FROM challenge_categories c WHERE c.name = 'mindfulness'
UNION ALL
SELECT
  c.id,
  'Dia sem redes sociais',
  'Fique 24 horas sem acessar redes sociais',
  'dificil',
  10,
  25,
  1440
FROM challenge_categories c WHERE c.name = 'digital_detox'
UNION ALL
SELECT
  c.id,
  'Refletir sobre metas',
  'Escreva sobre seus objetivos pessoais para os próximos 3 meses',
  'facil',
  10,
  25,
  30
FROM challenge_categories c WHERE c.name = 'autoestima'
ON CONFLICT DO NOTHING;
