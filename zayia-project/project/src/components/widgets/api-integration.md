# 📡 Integração com API - Widget de Estatísticas de Desafios

## 🔌 Endpoints Necessários

### 1. **GET /api/challenges/stats**
Retorna estatísticas gerais de desafios

**Resposta esperada:**
```json
{
  "total_completed": 1247,
  "today_completed": 12,
  "average_daily": 8,
  "current_streak": 15,
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### 2. **GET /api/challenges/weekly**
Retorna dados das últimas 4 semanas

**Parâmetros:**
- `weeks`: número de semanas (padrão: 4)

**Resposta esperada:**
```json
{
  "data": [
    {
      "week_start": "2024-01-08",
      "week_end": "2024-01-14", 
      "week_label": "Semana 1",
      "completed": 45,
      "growth_percentage": 12.5,
      "challenges_by_day": [
        {"date": "2024-01-08", "completed": 8},
        {"date": "2024-01-09", "completed": 6},
        {"date": "2024-01-10", "completed": 7},
        {"date": "2024-01-11", "completed": 5},
        {"date": "2024-01-12", "completed": 9},
        {"date": "2024-01-13", "completed": 6},
        {"date": "2024-01-14", "completed": 4}
      ]
    }
  ]
}
```

### 3. **GET /api/challenges/monthly**
Retorna dados dos últimos 6 meses

**Parâmetros:**
- `months`: número de meses (padrão: 6)

**Resposta esperada:**
```json
{
  "data": [
    {
      "month": "2024-01",
      "month_label": "Janeiro",
      "completed": 234,
      "growth_percentage": 8.3,
      "challenges_by_category": {
        "mindfulness": 45,
        "fitness": 38,
        "learning": 52,
        "creativity": 29,
        "social": 33
      }
    }
  ]
}
```

### 4. **GET /api/challenges/categories**
Retorna breakdown por categoria

**Parâmetros:**
- `period`: "30d", "7d", "1d" (padrão: "30d")

**Resposta esperada:**
```json
{
  "period": "30d",
  "categories": [
    {
      "type": "mindfulness",
      "label": "Mindfulness",
      "icon": "🧘‍♀️",
      "completed": 45,
      "percentage": 23.5,
      "growth": 12.3
    },
    {
      "type": "fitness", 
      "label": "Fitness",
      "icon": "💪",
      "completed": 38,
      "percentage": 19.8,
      "growth": -2.1
    }
  ]
}
```

## 🔄 WebSocket para Tempo Real

### Conexão WebSocket
```javascript
const ws = new WebSocket('wss://api.zayia.com/ws/challenges')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  
  switch(data.type) {
    case 'challenge_completed':
      // Atualizar contador em tempo real
      updateChallengeCount(data.payload)
      break
      
    case 'stats_update':
      // Atualizar estatísticas gerais
      updateStats(data.payload)
      break
      
    case 'new_user_challenge':
      // Notificar novo desafio completado por usuário
      showNotification(data.payload)
      break
  }
}
```

### Estrutura de Mensagens WebSocket
```json
{
  "type": "challenge_completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "payload": {
    "user_id": "user-123",
    "challenge_type": "mindfulness",
    "challenge_id": "challenge-456",
    "points_earned": 50,
    "new_total": 1248
  }
}
```

## 🛠️ Implementação no React

### Hook Customizado para API
```typescript
// hooks/useChallengesStats.ts
import { useState, useEffect } from 'react'

interface ChallengesStatsHook {
  data: ChallengeData[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useChallengesStats(viewMode: 'weekly' | 'monthly'): ChallengesStatsHook {
  const [data, setData] = useState<ChallengeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const endpoint = viewMode === 'weekly' ? '/api/challenges/weekly' : '/api/challenges/monthly'
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados')
      }
      
      const result = await response.json()
      setData(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [viewMode])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}
```

### WebSocket Hook
```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react'

export function useWebSocket(url: string, onMessage: (data: any) => void) {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(url)
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      ws.current?.close()
    }
  }, [url, onMessage])

  return ws.current
}
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente
```env
# .env.local
VITE_API_BASE_URL=https://api.zayia.com
VITE_WS_URL=wss://api.zayia.com/ws
VITE_API_KEY=your_api_key_here
```

### Configuração do Cliente HTTP
```typescript
// lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }
}
```

## 📱 Responsividade

### Breakpoints Utilizados
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px  
- **Desktop:** > 1024px

### Classes Tailwind para Responsividade
```css
/* Mobile First */
.grid-cols-2          /* 2 colunas no mobile */
.sm:grid-cols-2       /* 2 colunas no tablet */
.lg:grid-cols-4       /* 4 colunas no desktop */

/* Flexbox responsivo */
.flex-col             /* Coluna no mobile */
.sm:flex-row          /* Linha no tablet+ */
```

## 🚀 Performance

### Otimizações Implementadas
1. **Debounce** nas atualizações em tempo real
2. **Memoização** dos cálculos pesados
3. **Lazy loading** dos gráficos
4. **Cache** das requisições API
5. **Animações** otimizadas com CSS

### Exemplo de Debounce
```typescript
import { debounce } from 'lodash'

const debouncedUpdate = debounce((newData) => {
  setData(newData)
}, 1000) // Atualiza no máximo a cada 1 segundo
```