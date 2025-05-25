import { checkDatabase } from './checkDatabase.js';

// Run the database check
checkDatabase()
  .then(result => {
    console.log('Database check completed');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.tables && result.tables.length > 0) {
      console.log('Existing tables:');
      result.tables.forEach(table => {
        console.log(`- ${table}`);
      });
    } else {
      console.log('No tables found in the database');
    }
    
    if (!result.success) {
      console.error('Error details:', result.error);
    }
  })
  .catch(err => {
    console.error('Failed to run database check:', err);
  });
