-- =============================================================
-- Fix badges table, user_earned_badges, and levels
-- Seeds all 33 category/global badges and 10 levels
-- =============================================================

-- ============================================================
-- PART 1: Fix badges table
-- ============================================================

-- Add missing columns (safe if already exist)
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS badge_id    TEXT;
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS icon        TEXT;
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS color       TEXT;
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT now();

-- Drop name uniqueness (names repeat across categories e.g. 'Iniciante' × 7)
ALTER TABLE public.badges DROP CONSTRAINT IF EXISTS badges_name_key;
ALTER TABLE public.badges DROP CONSTRAINT IF EXISTS badges_badge_id_unique;

-- Clear all existing data (was empty / wrong schema anyway)
-- CASCADE also clears user_earned_badges rows (there are none since seed never ran)
TRUNCATE public.badges CASCADE;

-- badge_id is now the primary semantic key
ALTER TABLE public.badges ALTER COLUMN badge_id SET NOT NULL;
ALTER TABLE public.badges ADD CONSTRAINT badges_badge_id_unique UNIQUE (badge_id);

-- Seed 33 badges (requirement stored as INTEGER)
INSERT INTO public.badges (badge_id, name, description, category, icon, points, rarity, color, requirement, is_active)
VALUES
  -- ROTINA & ORGANIZAÇÃO (4)
  ('org_iniciante',   'Iniciante',  '1º desafio de rotina & organização',            'Rotina & Organização',                    '📋',  25,  'common',    '#3B82F6', 1,   true),
  ('org_praticante',  'Praticante', '30 desafios de rotina & organização',            'Rotina & Organização',                    '📊',  100, 'uncommon',  '#3B82F6', 30,  true),
  ('org_mestre',      'Mestre',     '90 desafios de rotina & organização',            'Rotina & Organização',                    '🎖️', 300, 'epic',      '#3B82F6', 90,  true),
  ('org_suprema',     'Suprema',    '120 desafios de rotina & organização',           'Rotina & Organização',                    '👑',  500, 'legendary', '#3B82F6', 120, true),

  -- RELACIONAMENTOS & COMUNICAÇÃO (4)
  ('com_iniciante',   'Iniciante',  '1º desafio de relacionamentos & comunicação',    'Relacionamentos & Comunicação',           '💬',  25,  'common',    '#EF4444', 1,   true),
  ('com_praticante',  'Praticante', '30 desafios de relacionamentos & comunicação',   'Relacionamentos & Comunicação',           '🤝',  100, 'uncommon',  '#EF4444', 30,  true),
  ('com_mestre',      'Mestre',     '90 desafios de relacionamentos & comunicação',   'Relacionamentos & Comunicação',           '❤️',  300, 'epic',      '#EF4444', 90,  true),
  ('com_suprema',     'Suprema',    '120 desafios de relacionamentos & comunicação',  'Relacionamentos & Comunicação',           '💕',  500, 'legendary', '#EF4444', 120, true),

  -- MINDFULNESS & EMOÇÕES (4)
  ('ie_iniciante',    'Iniciante',  '1º desafio de mindfulness & emoções',            'Mindfulness & Emoções',                   '🧘',  25,  'common',    '#10B981', 1,   true),
  ('ie_praticante',   'Praticante', '30 desafios de mindfulness & emoções',           'Mindfulness & Emoções',                   '🌿',  100, 'uncommon',  '#10B981', 30,  true),
  ('ie_mestre',       'Mestre',     '90 desafios de mindfulness & emoções',           'Mindfulness & Emoções',                   '☮️',  300, 'epic',      '#10B981', 90,  true),
  ('ie_suprema',      'Suprema',    '120 desafios de mindfulness & emoções',          'Mindfulness & Emoções',                   '🌸',  500, 'legendary', '#10B981', 120, true),

  -- CARREIRA E DESENVOLVIMENTO PROFISSIONAL (4)
  ('lead_iniciante',  'Iniciante',  '1º desafio de carreira & desenvolvimento',       'Carreira e Desenvolvimento Profissional', '💼',  25,  'common',    '#FBBF24', 1,   true),
  ('lead_praticante', 'Praticante', '30 desafios de carreira & desenvolvimento',      'Carreira e Desenvolvimento Profissional', '📈',  100, 'uncommon',  '#FBBF24', 30,  true),
  ('lead_mestre',     'Mestre',     '90 desafios de carreira & desenvolvimento',      'Carreira e Desenvolvimento Profissional', '🚀',  300, 'epic',      '#FBBF24', 90,  true),
  ('lead_suprema',    'Suprema',    '120 desafios de carreira & desenvolvimento',     'Carreira e Desenvolvimento Profissional', '🌟',  500, 'legendary', '#FBBF24', 120, true),

  -- DIGITAL DETOX (4)
  ('inov_iniciante',  'Iniciante',  '1º desafio de digital detox',                   'Digital Detox',                           '📱',  25,  'common',    '#A78BFA', 1,   true),
  ('inov_praticante', 'Praticante', '30 desafios de digital detox',                  'Digital Detox',                           '🚫',  100, 'uncommon',  '#A78BFA', 30,  true),
  ('inov_mestre',     'Mestre',     '90 desafios de digital detox',                  'Digital Detox',                           '🔕',  300, 'epic',      '#A78BFA', 90,  true),
  ('inov_suprema',    'Suprema',    '120 desafios de digital detox',                 'Digital Detox',                           '⏰',  500, 'legendary', '#A78BFA', 120, true),

  -- AUTOESTIMA & AUTOCUIDADO (4)
  ('rot_iniciante',   'Iniciante',  '1º desafio de autoestima & autocuidado',         'Autoestima & Autocuidado',                '💅',  25,  'common',    '#F97316', 1,   true),
  ('rot_praticante',  'Praticante', '30 desafios de autoestima & autocuidado',        'Autoestima & Autocuidado',                '✨',  100, 'uncommon',  '#F97316', 30,  true),
  ('rot_mestre',      'Mestre',     '90 desafios de autoestima & autocuidado',        'Autoestima & Autocuidado',                '👸',  300, 'epic',      '#F97316', 90,  true),
  ('rot_suprema',     'Suprema',    '120 desafios de autoestima & autocuidado',       'Autoestima & Autocuidado',                '👰',  500, 'legendary', '#F97316', 120, true),

  -- CORPO & SAÚDE (4)
  ('saude_iniciante',  'Iniciante',  '1º desafio de corpo & saúde',                  'Corpo & Saúde',                           '💪',  25,  'common',    '#EC4899', 1,   true),
  ('saude_praticante', 'Praticante', '30 desafios de corpo & saúde',                 'Corpo & Saúde',                           '🏃',  100, 'uncommon',  '#EC4899', 30,  true),
  ('saude_mestre',     'Mestre',     '90 desafios de corpo & saúde',                 'Corpo & Saúde',                           '🏆',  300, 'epic',      '#EC4899', 90,  true),
  ('saude_suprema',    'Suprema',    '120 desafios de corpo & saúde',                'Corpo & Saúde',                           '🥇',  500, 'legendary', '#EC4899', 120, true),

  -- GLOBAIS — Metamorfose Borboleta (5)
  ('global_ovo',                  'Ovo',                 '1º desafio qualquer',    'Global', '🥚', 10,  'common',    '#D6E9FF', 1,   true),
  ('global_lagarta',              'Lagarta',             '20 desafios no total',   'Global', '🐛', 50,  'common',    '#BBF7D0', 20,  true),
  ('global_crisalida',            'Crisálida',           '50 desafios no total',   'Global', '🛡️',100, 'uncommon',  '#FCD34D', 50,  true),
  ('global_borboleta_emergente',  'Borboleta Emergente', '100 desafios no total',  'Global', '🦋', 200, 'rare',      '#EC4899', 100, true),
  ('global_borboleta_radiante',   'Borboleta Radiante',  '840 desafios no total',  'Global', '✨', 500, 'legendary', '#FFD700', 840, true)
