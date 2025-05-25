/*
  # Create food diary table

  1. New Tables
    - `food_diary`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `date` (date)
      - `meal_type` (text: 'breakfast', 'lunch', 'dinner', 'snack')
      - `food_name` (text)
      - `calories` (integer)
      - `fat` (numeric, grams)
      - `protein` (numeric, grams)
      - `net_carbs` (numeric, grams)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `food_diary` table
    - Add policies for authenticated users to read/write their own food diary entries
*/

CREATE TABLE IF NOT EXISTS food_diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER,
  fat NUMERIC,
  protein NUMERIC,
  net_carbs NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE food_diary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own food diary entries"
  ON food_diary
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food diary entries"
  ON food_diary
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food diary entries"
  ON food_diary
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food diary entries"
  ON food_diary
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on update
CREATE TRIGGER update_food_diary_updated_at
BEFORE UPDATE ON food_diary
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
