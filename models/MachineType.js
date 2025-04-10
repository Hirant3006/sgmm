const db = require('../config/db');

class MachineType {
  static async getAll() {
    const query = `
      SELECT machine_type_id, name
      FROM machine_types
      ORDER BY name
    `;
    
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting machine types: ${error.message}`);
    }
  }

  static async getById(machineTypeId) {
    const query = `
      SELECT machine_type_id, name
      FROM machine_types
      WHERE machine_type_id = $1
    `;
    
    try {
      const { rows } = await db.query(query, [machineTypeId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting machine type: ${error.message}`);
    }
  }

  static async create(machineType) {
    const { machine_type_id, name } = machineType;
    
    const query = `
      INSERT INTO machine_types (machine_type_id, name)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    try {
      const { rows } = await db.query(query, [machine_type_id, name]);
      return rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Machine type ID already exists');
      }
      throw new Error(`Error creating machine type: ${error.message}`);
    }
  }

  static async update(machineTypeId, machineType) {
    const { name } = machineType;
    
    const query = `
      UPDATE machine_types
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE machine_type_id = $2
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [name, machineTypeId]);
      
      if (result.rowCount === 0) {
        throw new Error('Machine type not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating machine type: ${error.message}`);
    }
  }

  static async delete(machineTypeId) {
    // First check if any machines are using this type
    const checkUsageQuery = `
      SELECT 1 FROM machines WHERE machine_type_id = $1 LIMIT 1
    `;
    
    const deleteQuery = `
      DELETE FROM machine_types 
      WHERE machine_type_id = $1 
      RETURNING *
    `;
    
    try {
      // Check if this type is being used
      const usageResult = await db.query(checkUsageQuery, [machineTypeId]);
      if (usageResult.rowCount > 0) {
        throw new Error('Cannot delete machine type that is being used by machines');
      }
      
      // Delete the machine type
      const result = await db.query(deleteQuery, [machineTypeId]);
      
      if (result.rowCount === 0) {
        throw new Error('Machine type not found');
      }
      
      return result.rows[0];
    } catch (error) {
      // If error is foreign key violation, provide better message
      if (error.code === '23503') {
        throw new Error('Cannot delete machine type that is being used by machines');
      }
      throw new Error(`Error deleting machine type: ${error.message}`);
    }
  }
}

module.exports = MachineType; 