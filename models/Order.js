const db = require('../config/database');
const { format } = require('date-fns');

class Order {
  static async getAll(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const whereConditions = [];
    const queryParams = [];

    // Build WHERE clause dynamically
    if (filters.startDate) {
      whereConditions.push('o.date >= $1');
      queryParams.push(filters.startDate);
    }
    if (filters.endDate) {
      whereConditions.push('o.date <= $2');
      queryParams.push(filters.endDate);
    }
    if (filters.machineId) {
      whereConditions.push('o.machine_id = $3');
      queryParams.push(filters.machineId);
    }
    if (filters.customerName) {
      whereConditions.push('o.customer_name ILIKE $4');
      queryParams.push(`%${filters.customerName}%`);
    }
    if (filters.customerPhone) {
      whereConditions.push('o.customer_phone ILIKE $5');
      queryParams.push(`%${filters.customerPhone}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Use materialized CTE for better performance
    const query = `
      WITH filtered_orders AS MATERIALIZED (
        SELECT 
          o.*,
          m.name as machine_name,
          mt.name as machine_type_name,
          mst.name as machine_subtype_name,
          COUNT(*) OVER() as total_count
        FROM orders o
        LEFT JOIN machines m ON o.machine_id = m.machine_id
        LEFT JOIN machine_types mt ON m.machine_type_id = mt.machine_type_id
        LEFT JOIN machine_subtypes mst ON m.machine_subtype_id = mst.machine_subtype_id
        ${whereClause}
        ORDER BY o.date DESC
        LIMIT $${queryParams.length + 1}
        OFFSET $${queryParams.length + 2}
      )
      SELECT 
        *,
        (SELECT total_count FROM filtered_orders LIMIT 1) as total
      FROM filtered_orders
    `;

    const result = await db.query(query, [...queryParams, limit, offset]);
    return {
      orders: result.rows,
      total: result.rows[0]?.total || 0
    };
  }

  static async getCount(filters = {}) {
    let query = `
      SELECT COUNT(*) as total
      FROM orders o
      WHERE 1=1
    `;
    
    const params = [];
    
    // Apply the same filters for counting
    if (filters.dateFrom) {
      params.push(filters.dateFrom);
      query += ` AND o.date >= $${params.length}`;
    }
    
    if (filters.dateTo) {
      params.push(filters.dateTo);
      query += ` AND o.date <= $${params.length}`;
    }
    
    if (filters.machineId) {
      params.push(filters.machineId);
      query += ` AND o.machine_id = $${params.length}`;
    }
    
    if (filters.machineTypeId) {
      params.push(filters.machineTypeId);
      query += ` AND o.machine_type_id = $${params.length}`;
    }
    
    if (filters.machineSubTypeId) {
      params.push(filters.machineSubTypeId);
      query += ` AND o.machine_subtype_id = $${params.length}`;
    }
    
    if (filters.customerName) {
      params.push(`%${filters.customerName}%`);
      query += ` AND o.customer_name ILIKE $${params.length}`;
    }
    
    if (filters.customerPhone) {
      params.push(`%${filters.customerPhone}%`);
      query += ` AND o.customer_phone ILIKE $${params.length}`;
    }
    
    if (filters.source) {
      params.push(`%${filters.source}%`);
      query += ` AND o.source ILIKE $${params.length}`;
    }
    
    if (filters.priceFrom) {
      params.push(filters.priceFrom);
      query += ` AND o.price >= $${params.length}`;
    }
    
    if (filters.priceTo) {
      params.push(filters.priceTo);
      query += ` AND o.price <= $${params.length}`;
    }
    
    if (filters.costFrom) {
      params.push(filters.costFrom);
      query += ` AND o.cost_of_good >= $${params.length}`;
    }
    
    if (filters.costTo) {
      params.push(filters.costTo);
      query += ` AND o.cost_of_good <= $${params.length}`;
    }
    
    if (filters.shippingFrom) {
      params.push(filters.shippingFrom);
      query += ` AND o.shipping_cost >= $${params.length}`;
    }
    
    if (filters.shippingTo) {
      params.push(filters.shippingTo);
      query += ` AND o.shipping_cost <= $${params.length}`;
    }
    
    if (filters.purchaseLocation) {
      params.push(`%${filters.purchaseLocation}%`);
      query += ` AND o.purchase_location ILIKE $${params.length}`;
    }
    
    try {
      const { rows } = await db.query(query, params);
      return parseInt(rows[0].total);
    } catch (error) {
      throw new Error(`Error counting orders: ${error.message}`);
    }
  }

  static async getById(id) {
    const query = `
      SELECT o.id, o.date, o.customer_name, o.customer_phone, o.source,
             o.price, o.cost_of_good, o.shipping_cost, o.purchase_location, o.notes,
             o.created_at, o.updated_at,
             m.machine_id, m.name as machine_name,
             mt.machine_type_id, mt.name as machine_type_name,
             mst.machine_subtype_id, mst.name as machine_subtype_name
      FROM orders o
      LEFT JOIN machines m ON o.machine_id = m.machine_id
      LEFT JOIN machine_types mt ON o.machine_type_id = mt.machine_type_id
      LEFT JOIN machine_subtypes mst ON o.machine_subtype_id = mst.machine_subtype_id
      WHERE o.id = $1
    `;
    
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting order: ${error.message}`);
    }
  }

