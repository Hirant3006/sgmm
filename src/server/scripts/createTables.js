const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function createTables() {
  // Create a connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'xenuocmiatuan',
  });

  try {
    console.log('Connected to database');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../database/migrations/create_machine_subtypes_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    await connection.query(sql);
    console.log('Machine subtypes table created or already exists');

    // Check if the table exists
    const [rows] = await connection.query('SHOW TABLES LIKE "machine_subtypes"');
    if (rows.length > 0) {
      console.log('Machine subtypes table exists');
    } else {
      console.log('Machine subtypes table does not exist');
    }

  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await connection.end();
  }
}

// Run the function
createTables(); 