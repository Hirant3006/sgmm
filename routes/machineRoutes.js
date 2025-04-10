const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const authMiddleware = require('../middleware/auth');

// All routes should be protected
router.use(authMiddleware.authenticate);

// GET all machines
router.get('/', machineController.getAllMachines);

// GET a single machine
router.get('/:id', machineController.getMachineById);

// POST a new machine
router.post('/', machineController.createMachine);

// PUT (update) a machine
router.put('/:id', machineController.updateMachine);

// DELETE a machine
router.delete('/:id', machineController.deleteMachine);

module.exports = router; 