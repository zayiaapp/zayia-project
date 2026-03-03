/*
  # Create company information table

  1. New Tables
    - `company_info`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `cnpj` (text)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `website` (text)
      - `dpo_name` (text, optional)
      - `dpo_email` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `company_info` table
    - Add policy for CEO to read/update company info
    - Add policy for authenticated users to read company info
*/

CREATE TABLE IF NOT EXISTS company_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  cnpj text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  website text NOT NULL,
  dpo_name text,
  dpo_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Policy for CEO to read and update company info
CREATE POLICY "CEO can manage company info"
  ON company_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()::text
      AND role = 'ceo'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()::text
      AND role = 'ceo'
    )
  );

-- Policy for authenticated users to read company info
CREATE POLICY "Users can read company info"
  ON company_info
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_company_info_created_at ON company_info(created_at);
