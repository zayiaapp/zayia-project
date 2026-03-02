/*
  # Create quizz questions table

  1. New Tables
    - `quizz_questions`
      - `id` (uuid, primary key)
      - `question` (text)
      - `alternatives` (jsonb) - Array de alternativas
      - `category` (text)
      - `difficulty` (text)
      - `points` (integer, default 10)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `quizz_questions` table
    - Add policy for authenticated users to read active questions
    - Add policy for CEO to manage all questions
*/

CREATE TABLE IF NOT EXISTS quizz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  alternatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text DEFAULT 'geral',
  difficulty text DEFAULT 'medio' CHECK (difficulty IN ('facil', 'medio', 'dificil')),
  points integer DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quizz_questions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read active questions
CREATE POLICY "Users can read active quizz questions"
  ON quizz_questions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policy for CEO to read all questions
CREATE POLICY "CEO can read all quizz questions"
  ON quizz_questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to insert questions
CREATE POLICY "CEO can insert quizz questions"
  ON quizz_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to update questions
CREATE POLICY "CEO can update quizz questions"
  ON quizz_questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to delete questions
CREATE POLICY "CEO can delete quizz questions"
  ON quizz_questions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quizz_questions_updated_at
  BEFORE UPDATE ON quizz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_quizz_questions_active ON quizz_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_quizz_questions_category ON quizz_questions(category);

