import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Lê .env manualmente (não usa dotenv para manter simples)
function readEnv(): Record<string, string> {
  const envPath = path.join(__dirname, '../.env')
  const content = fs.readFileSync(envPath, 'utf-8')
  const env: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  }
  return env
}

const env = readEnv()

// Service Role Key ignora RLS — necessário para INSERT em batch
const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

// Mapa: nome do arquivo JSON → nome da categoria no DB (exato, case-sensitive)
// NOTA: nomes do banco estão em snake_case lowercase (verificado via SELECT name FROM challenge_categories)
const FILE_TO_CATEGORY: Record<string, string> = {
  'autoestima.json':      'autoestima',
  'corpo_saude.json':     'corpo_saude',
  'carreira.json':        'carreira',
  'relacionamentos.json': 'relacionamentos',
  'mindfulness.json':     'mindfulness',
  'digital_detox.json':   'digital_detox',
  'rotina.json':          'rotina',
  // compliance.json está vazio — não incluso
}

interface JsonChallenge {
  id: string
  title: string
  description?: string
  points?: number
  duration?: number
}

interface JsonCategory {
  label?: string
  facil: JsonChallenge[]
  dificil: JsonChallenge[]
}

async function seedChallenges() {
  console.log('🌱 Iniciando seed de challenges...\n')

  // 1. Busca categorias do banco
  const { data: categories, error: catError } = await supabase
    .from('challenge_categories')
    .select('id, name')

  if (catError || !categories) {
    console.error('❌ Erro ao buscar categorias:', catError)
    process.exit(1)
  }

  console.log(`✅ ${categories.length} categorias encontradas no banco`)
  console.log('   ', categories.map(c => c.name).join(', '))
  console.log()

  let totalInserted = 0
  let totalSkipped = 0

  // 2. Para cada arquivo JSON
  const dataDir = path.join(__dirname, '../src/data')

  for (const [filename, categoryName] of Object.entries(FILE_TO_CATEGORY)) {
    const filePath = path.join(dataDir, filename)

    // Verifica se arquivo existe
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Arquivo não encontrado: ${filename} — pulando`)
      continue
    }

    const json: JsonCategory = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // Verifica se arquivo tem conteúdo
    if (!json.facil?.length && !json.dificil?.length) {
      console.log(`⏭️  ${filename}: vazio — pulando`)
      continue
    }

    // Encontra categoria no banco (busca por nome, case-insensitive)
    const category = categories.find(c =>
      c.name.toLowerCase() === categoryName.toLowerCase()
    )

    if (!category) {
      console.error(`❌ Categoria "${categoryName}" não encontrada no banco!`)
      console.error('   Categorias disponíveis:', categories.map(c => c.name))
      continue
    }

    // Idempotência: pula se já existem challenges para a categoria
    const { count: existingCount } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)

    if (existingCount && existingCount > 0) {
      console.log(`⏭️  ${filename}: ${existingCount} challenges já existem para "${categoryName}" — pulando`)
      continue
    }

    // Prepara rows para inserção
    // NOTA: DB constraint usa 'facil'/'dificil' (PT), não 'easy'/'hard'
    const rows = [
      ...(json.facil || []).map((ch) => ({
        category_id: category.id,
        title: ch.title,
        description: ch.description || null,
        difficulty: 'facil' as const,
        points_easy: ch.points || 10,
        points_hard: 10,
        duration_minutes: ch.duration || 5,
        is_active: true,
      })),
      ...(json.dificil || []).map((ch) => ({
        category_id: category.id,
        title: ch.title,
        description: ch.description || null,
        difficulty: 'dificil' as const,
        points_easy: 10,
        points_hard: ch.points || 25,
        duration_minutes: ch.duration || 10,
        is_active: true,
      })),
    ]

    // Insere em batches de 100 (evita timeout)
    const batchSize = 100
    let batchErrors = 0

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const { error: insertError } = await supabase
        .from('challenges')
        .insert(batch)

      if (insertError) {
        console.error(`❌ Erro batch ${i}-${i + batchSize} de ${filename}:`, insertError.message)
        batchErrors++
      } else {
        totalInserted += batch.length
      }
    }

    const status = batchErrors > 0 ? `⚠️  ${batchErrors} erros` : '✅'
    console.log(`${status} ${filename}: ${rows.length} challenges (${json.facil?.length || 0} fáceis + ${json.dificil?.length || 0} difíceis) → categoria: ${category.name}`)
    if (batchErrors > 0) totalSkipped += rows.length
  }

  console.log('\n========================================')
  console.log(`✅ Inseridos: ${totalInserted} challenges`)
  if (totalSkipped > 0) {
    console.log(`⚠️  Com erros: ${totalSkipped} challenges`)
  }
  console.log('========================================')

  // 3. Verificação final
  const { count } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📊 Total de challenges no banco agora: ${count}`)
  if (count && count >= 840) {
    console.log('🎉 Seed completo! Banco tem >= 840 challenges.')
  } else {
    console.warn(`⚠️  Esperado >= 840, mas tem ${count}. Verificar logs acima.`)
  }
}

seedChallenges().catch((err) => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
