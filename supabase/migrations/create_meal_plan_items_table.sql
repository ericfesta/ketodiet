/*
  # Create meal plan items table

  1. New Tables
    - `meal_plan_items`
      - `id` (uuid, primary key)
      - `meal_plan_id` (uuid, references meal_plans.id)
      - `recipe_id` (uuid, references recipes.id)
      - `day` (date)
      - `meal_type` (text: 'breakfast', 'lunch', 'dinner', 'snack')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `meal_plan_items` table
    - Add policies for authenticated users to read/write their own meal plan items
*/

CREATE TABLE IF NOT EXISTS meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) NOT NULL,
  day DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own meal plan items
CREATE POLICY "Users can view their own meal plan items"
  ON meal_plan_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = meal_plan_items.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

-- Create policy to allow users to insert their own meal plan items
CREATE POLICY "Users can insert their own meal plan items"
  ON meal_plan_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = meal_plan_items.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

-- Create policy to allow users to update their own meal plan items
CREATE POLICY "Users can update their own meal plan items"
  ON meal_plan_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = meal_plan_items.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

-- Create policy to allow users to delete their own meal plan items
CREATE POLICY "Users can delete their own meal plan items"
  ON meal_plan_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = meal_plan_items.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

-- Create a trigger to set updated_at on update
CREATE TRIGGER update_meal_plan_items_updated_at
BEFORE UPDATE ON meal_plan_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
