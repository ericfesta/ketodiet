/*
  # Create recipe ratings table

  1. New Tables
    - `recipe_ratings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `recipe_id` (uuid, references recipes.id)
      - `rating` (integer, 1-5)
      - `review` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `recipe_ratings` table
    - Add policies for public read access and authenticated user write access
*/

CREATE TABLE IF NOT EXISTS recipe_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  recipe_id UUID REFERENCES recipes(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to recipe ratings
CREATE POLICY "Recipe ratings are viewable by everyone"
  ON recipe_ratings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert their own ratings
CREATE POLICY "Users can insert their own recipe ratings"
  ON recipe_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own ratings
CREATE POLICY "Users can update their own recipe ratings"
  ON recipe_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own ratings
CREATE POLICY "Users can delete their own recipe ratings"
  ON recipe_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on update
CREATE TRIGGER update_recipe_ratings_updated_at
BEFORE UPDATE ON recipe_ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
