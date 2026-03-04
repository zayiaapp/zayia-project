const { createClient } = require('@supabase/supabase-js');

const projectUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(projectUrl, serviceRoleKey);

async function enableRealtime() {
  console.log('🔧 Enabling Real-time for Community Tables...\n');
  
  try {
    // Try using Supabase RPC for direct SQL execution
    const sql = `
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS community_messages;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS message_reactions;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS community_bans;
      ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS message_reports;
    `;
    
    console.log('Executing SQL via Supabase...');
    
    // Supabase doesn't expose direct SQL exec, but we can check publication status
    const { data: checkData, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['community_messages', 'message_reactions'])
      .catch(e => ({ data: null, error: e }));
    
    console.log('Table check:', checkData || 'Cannot access via REST API');
    
    console.log('\n⚠️  Direct SQL execution not available via Supabase client library');
    console.log('\n✅ SOLUTION: Use Supabase Dashboard SQL Editor');
    console.log('\nSteps:');
    console.log('1. Go to: https://app.supabase.com/project/wrcprmujlkwvusekfogf/sql/new');
    console.log('2. Copy-paste the SQL below');
    console.log('3. Click "Run"');
    console.log('\n---SQL TO RUN---');
    console.log(sql);
    console.log('---END SQL---\n');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

enableRealtime();
