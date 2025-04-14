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
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
    
    // Check if default admin user exists
    const result = await db.query('SELECT * FROM users WHERE username = $1', ['admin']);
    
    // If admin user doesn't exist, create it with default password and admin role
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await db.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('Default admin user created');
    } else {
      // Update existing admin user to have admin role if it doesn't already
      const adminUser = result.rows[0];
      if (!adminUser.role || adminUser.role !== 'admin') {
        await db.query(
          'UPDATE users SET role = $1 WHERE username = $2',
          ['admin', 'admin']
        );
        console.log('Updated existing admin user with admin role');
      }
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