# DATABASE AUDIT REPORT — @data-engineer (Dara)

**Data:** 2026-03-05
**Auditado por:** Dara (data-engineer agent)
**Escopo:** Implementação completa Supabase pós EPIC-005 (Stories 001–011)
**Status:** ❌ 4 CRITICAL bugs encontrados — bloqueiam fluxo de usuário end-to-end

---

## RESUMO EXECUTIVO

| Severidade | Qtd | Status |
|-----------|-----|--------|
| CRITICAL | 4 | ❌ Bloqueiam fluxo |
| HIGH | 2 | ⚠️ Dados incorretos |
| MEDIUM | 3 | 📋 Tech debt |
| OK | ✅ | RLS, Realtime, Auth |

**O banco em si está bem modelado. Os bugs estão no `supabase-client.ts` — desalinhamentos entre tabelas antigas (user_progress) e novas (challenge_completions), e erros de tipo em badge_id.**

---

## 🔴 BUG #1 — CRITICAL: completeChallenge() grava na tabela errada

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** 854–886

### Problema

`completeChallenge()` faz a verificação de duplicata em `challenge_completions` (correta) mas **grava** em `user_progress` (tabela antiga):

```typescript
// linha 854 — CHECK: lê challenge_completions ✅
const { data: existingCompletion } = await supabase
  .from('user_progress')    // ← ERRADO: devia ser challenge_completions
  .select('id')
  .eq('user_id', userId)
  // ...

// linha 876 — INSERT: grava em user_progress ← ERRADO
const { error: insertError } = await supabase.from('user_progress').insert({
  user_id: userId,
  challenge_id: challengeId,
  challenge_category: challenge.category_id,
  challenge_difficulty: challenge.difficulty,
  points_earned: points,
  proof_url: proofUrl,
  duration_minutes: challenge.duration_minutes || 15,
  created_at: new Date().toISOString()    // ← challenge_completions usa completed_at
})
```

Mas `getTodayStats()` lê de `challenge_completions`:

```typescript
// linha 2578 — lê challenge_completions
const { data } = await supabase
  .from('challenge_completions')   // ← never written by completeChallenge()
  .select('points_earned')
  .eq('user_id', userId)
  .gte('completed_at', today)
```

### Impacto

- Dashboard sempre mostra **0/120** desafios completados hoje
- Barra de progresso diária nunca avança
- `getPointsHistory()` também lê `challenge_completions` → gráfico 7 dias sempre vazio

### Fix necessário

Mudar `completeChallenge()` para gravar em `challenge_completions` com schema correto:

```typescript
// REMOVER: .from('user_progress').insert({...})
// ADICIONAR: .from('challenge_completions').insert({
//   user_id: userId,
//   challenge_id: challengeId,
//   category_id: challenge.category_id,
//   difficulty: challenge.difficulty,
//   points_earned: points,
//   proof_url: proofUrl,
//   completed_at: new Date().toISOString()
// })
```

Também mudar a verificação de duplicata na linha 854 para `challenge_completions`.

Verificar schema de `challenge_completions` em `20260304100000_challenge_completions.sql`.

---

## 🔴 BUG #2 — CRITICAL: getAllBadgesWithUserStatus() — mismatch UUID vs TEXT

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** 2733–2739

### Problema

Após migration `20260305000200_fix_badges_complete.sql`, `user_earned_badges.badge_id` é **TEXT** (ex: `'global_ovo'`, `'category_autoestima_1'`). Mas a função compara com `badges.id` que é **UUID**:

```typescript
// linha 2733 — earnedMap tem chaves TEXT ('global_ovo', etc.)
const earnedMap = new Map(earnedData?.map(e => [e.badge_id, e.earned_at]) || [])

// linha 2738 — badge.id é UUID ('123e4567-...')
isEarned: earnedMap.has(badge.id),    // ← UUID nunca está no Map de TEXT
earnedAt: earnedMap.get(badge.id) || null  // ← sempre null
```

O `badges` table tem dois campos distintos:
- `badges.id` → UUID (PK auto-gerado)
- `badges.badge_id` → TEXT (chave semântica: `'global_ovo'`)

### Impacto

- **Todas as medalhas aparecem como bloqueadas (locked)** mesmo após desbloquear
- F5 após ganhar medalha → medalha some (não persiste na UI)
- MedalsSection não mostra nenhuma medalha como earned

### Fix necessário

```typescript
// SUBSTITUIR:
isEarned: earnedMap.has(badge.id),
earnedAt: earnedMap.get(badge.id) || null

// POR:
isEarned: earnedMap.has(badge.badge_id),
earnedAt: earnedMap.get(badge.badge_id) || null
```

---

## 🔴 BUG #3 — CRITICAL: user_streak_milestones table não existe

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** 2963–2988
**Tabela:** `user_streak_milestones`

### Problema

