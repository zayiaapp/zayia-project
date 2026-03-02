# 📊 ANÁLISE COMPLETA: PONTOS, NÍVEIS E CÁLCULOS DO ZAYIA

**Data:** 28 de Fevereiro de 2026
**Leitura Completa de:** badges-data-mock.ts + challenges-data-mock.ts + DashboardSection.tsx
**Status:** ✅ DOCUMENTAÇÃO FINALIZADA

---

## PASSO 1: NÍVEIS (LEVELS ARRAY - 10 Níveis)

### Tabela de Progressão de Níveis

| Nível | Nome | Pontos Req. | Progressão | Cor |
|-------|------|-----------|-----------|-----|
| 0 | Iniciante | 0 | — (inicial) | #D1D5DB (cinza) |
| 1 | Aprendiz | 2.203 | +2.203 pts | #60A5FA (azul claro) |
| 2 | Praticante | 4.406 | +2.203 pts | #06B6D4 (ciano) |
| 3 | Especialista | 6.609 | +2.203 pts | #FBBF24 (dourado) |
| 4 | Mestre | 8.812 | +2.203 pts | #FB923C (laranja) |
| 5 | Sábio | 11.015 | +2.203 pts | #A78BFA (roxo) |
| 6 | Lenda | 13.218 | +2.203 pts | #F87171 (rosa) |
| 7 | Imortal | 15.421 | +2.203 pts | #EC4899 (pink) |
| 8 | Divino | 17.624 | +2.203 pts | #6366F1 (índigo) |
| 9 | Supremo | 22.035 | +4.411 pts | #EC4899 (pink) |

### 🔍 ANÁLISE DA PROGRESSÃO DE NÍVEIS

**Padrão:** Progressão é linearmente **progressiva**
- Níveis 0-8: Cada nível requer **+2.203 pontos** a mais que o anterior
- Nível 9: Salto final de **+4.411 pontos** (dobro)
- **Total para atingir Supremo:** 22.035 pontos

**Fórmula (Níveis 1-8):**
```
Nível N = Nível(N-1) + 2.203
```

**Fórmula (Nível 9):**
```
Nível 9 = 22.035 (salto especial)
```

---

## PASSO 2: MEDALHAS POR CATEGORIA (7 Categorias + Global)

### 7 Categorias de Medalhas (4 níveis cada)

#### **1️⃣ ROTINA & ORGANIZAÇÃO**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total possível em desafios Rotina:** 120 desafios
**Total de pontos por medalhas:** 25 + 100 + 300 + 500 = **925 pts**

#### **2️⃣ RELACIONAMENTOS & COMUNICAÇÃO**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total possível em desafios:** 120 desafios
**Total de pontos por medalhas:** **925 pts**

#### **3️⃣ MINDFULNESS & EMOÇÕES**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total de pontos por medalhas:** **925 pts**

#### **4️⃣ CARREIRA E DESENVOLVIMENTO PROFISSIONAL**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total de pontos por medalhas:** **925 pts**

#### **5️⃣ DIGITAL DETOX**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total de pontos por medalhas:** **925 pts**

#### **6️⃣ AUTOESTIMA & AUTOCUIDADO**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total de pontos por medalhas:** **925 pts**

#### **7️⃣ CORPO & SAÚDE**
| Medalha | Requisito | Pontos | Rarity |
|---------|-----------|--------|--------|
| Iniciante | 1 desafio | +25 pts | common |
| Praticante | 30 desafios | +100 pts | uncommon |
| Mestre | 90 desafios | +300 pts | epic |
| Suprema | 120 desafios | +500 pts | legendary |

**Total de pontos por medalhas:** **925 pts**

---

### 🌍 MEDALHAS GLOBAIS (5 stages da Metamorfose)