  static async create(orderData) {
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
    } = orderData;
    
    // Generate a unique ID format like "ORD-00001"
    const getIdQuery = `SELECT nextval('orders_id_seq') as next_id`;
    
    // Insert the order
    const insertQuery = `
      INSERT INTO orders (
        id, date, machine_id, machine_type_id, machine_subtype_id, 
        customer_name, customer_phone, source, price, cost_of_good, 
        shipping_cost, purchase_location, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    try {
      // Get the next id value
      const { rows: idRows } = await db.query(getIdQuery);
      const nextId = idRows[0].next_id;
      
      // Generate the order_id
      const orderId = 'ORD-' + String(nextId).padStart(5, '0');
      
      // Insert the order
      const { rows } = await db.query(insertQuery, [
        orderId,
        date || new Date(),
        machine_id,
        machine_type_id,
        machine_subtype_id,
        customer_name || null,
        customer_phone || null,
        source || null,
        price,
        cost_of_good,
        shipping_cost || null,
        purchase_location || null,
        notes || null
      ]);
      
      if (!rows[0]) {
        throw new Error('Failed to create order');
      }
      
      // Return the order with joins
      return this.getById(orderId);
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation in PostgreSQL
        throw new Error('Invalid reference: ' + error.detail);
      }
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  static async update(id, orderData) {
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
    } = orderData;
    
    // Verify that the order exists
    const checkOrderQuery = 'SELECT 1 FROM orders WHERE id = $1';
    
    // Update query
    const updateQuery = `
      UPDATE orders
      SET 
        date = $1,
        machine_id = $2,
        machine_type_id = $3,
        machine_subtype_id = $4,
        customer_name = $5,
        customer_phone = $6,
        source = $7,
        price = $8,
        cost_of_good = $9,
        shipping_cost = $10,
        purchase_location = $11,
        notes = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `;
    
    try {
      // Verify order exists
      const orderResult = await db.query(checkOrderQuery, [id]);
      if (orderResult.rowCount === 0) {
        throw new Error('Order not found');
      }
      
      // Update order
      const result = await db.query(updateQuery, [
        date || new Date(),
        machine_id,
        machine_type_id,
        machine_subtype_id,
        customer_name || null,
        customer_phone || null,
        source || null,
        price,
        cost_of_good,
        shipping_cost || null,
        purchase_location || null,
        notes || null,
        id
      ]);
      
      if (result.rowCount === 0) {
        throw new Error('Order not found');
      }
      
      // Return the order with joins
      return this.getById(id);
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        throw new Error('Invalid reference: ' + error.detail);
      }
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
    
    try {
      const result = await db.query(query, [id]);
      
      if (result.rowCount === 0) {
        throw new Error('Order not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }
}

module.exports = Order; 