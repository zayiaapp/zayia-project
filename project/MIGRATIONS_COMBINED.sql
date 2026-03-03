-- ============================================================================
-- ZAYIA BACKEND PHASE 1 - MIGRATIONS COMBINED
-- ============================================================================
-- Apply all three migrations in Supabase SQL Editor in order
-- Copy the entire content below and run in Supabase Dashboard
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Challenge Categories and Challenges
-- ============================================================================

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

CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category_id);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(is_active);

ALTER TABLE challenge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenge categories are public"
  ON challenge_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Challenges are public"
  ON challenges
  FOR SELECT
  USING (is_active = true);

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

INSERT INTO challenges (category_id, title, description, difficulty, points_easy, points_hard, duration_minutes)
SELECT
  c.id,
  'Caminhada de 30 minutos'::text,
  'Realize uma caminhada relaxante de 30 minutos e registre a experiência'::text,
  'facil'::text,
  10::integer,
  25::integer,
  30::integer
FROM challenge_categories c WHERE c.name = 'corpo_saude'::text
UNION ALL
SELECT
  c.id,
  'Exercício de força'::text,
  'Complete 20 minutos de exercício de força ou musculação'::text,
  'dificil'::text,
  10::integer,
  25::integer,
  20::integer
FROM challenge_categories c WHERE c.name = 'corpo_saude'::text
UNION ALL
SELECT
  c.id,
  'Refeição saudável'::text,
  'Prepare e coma uma refeição balanceada com legumes e proteína'::text,
  'facil'::text,
  10::integer,
  25::integer,
  45::integer
FROM challenge_categories c WHERE c.name = 'corpo_saude'::text
UNION ALL
SELECT
  c.id,
  'Atualizar LinkedIn'::text,
  'Melhore seu perfil profissional no LinkedIn com novas informações'::text,
  'facil'::text,
  10::integer,
  25::integer,
  20::integer
FROM challenge_categories c WHERE c.name = 'carreira'::text
UNION ALL
SELECT
  c.id,
  'Estudar nova habilidade'::text,
  'Dedique 1 hora estudando uma nova habilidade profissional'::text,
  'dificil'::text,
  10::integer,
  25::integer,
  60::integer
FROM challenge_categories c WHERE c.name = 'carreira'::text
UNION ALL
SELECT
  c.id,
  'Meditação guiada'::text,
  'Faça uma sessão de meditação guiada de 10 minutos'::text,
  'facil'::text,
  10::integer,
  25::integer,
  10::integer
FROM challenge_categories c WHERE c.name = 'mindfulness'::text
UNION ALL
SELECT
  c.id,
  'Dia sem redes sociais'::text,
  'Fique 24 horas sem acessar redes sociais'::text,
  'dificil'::text,
  10::integer,
  25::integer,
  1440::integer
FROM challenge_categories c WHERE c.name = 'digital_detox'::text
UNION ALL
SELECT
  c.id,
  'Refletir sobre metas'::text,
  'Escreva sobre seus objetivos pessoais para os próximos 3 meses'::text,
  'facil'::text,
  10::integer,
  25::integer,
  30::integer
FROM challenge_categories c WHERE c.name = 'autoestima'::text
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION 2: Badges and Levels
-- ============================================================================

CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL CHECK (level_number >= 0 AND level_number <= 99),
  points_required integer NOT NULL,
  name text,
  description text,
  color text DEFAULT 'gray',
  created_at timestamptz DEFAULT now()
);

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

CREATE INDEX IF NOT EXISTS idx_badges_active ON badges(is_active);
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);
CREATE INDEX IF NOT EXISTS idx_levels_points ON levels(points_required);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Levels are public"
  ON levels
  FOR SELECT
  USING (true);

CREATE POLICY "Badges are public"
  ON badges
  FOR SELECT
  USING (is_active = true);

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

-- ============================================================================
-- MIGRATION 3: User Earned Badges and RLS Policies
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_earned_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_earned_badges_user ON user_earned_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_badge ON user_earned_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_earned_at ON user_earned_badges(earned_at DESC);

ALTER TABLE user_earned_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own earned badges"
  ON user_earned_badges
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can see public profile badges"
  ON user_earned_badges
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_earned_badges.user_id
      AND (profiles.mentor_status = 'mentor' OR profiles.community_access = true)
    )
  );

CREATE POLICY "System can insert earned badges"
  ON user_earned_badges
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE OR REPLACE FUNCTION award_badge(user_id_param uuid, badge_name_param text)
RETURNS boolean AS $$
DECLARE
  badge_id_var uuid;
BEGIN
  SELECT id INTO badge_id_var FROM badges WHERE name = badge_name_param::text AND is_active = true;

  IF badge_id_var IS NULL THEN
    RAISE EXCEPTION 'Badge not found: %', badge_name_param;
  END IF;

  INSERT INTO user_earned_badges (user_id, badge_id)
  VALUES (user_id_param::uuid, badge_id_var::uuid)
  ON CONFLICT (user_id, badge_id) DO NOTHING;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_earned_badge_count(user_id_param uuid)
RETURNS integer AS $$
DECLARE
  count integer;
BEGIN
  SELECT COUNT(*)::integer INTO count
  FROM user_earned_badges
  WHERE user_id = user_id_param::uuid;

  RETURN COALESCE(count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_next_badge_progress(user_id_param uuid)
RETURNS TABLE(badge_name text, earned_count integer, requirement integer, progress_percent integer) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.name::text,
    (SELECT COUNT(*)::integer FROM user_earned_badges WHERE user_id = user_id_param::uuid AND badge_id = b.id)::integer as earned_count,
    b.requirement::integer,
    CASE
      WHEN b.requirement = 0 THEN 100::integer
      ELSE ((SELECT COUNT(*)::float FROM user_earned_badges WHERE user_id = user_id_param::uuid AND badge_id = b.id)::float / b.requirement::float * 100.0)::integer
    END as progress_percent
  FROM badges b
  WHERE b.is_active = true
  ORDER BY progress_percent DESC, b.rarity
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION award_badge TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_earned_badge_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_badge_progress TO authenticated;
GRANT EXECUTE ON FUNCTION award_badge TO service_role;
GRANT EXECUTE ON FUNCTION get_user_earned_badge_count TO service_role;
GRANT EXECUTE ON FUNCTION get_next_badge_progress TO service_role;

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- All tables, indexes, RLS policies, and seed data have been applied.
-- You can now use the challenge and badge functions in your application.
-- ============================================================================
