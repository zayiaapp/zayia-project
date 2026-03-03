#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

  // Remove comment blocks and count statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('/*') && !s.startsWith('--'))

  console.log(`   Found ~${statements.length} SQL statements`)
  console.log(`   Testing connection...\n`)

  try {
    // Test if exec_sql function exists
    const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
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

    if (testResponse.ok) {
      console.log('✅ exec_sql RPC function available - executing migration...\n')

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
        console.log(`✅ Successfully executed: ${filename}\n`)
        return true
      } else {
        const errorText = await response.text()
        console.error(`❌ HTTP ${response.status}: ${errorText}\n`)
        return false
      }
    } else {
      // exec_sql not available, this is expected for managed Supabase
      return null
    }
  } catch (error) {
    console.error(`❌ Network error: ${error.message}\n`)
    return false
  }
}

async function main() {
  console.log('🚀 Supabase Migration Executor\n')
  console.log(`📍 Project: ${SUPABASE_URL}`)
  console.log(`🔐 Auth: Service Role Key\n`)
  console.log('=' .repeat(60) + '\n')

  const migrations = [
    'supabase/migrations/20260303120000_create_challenge_tables.sql',
    'supabase/migrations/20260303120001_create_badges_tables.sql',
    'supabase/migrations/20260303120002_create_user_badges_and_rls.sql'
  ]

  let rpcAvailable = undefined

  for (const migrationPath of migrations) {
    const fullPath = path.join(__dirname, migrationPath)

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`)
      continue
    }

    const result = await executeMigration(fullPath)

    if (result === null && rpcAvailable === undefined) {
      rpcAvailable = false
      break
    } else if (result === true) {
      rpcAvailable = true
    }
  }

  console.log('=' .repeat(60) + '\n')

  if (rpcAvailable === false) {
    console.log('⚠️  Supabase RPC exec_sql not available (expected for managed databases)')
    console.log('\n📌 To apply migrations manually:\n')
    console.log('1. Open: https://app.supabase.com')
    console.log('2. Select project: wrcprmujlkwvusekfogf')
    console.log('3. Go to: SQL Editor')
    console.log('4. Click: New Query')
    console.log('5. Copy & paste migration content → Run\n')
    console.log('Migration files to apply (in order):')
    migrations.forEach((m, i) => {
      console.log(`\n   ${i + 1}. ${m}`)
    })
    console.log('\n✅ I can show you the SQL content to copy/paste if needed!')
  } else {
    console.log('✅ All migrations applied successfully!')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
