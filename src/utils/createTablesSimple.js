// Simplified approach to create tables using direct SQL statements
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
    console.log('Executing SQL...');
    console.log(sql);
    
    // Use Supabase's REST API to execute SQL
    const { data, error } = await supabase.from('_exec_sql').select('*').eq('query', sql).single();
    
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

// Create weight_logs table with minimal SQL
async function createWeightLogsTable() {
  console.log('Creating weight_logs table...');
  
  const sql = `
  CREATE TABLE IF NOT EXISTS weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    weight NUMERIC NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  `;
  
  return executeSQL(sql);
}

// Create user_macros table with minimal SQL
async function createUserMacrosTable() {
  console.log('Creating user_macros table...');
  
  const sql = `
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
  
  return executeSQL(sql);
}

// Main function to create tables
async function createTables() {
  console.log('Starting simplified table creation process...');
  
  // Create tables with minimal SQL
  const weightLogsResult = await createWeightLogsTable();
  if (weightLogsResult.success) {
    console.log('✓ Successfully created weight_logs table structure');
  } else {
    console.error('✖ Failed to create weight_logs table structure');
  }
  
  const userMacrosResult = await createUserMacrosTable();
  if (userMacrosResult.success) {
    console.log('✓ Successfully created user_macros table structure');
  } else {
    console.error('✖ Failed to create user_macros table structure');
  }
  
  console.log('Simplified table creation process completed.');
}

// Execute the main function
createTables()
  .then(() => console.log('Simplified table creation process completed.'))
  .catch(error => console.error('Error in simplified table creation process:', error));
