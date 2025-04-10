const db = require('../config/db');

class Machine {
  static async getAll() {
    const query = `
      SELECT m.machine_id, m.machine_type_id, m.price, mt.name as machine_type_name
      FROM machines m
      LEFT JOIN machine_types mt ON m.machine_type_id = mt.machine_type_id
      ORDER BY m.machine_id
    `;
    
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting machines: ${error.message}`);
    }
  }

  static async getById(machineId) {
    const query = `
      SELECT m.machine_id, m.machine_type_id, m.price, mt.name as machine_type_name
      FROM machines m
      LEFT JOIN machine_types mt ON m.machine_type_id = mt.machine_type_id
      WHERE m.machine_id = $1
    `;
    
    try {
      const { rows } = await db.query(query, [machineId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting machine: ${error.message}`);
    }
  }

  static async create(machine) {
    const { machine_id, machine_type_id, price } = machine;
    
    // Check if machine_type_id exists
    const checkTypeQuery = 'SELECT 1 FROM machine_types WHERE machine_type_id = $1';
    
    // Insert query
    const insertQuery = `
      INSERT INTO machines (machine_id, machine_type_id, price)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    try {
      // Verify machine type exists
      const typeResult = await db.query(checkTypeQuery, [machine_type_id]);
      if (typeResult.rowCount === 0) {
        throw new Error('Invalid machine type ID');
      }
      
      // Create machine
      const { rows } = await db.query(insertQuery, [machine_id, machine_type_id, price]);
      
      // Get the created machine with type name
      return this.getById(machine_id);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Machine ID already exists');
      }
      if (error.code === '23503') { // Foreign key violation
        throw new Error('Invalid machine type ID');
      }
      throw new Error(`Error creating machine: ${error.message}`);
    }
  }

  static async update(machineId, machine) {
    const { machine_type_id, price } = machine;
    
    // Check if machine_type_id exists
    const checkTypeQuery = 'SELECT 1 FROM machine_types WHERE machine_type_id = $1';
    
    // Update query
    const updateQuery = `
      UPDATE machines
      SET machine_type_id = $1, price = $2, updated_at = CURRENT_TIMESTAMP
      WHERE machine_id = $3
      RETURNING *
    `;
    
    try {
      // Verify machine type exists
      const typeResult = await db.query(checkTypeQuery, [machine_type_id]);
      if (typeResult.rowCount === 0) {
        throw new Error('Invalid machine type ID');
      }
      
      // Update machine
      const result = await db.query(updateQuery, [machine_type_id, price, machineId]);
      
      if (result.rowCount === 0) {
        throw new Error('Machine not found');
      }
      
      // Get the updated machine with type name
      return this.getById(machineId);
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        throw new Error('Invalid machine type ID');
      }
      throw new Error(`Error updating machine: ${error.message}`);
    }
  }

  static async delete(machineId) {
    const query = 'DELETE FROM machines WHERE machine_id = $1 RETURNING *';
    
    try {
      const result = await db.query(query, [machineId]);
      
      if (result.rowCount === 0) {
        throw new Error('Machine not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting machine: ${error.message}`);
    }
  }
}

module.exports = Machine; 