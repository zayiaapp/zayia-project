# 🧪 Teste de Sincronização - Company Info

## Como testar a sincronização entre Admin e User

### ✅ Setup Inicial

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Abra 2 abas do navegador:**
   - Aba 1: Admin (CEO Dashboard)
   - Aba 2: User (User Dashboard)

---

## 🔄 Teste 1: Sincronização em Tempo Real

### Admin (Aba 1):
1. Vá para **CEO Dashboard**
2. Role até **⚖️ Compliance Legal**
3. Procure **🏢 Dados da Empresa**
4. Clique no botão **Editar**
5. Modifique **1 campo** (exemplo: Razão Social)
   - De: `ZAYIA LTDA`
   - Para: `ZAYIA COACHING LTDA`
6. Clique **Salvar Alterações**
7. **Aguarde 2-3 segundos** para a sincronização

### User (Aba 2):
1. Vá para **User Dashboard**
2. Clique em ⚙️ **Configurações**
3. Procure seção **ℹ️ Sobre**
4. Clique em **Ver informações da empresa**
5. ✅ **Verifique se mudou para:** `ZAYIA COACHING LTDA`

---

## 🔄 Teste 2: Múltiplos Campos

### Admin (Aba 1):
1. Clique **Editar** novamente
2. Modifique **3 campos:**
   - Razão Social: `ZAYIA COACHING LTDA` → `ZAYIA ACADEMY`
   - Telefone: `(11) 3000-0000` → `(11) 9999-9999`
   - Email: `contato@zayia.com` → `suporte@zayia.com`
3. Clique **Salvar Alterações**

### User (Aba 2):
1. O modal **já deve estar aberto** (não feche)
2. Verifique se todos os 3 campos foram atualizados
   - Se não tiver atualizado automaticamente:
     - Clique no botão **🔄 Atualizar** (ícone de refresh)
     - Os dados devem carregar em segundos

---

## 🔄 Teste 3: Fechamento e Reabertura

### Admin (Aba 1):
1. Edite qualquer campo
2. Salve as alterações

### User (Aba 2):
1. **Feche o modal** (clique em X)
2. **Aguarde 5 segundos**
3. Abra novamente: **ℹ️ Sobre → Ver informações da empresa**
4. ✅ Dados devem estar atualizados

---

## 🔍 Verificação no Console

Abra o **Console do Navegador** (F12) para ver os logs de sincronização:

### Esperado no console:
```
Fetching company info from Supabase...
Supabase response: { data: {...}, error: null }
Company info loaded from Supabase: {...}
Setting up real-time subscription for company_info
Subscription status: SUBSCRIBED
Real-time update received: {event: 'UPDATE', new: {...}}
```

---

## 🚨 Se Não Estiver Funcionando

### 1. Verificar se tabela foi criada:
- Acesse [Supabase Console](https://app.supabase.com)
- Vá para **SQL Editor**
- Execute:
  ```sql
  SELECT * FROM company_info LIMIT 1;
  ```
- Deve retornar 1 linha de dados

### 2. Verificar logs no Console (F12):
- Procure por erros como:
  - `Error fetching company info:`
  - `Supabase query error:`
- Se houver erro, copie e compartilhe

### 3. Testar Refresh Manual:
- Clique no botão **🔄** no modal
- Deve recarregar os dados em segundos

### 4. Verificar localStorage:
- Abra DevTools (F12) → Application → Local Storage
- Procure por `zayia_compliance_data`
- Se existir, os dados antigos estão lá (pode deletar para limpar)

---

## 📊 Resumo da Sincronização

| Etapa | O que acontece |
|-------|---|
| Admin edita campos | Salva em Supabase ✅ |
| Real-time subscription ativa | Envia notificação para User |
| User recebe atualização | Refetch dos dados |
| Modal exibe novos dados | ✅ User vê mudanças |
| 30s polling (fallback) | Se real-time falhar, refetch automático |
| User clica 🔄 | Atualiza manualmente |

---

## ✅ Checklist Final

- [ ] Admin consegue editar Dados da Empresa
- [ ] Admin consegue salvar alterações (sem erros)
- [ ] User vê dados atualizados no modal
- [ ] Dados sincronizam em menos de 5 segundos
- [ ] Botão de refresh funciona
- [ ] Console não mostra erros críticos
