import React, { useState, useEffect } from 'react';
import { verifyTables } from '../utils/verifyTables';
import { supabase } from '../lib/supabaseClient';

const DatabaseCheck = () => {
  const [checkResults, setCheckResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingTable, setCreatingTable] = useState(null);

  useEffect(() => {
    checkTables();
  }, []);

  const checkTables = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await verifyTables();
      setCheckResults(results);
    } catch (err) {
      console.error('Error verifying tables:', err);
      setError(err.message || 'Failed to verify tables');
    } finally {
      setIsLoading(false);
    }
  };

  const createMissingTable = async (tableName) => {
    setCreatingTable(tableName);
    try {
      let query;
      
      // Define table creation SQL based on table name
      switch (tableName) {
        case 'profiles':
          query = `
            CREATE TABLE IF NOT EXISTS profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id),
              username TEXT UNIQUE,
              full_name TEXT,
              avatar_url TEXT,
              website TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'weight_logs':
          query = `
            CREATE TABLE IF NOT EXISTS weight_logs (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              weight DECIMAL(5,2) NOT NULL,
              date DATE NOT NULL DEFAULT CURRENT_DATE,
              notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'recipes':
          query = `
            CREATE TABLE IF NOT EXISTS recipes (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id),
              title TEXT NOT NULL,
              description TEXT,
              ingredients JSONB NOT NULL,
              instructions JSONB NOT NULL,
              prep_time INTEGER,
              cook_time INTEGER,
              servings INTEGER,
              calories INTEGER,
              protein DECIMAL(5,2),
              fat DECIMAL(5,2),
              carbs DECIMAL(5,2),
              image_url TEXT,
              tags TEXT[],
              difficulty TEXT,
              meal_type TEXT,
              is_public BOOLEAN DEFAULT true,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'favorites':
          query = `
            CREATE TABLE IF NOT EXISTS favorites (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              recipe_id UUID REFERENCES recipes(id) NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(user_id, recipe_id)
            );
            ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'meal_plans':
          query = `
            CREATE TABLE IF NOT EXISTS meal_plans (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              start_date DATE,
              end_date DATE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'meal_plan_items':
          query = `
            CREATE TABLE IF NOT EXISTS meal_plan_items (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              meal_plan_id UUID REFERENCES meal_plans(id) NOT NULL,
              recipe_id UUID REFERENCES recipes(id) NOT NULL,
              day_of_week INTEGER,
              meal_type TEXT,
              servings INTEGER DEFAULT 1,
              notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'user_macros':
          query = `
            CREATE TABLE IF NOT EXISTS user_macros (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              daily_calories INTEGER,
              protein_percentage INTEGER,
              fat_percentage INTEGER,
              carbs_percentage INTEGER,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE user_macros ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'keto_articles':
          query = `
            CREATE TABLE IF NOT EXISTS keto_articles (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              summary TEXT,
              author TEXT,
              image_url TEXT,
              tags TEXT[],
              is_featured BOOLEAN DEFAULT false,
              published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE keto_articles ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'food_diary':
          query = `
            CREATE TABLE IF NOT EXISTS food_diary (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              date DATE NOT NULL DEFAULT CURRENT_DATE,
              meal_type TEXT NOT NULL,
              food_name TEXT NOT NULL,
              calories INTEGER,
              protein DECIMAL(5,2),
              fat DECIMAL(5,2),
              carbs DECIMAL(5,2),
              recipe_id UUID REFERENCES recipes(id),
              notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE food_diary ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'user_goals':
          query = `
            CREATE TABLE IF NOT EXISTS user_goals (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              goal_type TEXT NOT NULL,
              target_value DECIMAL(8,2),
              start_value DECIMAL(8,2),
              current_value DECIMAL(8,2),
              start_date DATE NOT NULL DEFAULT CURRENT_DATE,
              target_date DATE,
              is_completed BOOLEAN DEFAULT false,
              notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'user_achievements':
          query = `
            CREATE TABLE IF NOT EXISTS user_achievements (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              achievement_type TEXT NOT NULL,
              description TEXT NOT NULL,
              earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              badge_url TEXT,
              points INTEGER DEFAULT 0
            );
            ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        case 'recipe_ratings':
          query = `
            CREATE TABLE IF NOT EXISTS recipe_ratings (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              recipe_id UUID REFERENCES recipes(id) NOT NULL,
              rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
              review TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(user_id, recipe_id)
            );
            ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
          `;
          break;
          
        default:
          throw new Error(`No creation script defined for table: ${tableName}`);
      }
      
      // Execute the query
      const { error } = await supabase.query(query);
      
      if (error) {
        throw new Error(`Error creating table ${tableName}: ${error.message}`);
      }
      
      // Add RLS policies based on table
      await addRlsPolicies(tableName);
      
      // Refresh the table check
      await checkTables();
      
    } catch (err) {
      console.error(`Error creating table ${tableName}:`, err);
      setError(err.message || `Failed to create table ${tableName}`);
    } finally {
      setCreatingTable(null);
    }
  };
  
  const addRlsPolicies = async (tableName) => {
    try {
      let policyQueries = [];
      
      // Define policies based on table name
      switch (tableName) {
        case 'profiles':
          policyQueries = [
            `CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);`,
            `CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);`,
            `CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);`
          ];
          break;
          
        case 'weight_logs':
          policyQueries = [
            `CREATE POLICY "Users can view their own weight logs" ON weight_logs FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own weight logs" ON weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own weight logs" ON weight_logs FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own weight logs" ON weight_logs FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'recipes':
          policyQueries = [
            `CREATE POLICY "Users can view public recipes" ON recipes FOR SELECT USING (is_public = true);`,
            `CREATE POLICY "Users can view their own recipes" ON recipes FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own recipes" ON recipes FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own recipes" ON recipes FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'favorites':
          policyQueries = [
            `CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'meal_plans':
          policyQueries = [
            `CREATE POLICY "Users can view their own meal plans" ON meal_plans FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own meal plans" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own meal plans" ON meal_plans FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own meal plans" ON meal_plans FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'meal_plan_items':
          policyQueries = [
            `CREATE POLICY "Users can view their own meal plan items" ON meal_plan_items FOR SELECT USING (
              EXISTS (SELECT 1 FROM meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
            );`,
            `CREATE POLICY "Users can insert their own meal plan items" ON meal_plan_items FOR INSERT WITH CHECK (
              EXISTS (SELECT 1 FROM meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
            );`,
            `CREATE POLICY "Users can update their own meal plan items" ON meal_plan_items FOR UPDATE USING (
              EXISTS (SELECT 1 FROM meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
            );`,
            `CREATE POLICY "Users can delete their own meal plan items" ON meal_plan_items FOR DELETE USING (
              EXISTS (SELECT 1 FROM meal_plans WHERE id = meal_plan_items.meal_plan_id AND user_id = auth.uid())
            );`
          ];
          break;
          
        case 'user_macros':
          policyQueries = [
            `CREATE POLICY "Users can view their own macros" ON user_macros FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own macros" ON user_macros FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own macros" ON user_macros FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own macros" ON user_macros FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'keto_articles':
          policyQueries = [
            `CREATE POLICY "Public can view keto articles" ON keto_articles FOR SELECT USING (true);`,
            `CREATE POLICY "Admins can manage keto articles" ON keto_articles USING (auth.uid() IN (
              SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
            ));`
          ];
          break;
          
        case 'food_diary':
          policyQueries = [
            `CREATE POLICY "Users can view their own food diary" ON food_diary FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own food diary entries" ON food_diary FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own food diary entries" ON food_diary FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own food diary entries" ON food_diary FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'user_goals':
          policyQueries = [
            `CREATE POLICY "Users can view their own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can insert their own goals" ON user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own goals" ON user_goals FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own goals" ON user_goals FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        case 'user_achievements':
          policyQueries = [
            `CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);`,
            `CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT WITH CHECK (
              auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
              OR auth.uid() = user_id
            );`
          ];
          break;
          
        case 'recipe_ratings':
          policyQueries = [
            `CREATE POLICY "Public can view recipe ratings" ON recipe_ratings FOR SELECT USING (true);`,
            `CREATE POLICY "Users can insert their own ratings" ON recipe_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);`,
            `CREATE POLICY "Users can update their own ratings" ON recipe_ratings FOR UPDATE USING (auth.uid() = user_id);`,
            `CREATE POLICY "Users can delete their own ratings" ON recipe_ratings FOR DELETE USING (auth.uid() = user_id);`
          ];
          break;
          
        default:
          console.log(`No policies defined for table: ${tableName}`);
          return;
      }
      
      // Execute each policy query
      for (const policyQuery of policyQueries) {
        const { error } = await supabase.query(policyQuery);
        if (error && !error.message.includes('already exists')) {
          console.error(`Error creating policy for ${tableName}:`, error);
        }
      }
      
    } catch (err) {
      console.error(`Error adding RLS policies for ${tableName}:`, err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Table Check</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <button 
          onClick={checkTables}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {isLoading ? 'Checking...' : 'Refresh Table Check'}
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">
          <p>Checking database tables...</p>
        </div>
      ) : checkResults ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {checkResults.allTablesExist 
              ? '✅ All required tables exist!' 
              : `❌ Missing ${checkResults.missingTables.length} tables`}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Table Name</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(checkResults.results).map(([tableName, result]) => (
                  <tr key={tableName} className={result.exists ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="py-2 px-4 border-b font-medium">{tableName}</td>
                    <td className="py-2 px-4 border-b">
                      {result.exists ? (
                        <span className="text-green-600">✓ Exists</span>
                      ) : (
                        <span className="text-red-600">✖ Missing</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {!result.exists && (
                        <button
                          onClick={() => createMissingTable(tableName)}
                          disabled={creatingTable === tableName}
                          className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-2 rounded"
                        >
                          {creatingTable === tableName ? 'Creating...' : 'Create Table'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Click the button to check database tables.</p>
      )}
    </div>
  );
};

export default DatabaseCheck;
