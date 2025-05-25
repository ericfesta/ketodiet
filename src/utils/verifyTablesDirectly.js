// Direct verification script that doesn't rely on the browser-specific supabaseClient.js
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
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Log the environment variables for debugging
console.log('Environment variables:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Not found');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Found' : 'Not found');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  console.error('Manually setting values from .env file for testing...');
  
  // Hardcode the values from .env for testing purposes
  const supabaseUrlHardcoded = 'https://lnqjxddxvbhnbyuphmxv.supabase.co';
  const supabaseAnonKeyHardcoded = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucWp4ZGR4dmJobmJ5dXBobXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTI2NzYsImV4cCI6MjA2MzQyODY3Nn0.0lYPkzMBJx1NmuUFLmDhW6270fF1nrD2-HuoTE-4CWk';
  
  // Create Supabase client with hardcoded values
  const supabase = createClient(supabaseUrlHardcoded, supabaseAnonKeyHardcoded);
  verifyTablesWithClient(supabase);
} else {
  // Create Supabase client with environment variables
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  verifyTablesWithClient(supabase);
}

/**
 * Verifies that all required tables have been created in Supabase
 */
async function verifyTablesWithClient(supabase) {
  console.log('Verifying all required tables...');
  
  // List of tables that should exist
  const requiredTables = [
    'profiles',
    'weight_logs',
    'recipes',
    'favorites',
    'meal_plans',
    'meal_plan_items',
    'user_macros'
  ];
  
  let allTablesExist = true;
  
  // Check each table
  for (const tableName of requiredTables) {
    try {
      console.log(`Checking table '${tableName}'...`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`✖ Error checking table '${tableName}':`, error);
        allTablesExist = false;
      } else {
        console.log(`✓ Table '${tableName}' exists`);
      }
    } catch (err) {
      console.error(`Exception checking table '${tableName}':`, err);
      allTablesExist = false;
    }
  }
  
  if (allTablesExist) {
    console.log('\n✅ All required tables exist in the database!');
  } else {
    console.log('\n❌ Some required tables are missing from the database.');
  }
}