| Medalha | Requisito Total | Pontos | Rarity | Descrição |
|---------|-----------------|--------|--------|-----------|
| 🥚 Ovo | 1 desafio | +10 pts | common | Inicio da jornada |
| 🐛 Lagarta | 20 desafios | +50 pts | common | Crescimento inicial |
| 🫘 Crisálida | 50 desafios | +100 pts | uncommon | Transformação |
| 🦋 Borboleta Emergente | 100 desafios | +200 pts | rare | Emergência |
| ✨ Borboleta Radiante | 840 desafios | +500 pts | legendary | MÁXIMO |

---

## PASSO 3: DESAFIOS POR CATEGORIA

### Contagem de Desafios (8 Categorias)

| Categoria | Fáceis | Difíceis | Total | Pts Fácil | Pts Difícil | Total Pts |
|-----------|--------|----------|-------|-----------|-------------|-----------|
| **Rotina** | 60 | 60 | 120 | 600 | 1.500 | **2.100** |
| **Saúde** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **Mindfulness** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **Relacionamentos** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **Carreira** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **Digital Detox** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **Autoestima** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **Compliance** | ~60 | ~60 | ~120 | ~600 | ~1.500 | ~**2.100** |
| **TOTAL** | ~480 | ~480 | ~960 | ~4.800 | ~12.000 | ~**16.800** |

### 🎯 Estrutura de Pontos de Desafios

- **Desafios FÁCEIS:** 10 pontos cada
- **Desafios DIFÍCEIS:** 25 pontos cada
- **Total GLOBAL de desafios:** ~960 desafios
- **Total POSSÍVEL de pontos (só desafios):** ~16.800 pontos

---

## PASSO 4: VALIDAÇÃO DE CÁLCULOS

### Cenário: User Novo Completa 2 Desafios

```
Estado Inicial:
├─ Pontos: 0
├─ Nível: 0
├─ Medalhas: 0
└─ Desafios Totais: 0

AÇÃO 1: Completa Desafio Fácil (Rotina) [10 pts]
├─ Pontos: 0 → 10
├─ Nível: 0 (precisa de 2.203 para Nível 1)
├─ Desbloqueia Ovo? SIM (1º desafio)
│  └─ Ganho: +10 pts
│  └─ Novos Pontos: 10 + 10 = 20 pts
└─ Desafios Totais: 0 → 1

AÇÃO 2: Completa Desafio Difícil (Rotina) [25 pts]
├─ Pontos: 20 + 25 = 45
├─ Nível: 0 (ainda precisa de 2.203 para Nível 1)
├─ Desbloqueia Iniciante (Rotina)? SIM (1º desafio)
│  └─ Ganho: +25 pts
│  └─ Novos Pontos: 45 + 25 = 70 pts
├─ Desafios Totais: 1 → 2
└─ Status Final:
   ├─ Pontos Totais: 70 pts
   ├─ Nível: 0 (faltam 2.133 para Nível 1)
   ├─ Medalhas Desbloqueadas: Ovo, Iniciante (Rotina)
   └─ Progresso: 70 / 2.203 = 3.2%
```

---

## PASSO 5: FLUXO DE ACUMULAÇÃO (Diagrama)

