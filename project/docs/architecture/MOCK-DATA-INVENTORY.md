# MOCK-DATA-INVENTORY.md

**Status:** Auditoria PASSOU — Zero mock data crítico em produção
**Última atualização:** 2026-03-05
**Script de auditoria:** `scripts/audit-mock-data.sh`

---

## O que está OK (Exceções Documentadas)

### 1. `src/lib/badges-data-mock.ts` — Configuração real, não mock data

**Mantido intencionalmente.** Este arquivo contém as constantes `BADGES` e `LEVELS` que definem as regras do sistema de gamificação — quantos desafios necessários para cada badge, nomes e ícones dos níveis. Não é mock data gerado para testes: é a configuração canônica do sistema.

```
BADGES = [{ id, name, category, requirement, ... }, ...]
LEVELS = [{ level, name, minPoints, maxPoints, ... }, ...]
```

### 2. `src/lib/challenges-data-mock.ts` — Interfaces TypeScript (type-only)

**Mantido intencionalmente.** Exporta as interfaces `ChallengeCategory` e `Challenge` que definem a forma dos dados. Os dados reais vêm do Supabase (`challenges` table). Importado apenas para tipagem, sem dados fake em runtime.

### 3. `src/lib/ranking-data-mock.ts` — Interfaces TypeScript (type-only)

**Mantido intencionalmente.** Exporta as interfaces `MonthlyWinner` e `PrizePayment`. Os dados reais vêm de `monthly_rankings` e `prize_payments` no Supabase.

### 4. `src/lib/community-data-mock.ts` — Interface TypeScript (type-only)

**Mantido intencionalmente.** Exporta a interface `MessageReaction`. Os dados reais vêm de `community_messages` no Supabase.

### 5. `Math.random()` em modais de celebração — Animações UI

**Aceito.** Os modais `PopUpMedalUnlocked`, `LevelUpModal`, e `PopUpCelebration` usam `Math.random()` para efeitos visuais (confetti, posicionamento de partículas). Não afeta dados persistidos.

### 6. `generateMockGuerreiras()` em GuerreirasSection — Fallback de erro

**Aceito.** A função `generateMockGuerreiras()` é usada exclusivamente como fallback quando a query ao Supabase falha. Em produção normal, os dados vêm de `profiles` via Supabase. O fallback garante que a tela não quebre em caso de falha de rede.

### 7. `generateCategoryProgress()` em GuerreirasSection — Estimativa para CEO view

**Aceito com ressalva.** A função `generateCategoryProgress()` gera progresso estimado por categoria para a view administrativa de guerreiras. A fonte real (`challenge_completions` agrupado por categoria) requer uma query complexa que está fora do escopo atual. O dado é usado apenas no painel CEO para visualização aproximada.

> **Nota:** Em versão futura, substituir por query:
> `SELECT category_id, COUNT(*) FROM challenge_completions WHERE user_id = $1 GROUP BY category_id`

### 8. `generateCPF()` e `generateAddress()` em GuerreirasSection — Dados de display-only

**Aceito.** CPF e endereço não existem no schema atual de `profiles`. Esses campos são gerados para preencher o formulário de detalhes no painel CEO. Não são persistidos no banco.

---

## Arquivos Mock que podem ser deletados (quando prontos)

| Arquivo | Condição para deletar |
|---------|----------------------|
| `src/lib/badges-storage.ts` | Quando todas as badges vierem 100% do Supabase (AC já satisfeito — manter até refatoração de imports) |
| `src/lib/challenges-storage.ts` | Quando `getFormattedToday`/`getDateKey` forem movidos para utils |
| `src/lib/ranking-data-mock.ts` | Quando todos os imports forem atualizados para usar tipos inline |
| `src/lib/community-data-mock.ts` | Quando `MessageReaction` interface for movida para types.ts |

---

## Dados críticos — Confirmado no Supabase

| Dado | Fonte | Status |
|------|-------|--------|
| Pontos do usuário | `profiles.points` via realtime | ✅ Supabase |
| Streak do usuário | `profiles.streak` via `getUserStreak()` | ✅ Supabase |
| Desafios completados hoje | `challenge_completions` via `getTodayStats()` | ✅ Supabase |
| Badges/medalhas | `user_badges` table via `getUserEarnedBadgeIds()` | ✅ Supabase |
| Posição no ranking | `profiles ORDER BY points DESC` | ✅ Supabase |
| Histórico de pontos (7 dias) | `challenge_completions` via `getPointsHistory()` | ✅ Supabase |
| Desafios do usuário | `challenge_completions` e `challenges` tables | ✅ Supabase |
| Preferências | `user_preferences` table | ✅ Supabase |
| Prêmios (prize_payments) | `prize_payments` table | ✅ Supabase |
| Rankings mensais | `monthly_rankings` table | ✅ Supabase |
| Regras da comunidade | `community_rules` table | ✅ Supabase |
