const { Pool } = require('pg');

// Create a new PostgreSQL pool instance with optimized settings
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'goodsdb',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
  allowExitOnIdle: true // Allow the pool to close idle connections
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