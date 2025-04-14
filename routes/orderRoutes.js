const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// All routes should be protected
router.use(authMiddleware.authenticate);

// GET all orders with filtering
router.get('/', orderController.getAllOrders);

// GET a single order
router.get('/:id', orderController.getOrderById);

// POST a new order
router.post('/', orderController.createOrder);

// PUT (update) an order
router.put('/:id', orderController.updateOrder);

// DELETE an order
router.delete('/:id', orderController.deleteOrder);

module.exports = router; 