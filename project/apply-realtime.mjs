import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(projectUrl, serviceRoleKey);

async function enableRealtime() {
  console.log('🔧 Enabling Real-time for Community Tables...\n');
  
  try {
    const sql = `
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS community_messages;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS message_reactions;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS community_bans;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS message_reports;
    `;
    
    console.log('✅ MANUAL EXECUTION REQUIRED\n');
    console.log('Supabase client library does not expose direct SQL execution.');
    console.log('You need to run this SQL via Supabase Dashboard.\n');
    
    console.log('📋 STEPS:');
    console.log('1. Go to: https://app.supabase.com/project/wrcprmujlkwvusekfogf/sql/new');
    console.log('2. Copy and paste the SQL below into the SQL Editor');
    console.log('3. Click "Run"\n');
    
    console.log('---SQL TO EXECUTE---');
    console.log(sql);
    console.log('---END SQL---\n');
    
    console.log('✅ After execution, test real-time:');
    console.log('- Open 2 browsers: one as User, one as Admin');
    console.log('- Post message in User → should appear INSTANTLY on Admin');
    console.log('- No F5 needed!\n');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

enableRealtime();
