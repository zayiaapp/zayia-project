-- Seed badges and levels from mock data
-- This migration is idempotent: safe to run multiple times

-- Insert levels if they don't exist
INSERT INTO public.levels (level_number, name, points_required, icon, color, description, bonus_points)
VALUES
  (0, 'Iniciante', 0, '🌱', '#D1D5DB', 'Você acaba de começar sua jornada!', 0),
  (1, 'Aprendiz', 2203, '📚', '#60A5FA', 'Primeiros passos dados!', 50),
  (2, 'Praticante', 4406, '🎯', '#06B6D4', 'Você está no caminho certo!', 75),
  (3, 'Especialista', 6609, '⭐', '#FBBF24', 'Você domina a prática!', 100),
  (4, 'Mestre', 8812, '🥇', '#FB923C', 'Você é um verdadeiro mestre!', 150),
  (5, 'Sábio', 11015, '🧠', '#A78BFA', 'A sabedoria guia seus passos!', 200),
  (6, 'Lenda', 13218, '👑', '#F87171', 'Você é uma lenda viva!', 250),
  (7, 'Imortal', 15421, '🔥', '#EC4899', 'Imortal na memória!', 300),
  (8, 'Divino', 17624, '✨', '#6366F1', 'Você é quase um deus!', 350),
  (9, 'Supremo', 22035, '💎', '#EC4899', 'O pico máximo da excelência!', 500)
ON CONFLICT DO NOTHING;

-- Insert badges if they don't exist
-- ROTINA & ORGANIZAÇÃO
INSERT INTO public.badges (badge_id, name, description, category, icon, points, rarity, color, requirement, is_active)
VALUES
  ('org_iniciante', 'Iniciante', '1º desafio de rotina & organização', 'Rotina & Organização', '📋', 25, 'common', '#3B82F6', '{"type": "category_completed", "category": "Rotina & Organização", "value": 1}', true),
  ('org_praticante', 'Praticante', '30 desafios de rotina & organização', 'Rotina & Organização', '📊', 100, 'uncommon', '#3B82F6', '{"type": "category_completed", "category": "Rotina & Organização", "value": 30}', true),
  ('org_mestre', 'Mestre', '90 desafios de rotina & organização', 'Rotina & Organização', '🎖️', 300, 'epic', '#3B82F6', '{"type": "category_completed", "category": "Rotina & Organização", "value": 90}', true),
  ('org_suprema', 'Suprema', '120 desafios de rotina & organização', 'Rotina & Organização', '👑', 500, 'legendary', '#3B82F6', '{"type": "category_completed", "category": "Rotina & Organização", "value": 120}', true),

-- RELACIONAMENTOS & COMUNICAÇÃO
  ('com_iniciante', 'Iniciante', '1º desafio de relacionamentos & comunicação', 'Relacionamentos & Comunicação', '💬', 25, 'common', '#EF4444', '{"type": "category_completed", "category": "Relacionamentos & Comunicação", "value": 1}', true),
  ('com_praticante', 'Praticante', '30 desafios de relacionamentos & comunicação', 'Relacionamentos & Comunicação', '🤝', 100, 'uncommon', '#EF4444', '{"type": "category_completed", "category": "Relacionamentos & Comunicação", "value": 30}', true),
  ('com_mestre', 'Mestre', '90 desafios de relacionamentos & comunicação', 'Relacionamentos & Comunicação', '❤️', 300, 'epic', '#EF4444', '{"type": "category_completed", "category": "Relacionamentos & Comunicação", "value": 90}', true),
  ('com_suprema', 'Suprema', '120 desafios de relacionamentos & comunicação', 'Relacionamentos & Comunicação', '💕', 500, 'legendary', '#EF4444', '{"type": "category_completed", "category": "Relacionamentos & Comunicação", "value": 120}', true),

-- MINDFULNESS & EMOÇÕES
  ('ie_iniciante', 'Iniciante', '1º desafio de mindfulness & emoções', 'Mindfulness & Emoções', '🧘', 25, 'common', '#10B981', '{"type": "category_completed", "category": "Mindfulness & Emoções", "value": 1}', true),
  ('ie_praticante', 'Praticante', '30 desafios de mindfulness & emoções', 'Mindfulness & Emoções', '🌿', 100, 'uncommon', '#10B981', '{"type": "category_completed", "category": "Mindfulness & Emoções", "value": 30}', true),
  ('ie_mestre', 'Mestre', '90 desafios de mindfulness & emoções', 'Mindfulness & Emoções', '☮️', 300, 'epic', '#10B981', '{"type": "category_completed", "category": "Mindfulness & Emoções", "value": 90}', true),
  ('ie_suprema', 'Suprema', '120 desafios de mindfulness & emoções', 'Mindfulness & Emoções', '🌸', 500, 'legendary', '#10B981', '{"type": "category_completed", "category": "Mindfulness & Emoções", "value": 120}', true),

