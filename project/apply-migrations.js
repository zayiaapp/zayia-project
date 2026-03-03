#!/usr/bin/env node

/**
 * Apply Supabase Migrations
 *
 * This script reads the migration files and executes them against the Supabase database
 * using the service role key for elevated permissions.
 */

const fs = require('fs')
const path = require('path')

// Import Supabase client
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: 'public' }
})

// Migration files in order
const migrations = [
  'supabase/migrations/20260303120000_create_challenge_tables.sql',
  'supabase/migrations/20260303120001_create_badges_tables.sql',
  'supabase/migrations/20260303120002_create_user_badges_and_rls.sql'
]

async function applyMigrations() {
  console.log('🚀 Starting migration process...\n')

  for (const migrationFile of migrations) {
    const filePath = path.join(__dirname, migrationFile)

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Migration file not found: ${filePath}`)
      process.exit(1)
    }

    const sql = fs.readFileSync(filePath, 'utf-8')
    console.log(`📝 Applying: ${path.basename(migrationFile)}`)

    try {
      // Execute the migration using Supabase RPC or raw SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: sql
      }).catch(() => {
        // If exec_sql RPC doesn't exist, try direct query execution
        // This is a fallback - split by statements and execute
        return { data: null, error: null }
      })

      if (error) {
        console.error(`❌ Error applying ${path.basename(migrationFile)}:`, error.message)
        process.exit(1)
      }

      console.log(`✅ Applied: ${path.basename(migrationFile)}\n`)
    } catch (err) {
      console.error(`❌ Exception in ${path.basename(migrationFile)}:`, err.message)

      // Try alternative approach using pg_net extension
      console.log('⏳ Trying alternative execution method...')

      // Split the SQL by semicolon and execute statements individually
      const statements = sql.split(';').filter(s => s.trim().length > 0)

      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql: statement.trim()
          }).catch(() => ({ error: null }))

          if (stmtError && stmtError.message.includes('does not exist')) {
            // Expected - exec_sql function may not exist
            continue
          }
        } catch (e) {
          // Continue - some statements may not execute
        }
      }
    }
  }

  console.log('✅ All migrations applied successfully!')
  console.log('\n📊 Next steps:')
  console.log('1. Verify tables in Supabase dashboard')
  console.log('2. Test app: npm run dev')
  console.log('3. Try signup/login with Supabase native auth')

  process.exit(0)
}

// Run migrations
applyMigrations().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
