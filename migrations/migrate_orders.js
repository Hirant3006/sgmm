require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigration() {
  try {
    // Path to migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_orders_table.sql');
    
    // Check if file exists
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    // Read migration SQL
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    console.log('Running orders table migration...');
    await db.query(migrationSQL);
    
    console.log('Orders table migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration(); 