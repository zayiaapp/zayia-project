# 🧪 Guia de Testes - Sistema de Comunidade ZAYIA

**Data:** 2026-02-25
**Status:** MVP Completo - Aguardando Testes
**Arquivos:** 1 dados mock + 6 sub-components + 1 container principal

---

## 📋 O QUE FOI IMPLEMENTADO

### ✅ Camada de Dados
- **community-data-mock.ts** (243 linhas)
  - Mock de mensagens, reações, bans, regras em localStorage
  - Sincronização manual a cada 3 segundos
  - Sistema de escalação de bans (1º/2º/3º)
  - Histórico de deletions e bans

### ✅ Componentes (6 sub-components)
1. **ReactionButtons.tsx** - Emojis com contador (😍, 🔥, 💪, 🙌, ❤️)
2. **Message.tsx** - Display de mensagem com @mentions highlightadas
3. **MessageInput.tsx** - Input + botão enviar com validação
4. **RulesModal.tsx** - Modal para ler/editar regras (admin only)
5. **UserBanPanel.tsx** - Painel à direita com histórico e opção de ban
6. **DeleteMessageModal.tsx** - Modal de confirmação de delete

### ✅ Container Principal
- **CommunitySection.tsx** - Orquestra tudo
  - Header com contador de mensagens
  - Botão "Regras"
  - Aviso se usuária está banida
  - Lista de mensagens scrollável
  - Input de mensagem
  - Painel admin à direita (apenas para CEO)

---

## 🚀 COMO TESTAR

### PASSO 1: Iniciar o servidor
```bash
cd /home/isaias/zayia-project/project
npm run dev
# Abre em http://localhost:5173/
```

### PASSO 2: Login (2 abas)

**Aba 1 - Usuária Comum:**
```
Email:   user@zayia.com
Senha:   demo2024
Função:  Ver mensagens, enviar, reagir, mencionar
```

**Aba 2 - Admin (CEO):**
```
Email:   ceo@zayia.com
Senha:   zayia2024
Função:  Tudo + editar regras, deletar, banir
```

### PASSO 3: Navegar até "Comunidade"
- Ambas abas devem mostrar a mesma comunidade
- Sincroniza a cada 3 segundos (atualize com F5 se quiser mais rápido)

---

## ✅ TESTES A FAZER

### TESTE 1: Enviar Mensagem
- [ ] **Usuária 1:** Digite na caixa de input: "Oi meninas!"
- [ ] **Usuária 1:** Clique "Enviar"
- [ ] **Resultado:** Mensagem aparece no topo da lista
- [ ] **Usuária 2:** Vê a mensagem em 3 segundos

### TESTE 2: Reações com Emojis
- [ ] **Usuária 1:** Clique "+" em uma mensagem
- [ ] **Popup:** Mostra 5 emojis (😍, 🔥, 💪, 🙌, ❤️)
- [ ] **Usuária 1:** Clique em um emoji (ex: 💪)
- [ ] **Resultado:** Badge com "💪 1" aparece abaixo da mensagem
- [ ] **Usuária 2:** Vê a reação em 3 segundos
- [ ] **Usuária 1:** Clique novamente no emoji para remover
- [ ] **Resultado:** Badge desaparece

### TESTE 3: Mencionar @username
- [ ] **Usuária 1:** Digite: "Oi @Ana, tudo bem?"
- [ ] **Clique Enviar**
- [ ] **Resultado:** "@Ana" aparece em AZUL e destacado
- [ ] **Funciona com:** @Maria @Ana @Julia (nomes do mock)

### TESTE 4: Ler Regras (Ambas)
- [ ] Clique em botão "📋 Regras"
- [ ] **Modal abre** com as regras em Markdown
- [ ] **Mostra:** Título, lista numerada, explicação de bans
- [ ] Feche o modal (X ou área exterior)

### TESTE 5: Admin Edita Regras (CEO apenas)
- [ ] **CEO:** Abra modal "Regras"
- [ ] **CEO:** Veja botão "✏️ Editar Regras" (apenas visible para CEO)
- [ ] **CEO:** Clique para editar
- [ ] **Textarea abre** com conteúdo atual
- [ ] **CEO:** Adicione uma linha: "6. Nova regra de teste"
- [ ] **CEO:** Clique "Salvar Regras"
- [ ] **Resultado:** Modal fecha, regras atualizadas
- [ ] **Usuária 1:** Abra regras novamente em 3 segundos
- [ ] **Resultado:** Vê a nova regra que CEO adicionou

### TESTE 6: Admin Deleta Mensagem (CEO apenas)
- [ ] **CEO:** Passe mouse sobre uma mensagem
- [ ] **Botão 🗑️ aparece** (hover effect)
- [ ] **CEO:** Clique para deletar
- [ ] **Modal abre:** "Tem certeza? Insira motivo"
- [ ] **CEO:** Digite motivo: "Spam"
- [ ] **CEO:** Clique "Deletar"
- [ ] **Resultado:** Mensagem desaparece imediatamente
- [ ] **Usuária 1:** Vê mensagem desaparecer em 3 segundos

