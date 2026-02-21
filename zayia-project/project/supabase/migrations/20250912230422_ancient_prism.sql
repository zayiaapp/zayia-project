/*
  # Create WhatsApp groups table

  1. New Tables
    - `whatsapp_groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `link` (text)
      - `rules` (text)
      - `welcome_message` (text)
      - `member_count` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `whatsapp_groups` table
    - Add policy for authenticated users to read active groups
    - Add policy for CEO to manage all groups
*/

CREATE TABLE IF NOT EXISTS whatsapp_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  link text NOT NULL,
  rules text,
  welcome_message text,
  member_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read active groups
CREATE POLICY "Users can read active groups"
  ON whatsapp_groups
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policy for CEO to read all groups
CREATE POLICY "CEO can read all groups"
  ON whatsapp_groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to insert groups
CREATE POLICY "CEO can insert groups"
  ON whatsapp_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to update groups
CREATE POLICY "CEO can update groups"
  ON whatsapp_groups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Policy for CEO to delete groups
CREATE POLICY "CEO can delete groups"
  ON whatsapp_groups
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid()::text 
      AND role = 'ceo'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_whatsapp_groups_updated_at
  BEFORE UPDATE ON whatsapp_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();