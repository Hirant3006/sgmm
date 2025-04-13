const db = require('../config/db');

class Machine {
  static async getAll() {
    const query = `
      SELECT m.machine_id, m.name, m.machine_type_id, m.price, mt.name as machine_type_name
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
      SELECT m.machine_id, m.name, m.machine_type_id, m.price, mt.name as machine_type_name
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

  static async create(machineData) {
    const { machine_type_id, name, price } = machineData;
    
    // First, get the next id value
    const getIdQuery = `
      SELECT nextval('machines_id_seq') as next_id
    `;
    
    // Then insert with the generated machine_id
    const insertQuery = `
      WITH inserted_machine AS (
        INSERT INTO machines (machine_id, machine_type_id, name, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      )
      SELECT 
        m.machine_id,
        m.name,
        m.machine_type_id,
        m.price,
        mt.name as machine_type_name
      FROM inserted_machine m
      LEFT JOIN machine_types mt ON m.machine_type_id = mt.machine_type_id
    `;
    
    try {
      // Get the next id value
      const { rows: idRows } = await db.query(getIdQuery);
      const nextId = idRows[0].next_id;
      
      // Generate the machine_id
      const machineId = 'M' + String(nextId).padStart(3, '0');
      
      // Insert the machine with the generated machine_id
      const { rows } = await db.query(insertQuery, [machineId, machine_type_id, name, price]);
      
      if (!rows[0]) {
        throw new Error('Failed to create machine');
      }
      
      return rows[0];
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation in PostgreSQL
        throw new Error('Invalid machine type ID');
      }
      throw new Error(`Error creating machine: ${error.message}`);
    }
  }

  static async update(machineId, machine) {
    const { machine_type_id, name, price } = machine;
    
    // Check if machine_type_id exists
    const checkTypeQuery = 'SELECT 1 FROM machine_types WHERE machine_type_id = $1';
    
    // Update query
    const updateQuery = `
      UPDATE machines
      SET machine_type_id = $1, name = $2, price = $3, updated_at = CURRENT_TIMESTAMP
      WHERE machine_id = $4
      RETURNING *
    `;
    
    try {
      // Verify machine type exists
      const typeResult = await db.query(checkTypeQuery, [machine_type_id]);
      if (typeResult.rowCount === 0) {
        throw new Error('Invalid machine type ID');
      }
      
      // Update machine
      const result = await db.query(updateQuery, [machine_type_id, name, price, machineId]);
      
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