# ZAYIA — Developer Implementation Guide

> **Versão:** 1.0 | **Data:** 2026-03-05
> **Propósito:** Guia completo para migrar ZAYIA de localStorage/mock data para Supabase.
> Qualquer dev consegue implementar lendo **apenas este documento**.

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Banco de Dados Supabase — Tabelas Completas](#2-banco-de-dados-supabase--tabelas-completas)
3. [Autenticação](#3-autenticação)
4. [Padrões de Busca de Dados](#4-padrões-de-busca-de-dados)
5. [CRUD — Criar / Atualizar / Deletar](#5-crud--criar--atualizar--deletar)
6. [Lista Completa de Mock Data a Remover](#6-lista-completa-de-mock-data-a-remover)
7. [Fluxos de Teste](#7-fluxos-de-teste)

---

## 1. Visão Geral do Projeto

### Stack Técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | React + TypeScript | 18 / 5.2 |
| Build | Vite + ESLint | 5.0 |
| Styling | Tailwind CSS + `zayia-*` palette | 3.4 |
| Backend | Supabase (PostgreSQL + Auth + Realtime) | @supabase/supabase-js ^2.39.3 |
| Estado Global | Context API only | — |
| Roteamento | Conditional rendering (sem React Router) | — |

### Arquitetura de Camadas Supabase

```
src/lib/supabase.ts          → raw createClient() — NUNCA importar diretamente em components
src/lib/supabase-client.ts   → class SupabaseClient com ~50 métodos — USE SEMPRE ESTE
```

**Regra:** Todo componente importa `supabaseClient` de `src/lib/supabase-client.ts`. Nunca importe `supabase` diretamente exceto em `supabase-client.ts`.

### Estrutura de Diretórios Relevante

```
src/
├── lib/
│   ├── supabase.ts              ← raw client (não tocar)
│   ├── supabase-client.ts       ← SupabaseClient class (adicionar métodos aqui)
│   ├── medals-unlock.ts         ← CRÍTICO: síncrono, usa localStorage — precisa migrar
│   ├── badges-storage.ts        ← localStorage wrapper para badges
│   ├── challenges-storage.ts    ← localStorage wrapper para challenges
│   └── challenges-data-mock.ts  ← mock data dos JSON files
├── contexts/
│   └── AuthContext.tsx          ← estado global user/profile/role
├── hooks/
│   ├── useRealtimeCommunity.ts  ← realtime messages
│   ├── useCommunityActions.ts   ← CRUD community
│   ├── useBanStatus.ts          ← ban tracking
│   └── useRules.ts              ← community rules
├── data/                        ← JSON com 840 challenges (7 categorias × 120)
│   ├── autoestima.json
│   ├── corpo_saude.json
│   ├── carreira.json
│   ├── relacionamentos.json
│   ├── mindfulness.json
│   ├── digital_detox.json
│   ├── rotina.json
│   └── compliance.json          ← VAZIO (0 challenges)
```

### Tarefas por Prioridade

| ID | Tarefa | Prioridade | Dificuldade |
|----|--------|-----------|-------------|
| T-01 | Seed 840 challenges dos JSON para Supabase | 🔴 CRÍTICO | Fácil |
| T-02 | Substituir métricas hardcoded CEO Dashboard | 🔴 CRÍTICO | Média |
| T-03 | Fix SubscriptionsSection (4 fake subscribers) | 🔴 CRÍTICO | Fácil |
| T-04 | Fix AnalyticsSection (6 hardcoded winners) | 🔴 CRÍTICO | Fácil |
| T-05 | Fix `getProfiles()` → `getProfile(id)` AuthContext | 🟠 ALTA | Fácil |
| T-06 | Unificar Profile type duplicado | 🟠 ALTA | Média |
| T-07 | Migrar PlansContext para tabela Supabase | 🟠 ALTA | Média |
| T-08 | Implementar password reset flow | 🟠 ALTA | Fácil |
| T-09 | Substituir generateMockRankingUsers() | 🟠 ALTA | Fácil |
| T-10 | Criar activity_log table + feed real | 🟡 MÉDIA | Média |
| T-11 | Criar daily_analytics table + dados históricos | 🟡 MÉDIA | Média |
| T-12 | Substituir Math.random() charts | 🟡 MÉDIA | Média |
| T-13 | Refatorar medals-unlock.ts: sync → async | 🔴 CRÍTICO | Difícil |
| T-14 | Remover dependências localStorage medals/badges | 🟠 ALTA | Difícil |
| T-15 | Adicionar validações de formulário | 🟡 MÉDIA | Fácil |

---

## 2. Banco de Dados Supabase — Tabelas Completas

### Estado Atual do Banco (2026-03-05)

```
challenges:        8 rows   ← CRÍTICO: deveria ter 840
categories:        8 rows   ✅ correto
profiles:          2 rows
challenge_completions: 0 rows
user_earned_badges: 0 rows
community_messages: 6 rows
user_preferences:  3 rows
community_rules:   1 row
```

### Tabelas Existentes (16 total, todas com RLS habilitado)

As tabelas a seguir já existem no banco. Verifique o estado atual antes de criar migrações.

```sql
-- Tabelas já criadas e com RLS habilitado:
-- public.profiles
-- public.challenge_categories
-- public.challenges
-- public.challenge_completions
-- public.user_earned_badges
-- public.badges
-- public.levels
-- public.user_preferences
-- public.community_messages
-- public.community_bans
-- public.message_reactions
-- public.message_reports
-- public.community_rules
-- public.prize_payments
-- public.monthly_rankings
-- public.questions (AI coaching)
```

### Tabelas a Criar (T-10, T-11)

```sql
-- T-10: Activity Log para feed real do CEO Dashboard
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'challenge_completed', 'badge_earned', 'level_up', 'community_post', 'subscription_changed'
  action_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- CEO pode ver tudo, usuário vê apenas próprio
CREATE POLICY "CEO can read all activity" ON public.activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ceo')
  );

CREATE POLICY "Users can read own activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity" ON public.activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

-- T-11: Daily Analytics para charts do CEO Dashboard
CREATE TABLE IF NOT EXISTS public.daily_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  active_users INT DEFAULT 0,
  new_users INT DEFAULT 0,
  challenges_completed INT DEFAULT 0,
  community_posts INT DEFAULT 0,
  badges_earned INT DEFAULT 0,
  revenue_brl DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- Apenas CEO pode ler analytics
CREATE POLICY "CEO can read analytics" ON public.daily_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ceo')
  );
```

### Schema Completo das Tabelas Críticas

```sql
-- profiles (já existe — apenas para referência)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'ceo')),
  avatar_url TEXT,
  phone TEXT,
  birth_date DATE,
  location TEXT,
  profession TEXT,
  education TEXT,
  bio TEXT,
  streak INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  points INT DEFAULT 0,
  level INT DEFAULT 1,
  completed_challenges INT DEFAULT 0,
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'vip')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  notifications_enabled BOOL DEFAULT true,
  community_access BOOL DEFAULT true,
  mentor_status TEXT DEFAULT 'none' CHECK (mentor_status IN ('none', 'mentee', 'mentor')),
  -- Address fields
  street TEXT,
  street_number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- challenges (já existe — apenas para referência)
-- ATENÇÃO: tem apenas 8 rows. T-01 = seed 840 challenges.
CREATE TABLE public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.challenge_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'hard')),
  -- ATENÇÃO: JSON usa 'facil'/'dificil', DB usa 'easy'/'hard'
  -- Map ao inserir: 'facil' → 'easy', 'dificil' → 'hard'
  points_easy INT DEFAULT 10,
  points_hard INT DEFAULT 25,
  duration_minutes INT DEFAULT 5,
  is_active BOOL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Autenticação

### Fluxo Completo

```
Usuário → AuthPage → LoginForm / SignUpForm
  ↓
supabase.auth.signInWithPassword() / signUp()
  ↓
AuthContext.tsx → onAuthStateChange listener
  ↓
profile.role === 'ceo' → CEODashboard
profile.role === 'user' → MobileUserDashboard
```

### AuthContext — Problemas Conhecidos e Correções

#### Problema 1: `getProfiles()` faz full table scan (T-05)

```typescript
// PROBLEMA ATUAL (src/contexts/AuthContext.tsx)
// Busca TODOS os profiles e filtra client-side
const profiles = await supabaseClient.getProfiles() // SELECT * FROM profiles
const profile = profiles.find(p => p.id === session.user.id) // filtra em JS

// CORREÇÃO — adicionar método no SupabaseClient:
async getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single() // Retorna um objeto, não array
    if (error) throw error
    return data
  } catch (err) {
    console.error('getProfile error:', err)
    return null
  }
}

// E substituir em AuthContext.tsx linha ~85:
// ANTES:
const profiles = await supabaseClient.getProfiles()
const profile = profiles.find(p => p.id === session.user.id)
// DEPOIS:
const profile = await supabaseClient.getProfile(session.user.id)
```

#### Problema 2: Profile type duplicado (T-06)

Existem **dois** `Profile` type:
- `src/lib/supabase-client.ts` → campos DB (snake_case flat)
- `src/contexts/AuthContext.tsx` → campos com objeto `address` aninhado

**Regra:** Use apenas o tipo de `supabase-client.ts`. O AuthContext deve importar de lá.

```typescript
// src/contexts/AuthContext.tsx — REMOVER tipo local e importar:
import { Profile } from '../lib/supabase-client'
```

### Signup Flow

```typescript
// src/components/auth/SignUpForm.tsx — como funciona
const handleSignUp = async () => {
  // 1. Cria user no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name } // armazenado em auth.users.raw_user_meta_data
    }
  })

  // 2. AuthContext.onAuthStateChange dispara automaticamente
  // 3. AuthContext chama ensureProfileExists() que faz:
  const profile = {
    id: user.id,
    email: user.email,
    full_name: name,
    role: 'user',
    points: 0,
    level: 1,
    streak: 0,
    subscription_plan: 'basic',
    subscription_status: 'active',
  }
  await supabase.from('profiles').upsert(profile)
}
```

### Password Reset (T-08 — não implementado ainda)

```typescript
// Adicionar em src/components/auth/LoginForm.tsx:
const handleForgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  if (error) throw error
  // Mostrar: "Email enviado! Verifique sua caixa de entrada."
}