-- CARREIRA E DESENVOLVIMENTO PROFISSIONAL
  ('lead_iniciante', 'Iniciante', '1º desafio de carreira & desenvolvimento profissional', 'Carreira e Desenvolvimento Profissional', '💼', 25, 'common', '#FBBF24', '{"type": "category_completed", "category": "Carreira e Desenvolvimento Profissional", "value": 1}', true),
  ('lead_praticante', 'Praticante', '30 desafios de carreira & desenvolvimento profissional', 'Carreira e Desenvolvimento Profissional', '📈', 100, 'uncommon', '#FBBF24', '{"type": "category_completed", "category": "Carreira e Desenvolvimento Profissional", "value": 30}', true),
  ('lead_mestre', 'Mestre', '90 desafios de carreira & desenvolvimento profissional', 'Carreira e Desenvolvimento Profissional', '🚀', 300, 'epic', '#FBBF24', '{"type": "category_completed", "category": "Carreira e Desenvolvimento Profissional", "value": 90}', true),
  ('lead_suprema', 'Suprema', '120 desafios de carreira & desenvolvimento profissional', 'Carreira e Desenvolvimento Profissional', '🌟', 500, 'legendary', '#FBBF24', '{"type": "category_completed", "category": "Carreira e Desenvolvimento Profissional", "value": 120}', true),

-- DIGITAL DETOX
  ('inov_iniciante', 'Iniciante', '1º desafio de digital detox', 'Digital Detox', '📱', 25, 'common', '#A78BFA', '{"type": "category_completed", "category": "Digital Detox", "value": 1}', true),
  ('inov_praticante', 'Praticante', '30 desafios de digital detox', 'Digital Detox', '🚫', 100, 'uncommon', '#A78BFA', '{"type": "category_completed", "category": "Digital Detox", "value": 30}', true),
  ('inov_mestre', 'Mestre', '90 desafios de digital detox', 'Digital Detox', '🔕', 300, 'epic', '#A78BFA', '{"type": "category_completed", "category": "Digital Detox", "value": 90}', true),
  ('inov_suprema', 'Suprema', '120 desafios de digital detox', 'Digital Detox', '⏰', 500, 'legendary', '#A78BFA', '{"type": "category_completed", "category": "Digital Detox", "value": 120}', true),

-- AUTOESTIMA & AUTOCUIDADO
  ('rot_iniciante', 'Iniciante', '1º desafio de autoestima & autocuidado', 'Autoestima & Autocuidado', '💅', 25, 'common', '#F97316', '{"type": "category_completed", "category": "Autoestima & Autocuidado", "value": 1}', true),
  ('rot_praticante', 'Praticante', '30 desafios de autoestima & autocuidado', 'Autoestima & Autocuidado', '✨', 100, 'uncommon', '#F97316', '{"type": "category_completed", "category": "Autoestima & Autocuidado", "value": 30}', true),
  ('rot_mestre', 'Mestre', '90 desafios de autoestima & autocuidado', 'Autoestima & Autocuidado', '👸', 300, 'epic', '#F97316', '{"type": "category_completed", "category": "Autoestima & Autocuidado", "value": 90}', true),
  ('rot_suprema', 'Suprema', '120 desafios de autoestima & autocuidado', 'Autoestima & Autocuidado', '👰', 500, 'legendary', '#F97316', '{"type": "category_completed", "category": "Autoestima & Autocuidado", "value": 120}', true),

-- CORPO & SAÚDE
  ('saude_iniciante', 'Iniciante', '1º desafio de corpo & saúde', 'Corpo & Saúde', '💪', 25, 'common', '#EC4899', '{"type": "category_completed", "category": "Corpo & Saúde", "value": 1}', true),
  ('saude_praticante', 'Praticante', '30 desafios de corpo & saúde', 'Corpo & Saúde', '🏃', 100, 'uncommon', '#EC4899', '{"type": "category_completed", "category": "Corpo & Saúde", "value": 30}', true),
  ('saude_mestre', 'Mestre', '90 desafios de corpo & saúde', 'Corpo & Saúde', '🏆', 300, 'epic', '#EC4899', '{"type": "category_completed", "category": "Corpo & Saúde", "value": 90}', true),
  ('saude_suprema', 'Suprema', '120 desafios de corpo & saúde', 'Corpo & Saúde', '🥇', 500, 'legendary', '#EC4899', '{"type": "category_completed", "category": "Corpo & Saúde", "value": 120}', true),

-- GLOBAL BADGES - BORBOLETA 🦋 (Metamorfose Transformacional)
  ('global_ovo', 'Ovo', '1º desafio qualquer', 'Global', '🥚', 10, 'common', '#D6E9FF', '{"type": "total_completed", "value": 1}', true),
  ('global_lagarta', 'Lagarta', '20 desafios no total', 'Global', '🐛', 50, 'common', '#BBF7D0', '{"type": "total_completed", "value": 20}', true),
  ('global_crisalida', 'Crisálida', '50 desafios no total', 'Global', '🛡️', 100, 'uncommon', '#FCD34D', '{"type": "total_completed", "value": 50}', true),
  ('global_borboleta_emergente', 'Borboleta Emergente', '100 desafios no total', 'Global', '🦋', 200, 'rare', '#EC4899', '{"type": "total_completed", "value": 100}', true),
  ('global_borboleta_radiante', 'Borboleta Radiante', '840 desafios no total', 'Global', '✨🦋', 500, 'legendary', '#FFD700', '{"type": "total_completed", "value": 840}', true)
ON CONFLICT DO NOTHING;
