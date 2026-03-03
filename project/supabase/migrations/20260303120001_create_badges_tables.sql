/*
  # Create Badges and Levels Tables

  1. New Tables
    - `levels`: User progression levels
      - `id` (uuid, primary key)
      - `level_number` (integer, unique) - 0-9
      - `points_required` (integer) - Points needed to reach this level
      - `name` (text) - Level name
      - `description` (text)
      - `color` (text) - Tailwind color code
      - `created_at`

    - `badges`: Badge definitions (achievements)
      - `id` (uuid, primary key)
      - `name` (text, unique) - Badge identifier
      - `description` (text)
      - `icon_name` (text) - Icon/emoji name
      - `category` (text) - Badge category
      - `rarity` (text) - 'common', 'uncommon', 'rare', 'epic', 'legendary'
      - `requirement` (integer) - Requirement to unlock
      - `points` (integer) - Points awarded
      - `color` (text)
      - `is_active` (boolean)
      - `created_at`

  2. Seed Data
    - 10 levels (0-9) with point requirements
    - 50+ badges with various rarities

  3. Indexes
    - idx_badges_active
    - idx_levels_points_required
*/

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL CHECK (level_number >= 0 AND level_number <= 99),
  points_required integer NOT NULL,
  name text,
  description text,
  color text DEFAULT 'gray',
  created_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon_name text,
  category text,
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  requirement integer DEFAULT 1,
  points integer DEFAULT 0,
  color text DEFAULT 'gray',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_badges_active ON badges(is_active);
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);
CREATE INDEX IF NOT EXISTS idx_levels_points ON levels(points_required);

-- Enable RLS
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Levels are public
CREATE POLICY "Levels are public"
  ON levels
  FOR SELECT
  USING (true);

-- RLS Policies - Badges are public
CREATE POLICY "Badges are public"
  ON badges
  FOR SELECT
  USING (is_active = true);

-- Seed levels (0-9)
INSERT INTO levels (level_number, points_required, name, description, color)
VALUES
  (0, 0, 'Iniciante', 'Bem-vinda ao ZAYIA!', 'gray'),
  (1, 100, 'Guerreira', 'Primeira vitória conquistada', 'blue'),
  (2, 250, 'Pioneira', 'Você está no caminho certo', 'indigo'),
  (3, 500, 'Visionária', 'Sua dedicação brilha', 'purple'),
  (4, 1000, 'Liderança', 'Você é inspiração para outras', 'pink'),
  (5, 1500, 'Maestrina', 'Domínio e excelência', 'red'),
  (6, 2500, 'Rainha', 'Você conquistou tudo', 'orange'),
  (7, 3500, 'Divina', 'Você é lendária', 'yellow'),
  (8, 5000, 'Deusa', 'Símbolo supremo de poder', 'green'),
  (9, 7500, 'Infinita', 'Sem limites, sem fim', 'emerald')
ON CONFLICT (level_number) DO NOTHING;

-- Seed badges (sample set)
INSERT INTO badges (name, description, icon_name, category, rarity, requirement, points, color)
VALUES
  ('ovo', 'Completar 1 desafio', '🥚', 'milestone', 'common', 1, 10, 'blue'),
  ('saude_iniciante', 'Completar 5 desafios de saúde', '💪', 'health', 'uncommon', 5, 25, 'pink'),
  ('carreira_iniciante', 'Completar 5 desafios de carreira', '📚', 'career', 'uncommon', 5, 25, 'blue'),
  ('mindfulness_master', 'Completar 10 desafios de mindfulness', '🧘', 'mindfulness', 'rare', 10, 50, 'green'),
  ('digital_detox_warrior', 'Completar 10 desafios de digital detox', '📱', 'digital', 'rare', 10, 50, 'yellow'),
  ('todas_categorias', 'Completar desafios em todas as 8 categorias', '🌟', 'achievement', 'epic', 8, 100, 'purple'),
  ('50_desafios', 'Completar 50 desafios', '🎯', 'milestone', 'epic', 50, 150, 'orange'),
  ('100_desafios', 'Completar 100 desafios', '👑', 'milestone', 'legendary', 100, 250, 'red'),
  ('comunidade_amiga', 'Receber 10 reações em mensagens da comunidade', '❤️', 'community', 'uncommon', 10, 25, 'pink'),
  ('sem_falhas', 'Manter 7 dias consecutivos de atividade', '⚡', 'streak', 'rare', 7, 50, 'yellow'),
  ('30_dias', 'Manter 30 dias consecutivos de atividade', '🔥', 'streak', 'epic', 30, 150, 'orange'),
  ('mentalista', 'Completar 20 desafios de mindfulness', '🧠', 'mindfulness', 'epic', 20, 100, 'purple'),
  ('saude_expert', 'Completar 20 desafios de saúde', '🥇', 'health', 'rare', 20, 75, 'pink'),
  ('carreira_expert', 'Completar 20 desafios de carreira', '📊', 'career', 'rare', 20, 75, 'blue'),
  ('primeira_medalha', 'Desbloquear primeira medalha', '🏅', 'achievement', 'common', 1, 15, 'yellow')
ON CONFLICT (name) DO NOTHING;