```
┌─────────────────────────────────────────────────────────┐
│              JORNADA DO USUÁRIO                         │
└─────────────────────────────────────────────────────────┘

[CONTA CRIADA]
    ↓
Nível: 0 | Pontos: 0 | Medalhas: 0 | Desafios: 0
    ↓
┌─ DESAFIO 1: Fácil [10 pts]
│  Pontos: 0 → 10
│  Medalha: Ovo [+10] → 20 pts
│  Nível: 0 (progresso: 20/2.203)
│  Desafios: 1
│  ├─ META: 1 desafio completo ✓
│  └─ PRÓXIMO: Lagarta (20 desafios)
    ↓
┌─ DESAFIO 2: Difícil [25 pts]
│  Pontos: 20 + 25 = 45
│  Medalha: Iniciante (Rotina) [+25] → 70 pts
│  Nível: 0 (progresso: 70/2.203)
│  Desafios: 2
│  ├─ META: Completa categoria parcialmente
│  └─ PRÓXIMO: Praticante (30 desafios)
    ↓
┌─ CONTINUA... Mais desafios completados
│  → Acumula pontos
│  → Desbloqueias medalhas
│  → Sobe de nível
│  → Progride na metamorfose 🦋
    ↓
┌─ NÍVEL 1: 2.203 pontos
│  ├─ Nome: Aprendiz
│  ├─ Ícone: Level1Icon3D (azul)
│  └─ Próximo: 4.406 pontos (2.203 a mais)
    ↓
[... ciclo contínuo até Nível 9 ...]
    ↓
┌─ NÍVEL 9: 22.035 pontos
│  ├─ Nome: Supremo
│  ├─ Ícone: Level9Icon3D (pink)
│  └─ Status: MÁXIMO ALCANÇADO
```

---

## PASSO 6: ANÁLISE DO CÓDIGO - DashboardSection.tsx

### ❌ PROBLEMAS IDENTIFICADOS

#### **PROBLEMA 1: Cálculo de Progresso de Nível - ERRADO**

**Localização:** DashboardSection.tsx, linhas 156-168

```typescript
// ❌ ERRADO - código atual
<span>{Math.min(100, ((profile?.points || 0) % 200))}%</span>

// EXPLICAÇÃO DO ERRO:
// Usa modulo 200, mas threshold é 2.203!
// (profile.points % 200) não funciona para progressão real

// Exemplo com 2.203 pontos:
// 2.203 % 200 = 3 → mostra 3% de progresso
// Mas deveria mostrar: 100% (atingiu Nível 1!)
```

**FIX NECESSÁRIO:**
```typescript
// ✅ CORRETO - deve calcular com base no nível atual
const currentLevel = profile?.level || 0
const currentLevelThreshold = LEVELS[currentLevel].pointsRequired
const nextLevelThreshold = LEVELS[currentLevel + 1]?.pointsRequired || currentLevelThreshold
const pointsInCurrentLevel = (profile?.points || 0) - currentLevelThreshold
const pointsForNextLevel = nextLevelThreshold - currentLevelThreshold
const progressPercent = Math.min(100, (pointsInCurrentLevel / pointsForNextLevel) * 100)
```

---

#### **PROBLEMA 2: Barra de Progresso - ERRADO**

**Localização:** DashboardSection.tsx, linha 162

```typescript
// ❌ ERRADO - código atual
style={{ width: `${Math.min(100, ((profile?.points || 0) % 200) / 2)}%` }}

// Dividi por 2? Por quê? Isso não faz sentido!
// Exemplo:
// Se usuário tem 100 pts: 100 % 200 / 2 = 50 / 2 = 25%
// Se usuário tem 2.203 pts: 2.203 % 200 / 2 = 3 / 2 = 1.5%
```

**FIX NECESSÁRIO:**
```typescript
// ✅ CORRETO
style={{ width: `${progressPercent}%` }}
```

---

#### **PROBLEMA 3: "Faltam X pontos para próximo nível" - ERRADO**

**Localização:** DashboardSection.tsx, linha 168

```typescript
// ❌ ERRADO - código atual
Faltam {200 - ((profile?.points || 0) % 200)} pontos para o próximo nível

// Exemplo:
// User com 2.203 pts (Nível 1):
// 200 - (2.203 % 200) = 200 - 3 = 197 pontos
// ERRADO! Deveria mostrar: "Faltam 2.203 pontos para Nível 2"
// Pois: 4.406 (Nível 2) - 2.203 (pontos atuais) = 2.203 faltam
```

**FIX NECESSÁRIO:**
```typescript
// ✅ CORRETO
Faltam {nextLevelThreshold - (profile?.points || 0)} pontos para o próximo nível
```

