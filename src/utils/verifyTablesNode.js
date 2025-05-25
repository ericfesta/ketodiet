// Node.js script to verify all required tables exist in Supabase
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verifies that all required tables have been created in Supabase
 */
async function verifyTables() {
  console.log('Verifying all required tables...');
  
  // List of tables that should exist
  const requiredTables = [
    'profiles',
    'weight_logs',
    'recipes',
    'favorites',
    'meal_plans',
    'meal_plan_items',
    'user_macros',
    'keto_articles',
    'food_diary',
    'user_goals',
    'user_achievements',
    'recipe_ratings'
  ];
  
  let allTablesExist = true;
  const missingTables = [];
  
  // Check each table
  for (const tableName of requiredTables) {
    try {
      console.log(`Checking table '${tableName}'...`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`✖ Error checking table '${tableName}':`, error.message);
        allTablesExist = false;
        missingTables.push(tableName);
      } else {
        console.log(`✓ Table '${tableName}' exists`);
      }
    } catch (err) {
      console.error(`Exception checking table '${tableName}':`, err.message);
      allTablesExist = false;
      missingTables.push(tableName);
    }
  }
  
  if (allTablesExist) {
    console.log('\n✅ All required tables exist in the database!');
  } else {
    console.log('\n❌ Some required tables are missing from the database:');
    missingTables.forEach(table => console.log(`  - ${table}`));
  }
}

// Run the verification
verifyTables().catch(err => {
  console.error('Error verifying tables:', err);
  process.exit(1);
});
