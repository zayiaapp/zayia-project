# Seção "Guerreiras" - Admin Dashboard - Documentação Completa

## 1. Visão Geral

**Seção**: Guerreiras (Gerenciamento de Usuárias)
**Arquivo Principal**: `src/components/ceo/GuerreirasSection.tsx`
**Stack**: React 18 + TypeScript + Tailwind CSS + Supabase
**Localização**: CEO Dashboard → Menu "Guerreiras"
**Tamanho**: 1.421 linhas de código
**Funcionalidades**: CRUD completo de usuárias, búsca, filtros, visualização de progresso

---

## 2. Tipos/Interfaces

### Interface Profile (Base)
Localizado em: `src/lib/supabase-client.ts`

```typescript
export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'ceo'
  avatar_url?: string
  phone?: string
  birth_date?: string
  location?: string
  profession?: string
  education?: string
  bio?: string
  streak?: number
  total_sessions?: number
  points?: number
  level?: number
  completed_challenges?: number
  subscription_plan?: 'basic' | 'premium' | 'vip'
  subscription_status?: 'active' | 'cancelled' | 'expired'
  notifications_enabled?: boolean
  community_access?: boolean
  mentor_status?: 'none' | 'mentee' | 'mentor'
  created_at: string
  updated_at: string
}
```

### Interface Guerreira (Estendida)
Localizado em: `src/components/ceo/GuerreirasSection.tsx`

```typescript
interface Guerreira extends Profile {
  cpf?: string
  address?: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipcode: string
  }
  category_progress?: {
    autoestima: { completed: number, total: number, percentage: number }
    rotina: { completed: number, total: number, percentage: number }
    mindfulness: { completed: number, total: number, percentage: number }
    corpo_saude: { completed: number, total: number, percentage: number }
    relacionamentos: { completed: number, total: number, percentage: number }
    carreira: { completed: number, total: number, percentage: number }
    digital_detox: { completed: number, total: number, percentage: number }
  }
  badges_earned?: Array<{
    id: string
    name: string
    description: string
    icon: string
    color: string
    earned_date: string
  }>
  membership_status?: 'trial' | 'active' | 'suspended' | 'cancelled'
}
```

### Interface UserProgress
Localizado em: `src/lib/supabase-client.ts`

```typescript
export interface UserProgress {
  id: string
  user_id: string
  challenge_id: string
  challenge_category: string
  challenge_difficulty: 'facil' | 'dificil'
  points_earned: number
  duration_minutes: number
  completed_at: string
  created_at: string
}
```

---

## 3. Arquivo Principal - GuerreirasSection.tsx

**Localização**: `src/components/ceo/GuerreirasSection.tsx`
**Tipo**: React Functional Component
**Dependências Principais**:
- React Hooks (useState, useEffect)
- supabaseClient (SupabaseClient class)
- integrationsManager (external integrations)
- LoadingSpinner (UI component)
- lucide-react (icons)

### Estrutura do Componente

```
GuerreirasSection
├── State Management
│   ├── guerreiras (list of users)
│   ├── filteredGuerreiras (filtered list)
│   ├── loading (loading state)
│   ├── error (error state)
│   ├── searchTerm (search input)
│   ├── selectedGuerreira (selected user)
│   ├── showModal (modal visibility)
│   ├── editingGuerreira (editing state)
│   ├── showDeleteModal (delete confirmation)
│   ├── deleteTarget (user to delete)
│   └── filters (active filters)
│
├── Effects
│   ├── loadGuerreiras() - fetch users on mount
│   ├── filterGuerreiras() - apply filters and search
│   └── real-time sync via Supabase
│
├── Handlers
│   ├── handleSearch() - search implementation
│   ├── handleFilter() - apply filters
│   ├── handleViewDetails() - show details modal
│   ├── handleEditGuerreira() - edit user
│   ├── handleSaveGuerreira() - save changes
│   ├── handleDeleteGuerreira() - delete user
│   └── handleStatusToggle() - toggle active/inactive
│
└── UI Sections
    ├── Header with title and action buttons
    ├── Search bar + Filter controls
    ├── Guerreiras list/table
    ├── User details modal
    ├── Edit modal
    └── Delete confirmation modal
```

### Principais Funcionalidades

1. **Carregamento de Dados**
   - Busca lista de usuárias (guerreiras) do Supabase
   - Calcula estatísticas (pontos, medalhas, progresso por categoria)
   - Sincroniza em tempo real

