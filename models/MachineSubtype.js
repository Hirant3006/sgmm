const db = require('../config/db');

class MachineSubtype {
  static async getAll() {
    const query = `
      SELECT machine_subtype_id, name
      FROM machine_subtypes
      ORDER BY name
    `;
    
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting machine subtypes: ${error.message}`);
    }
  }

  static async getById(machineSubtypeId) {
    const query = `
      SELECT machine_subtype_id, name
      FROM machine_subtypes
      WHERE machine_subtype_id = $1
    `;
    
    try {
      const { rows } = await db.query(query, [machineSubtypeId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting machine subtype: ${error.message}`);
    }
  }

  static async create(machineSubtype) {
    const { name } = machineSubtype;
    
    // Insert the machine subtype
    const insertQuery = `
      INSERT INTO machine_subtypes (name)
      VALUES ($1)
      RETURNING machine_subtype_id, name
    `;
    
    try {
      // Insert the machine subtype
      const { rows } = await db.query(insertQuery, [name]);
      
      if (!rows[0]) {
        throw new Error('Failed to create machine subtype');
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating machine subtype: ${error.message}`);
    }
  }

  static async update(machineSubtypeId, machineSubtype) {
    const { name } = machineSubtype;
    
    const query = `
      UPDATE machine_subtypes
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE machine_subtype_id = $2
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [name, machineSubtypeId]);
      
      if (result.rowCount === 0) {
        throw new Error('Machine subtype not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating machine subtype: ${error.message}`);
    }
  }

  static async delete(machineSubtypeId) {
    // First check if any machines are using this subtype
    const checkUsageQuery = `
      SELECT 1 FROM machines WHERE machine_subtype_id = $1 LIMIT 1
    `;
    
    const deleteQuery = `
      DELETE FROM machine_subtypes 
      WHERE machine_subtype_id = $1 
      RETURNING *
    `;
    
    try {
      // Check if this subtype is being used
      const usageResult = await db.query(checkUsageQuery, [machineSubtypeId]);
      if (usageResult.rowCount > 0) {
        throw new Error('Cannot delete machine subtype that is being used by machines');
      }
      
      // Delete the machine subtype
      const result = await db.query(deleteQuery, [machineSubtypeId]);
      
      if (result.rowCount === 0) {
        throw new Error('Machine subtype not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting machine subtype: ${error.message}`);
    }
  }
}

module.exports = MachineSubtype; 