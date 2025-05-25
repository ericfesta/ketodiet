/*
  # Create weight logs table

  1. New Tables
    - `weight_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `weight` (numeric, kg)
      - `date` (date)
      - `notes` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `weight_logs` table
    - Add policies for authenticated users to read/write their own weight logs
*/

CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  weight NUMERIC NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weight logs"
  ON weight_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight logs"
  ON weight_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight logs"
  ON weight_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight logs"
  ON weight_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