---

#### **PROBLEMA 4: Level Profile - POTENCIALMENTE ERRADO**

**Localização:** DashboardSection.tsx, linha 129 e 140

```typescript
// ⚠️ POTENCIAL PROBLEMA
const currentLevel = profile?.level || 1  // ← Por que default é 1?

// Deveria ser 0! User novo tem Nível 0.
// Se profile.level for undefined/null, deveria ser 0, não 1.

// Fórmula para calcular nível baseado em pontos:
const calculateLevel = (points: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].pointsRequired) return i
  }
  return 0
}
```

---

#### **PROBLEMA 5: "Próximos Milestones" - LÓGICA INCOMPLETA**

**Localização:** DashboardSection.tsx, linha 30

```typescript
// ⚠️ VERIFICAR
const milestones = getNextMilestones(points)

// Pergunta: getNextMilestones() retorna APENAS próximos níveis?
// Ou também medalhas de categoria e globais?

// Idealmente deveria retornar:
// 1. Próximo nível (level_1, level_2, etc)
// 2. Próximas medalhas de categoria
// 3. Próximas medalhas globais
// Tudo em ORDEM DE PROXIMIDADE (quanto menos pontos faltam)
```

---

## PASSO 7: TABELA FINAL COMPLETA

### 📋 ESTRUTURA COMPLETA DE PONTOS E NÍVEIS

```
═══════════════════════════════════════════════════════════════════
                    PROGRESSÃO DO ZAYIA
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      DESAFIOS POR CATEGORIA                     │
├─────────────────────┬────────┬──────────┬────────────────────────┤
│ Categoria           │ Total  │ Fáceis   │ Difíceis → Pontos Max  │
├─────────────────────┼────────┼──────────┼────────────────────────┤
│ Rotina              │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Saúde               │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Mindfulness         │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Relacionamentos     │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Carreira            │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Digital Detox       │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Autoestima          │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
│ Compliance          │ 120    │ 60×10pt  │ 60×25pt → 2.100 pts    │
├─────────────────────┼────────┼──────────┼────────────────────────┤
│ TOTAL DESAFIOS      │ ~960   │ ~480×10pt│ ~480×25pt → ~16.800 pts│
└─────────────────────┴────────┴──────────┴────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    MEDALHAS POR CATEGORIA                       │
│                     (7 categorias × 4 níveis)                   │
├────────────────────┬──────────────┬────────┬─────────────────────┤
│ Nível              │ Requisito    │ Pontos │ Total (7 cats)      │
├────────────────────┼──────────────┼────────┼─────────────────────┤
│ Iniciante          │ 1 desafio    │ +25    │ 25 × 7 = 175 pts    │
│ Praticante         │ 30 desafios  │ +100   │ 100 × 7 = 700 pts   │
│ Mestre             │ 90 desafios  │ +300   │ 300 × 7 = 2.100 pts │
│ Suprema            │ 120 desafios │ +500   │ 500 × 7 = 3.500 pts │
├────────────────────┼──────────────┼────────┼─────────────────────┤
│ TOTAL MEDALHAS CAT │              │        │ 6.475 pts           │
└────────────────────┴──────────────┴────────┴─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     MEDALHAS GLOBAIS                            │
├────────────────────┬──────────────┬────────┬─────────────────────┤
│ Medalha            │ Requisito    │ Pontos │ Descrição           │
├────────────────────┼──────────────┼────────┼─────────────────────┤
│ 🥚 Ovo             │ 1 desafio    │ +10    │ Primeiro passo      │
│ 🐛 Lagarta         │ 20 desafios  │ +50    │ Crescimento         │
│ 🫘 Crisálida       │ 50 desafios  │ +100   │ Transformação       │
│ 🦋 Borboleta Emerg │ 100 desafios │ +200   │ Emergência          │
│ ✨ Borboleta Radnt │ 840 desafios │ +500   │ Máximo              │
├────────────────────┼──────────────┼────────┼─────────────────────┤
│ TOTAL GLOBAL       │              │        │ 860 pts             │
└────────────────────┴──────────────┴────────┴─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PROGRESSÃO DE NÍVEIS                        │
├───────┬────────────┬──────────────┬─────────────────────────────┤
│ Nível │ Nome       │ Pontos Req.  │ Para Próximo Nível          │
├───────┼────────────┼──────────────┼─────────────────────────────┤
│ 0     │ Iniciante  │ 0            │ Faltam: 2.203 pts           │
│ 1     │ Aprendiz   │ 2.203        │ Faltam: 2.203 pts           │
│ 2     │ Praticante │ 4.406        │ Faltam: 2.203 pts           │
│ 3     │ Especialst │ 6.609        │ Faltam: 2.203 pts           │
│ 4     │ Mestre     │ 8.812        │ Faltam: 2.203 pts           │
│ 5     │ Sábio      │ 11.015       │ Faltam: 2.203 pts           │
│ 6     │ Lenda      │ 13.218       │ Faltam: 2.203 pts           │
│ 7     │ Imortal    │ 15.421       │ Faltam: 2.203 pts           │
│ 8     │ Divino     │ 17.624       │ Faltam: 4.411 pts           │
│ 9     │ Supremo    │ 22.035       │ ★ MÁXIMO ALCANÇADO ★        │
└───────┴────────────┴──────────────┴─────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                    POTENCIAL MÁXIMO
═══════════════════════════════════════════════════════════════════

Desafios:           ~16.800 pts
Medalhas Categoria: + 6.475 pts
Medalhas Globais:   +   860 pts
                    ───────────
TOTAL POSSÍVEL:     ~24.135 pts

Nível Máximo:       Nível 9 (Supremo) em 22.035 pts
Medalhas Máximas:   28 medalhas (7 cats × 4) + 5 globais = 33 medals
```

