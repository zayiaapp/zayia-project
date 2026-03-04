/*
  # Initialize Community Rules

  Populate community_rules table with default rules.
  This replaces the mock data previously stored in CommunityDataMock.
*/

-- Insert default community rules (only if table is empty)
INSERT INTO community_rules (content, updated_by_admin, created_at, updated_at)
SELECT
  '# Regras da Comunidade ZAYIA

## 1. Respeito Mútuo
- Trate todos os membros com gentileza e respeito
- Não tolere assédio, discriminação ou bullying
- Celebre a diversidade

## 2. Comunicação Apropriada
- Mensagens claras e construtivas
- Sem spam, flood ou conteúdo repetitivo
- Evite ALL CAPS (parece que você está gritando)

## 3. Privacidade e Segurança
- Não compartilhe dados pessoais (telefone, CPF, etc)
- Não publique fotos sem consentimento
- Respeite a privacidade dos outros

## 4. Conteúdo Apropriado
- Sem conteúdo sexual ou ofensivo
- Sem links maliciosos
- Sem promoção de atividades ilegais

## 5. Violações e Consequências
- Primeira violação: Aviso
- Segunda violação: Ban de 1 dia
- Terceira violação: Ban de 7 dias
- Violações graves: Ban permanente

Dúvidas? Contate os administradores da comunidade.',
  (SELECT id FROM profiles WHERE role = ''ceo'' LIMIT 1),
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM community_rules LIMIT 1);
