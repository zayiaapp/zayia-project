import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(projectUrl, serviceRoleKey);

async function investigate() {
  console.log('🔍 Investigating Messages and Users...\n');
  
  try {
    // 1. List all users
    console.log('=== ALL USERS ===');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError.message);
    } else {
      profiles.forEach(p => {
        console.log(`- ${p.full_name || 'NO NAME'} (${p.email}) [${p.role}]`);
        console.log(`  ID: ${p.id}\n`);
      });
    }
    
    // 2. List recent messages with user info
    console.log('\n=== RECENT MESSAGES (last 10) ===');
    const { data: messages, error: messagesError } = await supabase
      .from('community_messages')
      .select(`
        id,
        content,
        user_id,
        deleted_at,
        created_at,
        profiles:user_id(id, email, full_name, role)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (messagesError) {
      console.error('Error fetching messages:', messagesError.message);
    } else {
      messages.forEach((msg, i) => {
        const profile = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
        const sender = profile?.full_name || 'NO NAME FOUND';
        const deleted = msg.deleted_at ? ' [DELETED]' : '';
        console.log(`${i+1}. "${msg.content}"`);
        console.log(`   From: ${sender}`);
        console.log(`   User ID: ${msg.user_id}`);
        console.log(`   Sent: ${new Date(msg.created_at).toLocaleString()}${deleted}\n`);
      });
    }
    
    // 3. Check for orphaned messages (no user_id or invalid user_id)
    console.log('\n=== CHECKING FOR ORPHANED MESSAGES ===');
    const { data: orphaned, error: orphanedError } = await supabase
      .from('community_messages')
      .select('id, user_id, content, created_at')
      .is('user_id', null)
      .or('user_id.eq.00000000-0000-0000-0000-000000000000');
    
    if (orphaned && orphaned.length > 0) {
      console.log(`⚠️ Found ${orphaned.length} orphaned messages!`);
      orphaned.forEach(msg => {
        console.log(`- "${msg.content}" (user_id: ${msg.user_id})`);
      });
    } else {
      console.log('✅ No orphaned messages found');
    }
    
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

investigate();
