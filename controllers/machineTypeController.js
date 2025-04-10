const MachineType = require('../models/MachineType');

const machineTypeController = {
  // Get all machine types
  getAllMachineTypes: async (req, res) => {
    try {
      const machineTypes = await MachineType.getAll();
      
      return res.status(200).json({
        success: true,
        data: machineTypes,
        total: machineTypes.length
      });
    } catch (error) {
      console.error('Error in getAllMachineTypes:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách loại máy',
        error: error.message
      });
    }
  },
  
  // Get machine type by ID
  getMachineTypeById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const machineType = await MachineType.getById(id);
      
      if (!machineType) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại máy'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: machineType
      });
    } catch (error) {
      console.error('Error in getMachineTypeById:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin loại máy',
        error: error.message
      });
    }
  },
  
  // Create a new machine type
  createMachineType: async (req, res) => {
    try {
      const { machine_type_id, name } = req.body;
      
      // Validate request body
      if (!machine_type_id || !name) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
        });
      }
      
      // Validate machine_type_id format
      if (!/^[a-zA-Z0-9]+$/.test(machine_type_id)) {
        return res.status(400).json({
          success: false,
          message: 'Mã loại máy chỉ được chứa chữ cái và số'
        });
      }
      
      // Validate name
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Tên loại máy phải có độ dài từ 2-100 ký tự'
        });
      }
      
      const newMachineType = await MachineType.create({
        machine_type_id,
        name
      });
      
      return res.status(201).json({
        success: true,
        message: 'Thêm loại máy thành công',
        data: newMachineType
      });
    } catch (error) {
      console.error('Error in createMachineType:', error);
      
      // Handle specific errors
      if (error.message.includes('Machine type ID already exists')) {
        return res.status(400).json({
          success: false,
          message: 'Mã loại máy đã tồn tại'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm loại máy mới',
        error: error.message
      });
    }
  },
  
  // Update a machine type
  updateMachineType: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      // Validate request body
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tên loại máy'
        });
      }
      
      // Validate name
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Tên loại máy phải có độ dài từ 2-100 ký tự'
        });
      }
      
      const updatedMachineType = await MachineType.update(id, {
        name
      });
      
      return res.status(200).json({
        success: true,
        message: 'Cập nhật loại máy thành công',
        data: updatedMachineType
      });
    } catch (error) {
      console.error('Error in updateMachineType:', error);
      
      // Handle specific errors
      if (error.message.includes('Machine type not found')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại máy'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật loại máy',
        error: error.message
      });
    }
  },
  
  // Delete a machine type
  deleteMachineType: async (req, res) => {
    try {
      const { id } = req.params;
      
      await MachineType.delete(id);
      
      return res.status(200).json({
        success: true,
        message: 'Xóa loại máy thành công'
      });
    } catch (error) {
      console.error('Error in deleteMachineType:', error);
      
      // Handle specific errors
      if (error.message.includes('Machine type not found')) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại máy'
        });
      }
      
      if (error.message.includes('Cannot delete machine type that is being used')) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa loại máy đang được sử dụng bởi máy móc'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa loại máy',
        error: error.message
      });
    }
  }
};

module.exports = machineTypeController; 