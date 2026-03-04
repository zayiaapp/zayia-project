import { createClient } from '@supabase/supabase-js';

const projectUrl = 'https://wrcprmujlkwvusekfogf.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyY3BybXVqbGt3dnVzZWtmb2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU0NDk1OCwiZXhwIjoyMDg4MTIwOTU4fQ.zTQCoyHOJn0rcc6iPtxkY8cyHn0Yikz42e6uwbNmEx8';

const supabase = createClient(projectUrl, serviceRoleKey);

async function checkAndRemoveBans() {
  console.log('🔍 Checking for active bans...\n');
  
  try {
    // Get all active bans with user info
    const { data: activeBans, error: bansError } = await supabase
      .from('community_bans')
      .select(`
        id,
        user_id,
        status,
        ban_duration,
        reason,
        banned_at,
        expires_at,
        profiles:user_id(id, email, full_name, role)
      `)
      .eq('status', 'active');
    
    if (bansError) {
      console.error('❌ Error fetching bans:', bansError.message);
      return;
    }
    
    if (!activeBans || activeBans.length === 0) {
      console.log('✅ No active bans found!');
      return;
    }
    
    console.log(`Found ${activeBans.length} active ban(s):\n`);
    
    activeBans.forEach((ban, i) => {
      const profile = Array.isArray(ban.profiles) ? ban.profiles[0] : ban.profiles;
      console.log(`${i+1}. User: ${profile?.full_name || 'Unknown'} (${profile?.email})`);
      console.log(`   Ban ID: ${ban.id}`);
      console.log(`   Duration: ${ban.ban_duration}`);
      console.log(`   Reason: ${ban.reason}`);
      console.log(`   Expires: ${ban.expires_at || 'Permanent'}\n`);
    });
    
    // Remove all active bans by setting status to expired
    console.log('🧹 Removing all active bans...\n');
    
    const { error: deleteError } = await supabase
      .from('community_bans')
      .update({ status: 'expired' })
      .eq('status', 'active');
    
    if (deleteError) {
      console.error('❌ Error removing bans:', deleteError.message);
    } else {
      console.log('✅ All bans removed successfully!\n');
      console.log('You can now test real-time messaging freely.');
    }
    
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

checkAndRemoveBans();
