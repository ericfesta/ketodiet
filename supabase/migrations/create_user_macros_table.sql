/*
  # Create user macros table

  1. New Tables
    - `user_macros`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `date` (date)
      - `calories_goal` (integer)
      - `calories_consumed` (integer)
      - `fat_goal` (numeric, grams)
      - `fat_consumed` (numeric, grams)
      - `protein_goal` (numeric, grams)
      - `protein_consumed` (numeric, grams)
      - `net_carbs_goal` (numeric, grams)
      - `net_carbs_consumed` (numeric, grams)
      - `water_goal` (numeric, liters)
      - `water_consumed` (numeric, liters)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `user_macros` table
    - Add policies for authenticated users to read/write their own macro data
*/

CREATE TABLE IF NOT EXISTS user_macros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  calories_goal INTEGER,
  calories_consumed INTEGER DEFAULT 0,
  fat_goal NUMERIC,
  fat_consumed NUMERIC DEFAULT 0,
  protein_goal NUMERIC,
  protein_consumed NUMERIC DEFAULT 0,
  net_carbs_goal NUMERIC,
  net_carbs_consumed NUMERIC DEFAULT 0,
  water_goal NUMERIC,
  water_consumed NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE user_macros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own macros"
  ON user_macros
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macros"
  ON user_macros
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macros"
  ON user_macros
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own macros"
  ON user_macros
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on update
CREATE TRIGGER update_user_macros_updated_at
BEFORE UPDATE ON user_macros
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
