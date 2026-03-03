import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🚀 Criando tabelas de comunidade no Supabase...');
    
    const queries = [
      `CREATE TABLE IF NOT EXISTS community_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        content text NOT NULL,
        deleted_by_admin uuid REFERENCES profiles(id),
        deleted_at timestamptz,
        deletion_reason text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )`,
      `CREATE TABLE IF NOT EXISTS message_reactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        message_id uuid NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
        emoji text NOT NULL,
        user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        created_at timestamptz DEFAULT now(),
        UNIQUE(message_id, emoji, user_id)
      )`,
      `CREATE TABLE IF NOT EXISTS community_bans (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        ban_number integer DEFAULT 1,
        ban_duration text DEFAULT '1_day' CHECK (ban_duration IN ('1_day', '7_days', 'permanent')),
        reason text,
        banned_at timestamptz DEFAULT now(),
        expires_at timestamptz,
        status text DEFAULT 'active' CHECK (status IN ('active', 'expired')),
        created_at timestamptz DEFAULT now()
      )`,
      `CREATE TABLE IF NOT EXISTS message_reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        message_id uuid NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
        reported_by uuid REFERENCES profiles(id),
        reason text CHECK (reason IN ('disrespectful', 'inappropriate', 'spam', 'discrimination', 'privacy', 'other')),
        description text,
        status text DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'archived')),
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )`,
      `CREATE TABLE IF NOT EXISTS community_rules (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        content text NOT NULL,
        updated_by_admin uuid NOT NULL REFERENCES profiles(id),
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )`,
      `CREATE INDEX IF NOT EXISTS idx_messages_user ON community_messages(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_messages_created ON community_messages(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_reactions_message ON message_reactions(message_id)`,
      `CREATE INDEX IF NOT EXISTS idx_reactions_user ON message_reactions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_bans_user ON community_bans(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_bans_active ON community_bans(status) WHERE status = 'active'`,
      `CREATE INDEX IF NOT EXISTS idx_reports_message ON message_reports(message_id)`,
      `CREATE INDEX IF NOT EXISTS idx_reports_status ON message_reports(status)`,
      `ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE community_bans ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE message_reports ENABLE ROW LEVEL SECURITY`,
      `ALTER TABLE community_rules ENABLE ROW LEVEL SECURITY`
    ];
    
    for (const query of queries) {
      const { error } = await supabase.rpc('exec', { sql: query });
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Erro:', error.message);
      }
    }
    
    console.log('✅ Tabelas criadas com sucesso!');
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Erro crítico:', err.message);
    process.exit(1);
  }
}

applyMigration();
