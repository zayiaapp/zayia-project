# 🔧 Corrigir Permissões - Company Info

Se você está recebendo erro ao tentar salvar os dados da empresa, siga estes passos:

## ⚠️ Problema Provável

As RLS policies podem estar muito restritivas ou com problemas de type casting.

## ✅ Solução Rápida

### 1. Acesse Supabase Dashboard
- Vá para [https://app.supabase.com](https://app.supabase.com)
- Selecione seu projeto

### 2. Abra SQL Editor
- Clique em **SQL Editor** (no menu da esquerda)
- Clique em **New Query**

### 3. Copie e Cole Este SQL

```sql
-- Dropar as policies antigas
DROP POLICY IF EXISTS "CEO can manage company info" ON company_info;
DROP POLICY IF EXISTS "Users can read company info" ON company_info;

-- Criar novas policies melhoradas
CREATE POLICY "CEO can manage company info"
  ON company_info
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'
  );

CREATE POLICY "Users can read company info"
  ON company_info
  FOR SELECT
  TO authenticated
  USING (true);

-- Permitir leitura pública (opcional)
CREATE POLICY "Public can read company info"
  ON company_info
  FOR SELECT
  TO anon
  USING (true);
```

### 4. Execute (Ctrl+Enter)
- Aguarde a execução
- Se executar sem erros, está correto ✅

### 5. Teste Novamente
1. Atualize o navegador (F5)
2. Vá para CEO Dashboard → Compliance → Editar Dados da Empresa
3. Mude um campo e clique Salvar
4. Deve funcionar agora! ✅

---

## 🔍 Se Ainda Não Funcionar

Execute este SQL de debug:

```sql
-- Verificar sua conta
SELECT id, email, role FROM profiles WHERE email = 'seu_email_ceo_aqui';

-- Verificar as policies criadas
SELECT policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'company_info';

-- Tentar inserir como teste
INSERT INTO company_info (company_name, cnpj, address, phone, email, website, dpo_email)
VALUES ('ZAYIA TEST', '00.000.000/0001-00', 'Rua Test', '(11) 0000-0000', 'test@zayia.com', 'https://zayia.com', 'dpo@zayia.com');

-- Se inseriu, deve retornar 1 linha:
SELECT COUNT(*) FROM company_info;
```

Copie o resultado e compartilhe comigo.

---

## 📊 Comparação

| Antes (Quebrado) | Depois (Funcionando) |
|---|---|
| `id::text = auth.uid()::text` | `(SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'` |
| Type casting complexo | Comparação simples |
| Pode falhar com UUIDs | Funciona confiável |

---

## ✅ Checklist

- [ ] Executei o SQL das policies no Supabase
- [ ] Atualizei o navegador (F5)
- [ ] Tentei editar e salvar novamente
- [ ] Agora funciona! 🎉
