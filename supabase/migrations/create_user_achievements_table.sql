/*
  # Create user achievements table

  1. New Tables
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `achievement_type` (text: 'weight_goal', 'streak', 'recipe_count', 'low_carb_days')
      - `achievement_value` (integer)
      - `achieved_at` (timestamptz)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `user_achievements` table
    - Add policies for authenticated users to read/write their own achievements
*/

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  achievement_type TEXT CHECK (achievement_type IN ('weight_goal', 'streak', 'recipe_count', 'low_carb_days')) NOT NULL,
  achievement_value INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
  ON user_achievements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
