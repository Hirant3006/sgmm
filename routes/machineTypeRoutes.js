const express = require('express');
const router = express.Router();
const machineTypeController = require('../controllers/machineTypeController');
const authMiddleware = require('../middleware/auth');

// All routes should be protected
router.use(authMiddleware.authenticate);

// GET all machine types
router.get('/', machineTypeController.getAllMachineTypes);

// GET a single machine type
router.get('/:id', machineTypeController.getMachineTypeById);

// POST a new machine type
router.post('/', machineTypeController.createMachineType);

// PUT (update) a machine type
router.put('/:id', machineTypeController.updateMachineType);

// DELETE a machine type
router.delete('/:id', machineTypeController.deleteMachineType);

module.exports = router;