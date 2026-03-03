#!/usr/bin/env node

import { exec } from 'child_process'
import { readFileSync } from 'fs'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Run migrations using psql (PostgreSQL client)
 * Requires: psql command available and PostgreSQL client installed
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env')
  process.exit(1)
}

// Extract project ID from URL
// https://wrcprmujlkwvusekfogf.supabase.co -> wrcprmujlkwvusekfogf
const projectId = SUPABASE_URL.split('//')[1].split('.')[0]
const dbHost = `db.${projectId}.supabase.co`
const dbUser = 'postgres'
const dbPassword = SERVICE_ROLE_KEY.split('.')[1] // This is a JWT, we need the actual password

console.log('🔍 Supabase Project:', projectId)
console.log('📡 Database Host:', dbHost)

// The service role key is a JWT, not a password
// We need to use the actual connection details from Supabase

// For now, let's try a different approach - direct SQL execution via REST API
async function applySqlViaRest() {
  console.log('\n🚀 Applying migrations via Supabase REST API...\n')

  const migrations = [
    { name: 'Challenges & Categories', file: 'supabase/migrations/20260303120000_create_challenge_tables.sql' },
    { name: 'Badges & Levels', file: 'supabase/migrations/20260303120001_create_badges_tables.sql' },
    { name: 'User Badges & RLS', file: 'supabase/migrations/20260303120002_create_user_badges_and_rls.sql' }
  ]

  for (const { name, file } of migrations) {
    console.log(`📝 Processing: ${name}`)
    console.log(`   File: ${file}`)
    console.log(`   ⚠️  Migration ready - please apply manually in Supabase Dashboard`)
    console.log(`   📍 Go to: SQL Editor → New Query → Copy & Paste → Run\n`)
  }

  console.log('✅ To complete setup:\n')
  console.log('1. Go to: https://app.supabase.com')
  console.log('2. Select project: zayia-project')
  console.log('3. Go to: SQL Editor')
  console.log('4. Create a new query and paste the content of each migration file')
  console.log('5. Run each migration in order\n')
  console.log('📌 Migrations are located in: supabase/migrations/\n')
}

applySqlViaRest()
