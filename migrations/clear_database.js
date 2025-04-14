const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function clearDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database cleanup...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Disable foreign key constraints temporarily
    await client.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Clear specific tables (machines and orders)
    const tables = [
      'orders',
      'machines',
      'machine_types',
      'machine_subtypes'
    ];
    
    for (const table of tables) {
      try {
        console.log(`Clearing table: ${table}`);
        await client.query(`TRUNCATE TABLE ${table} CASCADE`);
      } catch (tableError) {
        console.log(`Table ${table} does not exist or could not be cleared: ${tableError.message}`);
      }
    }
    
    // Re-enable foreign key constraints
    await client.query('SET CONSTRAINTS ALL IMMEDIATE');
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database cleanup completed successfully!');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error clearing database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

clearDatabase(); 