-- Insert the 21 initial questions
INSERT INTO quizz_questions (question, alternatives, category, difficulty, points) VALUES
(
  'Quais são seus principais objetivos para os próximos 6 meses?',
  '[
    {"id": "a", "text": "Construir uma rotina mais saudável e produtiva", "is_correct": false},
    {"id": "b", "text": "Melhorar minha autoestima e equilíbrio emocional", "is_correct": false},
    {"id": "c", "text": "Alcançar metas profissionais ou financeiras", "is_correct": false},
    {"id": "d", "text": "Fortalecer meus relacionamentos pessoais e afetivos", "is_correct": false}
  ]'::jsonb,
  'objetivos',
  'medio',
  10
),
(
  'Qual área da sua vida mais precisa de mudança?',
  '[
    {"id": "a", "text": "Minha disciplina e constância nas tarefas", "is_correct": false},
    {"id": "b", "text": "Meu bem-estar emocional e autocuidado", "is_correct": false},
    {"id": "c", "text": "Minha vida profissional e financeira", "is_correct": false},
    {"id": "d", "text": "Meus relacionamentos e conexões sociais", "is_correct": false}
  ]'::jsonb,
  'autoconhecimento',
  'medio',
  10
),
(
  'Quais desafios você enfrenta no dia a dia?',
  '[
    {"id": "a", "text": "Falta de foco e organização", "is_correct": false},
    {"id": "b", "text": "Dificuldade em manter uma rotina consistente", "is_correct": false},
    {"id": "c", "text": "Emoções instáveis que afetam minha produtividade", "is_correct": false},
    {"id": "d", "text": "Falta de apoio ou compreensão das pessoas ao redor", "is_correct": false}
  ]'::jsonb,
  'desafios',
  'medio',
  10
),
(
  'O que mais drena sua motivação?',
  '[
    {"id": "a", "text": "Sentir que estou sempre atrasada com tudo", "is_correct": false},
    {"id": "b", "text": "Perceber que não estou evoluindo como gostaria", "is_correct": false},
    {"id": "c", "text": "Me comparar com outras pessoas o tempo todo", "is_correct": false},
    {"id": "d", "text": "Viver no automático, sem propósito claro", "is_correct": false}
  ]'::jsonb,
  'motivacao',
  'medio',
  10
),
(
  'Como organiza sua rotina diária?',
  '[
    {"id": "a", "text": "Anoto tudo e sigo um planejamento", "is_correct": false},
    {"id": "b", "text": "Tenho uma lista mental do que preciso fazer", "is_correct": false},
    {"id": "c", "text": "Vou fazendo conforme o que aparece", "is_correct": false},
    {"id": "d", "text": "Sinto que minha rotina está completamente desorganizada", "is_correct": false}
  ]'::jsonb,
  'rotina',
  'facil',
  10
),
(
  'Que estratégias já tentou aplicar?',
  '[
    {"id": "a", "text": "Listas de tarefas e planners", "is_correct": false},
    {"id": "b", "text": "Técnicas de produtividade (como Pomodoro, por exemplo)", "is_correct": false},
    {"id": "c", "text": "Bloquear distrações (celular, redes, etc.)", "is_correct": false},
    {"id": "d", "text": "Ainda não encontrei algo que realmente funcione pra mim", "is_correct": false}
  ]'::jsonb,
  'estrategias',
  'medio',
  10
),
(
  'De 0 a 10, como está sua motivação?',
  '[
    {"id": "a", "text": "Baixíssima (0 a 3) – Estou sem energia, sem direção", "is_correct": false},
    {"id": "b", "text": "Instável (4 a 6) – Tem dias bons, outros péssimos", "is_correct": false},
    {"id": "c", "text": "Razoável (7 a 8) – Consigo manter, mas oscila", "is_correct": false},
    {"id": "d", "text": "Alta (9 a 10) – Estou focada e engajada comigo mesma", "is_correct": false}
  ]'::jsonb,
  'motivacao',
  'facil',
  10
),
(
  'Quais sentimentos têm sido frequentes?',
  '[
    {"id": "a", "text": "Ansiedade, comparação e cobrança interna", "is_correct": false},
    {"id": "b", "text": "Tristeza, sensação de estagnação", "is_correct": false},
    {"id": "c", "text": "Motivação com medo de regredir", "is_correct": false},
    {"id": "d", "text": "Esperança e desejo real de mudança", "is_correct": false}
  ]'::jsonb,
  'emocoes',
  'medio',
  10
),
(
  'Você se sente apoiada pelas pessoas ao seu redor?',
  '[
    {"id": "a", "text": "Sim, tenho pessoas que me fortalecem", "is_correct": false},
    {"id": "b", "text": "Às vezes, mas não posso contar sempre", "is_correct": false},
    {"id": "c", "text": "Sinto que as pessoas não me entendem", "is_correct": false},
    {"id": "d", "text": "Me sinto sozinha, mesmo estando cercada", "is_correct": false}
  ]'::jsonb,
  'relacionamentos',
  'medio',
  10
),
(
  'Você se sente realizada profissionalmente?',
  '[
    {"id": "a", "text": "Sim, faço o que amo e me sinto reconhecida", "is_correct": false},
    {"id": "b", "text": "Em partes, ainda falta sentido ou motivação", "is_correct": false},
    {"id": "c", "text": "Não, mas tô tentando mudar isso", "is_correct": false},
    {"id": "d", "text": "Não mesmo, me sinto presa e frustrada", "is_correct": false}
  ]'::jsonb,
  'carreira',
  'medio',
  10
),
(
  'Como você avalia hoje sua disposição física?',
  '[
    {"id": "a", "text": "Me sinto com energia pra fazer o que preciso", "is_correct": false},
    {"id": "b", "text": "Oscila bastante ao longo da semana", "is_correct": false},
    {"id": "c", "text": "Ando cansada quase todos os dias", "is_correct": false},
    {"id": "d", "text": "Me sinto exausta até pra coisas simples", "is_correct": false}
  ]'::jsonb,
  'saude',
  'facil',
  10
),
(
  'Qual sua idade?',
  '[
    {"id": "a", "text": "Menos de 25 anos", "is_correct": false},
    {"id": "b", "text": "Entre 25 e 34 anos", "is_correct": false},
    {"id": "c", "text": "Entre 35 e 45 anos", "is_correct": false},
    {"id": "d", "text": "Mais de 45 anos", "is_correct": false}
  ]'::jsonb,
  'demografico',
  'facil',
  10
),
(
  'Você ainda menstrua?',
  '[
    {"id": "a", "text": "Sim, regularmente", "is_correct": false},
    {"id": "b", "text": "Sim, mas de forma irregular", "is_correct": false},
    {"id": "c", "text": "Não menstrua mais (menopausa)", "is_correct": false},
    {"id": "d", "text": "Nunca menstruei ou outro motivo médico", "is_correct": false}
  ]'::jsonb,
  'demografico',
  'facil',
  10
),
(
  'Como você se enxerga hoje?',
  '[
    {"id": "a", "text": "Uma mulher forte, mas cansada", "is_correct": false},
    {"id": "b", "text": "Uma versão apagada de mim mesma", "is_correct": false},
    {"id": "c", "text": "Ainda tô tentando me reconhecer", "is_correct": false},
    {"id": "d", "text": "Não gosto da mulher que vejo no espelho", "is_correct": false}
  ]'::jsonb,
  'autoestima',
  'medio',
  10
),
(
  'Você se sente culpada quando descansa?',
  '[
    {"id": "a", "text": "Sim, quase sempre", "is_correct": false},
    {"id": "b", "text": "Um pouco, mas tento ignorar", "is_correct": false},
    {"id": "c", "text": "Só quando tenho muita coisa pendente", "is_correct": false},
    {"id": "d", "text": "Não, descanso é necessário", "is_correct": false}
  ]'::jsonb,
  'autocuidado',
  'medio',
  10
),
(
  'Quando tá ansiosa ou triste, você costuma...',
  '[
    {"id": "a", "text": "Ir pras redes sociais", "is_correct": false},
    {"id": "b", "text": "Comer algo que gosta", "is_correct": false},
    {"id": "c", "text": "Se isolar e ficar em silêncio", "is_correct": false},
    {"id": "d", "text": "Trabalhar ou se ocupar com tarefas", "is_correct": false}
  ]'::jsonb,
  'emocoes',
  'medio',
  10
),
(
  'Qual aplicativo mais consome seu tempo hoje?',
  '[
    {"id": "a", "text": "Instagram ou TikTok", "is_correct": false},
    {"id": "b", "text": "WhatsApp ou YouTube", "is_correct": false},
    {"id": "c", "text": "Netflix / séries", "is_correct": false},
    {"id": "d", "text": "Jogos ou outro app de distração", "is_correct": false}
  ]'::jsonb,
  'digital',
  'facil',
  10
),
(
  'Teve algum momento recente que te fez querer mudar?',
  '[
    {"id": "a", "text": "Sim, um rompimento ou perda", "is_correct": false},
    {"id": "b", "text": "Um dia comum que virou meu limite", "is_correct": false},
    {"id": "c", "text": "Uma crise de ansiedade ou burnout", "is_correct": false},
    {"id": "d", "text": "Ainda tô esperando esse estalo", "is_correct": false}
  ]'::jsonb,
  'transformacao',
  'medio',
  10
),
(
  'Se nada mudar nos próximos 6 meses...',
  '[
    {"id": "a", "text": "Vou continuar me sabotando", "is_correct": false},
    {"id": "b", "text": "Vou perder coisas importantes", "is_correct": false},
    {"id": "c", "text": "Vou adoecer emocionalmente", "is_correct": false},
    {"id": "d", "text": "Não quero nem imaginar isso", "is_correct": false}
  ]'::jsonb,
  'futuro',
  'dificil',
  10
),
(
  'Prefere um plano mais...',
  '[
    {"id": "a", "text": "Direto e desafiador", "is_correct": false},
    {"id": "b", "text": "Leve e acolhedor", "is_correct": false},
    {"id": "c", "text": "Misto: apoio e firmeza", "is_correct": false},
    {"id": "d", "text": "Quero testar e ver na prática", "is_correct": false}
  ]'::jsonb,
  'preferencias',
  'facil',
  10
),
(
  'Qual dessas áreas você quer focar primeiro no app?',
  '[
    {"id": "a", "text": "Rotina & Organização", "is_correct": false},
    {"id": "b", "text": "Corpo & Saúde", "is_correct": false},
    {"id": "c", "text": "Mindfulness & Emoções", "is_correct": false},
    {"id": "d", "text": "Relacionamentos & Comunicação", "is_correct": false},
    {"id": "e", "text": "Autoestima & Autocuidado", "is_correct": false},
    {"id": "f", "text": "Carreira & Desenvolvimento Profissional", "is_correct": false},
    {"id": "g", "text": "Digital Detox", "is_correct": false}
  ]'::jsonb,
  'foco',
  'facil',
  10
);