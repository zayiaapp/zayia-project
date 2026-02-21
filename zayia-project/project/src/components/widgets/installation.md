# 🚀 Instalação e Configuração - Widget de Estatísticas de Desafios

## 📦 Dependências Necessárias

### Instalar Pacotes
```bash
npm install lucide-react lodash
npm install -D @types/lodash
```

### Dependências já incluídas no projeto ZAYIA:
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Tailwind Merge
- ✅ clsx

## 🔧 Configuração Inicial

### 1. Adicionar o Widget ao Dashboard CEO

```typescript
// src/components/ceo/CEODashboard.tsx
import { ChallengesStatsWidget } from '../widgets/ChallengesStatsWidget'

// Adicionar na seção de conteúdo:
const renderDashboard = () => (
  <div className="space-y-6">
    {/* Outros componentes existentes */}
    
    {/* NOVO: Widget de Estatísticas de Desafios */}
    <ChallengesStatsWidget />
    
    {/* Resto do conteúdo */}
  </div>
)
```

### 2. Configurar Variáveis de Ambiente

```bash
# .env.local
VITE_API_BASE_URL=https://api.zayia.com
VITE_WS_URL=wss://api.zayia.com/ws/challenges
VITE_API_KEY=your_api_key_here
VITE_ENABLE_REAL_TIME=true
```

### 3. Configurar Cliente HTTP (Opcional)

```typescript
// src/lib/api-client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_KEY = import.meta.env.VITE_API_KEY

export class ApiClient {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
```

## 🎨 Personalização de Estilos

### Adicionar Animações Customizadas ao Tailwind

```javascript
// tailwind.config.js
module.exports = {
  // ... configuração existente
  theme: {
    extend: {
      // ... cores existentes
      animation: {
        // ... animações existentes
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    }
  }
}
```

### CSS Customizado (Opcional)

```css
/* src/components/widgets/challenges-widget.css */
.challenges-widget {
  /* Gradiente personalizado para barras */
  --gradient-primary: linear-gradient(135deg, #7C3AED, #A855F7);
  --gradient-secondary: linear-gradient(135deg, #A855F7, #C084FC);
  
  /* Sombras customizadas */
  --shadow-soft: 0 4px 20px rgba(124, 58, 237, 0.1);
  --shadow-medium: 0 8px 30px rgba(124, 58, 237, 0.15);
}

.progress-bar-animated {
  background: var(--gradient-primary);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar-animated::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Responsividade customizada */
@media (max-width: 640px) {
  .challenges-widget .grid-responsive {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .challenges-widget .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1025px) {
  .challenges-widget .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
```

## 🔌 Integração com Backend Existente

### Adapter para Supabase (se usando)

```typescript
// src/lib/supabase-adapter.ts
import { supabase } from './supabase'

export class SupabaseChallengesAdapter {
  async getChallengesStats() {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        id,
        completed_at,
        challenge_type,
        points_earned,
        user_id
      `)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })

    if (error) throw error

    return this.transformToWidgetFormat(data)
  }

  async getWeeklyStats(weeks = 4) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (weeks * 7))

    const { data, error } = await supabase
      .from('challenges')
      .select('completed_at, challenge_type, points_earned')
      .gte('completed_at', startDate.toISOString())
      .not('completed_at', 'is', null)

    if (error) throw error

    return this.groupByWeeks(data, weeks)
  }

  private transformToWidgetFormat(data: any[]) {
    // Transformar dados do Supabase para o formato esperado pelo widget
    return data.map(item => ({
      date: item.completed_at.split('T')[0],
      completed: 1, // Cada registro é um desafio completado
      type: item.challenge_type,
      points: item.points_earned
    }))
  }

  private groupByWeeks(data: any[], weeks: number) {
    // Agrupar dados por semana
    const weeklyData = []
    const today = new Date()

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - (today.getDay() + 7 * i))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekData = data.filter(item => {
        const itemDate = new Date(item.completed_at)
        return itemDate >= weekStart && itemDate <= weekEnd
      })

      weeklyData.push({
        week: `Semana ${weeks - i}`,
        completed: weekData.length,
        growth: i > 0 ? Math.random() * 20 - 10 : 0 // Mock growth
      })
    }

    return weeklyData
  }
}
```

## 🧪 Modo de Desenvolvimento

### Mock Data para Testes

```typescript
// src/lib/mock-data.ts
export const mockChallengesData = {
  stats: {
    total_completed: 1247,
    today_completed: 12,
    average_daily: 8,
    current_streak: 15
  },
  weekly: [
    { week: 'Semana 1', completed: 45, growth: 12 },
    { week: 'Semana 2', completed: 52, growth: 15 },
    { week: 'Semana 3', completed: 48, growth: -8 },
    { week: 'Semana 4', completed: 41, growth: -15 }
  ],
  monthly: [
    { month: 'Ago', completed: 180, growth: 5 },
    { month: 'Set', completed: 195, growth: 8 },
    { month: 'Out', completed: 210, growth: 7 },
    { month: 'Nov', completed: 234, growth: 11 },
    { month: 'Dez', completed: 198, growth: -15 },
    { month: 'Jan', completed: 234, growth: 18 }
  ],
  categories: [
    { type: 'mindfulness', count: 45, growth: 12 },
    { type: 'fitness', count: 38, growth: -2 },
    { type: 'learning', count: 52, growth: 15 },
    { type: 'creativity', count: 29, growth: 5 },
    { type: 'social', count: 33, growth: 8 }
  ]
}

