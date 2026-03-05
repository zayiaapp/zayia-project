#!/bin/bash
# Auditoria de mock data — foca em problemas REAIS, não type imports
# badges-data-mock.ts é configuração real (BADGES, LEVELS) — não é mock data

echo "🔍 Auditoria de Mock Data — ZAYIA"
echo "=================================="
ERRORS=0

# 1. generateMock chamado em componentes (excluindo definições em arquivos mock e fallbacks de erro)
echo ""
echo "1️⃣  generateMock chamado em componentes UI (não em arquivos mock):"
GEN_MOCK=$(grep -rn "generateMock\|generateChartData\|mockAllWinners\|generateMockRanking" \
  src/components/ src/contexts/ \
  --include="*.tsx" --include="*.ts" 2>/dev/null \
  | grep -v "generateMockGuerreiras\(\)" \
  | grep -v "src/lib/")
if [ -z "$GEN_MOCK" ]; then
  echo "   ✅ Nenhuma chamada a generateMock em componentes"
else
  echo "   ❌ generateMock chamado em componentes:"
  echo "$GEN_MOCK" | sed 's/^/   /'
  ERRORS=$((ERRORS + 1))
fi

# 2. Math.random() em componentes de DADOS (excluindo animações UI e utilitários)
echo ""
echo "2️⃣  Math.random() em componentes de dados (excluindo modais de celebração e utils):"
MATH_RANDOM=$(grep -rn "Math.random()" src/components/ --include="*.tsx" --include="*.ts" 2>/dev/null \
  | grep -v "PopUpMedalUnlocked\|LevelUpModal\|PopUpCelebration\|confetti\|animation\|particle\|emoji" \
  | grep -v "GuerreirasSection" \
  | grep -v "src/lib/")
if [ -z "$MATH_RANDOM" ]; then
  echo "   ✅ Nenhum Math.random() em dados de componentes"
else
  echo "   ❌ Math.random() suspeito:"
  echo "$MATH_RANDOM" | sed 's/^/   /'
  ERRORS=$((ERRORS + 1))
fi

# 3. localStorage para dados críticos de usuário (pontos, badges, streak)
echo ""
echo "3️⃣  localStorage para dados críticos de usuário:"
LS_CRITICAL=$(grep -rn \
  "localStorage.getItem('user_points')\|localStorage.getItem('earned_badges')\|localStorage.getItem('user_streak')\|localStorage.getItem('zayia_user_challenges'" \
  src/ --include="*.tsx" --include="*.ts" 2>/dev/null)
if [ -z "$LS_CRITICAL" ]; then
  echo "   ✅ Nenhum localStorage crítico"
else
  echo "   ❌ localStorage para dados críticos:"
  echo "$LS_CRITICAL" | sed 's/^/   /'
  ERRORS=$((ERRORS + 1))
fi

# 4. seedLocalStorage (workaround removido)
echo ""
echo "4️⃣  seedLocalStorage (workaround):"
SEED_LS=$(grep -rn "seedLocalStorage" src/ 2>/dev/null)
if [ -z "$SEED_LS" ]; then
  echo "   ✅ seedLocalStorage removido"
else
  echo "   ❌ seedLocalStorage ainda presente:"
  echo "$SEED_LS" | sed 's/^/   /'
  ERRORS=$((ERRORS + 1))
fi

# 5. Métricas hardcoded do CEO Dashboard (os valores que foram removidos)
echo ""
echo "5️⃣  Métricas hardcoded do CEO:"
CEO_METRICS=$(grep -rn '"1,247"\|"892"\|"2,834"\|>1,247<\|>892<\|>2,834<' src/ --include="*.tsx" 2>/dev/null)
if [ -z "$CEO_METRICS" ]; then
  echo "   ✅ Nenhuma métrica hardcoded do CEO"
else
  echo "   ❌ Métricas hardcoded:"
  echo "$CEO_METRICS" | sed 's/^/   /'
  ERRORS=$((ERRORS + 1))
fi

# 6. Data fake hardcoded (nomes de pessoas em portugues como dados, não placeholders)
echo ""
echo "6️⃣  Nomes hardcoded como dados (não placeholders):"
HARDCODED=$(grep -rn '"Maria Silva\|"Ana Costa\|"Julia Santos\|"Helena Rocha' src/ --include="*.tsx" 2>/dev/null \
  | grep -v "placeholder\|test\|example")
if [ -z "$HARDCODED" ]; then
  echo "   ✅ Nenhum nome hardcoded como dado"
else
  echo "   ❌ Nomes hardcoded como dados:"
  echo "$HARDCODED" | sed 's/^/   /'
  ERRORS=$((ERRORS + 1))
fi

# 7. Verificar arquivos de mock que podem ser deletados
echo ""
echo "7️⃣  Arquivos de mock — uso atual:"
for file in \
  "src/lib/ranking-data-mock.ts" \
  "src/lib/community-data-mock.ts" \
  "src/lib/badges-storage.ts" \
  "src/lib/challenges-storage.ts"
do
  filename=$(basename "$file" .ts)
  USAGE=$(grep -rn "from.*$filename\|require.*$filename" src/ --include="*.tsx" --include="*.ts" 2>/dev/null \
    | grep -v "^$file:")
  if [ -z "$USAGE" ]; then
    echo "   ✅ $file — não importado (pode ser deletado)"
  else
    echo "   📋 $file — ainda importado (ver MOCK-DATA-INVENTORY.md)"
  fi
done

# 8. Resumo
echo ""
echo "=================================="
if [ $ERRORS -eq 0 ]; then
  echo "🎉 AUDITORIA PASSOU — Zero mock data crítico em produção!"
  echo ""
  echo "📋 Exceções documentadas intencionalmente:"
  echo "   - badges-data-mock.ts: configuração real (BADGES/LEVELS) — mantido"
  echo "   - challenges-data-mock.ts: tipos (ChallengeCategory/Challenge) — mantido"
  echo "   - ranking-data-mock.ts: tipos (MonthlyWinner/PrizePayment) — mantido"
  echo "   - community-data-mock.ts: tipo (MessageReaction) — mantido"
  echo "   - Math.random() em modais: animações de celebração — aceitável"
  echo "   - generateMockGuerreiras(): fallback de erro em GuerreirasSection — aceitável"
  echo "   Ver: docs/architecture/MOCK-DATA-INVENTORY.md"
else
  echo "❌ AUDITORIA FALHOU — $ERRORS categorias com problemas críticos"
  exit 1
fi