2. **Busca e Filtros**
   - Busca por nome/email
   - Filtro por status (ativo/inativo)
   - Filtro por plano de assinatura
   - Filtro por data de entrada

3. **CRUD Operations**
   - Create: Adicionar nova usuária (via modal)
   - Read: Visualizar detalhes da usuária
   - Update: Editar dados da usuária
   - Delete: Deletar usuária com confirmação

4. **Visualização de Progresso**
   - Mostrar pontos totais
   - Mostrar nível
   - Mostrar medalhas conquistadas
   - Mostrar progresso por categoria de desafios

5. **Gerenciamento de Status**
   - Ativar/desativar usuária
   - Mudar plano de assinatura
   - Mudar status de assinatura

---

## 4. Queries Supabase Utilizadas

### Buscar Todas as Usuárias
```typescript
supabaseClient.getProfiles()
```
**Query**: SELECT * FROM profiles ORDER BY created_at DESC

### Buscar Usuária Específica
```typescript
supabaseClient.getProfile(id: string)
```
**Query**: SELECT * FROM profiles WHERE id = ? LIMIT 1

### Atualizar Usuária
```typescript
supabaseClient.updateProfile(id: string, updates: Partial<Profile>)
```
**Query**: UPDATE profiles SET ... WHERE id = ? RETURNING *

### Buscar Progresso da Usuária
```typescript
supabaseClient.getUserProgress(userId: string)
```
**Query**: SELECT * FROM user_progress WHERE user_id = ? ORDER BY completed_at DESC

### Deletar Usuária
```typescript
supabaseClient.deleteProfile(id: string)
```
**Query**: DELETE FROM profiles WHERE id = ?

---

## 5. Estrutura de Dados - Supabase Schema

