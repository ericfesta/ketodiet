import { supabase } from '../lib/supabaseClient';

/**
 * Directly checks for the existence of specific tables in Supabase
 */
async function directSupabaseCheck() {
  console.log('Starting direct Supabase table verification...');
  
  // List of tables to check
  const tablesToCheck = ['profiles', 'weight_logs'];
  
  for (const tableName of tablesToCheck) {
    try {
      // Try to select a single row from the table
      console.log(`Checking if table '${tableName}' exists...`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') { // PostgreSQL code for "relation does not exist"
          console.log(`✖ Table '${tableName}' does NOT exist`);
        } else {
          console.error(`Error checking table '${tableName}':`, error);
        }
      } else {
        console.log(`✓ Table '${tableName}' exists`);
        console.log(`  Row count: ${data ? data.length : 0}`);
      }
    } catch (err) {
      console.error(`Exception checking table '${tableName}':`, err);
    }
  }
  
  // Try a raw SQL query to list all tables
  try {
    console.log('\nAttempting to list all tables using raw SQL...');
    const { data, error } = await supabase.rpc('get_all_tables');
    
    if (error) {
      // If the RPC doesn't exist, create it first
      if (error.message.includes('function get_all_tables() does not exist')) {
        console.log('Creating get_all_tables function...');
        const { error: createError } = await supabase.query(`
          CREATE OR REPLACE FUNCTION get_all_tables()
          RETURNS TABLE (table_name text) 
          LANGUAGE SQL
          SECURITY DEFINER
          AS $$
            SELECT tablename::text as table_name 
            FROM pg_tables 
            WHERE schemaname = 'public'
          $$;
        `);
        
        if (createError) {
          console.error('Failed to create get_all_tables function:', createError);
        } else {
          // Try again after creating the function
          const { data: tables, error: listError } = await supabase.rpc('get_all_tables');
          
          if (listError) {
            console.error('Failed to list tables after creating function:', listError);
          } else {
            console.log('All tables in database:');
            if (tables && tables.length > 0) {
              tables.forEach(t => console.log(`- ${t.table_name}`));
            } else {
              console.log('No tables found');
            }
          }
        }
      } else {
        console.error('Error listing all tables:', error);
      }
    } else {
      console.log('All tables in database:');
      if (data && data.length > 0) {
        data.forEach(t => console.log(`- ${t.table_name}`));
      } else {
        console.log('No tables found');
      }
    }
  } catch (err) {
    console.error('Exception listing all tables:', err);
  }
  
  console.log('\nDirect Supabase verification completed');
}

// Run the check
directSupabaseCheck().catch(err => {
  console.error('Failed to run direct Supabase check:', err);
});