A função `checkStreakMilestone()` faz queries em `user_streak_milestones`, mas **nenhuma migration cria esta tabela**. Verificado: `grep -rn "user_streak_milestones" migrations/*.sql` → 0 resultados.

```typescript
// linha 2963 — tabela não existe → erro 42P01 (relation does not exist)
const { data: existing } = await supabase
  .from('user_streak_milestones')
  .select('*')
  .eq('user_id', userId)
  .eq('milestone_days', milestone)

// linha 2972 — idem
await supabase.from('user_streak_milestones').insert({...})
```

### Impacto

- `checkStreakMilestone()` lança erro 42P01 toda vez que streak atinge milestone (7, 14, 30 dias)
- Se o erro não é capturado corretamente, pode silenciosamente falhar ou travar fluxo
- Evento `streakMilestone` nunca é disparado

### Fix necessário — duas opções

**Opção A (recomendada):** Criar migration para `user_streak_milestones`:

```sql
CREATE TABLE IF NOT EXISTS public.user_streak_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_days INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, milestone_days),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_streak_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own milestones"
  ON public.user_streak_milestones FOR ALL
  USING (auth.uid() = user_id);
```

**Opção B (curto prazo):** Adicionar try/catch isolado em `checkStreakMilestone()` para silenciar o erro até criar a migration.

---

## 🔴 BUG #4 — CRITICAL: Dois columns de pontos em profiles — update e leitura desalinhados

**Arquivo:** `src/lib/supabase-client.ts`
**Linhas:** 903–912 (update) vs 3083–3096 (leitura)

### Problema

O `profiles` table tem **duas colunas** de pontos:
- `points` INTEGER → criado na migration original (20250912230354)
- `total_points` INTEGER → adicionado em 20260304000008

`completeChallenge()` atualiza `profiles.points`:

```typescript
// linha 903-912 — grava em 'points'
await supabase.from('profiles').update({
  points: newPoints,   // ← coluna 'points'
  level: newLevel,
  updated_at: ...
})
```

Mas `getUserRankingByPoints()` lê `profiles.total_points`:

```typescript
// linha 3083-3096 — lê 'total_points' (sempre 0, nunca atualizado)
const { data: userData } = await supabase
  .from('profiles')
  .select('total_points')   // ← sempre 0
```

E `getUsersForLeaderboard()` lê `profiles.points` (corretamente). Então o Leaderboard mostra pontos corretos mas o Ranking por posição usa total_points = 0 para todos.

### Impacto

- `getUserRankingByPoints()` sempre retorna rank = 1 (pois todos têm total_points = 0, user é o primeiro)
- Posição no ranking é falsa/incorreta
- `total_points` nunca é atualizado → dado morto no schema

### Fix necessário

**Opção A (simples):** Substituir `total_points` por `points` em `getUserRankingByPoints()` e todas as outras funções que usam `total_points` (linhas 3083, 3089, 3094, 3095, 3096, 3330, 3336, 3343, 3478, 3483)

**Opção B (correto):** Unificar as duas colunas — remover `points` e usar apenas `total_points`, atualizando `completeChallenge()` para gravar em `total_points`.

Recomendo **Opção A** por ser menos disruptiva.

---

## 🟠 BUG #5 — HIGH: checkAndAwardGlobalMedals() usa critério errado

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** 3024–3036

### Problema

Os critérios das medalhas globais são baseados em "desafios completados", mas a função usa `earnedMedalIds.length` (quantidade de medalhas earned) como proxy:

```typescript
// 'global_lagarta' → "20 total challenges completed"
shouldUnlock = earnedMedalIds.length >= 20   // ← conta badges, não challenges!

// 'global_crisalida' → "50 total challenges completed"
shouldUnlock = earnedMedalIds.length >= 50   // ← idem
```

### Impacto

- Medalha `global_lagarta` (20 challenges) só desbloca quando usuária tem 20 badges — muito mais difícil
- Medalhas globais praticamente inacessíveis

### Fix necessário

Usar `getTotalChallengesCompleted(userId)` que lê de `challenge_completions`:

```typescript
const totalCompleted = await this.getTotalChallengesCompleted(userId)
// ...
shouldUnlock = totalCompleted >= 20  // para global_lagarta
shouldUnlock = totalCompleted >= 50  // para global_crisalida
```

> **Nota:** Este bug só é corrigível depois do Bug #1 (gravar em challenge_completions).

---

## 🟠 BUG #6 — HIGH: getAdminStatistics() lê tabela errada

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** 2497

### Problema

```typescript
// lê user_progress (tabela antiga, não usada por completeChallenge)
const { data: todayChallenges } = await supabase
  .from('user_progress')
  .select('id, completed_at')
  .gte('completed_at', `${todayDate}T00:00:00`)
```

### Impacto

- CEO Dashboard → "Desafios hoje" sempre mostra 0
- Métricas do CEO são inúteis