### Tabela: profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT ('user' | 'ceo'),
  avatar_url TEXT,
  phone TEXT,
  birth_date TEXT,
  location TEXT,
  profession TEXT,
  education TEXT,
  bio TEXT,
  streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  completed_challenges INTEGER DEFAULT 0,
  subscription_plan TEXT ('basic' | 'premium' | 'vip'),
  subscription_status TEXT ('active' | 'cancelled' | 'expired'),
  notifications_enabled BOOLEAN DEFAULT true,
  community_access BOOLEAN DEFAULT true,
  mentor_status TEXT ('none' | 'mentee' | 'mentor'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Tabela: user_progress
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  challenge_id TEXT,
  challenge_category TEXT,
  challenge_difficulty TEXT ('facil' | 'dificil'),
  points_earned INTEGER,
  duration_minutes INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP
)
```

---

## 6. Funcionalidades Implementadas

### ✅ Gerenciamento de Usuárias
- [x] Listar todas as guerreiras
- [x] Visualizar detalhes completos
- [x] Editar dados de perfil
- [x] Deletar usuária
- [x] Ativar/desativar usuária
- [x] Mudar plano de assinatura

### ✅ Busca e Filtros
- [x] Busca por nome/email (real-time)
- [x] Filtro por status (ativo/inativo)
- [x] Filtro por plano de assinatura
- [x] Filtro por período de entrada
- [x] Combinação de múltiplos filtros

### ✅ Visualização de Estatísticas
- [x] Mostrar pontos totais
- [x] Mostrar nível/ranking
- [x] Listar medalhas conquistadas
- [x] Mostrar progresso por categoria
- [x] Mostrar taxa de conclusão

### ✅ Modais
- [x] Modal de detalhes (visualização)
- [x] Modal de edição (atualização)
- [x] Modal de confirmação (delete)

### ✅ UI/UX
- [x] Responsivo (desktop/tablet)
- [x] Loading states
- [x] Error handling
- [x] Feedback visual (alertas)
- [x] ZAYIA theme colors

---

## 7. Design/Estilos

### Classes Tailwind Principais Usadas

#### Container e Layout
```css
.zayia-card - card/container styling
.space-y-6 - vertical spacing
.grid - grid layouts
.flex - flexbox layouts
.rounded-xl - border radius
.shadow-lg - shadows
```

#### Cores ZAYIA Theme
```css
.text-zayia-deep-violet - #6B46C1
.text-zayia-soft-purple - #A78BFA
.bg-zayia-lilac - background
.bg-zayia-lavender - secondary background
```

#### Componentes
```css
.zayia-button - button styling
.zayia-input - input field styling
.zayia-gradient-text - gradient text effect
.zayia-gradient - gradient backgrounds
```

#### Estados e Interações
```css
hover: - hover states
disabled: - disabled states
transition - smooth transitions
```

---

## 8. Imports e Dependências

### Imports Internos
```typescript
import React, { useState, useEffect } from 'react'
import { supabaseClient, type Profile } from '../../lib/supabase-client'
import { integrationsManager } from '../../lib/integrations-manager'
import { LoadingSpinner } from '../ui/LoadingSpinner'
```

### Lucide Icons Utilizados
```typescript
Plus, Search, Eye, Power, PowerOff, X, Save, User, Mail, Phone,
MapPin, Briefcase, GraduationCap, Calendar, FileText, Trophy,
Target, Star, Crown, Shield, Award, Zap, Heart, Brain, Dumbbell,
MessageCircle, Home, Smartphone, CheckCircle, Clock, TrendingUp,
Users, Activity, Flame, Gem, Medal, Sparkles
```

---

## 9. Fluxo de Dados

```
┌─────────────────────┐
│   Carregamento      │
│  (useEffect)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  supabaseClient.getProfiles()   │
│  (Busca lista de usuárias)      │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Processar dados                │
│  - Calcular pontos              │
│  - Processar medalhas           │
│  - Atualizar estado             │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Filtrar/Buscar                 │
│  (filterGuerreiras)             │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Renderizar UI                  │
│  - Lista de guerreiras          │
│  - Detalhes selecionados        │
└─────────────────────────────────┘
```

---

## 10. Notas Importantes e Considerações

### ⚠️ Arquitetura
- Componente monolítico (GuerreirasSection) com muita lógica
- Possibilidade de break down em sub-componentes
- Estado gerenciado localmente (props drilling pode ocorrer)

### 🔒 Segurança
- Depende de RLS (Row Level Security) do Supabase
- Apenas CEO deve ter acesso a esta seção
- Todas as operações devem verificar permissões

### 📊 Performance
- Lista pode ficar lenta com muitas usuárias (>1000)
- Considerar paginação/virtualização no futuro
- Busca é client-side (pode ser otimizada com server-side)

### 🔄 Sincronização
- Usa real-time Supabase (BroadcastChannel)
- Atualiza automaticamente quando dados mudam em outra aba/sessão

### 📱 Responsividade
- Tailwind responsive classes usadas
- Testado em desktop/tablet
- Mobile pode precisar ajustes

### 🎨 Design
- Segue ZAYIA theme colors
- Usa lucide-react icons
- Consistent com resto do dashboard

### 🚀 Oportunidades de Melhoria
1. Dividir em sub-componentes (GuerreiraCard, GuerreiraModal, etc)
2. Extrair lógica para hooks customizados
3. Adicionar paginação
4. Melhorar performance de search (debounce)
5. Adicionar exportação de dados
6. Adicionar bulk operations
7. Adicionar view alternativa (lista vs grid)

---

## 11. Referências de Código-Chave

### Estado Principal
```typescript
const [guerreiras, setGuerreiras] = useState<Guerreira[]>([])
const [filteredGuerreiras, setFilteredGuerreiras] = useState<Guerreira[]>([])
const [loading, setLoading] = useState(true)
const [searchTerm, setSearchTerm] = useState('')
const [selectedGuerreira, setSelectedGuerreira] = useState<Guerreira | null>(null)
const [showModal, setShowModal] = useState(false)
const [editingGuerreira, setEditingGuerreira] = useState<Guerreira | null>(null)
```

### Função de Carregamento
Busca todas as usuárias e calcula estatísticas incluindo pontos, medalhas e progresso por categoria.

### Função de Filtro
Aplica múltiplos filtros (status, plano, data) e busca em tempo real no nome/email.

---

## 12. Próximos Passos

### Para Sincronizar com User Side:
1. Criar `src/components/user/GuerreirasDashboard.tsx`
2. Exibir lista pública de guerreiras (sem dados privados)
3. Mostrar ranking
4. Sincronizar medalhas conquistadas
5. Permitir filtros (básicos)

### Dados a Sincronizar:
- Nome/full_name
- Avatar
- Pontos (points)
- Nível (level)
- Medalhas (badges_earned)
- Status do progresso

---

**Data de Extração**: 02/03/2026
**Versão**: 1.0
**Status**: ✅ Completa
