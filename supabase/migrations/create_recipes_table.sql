/*
  # Create recipes table

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `ingredients` (jsonb array)
      - `instructions` (jsonb array of steps)
      - `prep_time` (integer, minutes)
      - `cook_time` (integer, minutes)
      - `servings` (integer)
      - `calories` (integer, per serving)
      - `fat` (numeric, grams per serving)
      - `protein` (numeric, grams per serving)
      - `net_carbs` (numeric, grams per serving)
      - `image_url` (text)
      - `difficulty` (text: 'easy', 'medium', 'hard')
      - `meal_type` (text: 'breakfast', 'lunch', 'dinner', 'snack', 'dessert')
      - `tags` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `recipes` table
    - Add policies for public access to recipes
*/

CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  calories INTEGER,
  fat NUMERIC,
  protein NUMERIC,
  net_carbs NUMERIC,
  image_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to recipes
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes
  FOR SELECT
  TO public
  USING (true);

-- Create a trigger to set updated_at on update
CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
