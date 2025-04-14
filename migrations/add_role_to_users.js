require('dotenv').config();
const pool = require('../config/database');

async function addRoleToUsers() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if role column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `);
    
    if (checkColumn.rows.length === 0) {
      // Add role column if it doesn't exist
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(20) DEFAULT 'user'
      `);
      
      // Update admin user to have admin role
      await client.query(`
        UPDATE users 
        SET role = 'admin' 
        WHERE username = 'admin'
      `);
      
      console.log('Successfully added role column to users table');
    } else {
      console.log('Role column already exists in users table');
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
addRoleToUsers()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 