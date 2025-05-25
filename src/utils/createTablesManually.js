// Create tables manually using SQL statements
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

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    // Query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Exception checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Function to create weight_logs table
async function createWeightLogsTable() {
  console.log('Checking if weight_logs table exists...');
  
  const exists = await tableExists('weight_logs');
  if (exists) {
    console.log('✓ weight_logs table already exists');
    return { success: true };
  }
  
  console.log('Creating weight_logs table...');
  
  try {
    // Create the table using Supabase's SQL API
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS weight_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          weight NUMERIC NOT NULL,
          date DATE NOT NULL,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT now()
        );
      `
    });
    
    if (error) {
      console.error('Error creating weight_logs table:', error);
      return { success: false, error };
    }
    
    console.log('✓ Successfully created weight_logs table');
    return { success: true };
  } catch (error) {
    console.error('Exception creating weight_logs table:', error);
    return { success: false, error };
  }
}

// Function to create user_macros table
async function createUserMacrosTable() {
  console.log('Checking if user_macros table exists...');
  
  const exists = await tableExists('user_macros');
  if (exists) {
    console.log('✓ user_macros table already exists');
    return { success: true };
  }
  
  console.log('Creating user_macros table...');
  
  try {
    // Create the table using Supabase's SQL API
    const { error } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });
    
    if (error) {
      console.error('Error creating user_macros table:', error);
      return { success: false, error };
    }
    
    console.log('✓ Successfully created user_macros table');
    return { success: true };
  } catch (error) {
    console.error('Exception creating user_macros table:', error);
    return { success: false, error };
  }
}

// Main function to create tables
async function createTablesManually() {
  console.log('Starting manual table creation process...');
  
  // Create tables
  const weightLogsResult = await createWeightLogsTable();
  if (!weightLogsResult.success) {
    console.error('✖ Failed to create weight_logs table');
  }
  
  const userMacrosResult = await createUserMacrosTable();
  if (!userMacrosResult.success) {
    console.error('✖ Failed to create user_macros table');
  }
  
  console.log('Manual table creation process completed.');
}

// Execute the main function
createTablesManually()
  .then(() => console.log('Manual table creation process completed.'))
  .catch(error => console.error('Error in manual table creation process:', error));
