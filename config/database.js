const { Pool } = require('pg');

// Create a new PostgreSQL pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'goodsdb',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    done();
  }
});

// Add getClient method to match what's used in the migration controller
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient
}; 