### TESTE 7: Admin Clica em Username para Banir
- [ ] **CEO:** Clique no NAME de uma mensagem (ex: "Maria Silva")
- [ ] **Painel abre à DIREITA** com:
  - Avatar
  - Nome + Email
  - Histórico de Bans (vazio na primeira vez)
  - "⚠️ PRIMEIRA violação. Usuária será banida por 1 dia."
  - Botão "🚫 Iniciar Processo de Ban"
- [ ] **CEO:** Clique no botão
- [ ] **Textarea abre** pedindo motivo
- [ ] **CEO:** Digite: "Comportamento abusivo"
- [ ] **CEO:** Clique "Confirmar Ban"
- [ ] **Resultado:** Painel fecha

### TESTE 8: Usuária Banida Não Consegue Acessar
- [ ] **Após banir em TESTE 7:**
- [ ] Refresh na aba da **Usuária Banida** (F5)
- [ ] **Resultado:** Aviso vermelho "🚫 Você está banida da comunidade até XX/XX"
- [ ] **Resultado:** Input fica DESABILITADO (vermelho)
- [ ] **Usuária não consegue enviar mensagens**

### TESTE 9: Sistema de Escalação de Bans
- [ ] **1º Ban:** 1 dia (visto no painel)
- [ ] **Banir de novo:** Aviso muda para "⚠️ SEGUNDA violação. Ban 7 dias."
- [ ] **Banir pela 3ª:** Aviso: "🚨 TERCEIRA violação. BAN PERMANENTE!"
- [ ] **Histórico mostra:**
  ```
  Ban #1 - 1 day | Ban #2 - 7 days | Ban #3 - permanent 🔒
  ```

### TESTE 10: Ban Temporário Expira
- [ ] **Aguarde 30 segundos** (ou altere manualmente em localStorage)
- [ ] **Usuária refresha a página**
- [ ] **Resultado:** Aviso desaparece
- [ ] **Input fica ATIVO novamente**

### TESTE 11: Sincronização em Tempo Real (3s)
- [ ] **Abra 2 abas lado a lado** (Usuária 1 e Usuária 2)
- [ ] **Usuária 1:** Envie uma mensagem
- [ ] **Contagem:** Aguarde até 3 segundos
- [ ] **Resultado:** Mensagem aparece em Usuária 2 (SEM refresh)
- [ ] **Repita com reações:**
   - Usuária 1 reage
   - Usuária 2 vê em até 3 segundos

### TESTE 12: Responsividade Mobile
- [ ] **Abra DevTools** (F12)
- [ ] **Toggle "Device Toolbar"** (Ctrl+Shift+M)
- [ ] **Teste em iPhone 12**
- [ ] **Resultado:**
  - Input fica em 100% de largura
  - Mensagens scrollam corretamente
  - Modal regras adapta
  - Painel admin esconde (apenas em desktop)

---

## 🐛 POSSÍVEIS BUGS (Verificar)

| Bug | Como Detectar | Esperado |
|-----|---------------|----------|
| Reação não salva | Clique emoji, refresh F5 | Deve persistir em localStorage |
| Message list não atualiza | Envie msg, aguarde 5s | Deve atualizar a cada 3s |
| Ban não bloqueia | Banir usuária, ela tenta enviar | Input deve ficar desabilitado |
| Markdown não renderiza | Edite regras com `**negrito**` | Deve mostrar negrito |
| Avatar quebrado | Enviar msg sem avatar_url | DiceBear fallback |

---

## 📊 CHECKLIST FINAL

- [ ] **Funcionalidade:** Todos os 12 testes passando
- [ ] **Design:** Cores roxo/rosa consistentes
- [ ] **Responsividade:** Funciona em mobile
- [ ] **Performance:** Sincronização a cada 3s sem lag
- [ ] **UX:** Modals, warnings, confirmações claros
- [ ] **Admin:** Apenas CEO vê opções de editar/deletar/banir
- [ ] **Dados:** localStorage persiste dados entre reloads
- [ ] **Mentions:** @username highlightado em azul
- [ ] **Emojis:** 5 reações funcionando corretamente
- [ ] **Bans:** Escalação 1º/2º/3º funcionando

---

## 🎉 PRÓXIMOS PASSOS APÓS TESTES

1. **Se tudo passar:**
   - Gerar commit: "feat: implement community system MVP"
   - Documentar gotchas em memory.md
   - Criar task v1.1 (Supabase real + subscriptions)

2. **Se bug encontrado:**
   - Reportar aqui em COMMUNITY-SYSTEM-BUG-LOG.md
   - Indicar teste que falhou
   - Incluir erro de console

---

**Boa sorte nos testes! 🚀**

*Dex - Full Stack Developer*
