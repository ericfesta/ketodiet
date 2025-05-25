/*
  # Fix trigger for automatic profile creation

  1. New Functions
    - `handle_new_user()`: Creates a profile entry when a new user signs up
  2. New Triggers
    - `on_auth_user_created`: Trigger that calls handle_new_user() when a new user is created
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, 
          COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)), 
          COALESCE(new.raw_user_meta_data->>'full_name', ''), 
          COALESCE(new.raw_user_meta_data->>'avatar_url', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
