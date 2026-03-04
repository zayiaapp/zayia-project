/*
  # Enable Real-time for Community Messages Table
  
  PROBLEM: Community messages table exists with correct RLS policies,
  but is NOT published to supabase_realtime, preventing real-time sync.
  
  SOLUTION: Add community_messages table to supabase_realtime publication
  so that INSERT/UPDATE/DELETE events are broadcast to connected clients.
  
  VERIFICATION: After applying this migration:
  - Open 2 browsers (User + Admin)
  - Post message in one → should appear instantly in other (no F5 needed)
  - All INSERT/UPDATE/DELETE events will sync in real-time
*/

-- Enable real-time for community_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE community_messages;

-- Also enable for related tables to ensure full real-time sync
ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE community_bans;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reports;

/*
  ✅ RESULT:
  - community_messages now publishes INSERT/UPDATE/DELETE events
  - message_reactions syncs emoji reactions in real-time
  - community_bans syncs ban status changes
  - message_reports syncs report updates
  - All changes visible to authenticated users respecting RLS policies
*/
