-- Create machine_types table
CREATE TABLE IF NOT EXISTS machine_types (
    machine_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create machine_subtypes table
CREATE TABLE IF NOT EXISTS machine_subtypes (
    machine_subtype_id SERIAL PRIMARY KEY,
    machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create machines table with foreign key to machine_types and machine_subtypes
CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(50) UNIQUE,
    machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
    machine_subtype_id INTEGER REFERENCES machine_subtypes(machine_subtype_id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 