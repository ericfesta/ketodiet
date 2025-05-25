/*
  # Add birth_date column to profiles table

  1. Changes
    - Add `birth_date` column to profiles table
    - Add `starting_weight` column to profiles table  
    - Add `dietary_restrictions` column to profiles table
    - Add `allergies` column to profiles table
    - Update existing columns to match application requirements

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add missing columns to profiles table
DO $$
BEGIN
  -- Add birth_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN birth_date DATE;
  END IF;

  -- Add starting_weight column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'starting_weight'
  ) THEN
    ALTER TABLE profiles ADD COLUMN starting_weight NUMERIC;
  END IF;

  -- Add dietary_restrictions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'dietary_restrictions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN dietary_restrictions TEXT[];
  END IF;

  -- Add allergies column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'allergies'
  ) THEN
    ALTER TABLE profiles ADD COLUMN allergies TEXT;
  END IF;
END $$;