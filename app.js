require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');

// Import routes
const apiRoutes = require('./routes');

// Import models to create tables
const userModel = require('./models/user');
const db = require('./config/db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create user tables
    await userModel.createUsersTable();
    console.log('User tables initialized');
    
    // Create machine tables
    try {
      const migrationPath = path.join(__dirname, 'migrations', 'create_machine_tables.sql');
      if (fs.existsSync(migrationPath)) {
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        await db.query(migrationSQL);
        console.log('Machine tables initialized');
      }
    } catch (machineError) {
      console.error('Error initializing machine tables:', machineError);
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
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
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