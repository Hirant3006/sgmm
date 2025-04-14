const Machine = require('../models/Machine');

const machineController = {
  // Get all machines
  getAllMachines: async (req, res) => {
    try {
      const machines = await Machine.getAll();
      
      return res.status(200).json({
        success: true,
        data: machines,
        total: machines.length
      });
    } catch (error) {
      console.error('Error in getAllMachines:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách máy móc',
        error: error.message
      });
    }
  },
  
  // Get machine by ID
  getMachineById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const machine = await Machine.getById(id);
      
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy máy'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: machine
      });
    } catch (error) {
      console.error('Error in getMachineById:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin máy',
        error: error.message
      });
    }
  },
  
  // Create a new machine
  createMachine: async (req, res) => {
    try {
      const { machine_type_id, machine_subtype_id, name, price } = req.body;
      
      // Validate request body
      if (!machine_type_id || !machine_subtype_id || !name) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
        });
      }
      
      // Validate price
      const priceValue = price !== undefined ? Number(price) : 0;
      if (isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá không hợp lệ, phải là số không âm'
        });
      }
      
      const newMachine = await Machine.create({
        machine_type_id,
        machine_subtype_id,
        name,
        price: priceValue
      });
      
      return res.status(201).json({
        success: true,
        message: 'Thêm máy thành công',
        data: newMachine
      });
    } catch (error) {
      console.error('Error in createMachine:', error);
      
      // Handle specific errors
      if (error.message.includes('Invalid machine type ID') || error.message.includes('Invalid machine subtype ID')) {
        return res.status(400).json({
          success: false,
          message: 'Loại máy hoặc loại máy con không hợp lệ'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm máy mới',
        error: error.message
      });
    }
  },
  
  // Update a machine
  updateMachine: async (req, res) => {
    try {
      const { id } = req.params;
      const { machine_type_id, machine_subtype_id, name, price } = req.body;
      
      // Validate request body
      if (!machine_type_id || !machine_subtype_id || !name) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
        });
      }

      // Validate name
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Tên máy phải có độ dài từ 2-100 ký tự'
        });
      }
      
      // Validate price
      const priceValue = price !== undefined ? Number(price) : 0;
      if (isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá không hợp lệ, phải là số không âm'
        });
      }
      
      const updatedMachine = await Machine.update(id, {
        machine_type_id,
        machine_subtype_id,
        name,
        price: priceValue
      });
      
      return res.status(200).json({
        success: true,
        message: 'Cập nhật máy thành công',
        data: updatedMachine
      });
    } catch (error) {
      console.error('Error in updateMachine:', error);
      
      // Handle specific errors
      if (error.message.includes('Machine not found')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy máy'
        });
      }
      
      if (error.message.includes('Invalid machine type ID') || error.message.includes('Invalid machine subtype ID')) {
        return res.status(400).json({
          success: false,
          message: 'Loại máy hoặc loại máy con không hợp lệ'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật máy',
        error: error.message
      });
    }
  },
  
  // Delete a machine
  deleteMachine: async (req, res) => {
    try {
      const { id } = req.params;
      
      await Machine.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Xóa máy thành công'
      });
    } catch (error) {
      console.error('Error in deleteMachine:', error);
      
      // Handle specific errors
      if (error.message.includes('Machine not found')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy máy'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa máy',
        error: error.message
      });
    }
  }
};

module.exports = machineController; 