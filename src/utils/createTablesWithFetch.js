// Script to create tables using direct fetch to Supabase API
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fetch from 'node-fetch';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Get environment variables directly
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lnqjxddxvbhnbyuphmxv.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucWp4ZGR4dmJobmJ5dXBobXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTI2NzYsImV4cCI6MjA2MzQyODY3Nn0.0lYPkzMBJx1NmuUFLmDhW6270fF1nrD2-HuoTE-4CWk';

// Function to execute SQL query via REST API
async function executeSQLViaAPI(sql) {
  try {
    console.log('Executing SQL via API...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}): ${errorText}`);
      return { success: false, error: `API Error: ${response.status} - ${errorText}` };
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Exception executing SQL via API:', error);
    return { success: false, error };
  }
}

// Create update_updated_at_column function
async function createUpdateFunction() {
  console.log('Creating update_updated_at_column function...');
  
  const sql = `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  `;
  
  return executeSQLViaAPI(sql);
}

// Create weight_logs table
async function createWeightLogsTable() {
  console.log('Creating weight_logs table...');
  
  // Split into multiple statements to isolate potential issues
  const createTableSQL = `
  CREATE TABLE IF NOT EXISTS weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    weight NUMERIC NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  `;
  
  const result1 = await executeSQLViaAPI(createTableSQL);
  if (!result1.success) {
    console.error('Failed to create weight_logs table:', result1.error);
    return result1;
  }
  
  console.log('✓ Created weight_logs table structure');
  
  // Add foreign key constraint separately
  const addForeignKeySQL = `
  ALTER TABLE weight_logs 
  ADD CONSTRAINT weight_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id);
  `;
  
  const result2 = await executeSQLViaAPI(addForeignKeySQL);
  if (!result2.success) {
    console.error('Failed to add foreign key to weight_logs:', result2.error);
    return result2;
  }
  
  console.log('✓ Added foreign key constraint to weight_logs');
  
  // Enable RLS and add policies
  const securitySQL = `
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
  
  const result3 = await executeSQLViaAPI(securitySQL);
  if (!result3.success) {
    console.error('Failed to set up RLS for weight_logs:', result3.error);
    return result3;
  }
  
  console.log('✓ Enabled RLS and created policies for weight_logs');
  
  return { success: true };
}

// Create user_macros table
async function createUserMacrosTable() {
  console.log('Creating user_macros table...');
  
  // Split into multiple statements to isolate potential issues
  const createTableSQL = `
  CREATE TABLE IF NOT EXISTS user_macros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
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
  `;
  
  const result1 = await executeSQLViaAPI(createTableSQL);
  if (!result1.success) {
    console.error('Failed to create user_macros table:', result1.error);
    return result1;
  }
  
  console.log('✓ Created user_macros table structure');
  
  // Add foreign key constraint separately
  const addForeignKeySQL = `
  ALTER TABLE user_macros 
  ADD CONSTRAINT user_macros_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id);
  `;
  
  const result2 = await executeSQLViaAPI(addForeignKeySQL);
  if (!result2.success) {
    console.error('Failed to add foreign key to user_macros:', result2.error);
    return result2;
  }
  
  console.log('✓ Added foreign key constraint to user_macros');
  
  // Enable RLS and add policies
  const securitySQL = `
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
  `;
  
  const result3 = await executeSQLViaAPI(securitySQL);
  if (!result3.success) {
    console.error('Failed to set up RLS for user_macros:', result3.error);
    return result3;
  }
  
  console.log('✓ Enabled RLS and created policies for user_macros');
  
  // Add trigger
  const triggerSQL = `
  CREATE TRIGGER update_user_macros_updated_at
  BEFORE UPDATE ON user_macros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
  `;
  
  const result4 = await executeSQLViaAPI(triggerSQL);
  if (!result4.success) {
    console.error('Failed to create trigger for user_macros:', result4.error);
    return result4;
  }
  
  console.log('✓ Created trigger for user_macros');
  
  return { success: true };
}

// Create recipe_ratings table
async function createRecipeRatingsTable() {
  console.log('Creating recipe_ratings table...');
  
  // Split into multiple statements to isolate potential issues
  const createTableSQL = `
  CREATE TABLE IF NOT EXISTS recipe_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    recipe_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, recipe_id)
  );
  `;
  
  const result1 = await executeSQLViaAPI(createTableSQL);
  if (!result1.success) {
    console.error('Failed to create recipe_ratings table:', result1.error);
    return result1;
  }
  
  console.log('✓ Created recipe_ratings table structure');
  
  // Add foreign key constraints separately
  const addForeignKeysSQL = `
  ALTER TABLE recipe_ratings 
  ADD CONSTRAINT recipe_ratings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id);
  
  ALTER TABLE recipe_ratings 
  ADD CONSTRAINT recipe_ratings_recipe_id_fkey 
  FOREIGN KEY (recipe_id) REFERENCES recipes(id);
  `;
  
  const result2 = await executeSQLViaAPI(addForeignKeysSQL);
  if (!result2.success) {
    console.error('Failed to add foreign keys to recipe_ratings:', result2.error);
    return result2;
  }
  
  console.log('✓ Added foreign key constraints to recipe_ratings');
  
  // Enable RLS and add policies
  const securitySQL = `
  ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Recipe ratings are viewable by everyone"
    ON recipe_ratings
    FOR SELECT
    TO public
    USING (true);
  
  CREATE POLICY "Users can insert their own recipe ratings"
    ON recipe_ratings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own recipe ratings"
    ON recipe_ratings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own recipe ratings"
    ON recipe_ratings
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
  `;
  
  const result3 = await executeSQLViaAPI(securitySQL);
  if (!result3.success) {
    console.error('Failed to set up RLS for recipe_ratings:', result3.error);
    return result3;
  }
  
  console.log('✓ Enabled RLS and created policies for recipe_ratings');
  
  // Add trigger
  const triggerSQL = `
  CREATE TRIGGER update_recipe_ratings_updated_at
  BEFORE UPDATE ON recipe_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
  `;
  
  const result4 = await executeSQLViaAPI(triggerSQL);
  if (!result4.success) {
    console.error('Failed to create trigger for recipe_ratings:', result4.error);
    return result4;
  }
  
  console.log('✓ Created trigger for recipe_ratings');
  
  return { success: true };
}

// Main function to create all tables
async function createAllTables() {
  console.log('Starting table creation process with direct API calls...');
  
  // Create update_updated_at_column function first
  const functionResult = await createUpdateFunction();
  if (!functionResult.success) {
    console.error('Failed to create update_updated_at_column function. Continuing anyway...');
  } else {
    console.log('✓ Created update_updated_at_column function');
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