// Função para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
```

### Variável de Ambiente para Mock

```typescript
// No componente ChallengesStatsWidget.tsx
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

useEffect(() => {
  if (USE_MOCK_DATA) {
    // Usar dados mock
    setData(mockChallengesData)
  } else {
    // Fazer requisição real para API
    fetchRealData()
  }
}, [])
```

## 🚀 Deploy e Produção

### Otimizações para Produção

```typescript
// src/lib/performance.ts
import { debounce } from 'lodash'

// Debounce para atualizações em tempo real
export const debouncedUpdate = debounce((callback: Function, data: any) => {
  callback(data)
}, 1000)

// Cache simples para requisições
const cache = new Map()

export const cachedFetch = async (url: string, ttl = 60000) => {
  const cached = cache.get(url)
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }

  const data = await fetch(url).then(res => res.json())
  cache.set(url, { data, timestamp: Date.now() })
  
  return data
}
```

### Configuração de Build

```json
// package.json - adicionar scripts se necessário
{
  "scripts": {
    "build:widget": "tsc && vite build --mode widget",
    "preview:widget": "vite preview --mode widget"
  }
}
```

## 📱 Testes

### Teste Básico do Componente

```typescript
// src/components/widgets/__tests__/ChallengesStatsWidget.test.tsx
import { render, screen } from '@testing-library/react'
import { ChallengesStatsWidget } from '../ChallengesStatsWidget'

describe('ChallengesStatsWidget', () => {
  test('renders widget title', () => {
    render(<ChallengesStatsWidget />)
    expect(screen.getByText('📊 Estatísticas de Desafios')).toBeInTheDocument()
  })

  test('shows loading state initially', () => {
    render(<ChallengesStatsWidget />)
    expect(screen.getByText('Atualizando...')).toBeInTheDocument()
  })

  test('switches between weekly and monthly view', () => {
    render(<ChallengesStatsWidget />)
    
    const monthlyButton = screen.getByText('Mensal')
    fireEvent.click(monthlyButton)
    
    expect(screen.getByText('Últimos 6 Meses')).toBeInTheDocument()
  })
})
```

## ✅ Checklist de Instalação

- [ ] Instalar dependências (`npm install lucide-react lodash`)
- [ ] Configurar variáveis de ambiente
- [ ] Importar widget no dashboard CEO
- [ ] Configurar cliente HTTP (se necessário)
- [ ] Testar em modo desenvolvimento
- [ ] Configurar WebSocket (se disponível)
- [ ] Testar responsividade
- [ ] Verificar performance
- [ ] Deploy para produção

## 🆘 Troubleshooting

### Problemas Comuns

1. **Widget não aparece:**
   - Verificar se foi importado corretamente
   - Checar console para erros de TypeScript

2. **Dados não carregam:**
   - Verificar variáveis de ambiente
   - Checar network tab para erros de API

3. **Animações não funcionam:**
   - Verificar se Tailwind está configurado corretamente
   - Checar se as classes customizadas foram adicionadas

4. **WebSocket não conecta:**
   - Verificar URL do WebSocket
   - Checar se o servidor suporta WebSocket

### Logs de Debug

```typescript
// Adicionar no início do componente para debug
const DEBUG = import.meta.env.VITE_DEBUG === 'true'

if (DEBUG) {
  console.log('ChallengesStatsWidget: Data loaded', data)
  console.log('ChallengesStatsWidget: View mode', viewMode)
}
```