### Fix

Mudar para `challenge_completions` (após corrigir Bug #1).

---

## 🟡 BUG #7 — MEDIUM: checkAndAwardLevelUp() — localStorage TODO não completado

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** 2903–2907

### Problema

```typescript
if (newLevel > currentLevel) {
  // Update level locally (for now, using localStorage)
  localStorage.setItem('user_level', newLevel.toString())
  // TODO: When EPIC-001 is done, update level in profile via Supabase
  // await supabase.from('profiles').update({ level: newLevel }).eq('id', userId)
}
```

EPIC-001 já está concluído. O TODO não foi completado.

### Mitigação existente

`completeChallenge()` já atualiza `profiles.level` corretamente (linha 900–912). Então o fluxo principal funciona. Esta função `checkAndAwardLevelUp()` é chamada de outros lugares e pode ter o bug ativo nesses caminhos.

### Fix

Descomentar o `await supabase.from('profiles').update(...)` e remover o `localStorage.setItem`.

---

## 🟡 BUG #8 — MEDIUM: Receita no CEO Dashboard é mock hardcoded

**Arquivo:** `src/lib/supabase-client.ts`
**Linha:** ~2508

### Problema

```typescript
const revenueMock = activeUsers * 150 // Mock revenue calculation
```

### Fix

- Se não há tabela de pagamentos real: exibir "R$ --" ou "Não disponível" em vez de número falso
- Se `prize_payments` tem dados: somar os valores reais

---

## 🟡 BUG #9 — MEDIUM: Múltiplas migrations conflitantes para badges

### Problema

Existem migrations que criam `badges` em datas diferentes:
- `20260303120001_create_badges_tables.sql` — cria badges com estrutura antiga
- `20260304000004_create_badges.sql` — cria badges com estrutura nova (badge_id TEXT)
- `20260305000200_fix_badges_complete.sql` — modifica badges

Se aplicadas em sequência no banco limpo, podem haver conflitos de "table already exists".

### Fix

Verificar se as migrations possuem `CREATE TABLE IF NOT EXISTS` e `IF NOT EXISTS` em todos os ALTER TABLE. Consolidar se necessário.

---

## ✅ O QUE ESTÁ CORRETO

| Item | Status | Observação |
|------|--------|-----------|
| RLS habilitado em 16 tabelas | ✅ | Migrations 20260304000000, 20260305000300 |
| `auth.uid() = id` (UUID correto) | ✅ | Fix aplicado, sem type mismatch |
| Realtime em 7 tabelas | ✅ | profiles, challenges, completions, badges, community, preferences, rankings |
| `onPointsChange()` subscriber | ✅ | Filtra corretamente por user_id |
| `awardBadgeByKey()` | ✅ | Insere TEXT badge_id, trata UNIQUE violation (23505) |
| `getUserEarnedMedals()` | ✅ | Lê badge_id TEXT de user_earned_badges |
| Community (messages, bans, reports) | ✅ | Totalmente no Supabase |
| User preferences | ✅ | user_preferences table |
| Challenge categories | ✅ | challenge_categories table |
| CEO profile listing | ✅ | Lê profiles com RLS admin |
| `completeChallenge()` — points update | ✅ | Atualiza profiles.points inline |
| Soft delete community_messages | ✅ | deleted_at coluna existe e é usada |

---

## PRIORIDADE DE CORREÇÃO

```
SEMANA 1 — CRÍTICO (bloqueia o app):
  Bug #1: completeChallenge() → challenge_completions (+ duplicate check)
  Bug #2: getAllBadgesWithUserStatus() badge_id TEXT fix
  Bug #4: total_points vs points → usar 'points' everywhere

SEMANA 1 — CRÍTICO (evitar erros 42P01):
  Bug #3: criar migration user_streak_milestones

SEMANA 2 — IMPORTANTE:
  Bug #5: global medals criteria → getTotalChallengesCompleted()
  Bug #6: getAdminStatistics() → challenge_completions

BACKLOG:
  Bug #7: checkAndAwardLevelUp() → descomentar Supabase update
  Bug #8: revenue calculation → dado real ou placeholder
  Bug #9: revisar migrations conflitantes badges
```

---

## PARA O @dev

Após corrigir Bug #1 (completeChallenge → challenge_completions), verificar se o schema de `challenge_completions` tem os mesmos campos:

```sql
-- migration: 20260304100000_challenge_completions.sql
-- columns esperados:
user_id      UUID
challenge_id TEXT (não FK)
category_id  TEXT
difficulty   TEXT
points_earned INTEGER
proof_url    TEXT NULL
completed_at TIMESTAMPTZ
```

Se houver diferença de nomes (ex: `challenge_category` vs `category_id`, `created_at` vs `completed_at`), ajustar o INSERT no `completeChallenge()`.

— Dara, arquitetando dados 🗄️