// Adicionar nova page/component ResetPasswordForm.tsx:
const handleResetPassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  // Redirecionar para login
}
```

---

## 4. Padrões de Busca de Dados

### Padrão Padrão do SupabaseClient

Todo método segue este padrão (importante para consistência):

```typescript
// src/lib/supabase-client.ts — PADRÃO OBRIGATÓRIO
async nomeDaFuncao(param: string): Promise<TipoRetorno[]> {
  try {
    const { data, error } = await supabase
      .from('nome_tabela')
      .select('*')
      .eq('campo', param)
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('❌ nomeDaFuncao error:', err)
    return [] // Retorna vazio em caso de erro (não lança exception)
  }
}
```

**IMPORTANTE:** O padrão atual usa **silent failures** — retorna `null` ou `[]` em vez de propagar o erro. Isso é intencional para UX mas dificulta debugging.

### Buscar Challenges da Categoria Ativa

```typescript
// Já implementado em supabase-client.ts
async getChallengesByCategory(categoryId: string): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('difficulty', { ascending: true })
  if (error) throw error
  return data || []
}

// Uso em DailyChallengesView.tsx:
const challenges = await supabaseClient.getChallengesByCategory(category.id)
// Map difficulty: 'easy' → 'facil', 'hard' → 'dificil'
const mapped = challenges.map(ch => ({
  ...ch,
  difficulty: ch.difficulty === 'easy' ? 'facil' : 'dificil',
  points: ch.difficulty === 'easy' ? ch.points_easy : ch.points_hard,
}))
```

### Buscar Categoria Ativa do Usuário

```typescript
// Já implementado em supabase-client.ts
async getUserActiveCategory(userId: string): Promise<string | null> {
  // Lê a última conclusão de desafio para inferir categoria ativa
  // OU lê de user_preferences.active_category_id (se existir)
}

