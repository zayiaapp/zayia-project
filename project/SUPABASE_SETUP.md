# Supabase Setup - Company Info Table

## 🔧 Como criar a tabela company_info no Supabase

Siga um destes métodos:

### Método 1: Via Console Supabase (SQL Editor)

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor** (lado esquerdo)
3. Clique em **New Query**
4. Copie e cole o SQL abaixo:

```sql
-- Create company_info table
CREATE TABLE IF NOT EXISTS company_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  cnpj text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  website text NOT NULL,
  dpo_name text,
  dpo_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Policy for CEO to read and update company info
CREATE POLICY "CEO can manage company info"
  ON company_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()::text
      AND role = 'ceo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()::text
      AND role = 'ceo'
    )
  );

-- Policy for authenticated users to read company info
CREATE POLICY "Users can read company info"
  ON company_info
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_company_info_created_at ON company_info(created_at);

-- Insert default data
INSERT INTO company_info (
  company_name, cnpj, address, phone, email, website, dpo_name, dpo_email
) VALUES (
  'ZAYIA LTDA',
  '00.000.000/0001-00',
  'Rua das Flores, 123, Vila Madalena',
  '(11) 3000-0000',
  'contato@zayia.com',
  'https://zayia.com',
  'Responsável LGPD',
  'privacidade@zayia.com'
) ON CONFLICT DO NOTHING;
```

5. Clique em **Run** (ou Ctrl+Enter)
6. ✅ Tabela criada com sucesso!

### Método 2: Via CLI (Supabase)

```bash
# Se tiver Supabase CLI instalado:
supabase db push
```

---

## ✨ O que acontece depois

1. **Tabela criada** com dados padrão da ZAYIA
2. **RLS policies** aplicadas (CEO pode editar, usuários podem ler)
3. **Sincronização automática**:
   - Admin edita em Compliance → salva no Supabase
   - User abre modal → carrega dados do Supabase em tempo real
4. **Fallback**: Se tabela não existir, usa dados do `compliance.json`

---

## 🔍 Verificar se funcionou

No console do Supabase:
1. Vá para **SQL Editor**
2. Execute:
```sql
SELECT * FROM company_info;
```

Deve retornar 1 linha com os dados da ZAYIA.

---

## 🔄 Sincronização em Tempo Real

- **Admin edita dados** em `CEO Dashboard → Compliance → Dados da Empresa → Editar`
- **User vê atualização** em `User Dashboard → ⚙️ Configurações → ℹ️ Sobre → Ver informações da empresa`
- Mudanças aparecem instantaneamente (sem refresh necessário)
