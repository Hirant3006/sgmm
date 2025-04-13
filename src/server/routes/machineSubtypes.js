const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get all machine subtypes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM machine_subtypes ORDER BY machine_subtype_id');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching machine subtypes:', error);
    res.status(500).json({ success: false, message: 'Không thể tải dữ liệu loại máy con' });
  }
});

// Get a single machine subtype
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM machine_subtypes WHERE machine_subtype_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại máy con' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching machine subtype:', error);
    res.status(500).json({ success: false, message: 'Không thể tải dữ liệu loại máy con' });
  }
});

// Create a new machine subtype
router.post('/', authenticateToken, async (req, res) => {
  const { machine_subtype_id, name } = req.body;
  
  if (!machine_subtype_id || !name) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
  }
  
  try {
    await db.query(
      'INSERT INTO machine_subtypes (machine_subtype_id, name) VALUES (?, ?)',
      [machine_subtype_id, name]
    );
    
    const [newMachineSubType] = await db.query(
      'SELECT * FROM machine_subtypes WHERE machine_subtype_id = ?',
      [machine_subtype_id]
    );
    
    res.status(201).json({ success: true, data: newMachineSubType[0] });
  } catch (error) {
    console.error('Error creating machine subtype:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Mã loại máy con đã tồn tại' });
    }
    
    res.status(500).json({ success: false, message: 'Không thể tạo loại máy con mới' });
  }
});

// Update a machine subtype
router.put('/:id', authenticateToken, async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE machine_subtypes SET name = ? WHERE machine_subtype_id = ?',
      [name, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại máy con' });
    }
    
    const [updatedMachineSubType] = await db.query(
      'SELECT * FROM machine_subtypes WHERE machine_subtype_id = ?',
      [req.params.id]
    );
    
    res.json({ success: true, data: updatedMachineSubType[0] });
  } catch (error) {
    console.error('Error updating machine subtype:', error);
    res.status(500).json({ success: false, message: 'Không thể cập nhật loại máy con' });
  }
});

// Delete a machine subtype
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM machine_subtypes WHERE machine_subtype_id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại máy con' });
    }
    
    res.json({ success: true, message: 'Xóa loại máy con thành công' });
  } catch (error) {
    console.error('Error deleting machine subtype:', error);
    res.status(500).json({ success: false, message: 'Không thể xóa loại máy con' });
  }
});

module.exports = router; 