---

## PASSO 8: PROBLEMAS IDENTIFICADOS

### ❌ CRÍTICO - Cálculo de Progresso está COMPLETAMENTE ERRADO

| Problema | Local | Impacto | Severidade |
|----------|-------|---------|-----------|
| % Progresso usa modulo 200 | Linha 157 | Mostra % incorreto | 🔴 CRÍTICO |
| Barra divide por 2 | Linha 162 | Barra não progride corretamente | 🔴 CRÍTICO |
| "Faltam X pontos" usa modulo 200 | Linha 168 | Texto incorreto para usuário | 🔴 CRÍTICO |
| Default level é 1, não 0 | Linha 129 | User novo aparece Nível 1 | 🟠 ALTO |
| Cálculo de nível via points não automático | − | Nível pode desincronizar com pontos | 🟠 ALTO |

---

## RESUMO EXECUTIVO

### ✅ O QUE ESTÁ CORRETO
- Estrutura de LEVELS é bem definida
- BADGES por categoria seguem padrão consistente
- GLOBAL medals usam progressão 🐛→🦋 apropriada
- Desafios têm pontuação clara (10 fácil, 25 difícil)
- Arquitetura de localStorage persiste dados

### ❌ O QUE PRECISA SER FIXADO
1. **Refactorize progressão de nível** - use fórmula baseada em LEVELS array
2. **Corrija barra de progresso** - não use modulo 200
3. **Dinâmico "faltam X pontos"** - calcule do threshold real
4. **Considere calcular nível automaticamente** - baseado em points armazenados
5. **Validar sincronização** - profile.level vs profile.points

---

**PRÓXIMOS PASSOS:**
- [ ] Implementar fixes de cálculo de nível
- [ ] Testar com múltiplos cenários de pontos
- [ ] Validar DashboardSection com dados reais
- [ ] Revisar getNextMilestones() para inclusão de medalhas
- [ ] Documentar formulas em código