// Se não retornar nada → mostrar CategorySelectionModal
```

### Buscar Ranking

```typescript
// PROBLEMA ATUAL: CEODashboard usa generateMockRankingUsers() (50 fake users)
// CORREÇÃO (T-09):

async getRankingUsers(limit = 50): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, points, level, subscription_plan')
    .eq('role', 'user')
    .order('points', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
```

### Buscar Métricas Admin (T-02)

```typescript
// PROBLEMA ATUAL em CEODashboard.tsx linha 55:
// const [rankingUsers] = useState(() => generateMockRankingUsers())
// E métricas hardcoded: 1,247 / 892 / 156 / 2,834

// CORREÇÃO — já existe getAdminStatistics(), mas needs to return user counts:
async getAdminStatistics(month: number, year: number): Promise<AdminStatistics> {
  // Query 1: Total usuários ativos (subscription_status = 'active')
  const { count: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')
    .eq('subscription_status', 'active')

  // Query 2: Cancelamentos
  const { count: cancelledUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')
    .eq('subscription_status', 'cancelled')

  // Query 3: Challenges completados hoje
  const today = new Date().toISOString().split('T')[0]
  const { count: todayChallenges } = await supabase
    .from('challenge_completions')
    .select('*', { count: 'exact', head: true })
    .gte('completed_at', today)

  return {
    activeUsers: activeUsers || 0,
    cancelledUsers: cancelledUsers || 0,
    churnRate: activeUsers ? (cancelledUsers! / activeUsers) * 100 : 0,
    todayChallengesCount: todayChallenges || 0,
    revenue: 0, // Conectar a prize_payments futuramente
    lastUpdated: new Date().toISOString(),
  }
}
```

### Buscar SubscriptionsSection (T-03)

```typescript
// PROBLEMA ATUAL: hardcoded 4 fake subscribers
// src/components/ceo/SubscriptionsSection.tsx

// CORREÇÃO:
async getSubscribers(filter?: 'active' | 'cancelled' | 'expired'): Promise<Profile[]> {
  let query = supabase
    .from('profiles')
    .select('id, full_name, email, subscription_plan, subscription_status, created_at')
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  if (filter) {
    query = query.eq('subscription_status', filter)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}
```

---

## 5. CRUD — Criar / Atualizar / Deletar

### Completar um Challenge (fluxo principal)

```typescript
// src/components/user/sections/ChallengesSection.tsx
// Fluxo handleChallengeCompleted() — já implementado, apenas documentando

const handleChallengeCompleted = async (challengeId: string, points: number, difficulty: 'facil' | 'dificil') => {
  if (!user?.id || !activeCategory) return

  // 1. OTIMISTA: Atualiza UI imediatamente
  setCompletedChallengeIds(prev => new Set([...prev, challengeId]))

  // 2. SÍNCRONO: Verifica medalhas (usa localStorage como cache)
  const previousPoints = profile?.points || 0
  const newTotalPoints = previousPoints + points
  const newMedals = checkAndUnlockMedals(newTotalPoints, previousPoints, user.id)

  // 3. ASSÍNCRONO: Persiste no Supabase
  await supabaseClient.recordChallengeCompletion(user.id, challengeId, activeCategory.id, difficulty, points)
  await supabaseClient.addUserPoints(user.id, points, 'challenge_complete', challengeId)

  // 4. Dispara eventos para sync cross-component
  window.dispatchEvent(new Event('pointsUpdated'))
  window.dispatchEvent(new Event('rankingUpdated'))
  window.dispatchEvent(new Event('dailyProgressUpdated'))
}
```

### recordChallengeCompletion

```typescript
// Já em supabase-client.ts
async recordChallengeCompletion(
  userId: string,
  challengeId: string,
  categoryId: string,
  difficulty: 'facil' | 'dificil',
  pointsEarned: number
): Promise<void> {
  // Mapeia dificuldade para formato DB
  const dbDifficulty = difficulty === 'facil' ? 'easy' : 'hard'

  const { error } = await supabase.from('challenge_completions').insert({
    user_id: userId,
    challenge_id: challengeId,
    category_id: categoryId,
    difficulty: dbDifficulty,
    points_earned: pointsEarned,
    completed_at: new Date().toISOString(),
  })
  if (error) throw error

  // Incrementa contador no profile
  await supabase.rpc('increment_completed_challenges', { user_id_param: userId })
}
```

### addUserPoints

```typescript
// Já em supabase-client.ts
async addUserPoints(
  userId: string,
  pointsDelta: number,
  source: string,
  sourceId?: string
): Promise<void> {
  // Usa RPC para atomic update (evita race condition)
  const { error } = await supabase.rpc('add_user_points', {
    user_id_param: userId,
    points_delta: pointsDelta,
  })
  if (error) throw error
}
```

### Atualizar Perfil

```typescript
// src/contexts/AuthContext.tsx → updateProfile()
const updateProfile = async (updates: Partial<Profile>) => {
  if (!user?.id) return

  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw error

  // Atualiza state local imediatamente (sem re-fetch)
  setProfile(prev => prev ? { ...prev, ...updates } : null)
}
```

### Postar Mensagem na Comunidade

```typescript
// src/hooks/useCommunityActions.ts → postMessage()
const postMessage = async (content: string) => {
  if (!user?.id) return

  // Gera ID client-side para idempotência (evita duplicata com realtime)
  const clientId = crypto.randomUUID()

  // 1. OTIMISTA: Adiciona na UI imediatamente
  const optimisticMsg: CommunityMessage = {
    id: clientId,
    user_id: user.id,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_profile: profile,
    reactions: [],
  }
  setMessages(prev => [...prev, optimisticMsg])

  // 2. PERSISTE no Supabase
  const { error } = await supabase
    .from('community_messages')
    .insert({ id: clientId, user_id: user.id, content })

  if (error) {
    // Rollback otimismo
    setMessages(prev => prev.filter(m => m.id !== clientId))
    console.error('❌ postMessage error:', error)
  }
  // Se sucesso: realtime vai confirmar com dados do servidor (deduplication por ID)
}
```

### Seed 840 Challenges (T-01 — MAIS URGENTE)

```typescript
// scripts/seed-challenges.ts — CRIAR ESTE ARQUIVO
// Executar: npx tsx scripts/seed-challenges.ts

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY! // Service role ignora RLS
)

// Mapa: nome do arquivo JSON → nome da categoria no DB
const FILE_TO_CATEGORY: Record<string, string> = {
  'autoestima.json': 'Autoestima',
  'corpo_saude.json': 'Corpo & Saúde',
  'carreira.json': 'Carreira',
  'relacionamentos.json': 'Relacionamentos',
  'mindfulness.json': 'Mindfulness',
  'digital_detox.json': 'Digital Detox',
  'rotina.json': 'Rotina',
  // compliance.json está vazio — ignorar
}

async function seedChallenges() {
  // 1. Busca categorias do DB
  const { data: categories, error } = await supabase
    .from('challenge_categories')
    .select('id, name')
  if (error) throw error
  console.log(`✅ ${categories?.length} categorias encontradas`)

  // 2. Para cada arquivo JSON
  for (const [filename, categoryName] of Object.entries(FILE_TO_CATEGORY)) {
    const filePath = path.join(__dirname, '../src/data', filename)
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // Encontra categoria correspondente no DB
    const category = categories?.find(c =>
      c.name.toLowerCase() === categoryName.toLowerCase()
    )
    if (!category) {
      console.error(`❌ Categoria não encontrada: ${categoryName}`)
      continue
    }

    // Prepara challenges para inserção
    const challenges = [
      ...json.facil.map((ch: any) => ({
        category_id: category.id,
        title: ch.title,
        description: ch.description || null,
        difficulty: 'easy', // 'facil' → 'easy' para DB
        points_easy: ch.points || 10,
        points_hard: 10,
        duration_minutes: ch.duration || 5,
        is_active: true,
      })),
      ...json.dificil.map((ch: any) => ({
        category_id: category.id,
        title: ch.title,
        description: ch.description || null,
        difficulty: 'hard', // 'dificil' → 'hard' para DB
        points_easy: 10,
        points_hard: ch.points || 25,
        duration_minutes: ch.duration || 10,
        is_active: true,
      })),
    ]

    // Insere em batch (100 por vez para não exceder limite)
    const batchSize = 100
    for (let i = 0; i < challenges.length; i += batchSize) {
      const batch = challenges.slice(i, i + batchSize)
      const { error: insertError } = await supabase
        .from('challenges')
        .insert(batch)
      if (insertError) {
        console.error(`❌ Erro inserindo ${filename} batch ${i}:`, insertError)
      }
    }

    console.log(`✅ ${filename}: ${challenges.length} challenges inseridos (categoria: ${category.id})`)
  }

  console.log('🎉 Seed completo!')
}

seedChallenges().catch(console.error)
```

### Medals System — Refatoração Crítica (T-13)

**PROBLEMA ATUAL:**
`medals-unlock.ts` é síncrono e lê localStorage. `ChallengesSection.tsx` chama `checkAndUnlockMedals()` de forma síncrona antes do bloco async.

**Workaround atual:** `seedLocalStorage()` sincroniza localStorage com Supabase no mount para que `checkAndUnlockMedals()` leia dados corretos.

**RISCO:** Funciona somente se o usuário usou o mesmo dispositivo. Falha em novo dispositivo, browser anônimo, ou múltiplos dispositivos.

```typescript
// PLANO DE MIGRAÇÃO medals-unlock.ts (T-13)

// ANTES (src/lib/medals-unlock.ts):
export function checkAndUnlockMedals(
  newPoints: number,
  previousPoints: number,
  userId: string
): string[] {
  // Lê localStorage — PROBLEMÁTICO
  const completedChallenges = ChallengesDataMock.getUserCompletedChallenges(activeCategory, userId)
  // ...lógica síncrona...
}

// DEPOIS — converter para async:
export async function checkAndUnlockMedals(
  newPoints: number,
  previousPoints: number,
  userId: string
): Promise<string[]> {
  // Lê do Supabase em vez de localStorage
  const totalCompleted = await supabaseClient.getUserTotalCompletedCount(userId)
  // ...mesma lógica, mas dados do Supabase...
}

// IMPACTO: ChallengesSection.handleChallengeCompleted()
// Precisará mover checkAndUnlockMedals() para dentro do bloco async:
const handleChallengeCompleted = async (...) => {
  // ... código síncrono ...

  const savePointsAndCheck = async () => {
    // Mover para cá:
    const allNewMedals = await checkAndUnlockMedals(totalAfterChallenge, previousPoints, user.id)
    // ...resto do código...
  }
  await savePointsAndCheck()
}
```

---

## 6. Lista Completa de Mock Data a Remover

### Fase 1 — CEO Dashboard (mais urgente, visível)

| Arquivo | Linha(s) | O que está mockado | Substituir por |
|---------|----------|-------------------|----------------|
| `src/components/ceo/CEODashboard.tsx` | ~55 | `generateMockRankingUsers()` — 50 usuários fake | `supabaseClient.getRankingUsers()` |
| `src/components/ceo/CEODashboard.tsx` | ~115, ~127 | Métricas hardcoded: `1,247`, `892`, `156`, `2,834` | `supabaseClient.getAdminStatistics()` |
| `src/components/ceo/CEODashboard.tsx` | ~200-250 | Activity feed hardcoded em JSX | `supabaseClient.getActivityLog()` |
| `src/components/ceo/Dashboard2Section.tsx` | ~116-137 | `generateChartData()` com `Math.random()` | `supabaseClient.getDailyAnalytics()` |
| `src/components/ceo/SubscriptionsSection.tsx` | ~50-100 | 4 fake subscribers hardcoded | `supabaseClient.getSubscribers()` |
| `src/components/ceo/AnalyticsSection.tsx` | ~30-80 | 6 hardcoded winners mensais | `supabaseClient.getMonthlyWinners()` |

### Fase 2 — Challenges System

| Arquivo | Linha(s) | O que está mockado | Substituir por |
|---------|----------|-------------------|----------------|
| `src/lib/challenges-data-mock.ts` | arquivo inteiro | Parser dos JSON files + localStorage | Deletar após T-01 seed + T-13 medals |
| `src/lib/challenges-storage.ts` | arquivo inteiro | `incrementDailyCount()` e outros | Supabase `challenge_completions` queries |
| `src/lib/medals-unlock.ts` | arquivo inteiro | `checkAndUnlockMedals()` síncrono | Refatorar para async (T-13) |
| `src/lib/badges-storage.ts` | arquivo inteiro | `getEarnedBadges()`, `addEarnedBadge()` | `supabaseClient.getUserEarnedBadges()` |

### Fase 3 — User Sections

| Arquivo | Linha(s) | O que está mockado | Substituir por |
|---------|----------|-------------------|----------------|
| `src/components/user/sections/ChallengesSection.tsx` | ~127 | `ChallengesDataMock.completeChallenge()` | Remover — Supabase já registra |
| `src/components/user/sections/DailyChallengesView.tsx` | ~63 | `totalChallenges = 120` hardcoded | Count real do DB |

### Fase 4 — Imports a Remover (após fases anteriores)

```typescript
// Estes imports devem ser removidos quando as fases acima estiverem completas:

// src/components/user/sections/ChallengesSection.tsx
import ChallengesDataMock, { ChallengeCategory } from '../../../lib/challenges-data-mock'
// ↑ Remover após T-01 + T-13. Manter apenas ChallengeCategory type até T-06

import { getEarnedBadges } from '../../../lib/badges-storage'
// ↑ Remover após T-14

import { incrementDailyCount } from '../../../lib/challenges-storage'
// ↑ Remover após Fase 2
```

### Mapa de Dependências Para Remoção Segura

```
JSON files (src/data/*.json)
  └─ depende de: challenges-data-mock.ts (parse)
       └─ depende de: medals-unlock.ts (getUserCompletedChallenges)
            └─ depende de: ChallengesSection.tsx (checkAndUnlockMedals)
                └─ depende de: badges-storage.ts (addEarnedBadge)

ORDEM SEGURA DE REMOÇÃO:
1. T-01: Seed challenges no DB
2. T-13: Refatorar medals-unlock.ts para async + Supabase
3. T-14: Remover badges-storage.ts localStorage
4. Remover challenges-data-mock.ts
5. Remover challenges-storage.ts
6. Remover JSON files (ou manter como backup)
```

---

## 7. Fluxos de Teste

### Setup de Ambiente

```bash
# 1. Instalar dependências
cd /home/isaias/zayia-project/project
npm install

# 2. Verificar .env
cat .env
# Deve conter:
# VITE_SUPABASE_URL=https://wrcprmujlkwvusekfogf.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_...
# VITE_SUPABASE_SERVICE_ROLE_KEY=eyJ...
# VITE_DEMO_MODE=true

# 3. Iniciar dev server
npm run dev  # http://localhost:5173

# 4. Verificar TypeScript (DEVE passar com 0 erros)
npm run build

# 5. Verificar ESLint (DEVE passar com 0 warnings)
npm run lint
```

### Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| CEO (admin) | `ceo@zayia.com` | `zayia2024` |
| User (cliente) | Qualquer email cadastrado | password desse user |
| Demo mode | Botões de quick login (VITE_DEMO_MODE=true) | — |

### Fluxo 1 — Happy Path: Completar Challenge

```
PASSO 1: Login como User
  → Ir para seção "Desafios"
  → Verificar que lista de desafios carrega (não vazia)
  → Console não deve ter erros

PASSO 2: Selecionar uma categoria (se não tiver)
  → Modal de seleção deve aparecer
  → Clicar em uma categoria
  → Modal fecha, desafios aparecem

PASSO 3: Completar um desafio fácil
  → Clicar "Começar Desafio"
  → Timer de 60 segundos inicia (modal fullscreen)
  → Aguardar timer chegar em 00:00
  → Upload de foto/arquivo
  → Clicar "Enviar Prova e Validar"

PASSO 4: Verificar resultados
  ✅ Desafio marcado como "Concluído" (verde)
  ✅ Pontos atualizados no header do Dashboard
  ✅ Progresso da barra atualizado (X/120)
  ✅ challenge_completions: +1 row no Supabase
  ✅ profiles.points: +10 no Supabase
  ✅ Nenhum erro no console
```

### Fluxo 2 — Happy Path: CEO Ver Métricas

```
PASSO 1: Login como CEO
  → Ir para CEO Dashboard
  → Verificar que KPIs mostram dados reais (não 1,247/892/156/2,834)
  → Verificar que lista de guerreiras é real (não generateMockRankingUsers)

PASSO 2: Verificar seção Guerreiras
  → Deve mostrar usuários reais com subscription_status = 'active'
  → Deve mostrar 0 usuários se não há nenhum cadastrado

PASSO 3: Verificar ranking
  → Deve ordenar por pontos (maior → menor)
  → Pontos devem bater com o que está em profiles.points no Supabase
```

### Fluxo 3 — Edge Case: Novo Usuário (Sem Categoria)

```
PASSO 1: Criar conta nova via SignUp
PASSO 2: Ir para seção Desafios
PASSO 3: Modal de seleção de categoria DEVE aparecer automaticamente
PASSO 4: Fechar modal sem selecionar (clicar X)
  → DEVE navegar de volta ao Dashboard (não ficar em estado quebrado)
PASSO 5: Abrir Desafios novamente
  → Modal DEVE aparecer novamente
```

### Fluxo 4 — Edge Case: Medalha Desbloqueada

```
PASSO 1: Completar challenges suficientes para desbloquear uma medalha
  → (Ex: 10 challenges = primeira medalha de categoria)
PASSO 2: Verificar PopUpMedalUnlocked aparece
PASSO 3: Clicar "Ver Medalha"
  → DEVE navegar para a aba de medalhas
  → Medalha DEVE aparecer na lista
PASSO 4: Verificar user_earned_badges no Supabase: +1 row
PASSO 5: Recarregar página
  → Medalha DEVE permanecer desbloqueada (persistência)
```

### Fluxo 5 — Edge Case: Realtime Community

```
PASSO 1: Abrir comunidade em duas abas do browser (mesmo usuário ou dois users)
PASSO 2: Postar mensagem em aba 1
PASSO 3: Verificar que aba 2 recebe a mensagem SEM reload
  → Deve aparecer em < 2 segundos
PASSO 4: Deletar mensagem em aba 1 (se for admin)
  → Mensagem deve desaparecer em aba 2 automaticamente
```

### Fluxo 6 — Testar Seed de Challenges (T-01)

```bash
# Verificar estado ANTES do seed
curl -X POST "https://api.supabase.com/v1/projects/wrcprmujlkwvusekfogf/database/query" \
  -H "Authorization: Bearer $(grep SUPABASE_ACCESS_TOKEN .env | cut -d= -f2)" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) FROM challenges"}'
# Deve retornar: 8

# Executar seed
npx tsx scripts/seed-challenges.ts

# Verificar estado DEPOIS
# Deve retornar: ~840 (depende de quantas challenges têm nos JSONs)
```

### Checklist de Validação Antes de Commitar

```
□ npm run build → 0 TypeScript errors
□ npm run lint → 0 ESLint warnings
□ Fluxo 1 (challenge completo) funciona
□ Fluxo 3 (novo usuário sem categoria) funciona
□ Console sem erros em flows testados
□ Supabase queries retornam dados corretos (verificar no dashboard)
```

---

## Apêndice — Comandos Úteis Supabase

### Executar SQL Diretamente (via Management API)

```bash
# Forma mais confiável de executar SQL no WSL2 (direct DB não funciona)
curl -X POST "https://api.supabase.com/v1/projects/wrcprmujlkwvusekfogf/database/query" \
  -H "Authorization: Bearer $(grep SUPABASE_ACCESS_TOKEN .env | cut -d= -f2)" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = '\''public'\'' ORDER BY tablename"}'
```

### Verificar Estado RLS

```bash
# Verificar quais tabelas têm RLS habilitado
# Todas as 16 tabelas devem mostrar rowsecurity: true
curl -X POST "https://api.supabase.com/v1/projects/wrcprmujlkwvusekfogf/database/query" \
  -H "Authorization: Bearer $(grep SUPABASE_ACCESS_TOKEN .env | cut -d= -f2)" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = '\''public'\'' ORDER BY tablename"}'
```

### Verificar Publicação Realtime

```bash
# 7 tabelas devem estar na publicação: profiles, user_earned_badges, user_preferences,
# community_messages, community_bans, message_reactions, message_reports
curl -X POST "https://api.supabase.com/v1/projects/wrcprmujlkwvusekfogf/database/query" \
  -H "Authorization: Bearer $(grep SUPABASE_ACCESS_TOKEN .env | cut -d= -f2)" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT tablename FROM pg_publication_tables WHERE pubname = '\''supabase_realtime'\'' ORDER BY tablename"}'
```

---

*Documento gerado em 2026-03-05 com base em análise completa do codebase ZAYIA.*
*Próxima prioridade: executar T-01 (seed 840 challenges) e T-02 (métricas CEO reais).*
