// Script to create missing tables directly using Supabase client
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

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

// Function to read SQL file content
function readSqlFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading SQL file ${filePath}:`, error);
    return null;
  }
}

// Function to execute SQL query
async function executeSQL(sql) {
  if (!sql) return { success: false, error: 'No SQL provided' };
  
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

// Main function to create missing tables
async function createMissingTables() {
  console.log('Creating missing tables...');
  
  // Define SQL file paths
  const sqlFiles = [
    resolve(__dirname, '../../supabase/migrations/create_weight_logs_table.sql'),
    resolve(__dirname, '../../supabase/migrations/create_user_macros_table.sql'),
    resolve(__dirname, '../../supabase/migrations/create_recipe_ratings_table.sql')
  ];
  
  // Process each SQL file
  for (const filePath of sqlFiles) {
    console.log(`Processing SQL file: ${filePath}`);
    
    // Read SQL file
    const sql = readSqlFile(filePath);
    if (!sql) continue;
    
    // Execute SQL
    console.log('Executing SQL...');
    const result = await executeSQL(sql);
    
    if (result.success) {
      console.log(`✓ Successfully executed SQL from ${filePath}`);
    } else {
      console.error(`✖ Failed to execute SQL from ${filePath}:`, result.error);
    }
  }
  
  console.log('Finished creating tables.');
}

// Execute the main function
createMissingTables()
  .then(() => console.log('Table creation process completed.'))
  .catch(error => console.error('Error in table creation process:', error));
