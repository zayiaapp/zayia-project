#!/usr/bin/env node

/**
 * Execute Supabase Migrations via REST API
 *
 * This script uses the Supabase REST API with the service role key to execute SQL migrations.
 */

const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

async function executeMigration(migrationPath) {
  const filename = path.basename(migrationPath)
  console.log(`\n📝 Reading: ${filename}`)

  const sql = fs.readFileSync(migrationPath, 'utf-8')

  // Split into statements and remove comments
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('/*') && !s.startsWith('--'))

  console.log(`   Found ${statements.length} SQL statements`)
  console.log(`   Using endpoint: ${SUPABASE_URL}/rest/v1/rpc/exec_sql\n`)

  // Try to execute via RPC endpoint
  try {
    // Check if exec_sql function exists
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        sql_query: 'SELECT 1;'
      })
    })

    if (checkResponse.ok) {
      console.log('✅ RPC function exec_sql is available')

      // Execute the full migration
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        },
        body: JSON.stringify({
          sql_query: sql
        })
      })

      if (response.ok) {
        console.log(`✅ Successfully executed: ${filename}`)
        return true
      } else {
        const error = await response.text()
        console.error(`❌ Error executing ${filename}:`)
        console.error(error)
        return false
      }
    } else {
      console.log('⚠️  RPC function exec_sql not available')
      console.log('   This is normal - Supabase uses SQL Editor UI for migrations')
      return null
    }
  } catch (error) {
    console.error(`❌ Network error:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Supabase Migration Executor\n')
  console.log(`Supabase URL: ${SUPABASE_URL}`)
  console.log(`Service Role Key: ${SERVICE_ROLE_KEY.substring(0, 20)}...`)

  const migrations = [
    'supabase/migrations/20260303120000_create_challenge_tables.sql',
    'supabase/migrations/20260303120001_create_badges_tables.sql',
    'supabase/migrations/20260303120002_create_user_badges_and_rls.sql'
  ]

  let allSuccess = true

  for (const migrationPath of migrations) {
    const fullPath = path.join(__dirname, migrationPath)

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`)
      allSuccess = false
      continue
    }

    const result = await executeMigration(fullPath)
    if (result === false) {
      allSuccess = false
    }
  }

  if (allSuccess === null) {
    console.log('\n📌 Supabase doesn\'t support SQL execution via REST API.')
    console.log('   Please apply migrations manually:\n')
    console.log('   1. Go to: https://app.supabase.com/project/wrcprmujlkwvusekfogf')
    console.log('   2. Navigate to: SQL Editor')
    console.log('   3. Create a new query')
    console.log('   4. Paste the contents of each migration file and run\n')
    console.log('   Migration files:')
    migrations.forEach(m => console.log(`   - ${m}`))
  } else if (allSuccess) {
    console.log('\n✅ All migrations applied successfully!')
  } else {
    console.log('\n❌ Some migrations failed')
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
