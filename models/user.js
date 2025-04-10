const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Create users table
const createUsersTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
    
    // Check if default admin user exists
    const result = await db.query('SELECT * FROM users WHERE username = $1', ['admin']);
    
    // If admin user doesn't exist, create it with default password
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await db.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        ['admin', hashedPassword]
      );
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Validate user credentials
const validateUser = async (username, password) => {
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUsersTable,
  getUserByUsername,
  validateUser
}; 