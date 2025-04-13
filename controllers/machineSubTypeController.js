const db = require('../config/database');

// Get all machine subtypes
const getAllMachineSubTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM machine_subtypes ORDER BY machine_subtype_id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching machine subtypes:', error);
    res.status(500).json({ success: false, message: 'Không thể tải dữ liệu loại máy con' });
  }
};

// Get a single machine subtype
const getMachineSubTypeById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM machine_subtypes WHERE machine_subtype_id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại máy con' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching machine subtype:', error);
    res.status(500).json({ success: false, message: 'Không thể tải dữ liệu loại máy con' });
  }
};

// Create a new machine subtype
const createMachineSubType = async (req, res) => {
  const { machine_subtype_id, name } = req.body;
  
  if (!machine_subtype_id || !name) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
  }
  
  try {
    const result = await db.query(
      'INSERT INTO machine_subtypes (machine_subtype_id, name) VALUES ($1, $2) RETURNING *',
      [machine_subtype_id, name]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating machine subtype:', error);
    
    if (error.code === '23505') { // PostgreSQL unique violation code
      return res.status(400).json({ success: false, message: 'Mã loại máy con đã tồn tại' });
    }
    
    res.status(500).json({ success: false, message: 'Không thể tạo loại máy con mới' });
  }
};

// Update a machine subtype
const updateMachineSubType = async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
  }
  
  try {
    const result = await db.query(
      'UPDATE machine_subtypes SET name = $1 WHERE machine_subtype_id = $2 RETURNING *',
      [name, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại máy con' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating machine subtype:', error);
    res.status(500).json({ success: false, message: 'Không thể cập nhật loại máy con' });
  }
};

// Delete a machine subtype
const deleteMachineSubType = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM machine_subtypes WHERE machine_subtype_id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại máy con' });
    }
    
    res.json({ success: true, message: 'Xóa loại máy con thành công' });
  } catch (error) {
    console.error('Error deleting machine subtype:', error);
    res.status(500).json({ success: false, message: 'Không thể xóa loại máy con' });
  }
};

module.exports = {
  getAllMachineSubTypes,
  getMachineSubTypeById,
  createMachineSubType,
  updateMachineSubType,
  deleteMachineSubType
}; 