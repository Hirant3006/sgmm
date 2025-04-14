require('dotenv').config({ path: '.env.production' });
const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function resetDatabase() {
  const client = await db.getClient();
  
  try {
    console.log('Starting database reset...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Disable foreign key constraints temporarily
    await client.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Check if users table exists
    const userTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);
    
    let adminUser = { rows: [] };
    
    if (userTableExists.rows[0].exists) {
      // Backup admin user if exists
      adminUser = await client.query(
        'SELECT * FROM users WHERE username = $1',
        ['admin']
      );
    } else {
      // Create users table if it doesn't exist
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    // Drop all tables except users
    const tables = [
      'orders',
      'machines',
      'machine_subtypes',
      'machine_types'
    ];
    
    for (const table of tables) {
      try {
        console.log(`Dropping table: ${table}`);
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      } catch (error) {
        console.log(`Error dropping table ${table}: ${error.message}`);
      }
    }
    
    // Drop sequences
    const sequences = [
      'orders_id_seq',
      'machines_id_seq',
      'machine_subtypes_id_seq'
    ];
    
    for (const seq of sequences) {
      try {
        console.log(`Dropping sequence: ${seq}`);
        await client.query(`DROP SEQUENCE IF EXISTS ${seq} CASCADE`);
      } catch (error) {
        console.log(`Error dropping sequence ${seq}: ${error.message}`);
      }
    }
    
    // Clear users table but preserve admin
    if (adminUser.rows.length > 0) {
      console.log('Preserving admin user...');
      await client.query('DELETE FROM users WHERE username != $1', ['admin']);
    } else {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin', 10);
      await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin']
      );
    }

    // Add additional admin account
    console.log('Creating additional admin user...');
    const hashedTrucPassword = await bcrypt.hash('079386996', 10);
    await client.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
      ['lychaungoctruc', hashedTrucPassword, 'user']
    );

    // Recreate tables
    console.log('Recreating tables...');
    
    // Create machine_types table
    await client.query(`
      CREATE TABLE IF NOT EXISTS machine_types (
        machine_type_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created machine_types table');

    // Create machine_subtypes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS machine_subtypes (
        machine_subtype_id SERIAL PRIMARY KEY,
        machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created machine_subtypes table');

    // Create machines table
    await client.query(`
      CREATE TABLE IF NOT EXISTS machines (
        id SERIAL PRIMARY KEY,
        machine_id VARCHAR(50) UNIQUE,
        machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
        machine_subtype_id INTEGER REFERENCES machine_subtypes(machine_subtype_id),
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created machines table');

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        machine_id VARCHAR(50) NOT NULL,
        machine_type_id INTEGER NOT NULL,
        machine_subtype_id INTEGER NOT NULL,
        customer_name VARCHAR(255),
        customer_phone VARCHAR(20),
        source VARCHAR(255),
        price DECIMAL(15, 2) NOT NULL,
        cost_of_good DECIMAL(15, 2) NOT NULL,
        shipping_cost DECIMAL(15, 2),
        purchase_location TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machine_id) REFERENCES machines(machine_id),
        FOREIGN KEY (machine_type_id) REFERENCES machine_types(machine_type_id),
        FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes(machine_subtype_id)
      )
    `);
    console.log('Created orders table');

    // Create sequences
    await client.query('CREATE SEQUENCE IF NOT EXISTS orders_id_seq');
    await client.query('CREATE SEQUENCE IF NOT EXISTS machines_id_seq');
    await client.query('CREATE SEQUENCE IF NOT EXISTS machine_subtypes_id_seq');
    console.log('Created sequences');

    // Create updated_at triggers
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    // Add triggers to all tables
    const tablesWithTriggers = ['machine_types', 'machine_subtypes', 'machines', 'orders'];
    for (const table of tablesWithTriggers) {
      await client.query(`
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `);
    }
    console.log('Created triggers for updated_at columns');
    
    // Re-enable foreign key constraints
    await client.query('SET CONSTRAINTS ALL IMMEDIATE');
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database reset and recreation completed successfully!');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error resetting database:', error);
  } finally {
    client.release();
  }
}

// Execute if run directly
if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to reset database:', error);
      process.exit(1);
    });
}

module.exports = resetDatabase; 