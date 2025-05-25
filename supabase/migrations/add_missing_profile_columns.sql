/*
  # Add missing columns to profiles table

  1. Changes
    - Add birth_date column (date)
    - Add starting_weight column (numeric)
    - Add dietary_restrictions column (jsonb array)
    - Add allergies column (text)
    - Ensure all columns exist with proper types

  2. Safety
    - Use conditional column creation to avoid errors if columns already exist
    - Maintain existing data integrity
*/

-- Add birth_date column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_date DATE;
  END IF;
END $$;

-- Add starting_weight column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'starting_weight'
  ) THEN
    ALTER TABLE profiles ADD COLUMN starting_weight NUMERIC;
  END IF;
END $$;

-- Add dietary_restrictions column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'dietary_restrictions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN dietary_restrictions JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add allergies column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'allergies'
  ) THEN
    ALTER TABLE profiles ADD COLUMN allergies TEXT;
  END IF;
END $$;
