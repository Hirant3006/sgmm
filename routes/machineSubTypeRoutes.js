const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const machineSubTypeController = require('../controllers/machineSubTypeController');

// All routes should be protected
router.use(authMiddleware.authenticate);

// GET all machine subtypes
router.get('/', machineSubTypeController.getAllMachineSubTypes);

// GET a single machine subtype
router.get('/:id', machineSubTypeController.getMachineSubTypeById);

// POST a new machine subtype
router.post('/', machineSubTypeController.createMachineSubType);

// PUT update a machine subtype
router.put('/:id', machineSubTypeController.updateMachineSubType);

// DELETE a machine subtype
router.delete('/:id', machineSubTypeController.deleteMachineSubType);

module.exports = router; 