ON CONFLICT (badge_id) DO NOTHING;

-- ============================================================
-- PART 2: Fix user_earned_badges — store text badge_id
-- ============================================================

-- Drop FK (badge_id was UUID FK to badges.id — incompatible with text IDs)
ALTER TABLE public.user_earned_badges
  DROP CONSTRAINT IF EXISTS user_earned_badges_badge_id_fkey;

-- Drop old unique constraint
ALTER TABLE public.user_earned_badges
  DROP CONSTRAINT IF EXISTS user_earned_badges_user_id_badge_id_key;

-- Change badge_id column from UUID to TEXT
ALTER TABLE public.user_earned_badges
  ALTER COLUMN badge_id TYPE TEXT USING badge_id::TEXT;

-- Restore unique constraint (user_id + badge_id text)
ALTER TABLE public.user_earned_badges
  ADD CONSTRAINT user_earned_badges_user_badge_unique UNIQUE (user_id, badge_id);

-- ============================================================
-- PART 3: Fix levels table
-- ============================================================

ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS icon        TEXT;
ALTER TABLE public.levels ADD COLUMN IF NOT EXISTS bonus_points INTEGER DEFAULT 0;

-- Upsert all 10 levels
INSERT INTO public.levels (level_number, name, points_required, icon, color, description, bonus_points)
VALUES
  (0, 'Iniciante',   0,     '🌱', '#D1D5DB', 'Você acaba de começar sua jornada!',  0),
  (1, 'Aprendiz',    2203,  '📚', '#60A5FA', 'Primeiros passos dados!',             50),
  (2, 'Praticante',  4406,  '🎯', '#06B6D4', 'Você está no caminho certo!',         75),
  (3, 'Especialista',6609,  '⭐', '#FBBF24', 'Você domina a prática!',              100),
  (4, 'Mestre',      8812,  '🥇', '#FB923C', 'Você é um verdadeiro mestre!',        150),
  (5, 'Sábio',       11015, '🧠', '#A78BFA', 'A sabedoria guia seus passos!',       200),
  (6, 'Lenda',       13218, '👑', '#F87171', 'Você é uma lenda viva!',              250),
  (7, 'Imortal',     15421, '🔥', '#EC4899', 'Imortal na memória!',                 300),
  (8, 'Divino',      17624, '✨', '#6366F1', 'Você é quase um deus!',               350),
  (9, 'Supremo',     22035, '💎', '#EC4899', 'O pico máximo da excelência!',        500)
ON CONFLICT (level_number) DO UPDATE SET
  name           = EXCLUDED.name,
  points_required= EXCLUDED.points_required,
  icon           = EXCLUDED.icon,
  color          = EXCLUDED.color,
  description    = EXCLUDED.description,
  bonus_points   = EXCLUDED.bonus_points;
