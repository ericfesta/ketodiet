/*
  # Create updated_at trigger function

  1. New Functions
    - `trigger_set_timestamp()`: Updates the updated_at column to current timestamp
  2. New Triggers
    - Applies this trigger to all tables with updated_at columns
*/

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table with updated_at column
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name 
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_timestamp ON %I', t);
    EXECUTE format('CREATE TRIGGER set_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp()', t);
  END LOOP;
END;
$$ LANGUAGE plpgsql;
