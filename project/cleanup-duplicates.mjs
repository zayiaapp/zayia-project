import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(projectUrl, serviceRoleKey);

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate messages...\n');
  
  try {
    // Get all messages
    const { data: allMessages } = await supabase
      .from('community_messages')
      .select('id, content, user_id, created_at')
      .order('created_at', { ascending: false });
    
    // Group by content + user_id and keep only the LATEST
    const messageMap = {};
    const toDelete = [];
    
    allMessages.forEach(msg => {
      const key = `${msg.user_id}|${msg.content}`;
      if (!messageMap[key]) {
        messageMap[key] = msg; // Keep first (most recent)
      } else {
        toDelete.push(msg.id); // Mark for deletion
      }
    });
    
    console.log(`Found ${toDelete.length} duplicate message IDs to remove\n`);
    
    if (toDelete.length === 0) {
      console.log('✅ No duplicates to clean!');
      return;
    }
    
    // Delete duplicates in batches
    for (let i = 0; i < toDelete.length; i += 10) {
      const batch = toDelete.slice(i, i + 10);
      const { error } = await supabase
        .from('community_messages')
        .delete()
        .in('id', batch);
      
      if (error) {
        console.error(`Error deleting batch ${i/10 + 1}:`, error.message);
      } else {
        console.log(`✅ Deleted batch ${Math.floor(i/10) + 1}: ${batch.length} messages`);
      }
    }
    
    console.log(`\n✅ Cleanup complete! Removed ${toDelete.length} duplicate messages`);
    console.log('\n⚠️  IMPORTANT: The root cause is in the code!');
    console.log('   The hook is creating duplicates. Needs @dev fix.\n');
    
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

cleanupDuplicates();
