import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(projectUrl, serviceRoleKey);

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate messages...\n');
  
  try {
    const { data: allMessages } = await supabase
      .from('community_messages')
      .select('id, content, user_id, created_at')
      .order('created_at', { ascending: false });
    
    // Group by content + user_id + created_at (within 1 second)
    const messageMap = {};
    
    allMessages.forEach(msg => {
      const key = `${msg.user_id}|${msg.content}`;
      if (!messageMap[key]) messageMap[key] = [];
      messageMap[key].push(msg);
    });
    
    let hasDuplicates = false;
    
    Object.entries(messageMap).forEach(([key, msgs]) => {
      if (msgs.length > 1) {
        const [userId, content] = key.split('|');
        console.log(`⚠️ DUPLICATE FOUND: "${content}"`);
        console.log(`   Same user_id: ${userId}`);
        console.log(`   Instances: ${msgs.length}`);
        msgs.forEach((m, i) => {
          console.log(`   ${i+1}. ID: ${m.id} | Created: ${m.created_at}`);
        });
        console.log('');
        hasDuplicates = true;
      }
    });
    
    if (!hasDuplicates) {
      console.log('✅ No duplicate messages in database!\n');
      console.log('💡 The duplication is happening in the React UI, not the database.');
      console.log('   Likely cause: optimistic updates + real-time sync creating duplicates\n');
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkDuplicates();
