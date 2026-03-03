/*
  # Fix company_info RLS policies

  This migration fixes potential issues with the RLS policies:
  1. Simplifies the policy conditions
  2. Removes unnecessary type casting
  3. Ensures CEO can perform all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "CEO can manage company info" ON company_info;
DROP POLICY IF EXISTS "Users can read company info" ON company_info;

-- Create improved policies
CREATE POLICY "CEO can manage company info"
  ON company_info
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'ceo'
  );

CREATE POLICY "Users can read company info"
  ON company_info
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow public read (optional, for anonymous access)
CREATE POLICY "Public can read company info"
  ON company_info
  FOR SELECT
  TO anon
  USING (true);
