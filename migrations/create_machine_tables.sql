-- Create machine_types table
CREATE TABLE IF NOT EXISTS machine_types (
    machine_type_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create machines table with foreign key to machine_types
CREATE TABLE IF NOT EXISTS machines (
    machine_id VARCHAR(50) PRIMARY KEY,
    machine_type_id VARCHAR(50) NOT NULL,
    price DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_type_id) REFERENCES machine_types(machine_type_id)
);

-- Add sample data for machine_types
INSERT INTO machine_types (machine_type_id, name) 
VALUES 
    ('MT001', 'Máy Pha Cà Phê'),
    ('MT002', 'Máy Xay Cà Phê'),
    ('MT003', 'Máy Ép Trái Cây')
ON CONFLICT (machine_type_id) DO NOTHING;

-- Add sample data for machines
INSERT INTO machines (machine_id, machine_type_id, price)
VALUES
    ('M001', 'MT001', 5000000),
    ('M002', 'MT001', 7500000),
    ('M003', 'MT002', 3000000),
    ('M004', 'MT003', 2500000)
ON CONFLICT (machine_id) DO NOTHING; 