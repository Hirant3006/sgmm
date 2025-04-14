const express = require('express');
const router = express.Router();

// Import specific route modules
const authRoutes = require('./auth');
const machineRoutes = require('./machineRoutes');
const machineTypeRoutes = require('./machineTypeRoutes');
const machineSubTypeRoutes = require('./machineSubTypeRoutes');
const orderRoutes = require('./orderRoutes');
const migrationRoutes = require('./migrationRoutes');

// Import auth middleware
const authMiddleware = require('../middleware/auth');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes - require authentication
router.use('/machines', machineRoutes);
router.use('/machine-types', machineTypeRoutes);
router.use('/machine-subtypes', machineSubTypeRoutes);
router.use('/orders', orderRoutes);
router.use('/migration', migrationRoutes);

module.exports = router; 