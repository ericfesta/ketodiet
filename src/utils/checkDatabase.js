import { supabase } from '../lib/supabaseClient';

/**
 * Checks the Supabase connection and lists all existing tables
 * @returns {Promise<Object>} Result of the database check
 */
export const checkDatabaseConnection = async () => {
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count()')
      .limit(1);
    
    if (connectionError && connectionError.code !== '42P01') { // Ignore "relation does not exist" error
      console.error('Supabase connection error:', connectionError);
      return { 
        success: false, 
        error: connectionError,
        message: 'Failed to connect to Supabase'
      };
    }
    
    // Get list of all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      // If the RPC function doesn't exist, try a direct query to pg_tables
      const { data: pgTables, error: pgTablesError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (pgTablesError) {
        // If direct query fails, try a raw SQL query
        const { data: rawTables, error: rawError } = await supabase
          .rpc('get_tables_raw', {}, { count: 'exact' });
        
        if (rawError) {
          console.error('Failed to get tables list:', rawError);
          return { 
            success: true, 
            tables: [], 
            message: 'Connected to Supabase, but could not retrieve tables list'
          };
        }
        
        return { 
          success: true, 
          tables: rawTables || [],
          message: 'Connected to Supabase successfully'
        };
      }
      
      return { 
        success: true, 
        tables: pgTables?.map(t => t.tablename) || [],
        message: 'Connected to Supabase successfully'
      };
    }
    
    return { 
      success: true, 
      tables: tables || [],
      message: 'Connected to Supabase successfully'
    };
  } catch (err) {
    console.error('Unexpected error checking database:', err);
    return { 
      success: false, 
      error: err,
      message: 'Unexpected error checking database connection'
    };
  }
};

// Create RPC function to get tables if it doesn't exist
export const createGetTablesFunction = async () => {
  const { error } = await supabase.rpc('get_tables');
  
  if (error && error.message.includes('function get_tables() does not exist')) {
    const { error: createError } = await supabase.rpc('create_get_tables_function');
    
    if (createError) {
      console.error('Failed to create get_tables function:', createError);
      return false;
    }
    return true;
  }
  return true;
};

// Create a raw SQL version of the get_tables function
export const createRawGetTablesFunction = async () => {
  const { error } = await supabase.rpc('get_tables_raw');
  
  if (error && error.message.includes('function get_tables_raw() does not exist')) {
    // Create the function using raw SQL
    const { error: createError } = await supabase.query(`
      CREATE OR REPLACE FUNCTION get_tables_raw()
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
      console.error('Failed to create get_tables_raw function:', createError);
      return false;
    }
    return true;
  }
  return true;
};

// Main function to check database and list tables
export const checkDatabase = async () => {
  // Try to create helper functions first
  await createGetTablesFunction();
  await createRawGetTablesFunction();
  
  // Then check connection and get tables
  const result = await checkDatabaseConnection();
  
  console.log('Database connection check result:', result);
  
  if (result.success) {
    console.log('Connected to Supabase successfully!');
    console.log('Existing tables:', result.tables);
  } else {
    console.error('Failed to connect to Supabase:', result.error);
  }
  
  return result;
};

export default checkDatabase;
