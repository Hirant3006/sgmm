const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Login route - POST /api/auth/login
router.post('/login', authController.login);

// Check authentication status - GET /api/auth/status
router.get('/status', authMiddleware.authenticate, authController.checkAuth);

// Logout route - POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router; 