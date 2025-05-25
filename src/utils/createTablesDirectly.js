// Alternative approach to create tables directly using SQL queries
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Get environment variables directly
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lnqjxddxvbhnbyuphmxv.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucWp4ZGR4dmJobmJ5dXBobXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTI2NzYsImV4cCI6MjA2MzQyODY3Nn0.0lYPkzMBJx1NmuUFLmDhW6270fF1nrD2-HuoTE-4CWk';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to execute SQL query
async function executeSQL(sql) {
  try {
    // Use Supabase's rpc function to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Exception executing SQL:', error);
    return { success: false, error };
  }
}

// Create weight_logs table
async function createWeightLogsTable() {
  console.log('Creating weight_logs table...');
  
  const sql = `
  CREATE TABLE IF NOT EXISTS weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    weight NUMERIC NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  
  ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view their own weight logs"
    ON weight_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own weight logs"
    ON weight_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own weight logs"
    ON weight_logs
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own weight logs"
    ON weight_logs
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
  `;
  
  return executeSQL(sql);
}

// Create user_macros table
async function createUserMacrosTable() {
  console.log('Creating user_macros table...');
  
  const sql = `
  CREATE TABLE IF NOT EXISTS user_macros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    date DATE NOT NULL,
    calories_goal INTEGER,
    calories_consumed INTEGER DEFAULT 0,
    fat_goal NUMERIC,
    fat_consumed NUMERIC DEFAULT 0,
    protein_goal NUMERIC,
    protein_consumed NUMERIC DEFAULT 0,
    net_carbs_goal NUMERIC,
    net_carbs_consumed NUMERIC DEFAULT 0,
    water_goal NUMERIC,
    water_consumed NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date)
  );
  
  ALTER TABLE user_macros ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view their own macros"
    ON user_macros
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own macros"
    ON user_macros
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own macros"
    ON user_macros
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own macros"
    ON user_macros
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
  
  -- Create a trigger to set updated_at on update
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER update_user_macros_updated_at
  BEFORE UPDATE ON user_macros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
  `;
  
  return executeSQL(sql);
}

// Create recipe_ratings table
async function createRecipeRatingsTable() {
  console.log('Creating recipe_ratings table...');
  
  const sql = `
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
  `;
  
  return executeSQL(sql);
}

// Main function to create all tables
async function createAllTables() {
  console.log('Starting table creation process...');
  
  // Create update_updated_at_column function if it doesn't exist
  const createFunctionResult = await executeSQL(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
  
  if (!createFunctionResult.success) {
    console.error('Failed to create update_updated_at_column function');
  } else {
    console.log('✓ Created or replaced update_updated_at_column function');
  }
  
  // Create tables
  const weightLogsResult = await createWeightLogsTable();
  if (weightLogsResult.success) {
    console.log('✓ Successfully created weight_logs table');
  } else {
    console.error('✖ Failed to create weight_logs table');
  }
  
  const userMacrosResult = await createUserMacrosTable();
  if (userMacrosResult.success) {
    console.log('✓ Successfully created user_macros table');
  } else {
    console.error('✖ Failed to create user_macros table');
  }
  
  const recipeRatingsResult = await createRecipeRatingsTable();
  if (recipeRatingsResult.success) {
    console.log('✓ Successfully created recipe_ratings table');
  } else {
    console.error('✖ Failed to create recipe_ratings table');
  }
  
  console.log('Table creation process completed.');
}

// Execute the main function
createAllTables()
  .then(() => console.log('All tables creation process completed.'))
  .catch(error => console.error('Error in table creation process:', error));
