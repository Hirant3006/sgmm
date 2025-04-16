require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const compression = require('compression');

// Import routes
const apiRoutes = require('./routes');

// Import models to create tables
const userModel = require('./models/user');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://xenuocmiatuan.vercel.app', 'https://xenuocmiatuan.com'] 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize database tables - don't recreate in production
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // In production, don't drop tables
    if (process.env.NODE_ENV !== 'production') {
      try {
        await db.query('DROP TABLE IF EXISTS machines CASCADE');
        await db.query('DROP TABLE IF EXISTS machine_subtypes CASCADE');
        await db.query('DROP TABLE IF EXISTS machine_types CASCADE');
        await db.query('DROP TABLE IF EXISTS users CASCADE');
        console.log('All existing tables dropped');
      } catch (dropError) {
        console.error('Error dropping tables:', dropError);
      }
    }
    
    // Create user tables
    await userModel.createUsersTable();
    console.log('User tables initialized');
    
    // Check if machine tables exist
    const checkTablesQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'machine_types'
      );
    `;
    const tablesExist = await db.query(checkTablesQuery);
    
    // Only create machine tables if they don't exist
    if (!tablesExist.rows[0].exists) {
      try {
        // Create machine_types table
        await db.query(`
          CREATE TABLE IF NOT EXISTS machine_types (
            machine_type_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Create machine_subtypes table
        await db.query(`
          CREATE TABLE IF NOT EXISTS machine_subtypes (
            machine_subtype_id SERIAL PRIMARY KEY,
            machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Create machines table
        await db.query(`
          CREATE TABLE IF NOT EXISTS machines (
            id SERIAL PRIMARY KEY,
            machine_id VARCHAR(50) UNIQUE,
            machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
            machine_subtype_id INTEGER REFERENCES machine_subtypes(machine_subtype_id),
            name VARCHAR(100) NOT NULL,
            price DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        console.log('Machine tables initialized');
      } catch (machineError) {
        console.error('Error initializing machine tables:', machineError);
      }
    } else {
      console.log('Machine tables already exist - skipping creation');
    }
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
};

// Initialize database
initializeDatabase();

// API Routes
app.use('/api', apiRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // For a pure API backend, just send a JSON response for non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    res.json({
      message: 'Xenuocmiatuan API Server is running. Frontend is deployed separately.'
    });
  });
} else {
  // In development, serve the static files
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      }
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});