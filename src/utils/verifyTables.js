// This script will verify if all required tables exist in the Supabase database
import { supabase } from '../lib/supabaseClient';

/**
 * Verifies that all required tables have been created in Supabase
 */
export async function verifyTables() {
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
  const results = {};
  
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
        results[tableName] = { exists: false, error: error.message };
      } else {
        console.log(`✓ Table '${tableName}' exists`);
        results[tableName] = { exists: true };
      }
    } catch (err) {
      console.error(`Exception checking table '${tableName}':`, err.message);
      allTablesExist = false;
      missingTables.push(tableName);
      results[tableName] = { exists: false, error: err.message };
    }
  }
  
  if (allTablesExist) {
    console.log('\n✅ All required tables exist in the database!');
  } else {
    console.log('\n❌ Some required tables are missing from the database:');
    missingTables.forEach(table => console.log(`  - ${table}`));
  }
  
  return {
    allTablesExist,
    missingTables,
    results
  };
}

// Export a function that can be called from components
export default verifyTables;
