const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('Criando tabelas de comunidade no Supabase...');
    
    // Create community_messages table
    await supabase.rpc('exec', { 
      sql: `CREATE TABLE IF NOT EXISTS community_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        content text NOT NULL,
        deleted_by_admin uuid REFERENCES profiles(id),
        deleted_at timestamptz,
        deletion_reason text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );`
    });
    
    console.log('✅ Tabela community_messages criada');
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

applyMigration();
