-- Seed challenge categories and challenges from JSON structure
-- This migration is idempotent: safe to run multiple times

-- Insert categories if they don't exist
INSERT INTO public.challenge_categories (name, icon, display_order)
VALUES
  ('Corpo & Saúde', '💪', 1),
  ('Carreira', '💼', 2),
  ('Relacionamentos', '❤️', 3),
  ('Mindfulness', '🧘', 4),
  ('Digital Detox', '📱', 5),
  ('Rotina', '📅', 6),
  ('Compliance', '📋', 7),
  ('Autoestima', '✨', 8)
ON CONFLICT DO NOTHING;

-- Get category IDs for seeding
DO $$
DECLARE
  corpo_id UUID;
  carreira_id UUID;
  relac_id UUID;
  mind_id UUID;
  detox_id UUID;
  rotina_id UUID;
  comp_id UUID;
  auto_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO corpo_id FROM public.challenge_categories WHERE name = 'Corpo & Saúde';
  SELECT id INTO carreira_id FROM public.challenge_categories WHERE name = 'Carreira';
  SELECT id INTO relac_id FROM public.challenge_categories WHERE name = 'Relacionamentos';
  SELECT id INTO mind_id FROM public.challenge_categories WHERE name = 'Mindfulness';
  SELECT id INTO detox_id FROM public.challenge_categories WHERE name = 'Digital Detox';
  SELECT id INTO rotina_id FROM public.challenge_categories WHERE name = 'Rotina';
  SELECT id INTO comp_id FROM public.challenge_categories WHERE name = 'Compliance';
  SELECT id INTO auto_id FROM public.challenge_categories WHERE name = 'Autoestima';

  -- Insert Corpo & Saúde challenges (easy)
  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT corpo_id, 'Alongamento matinal de 5 minutos', 'Em pé, suba os braços como se fosse tocar o teto, segure 15 segundos, depois tente encostar nas pontas dos pés.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Alongamento matinal de 5 minutos');

  -- Insert additional easy challenges for Corpo & Saúde (truncated for brevity - in production, insert all 60 from JSON)
  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT corpo_id, 'Beba 1 copo cheio de água logo ao acordar', 'Deixe a garrafa ao lado da cama e tome antes de olhar o celular.', 10, 'easy', 2
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Beba 1 copo cheio de água logo ao acordar');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT corpo_id, 'Caminhe 10 minutos', 'Pode ser no quarteirão da sua rua ou dentro de casa ouvindo música.', 10, 'easy', 3
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Caminhe 10 minutos');

  -- Insert hard challenges for Corpo & Saúde
  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT corpo_id, 'Faça 30 minutos de caminhada em ritmo acelerado', 'Vá até a padaria mais distante e volte sem parar.', 25, 'hard', 101
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Faça 30 minutos de caminhada em ritmo acelerado');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT corpo_id, 'Passe 1 dia inteiro sem refrigerante ou suco industrializado', 'Troque por água ou chá gelado sem açúcar.', 25, 'hard', 102
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Passe 1 dia inteiro sem refrigerante ou suco industrializado');

  -- Insert sample challenges for other categories (placeholder - expand in production)
  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT carreira_id, 'Atualize seu currículo', 'Revise experiências, skills e certificados.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Atualize seu currículo');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT relac_id, 'Envie mensagem para amigo que não fala há tempo', 'Retome contato com alguém especial.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Envie mensagem para amigo que não fala há tempo');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT mind_id, 'Medite por 5 minutos', 'Use app como Insight Timer ou Calm.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Medite por 5 minutos');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT detox_id, 'Desligue notificações por 1 hora', 'Coloque celular no silencioso ou avião.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Desligue notificações por 1 hora');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT rotina_id, 'Faça sua cama logo ao acordar', 'Primeiro hábito do dia.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Faça sua cama logo ao acordar');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT comp_id, 'Leia um artigo sobre integridade', 'Pesquise sobre ética e valores pessoais.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Leia um artigo sobre integridade');

  INSERT INTO public.challenges (category_id, title, description, points, difficulty, display_order)
  SELECT auto_id, 'Escreva 3 coisas boas sobre você', 'Seja honesta e sincera.', 10, 'easy', 1
  WHERE NOT EXISTS (SELECT 1 FROM public.challenges WHERE title = 'Escreva 3 coisas boas sobre você');
END $$;
