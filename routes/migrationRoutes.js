const express = require('express');
const router = express.Router();
const migrationController = require('../controllers/migrationController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Apply admin middleware to all routes
router.use(adminMiddleware.isAdmin);

// Upload Excel file
router.post('/upload', migrationController.uploadFile);

// Google Sheets authentication
router.get('/google-sheets/auth', migrationController.googleSheetsAuth);

// Get preview data from Google Sheets
router.get('/preview', migrationController.getPreviewData);

// Start the migration process
router.post('/start', migrationController.startMigration);

// Get migration status
router.get('/status', migrationController.getMigrationStatus);

// Get migration progress
router.get('/progress', migrationController.getMigrationProgress);

module.exports = router; 