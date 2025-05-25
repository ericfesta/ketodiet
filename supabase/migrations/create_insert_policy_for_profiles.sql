/*
  # Create insert policy for profiles table

  1. Security
    - Add policy for authenticated users to insert their own profile
    - Add policy for public to read profiles
*/

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow public to read profiles (useful for public recipe authors)
CREATE POLICY "Public can view profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);
