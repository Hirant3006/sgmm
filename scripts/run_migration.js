require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Create a database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_machine_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Connecting to the database...');
    const client = await pool.connect();
    
    try {
      console.log('Running migration for machine tables...');
      await client.query(migrationSQL);
      console.log('Migration completed successfully!');
    } finally {
      client.release();
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration(); 