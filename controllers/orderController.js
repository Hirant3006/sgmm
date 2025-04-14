const Order = require('../models/Order');

const orderController = {
  // Get all orders with filtering
  getAllOrders: async (req, res) => {
    try {
      // Extract filter parameters from query
      const {
        page = 1,
        limit = 10,
        sortBy = 'date',
        sortOrder = 'desc',
        dateFrom,
        dateTo,
        machineId,
        machineTypeId,
        machineSubTypeId,
        customerName,
        customerPhone,
        source,
        priceFrom,
        priceTo,
        costFrom,
        costTo,
        shippingFrom,
        shippingTo,
        purchaseLocation,
      } = req.query;
      
      // Convert numeric values
      const filters = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        machineId,
        machineTypeId,
        machineSubTypeId,
        customerName,
        customerPhone,
        source,
        purchaseLocation,
      };
      
      // Add date filters if provided
      if (dateFrom) filters.dateFrom = new Date(dateFrom);
      if (dateTo) filters.dateTo = new Date(dateTo);
      
      // Add numeric filters if provided
      if (priceFrom) filters.priceFrom = parseFloat(priceFrom);
      if (priceTo) filters.priceTo = parseFloat(priceTo);
      if (costFrom) filters.costFrom = parseFloat(costFrom);
      if (costTo) filters.costTo = parseFloat(costTo);
      if (shippingFrom) filters.shippingFrom = parseFloat(shippingFrom);
      if (shippingTo) filters.shippingTo = parseFloat(shippingTo);
      
      // Get orders with filters
      const orders = await Order.getAll(filters);
      
      // Get total count for pagination
      const total = await Order.getCount(filters);
      
      return res.status(200).json({
        success: true,
        data: orders,
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          pages: Math.ceil(total / filters.limit)
        }
      });
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đơn đặt hàng',
        error: error.message
      });
    }
  },
  
  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const order = await Order.getById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt hàng'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error in getOrderById:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin đơn đặt hàng',
        error: error.message
      });
    }
  },
  
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const {
        date,
        machine_id,
        machine_type_id,
        machine_subtype_id,
        customer_name,
        customer_phone,
        source,
        price,
        cost_of_good,
        shipping_cost,
        purchase_location,
        notes
      } = req.body;
      
      // Validate required fields
      if (!machine_id || !machine_type_id || !machine_subtype_id) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin máy'
        });
      }
      
      // Validate price and cost
      const priceValue = price !== undefined ? parseFloat(price) : null;
      const costValue = cost_of_good !== undefined ? parseFloat(cost_of_good) : null;
      const shippingValue = shipping_cost !== undefined ? parseFloat(shipping_cost) : null;
      
      if (priceValue === null || isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá bán không hợp lệ, phải là số không âm'
        });
      }
      
      if (costValue === null || isNaN(costValue) || costValue < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá vốn không hợp lệ, phải là số không âm'
        });
      }
      
      if (shippingValue !== null && (isNaN(shippingValue) || shippingValue < 0)) {
        return res.status(400).json({
          success: false,
          message: 'Phí vận chuyển không hợp lệ, phải là số không âm'
        });
      }
      
      const newOrder = await Order.create({
        date: date ? new Date(date) : new Date(),
        machine_id,
        machine_type_id,
        machine_subtype_id,
        customer_name,
        customer_phone,
        source,
        price: priceValue,
        cost_of_good: costValue,
        shipping_cost: shippingValue,
        purchase_location,
        notes
      });
      
      return res.status(201).json({
        success: true,
        message: 'Thêm đơn đặt hàng thành công',
        data: newOrder
      });
    } catch (error) {
      console.error('Error in createOrder:', error);
      
      // Handle specific errors
      if (error.message.includes('Invalid reference')) {
        return res.status(400).json({
          success: false,
          message: 'Thông tin máy không hợp lệ'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm đơn đặt hàng mới',
        error: error.message
      });
    }
  },
  
  // Update an order
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        date,
        machine_id,
        machine_type_id,
        machine_subtype_id,
        customer_name,
        customer_phone,
        source,
        price,
        cost_of_good,
        shipping_cost,
        purchase_location,
        notes
      } = req.body;
      
      // Validate required fields
      if (!machine_id || !machine_type_id || !machine_subtype_id) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin máy'
        });
      }
      
      // Validate price and cost
      const priceValue = price !== undefined ? parseFloat(price) : null;
      const costValue = cost_of_good !== undefined ? parseFloat(cost_of_good) : null;
      const shippingValue = shipping_cost !== undefined ? parseFloat(shipping_cost) : null;
      
      if (priceValue === null || isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá bán không hợp lệ, phải là số không âm'
        });
      }
      
      if (costValue === null || isNaN(costValue) || costValue < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá vốn không hợp lệ, phải là số không âm'
        });
      }
      
      if (shippingValue !== null && (isNaN(shippingValue) || shippingValue < 0)) {
        return res.status(400).json({
          success: false,
          message: 'Phí vận chuyển không hợp lệ, phải là số không âm'
        });
      }
      
      const updatedOrder = await Order.update(id, {
        date: date ? new Date(date) : new Date(),
        machine_id,
        machine_type_id,
        machine_subtype_id,
        customer_name,
        customer_phone,
        source,
        price: priceValue,
        cost_of_good: costValue,
        shipping_cost: shippingValue,
        purchase_location,
        notes
      });
      
      return res.status(200).json({
        success: true,
        message: 'Cập nhật đơn đặt hàng thành công',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error in updateOrder:', error);
      
      // Handle specific errors
      if (error.message.includes('Order not found')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt hàng'
        });
      }
      
      if (error.message.includes('Invalid reference')) {
        return res.status(400).json({
          success: false,
          message: 'Thông tin máy không hợp lệ'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật đơn đặt hàng',
        error: error.message
      });
    }
  },
  
  // Delete an order
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      
      await Order.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Xóa đơn đặt hàng thành công'
      });
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      
      // Handle specific errors
      if (error.message.includes('Order not found')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt hàng'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa đơn đặt hàng',
        error: error.message
      });
    }
  }
};

module.exports = orderController; 