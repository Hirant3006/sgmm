-- Create machine_types table
CREATE TABLE IF NOT EXISTS machine_types (
    machine_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sequence for machine_subtypes
CREATE SEQUENCE IF NOT EXISTS machine_subtypes_id_seq;

-- Create machine_subtypes table
CREATE TABLE IF NOT EXISTS machine_subtypes (
    id SERIAL,
    machine_subtype_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to generate machine_subtype_id
CREATE OR REPLACE FUNCTION generate_machine_subtype_id()
RETURNS TRIGGER AS $$
DECLARE
    next_id INTEGER;
BEGIN
    -- Get the next value from the sequence
    SELECT nextval('machine_subtypes_id_seq') INTO next_id;
    -- Set the machine_subtype_id using the id value
    NEW.machine_subtype_id := 'ST' || LPAD(next_id::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate machine_subtype_id
DROP TRIGGER IF EXISTS generate_machine_subtype_id_trigger ON machine_subtypes;
CREATE TRIGGER generate_machine_subtype_id_trigger
    BEFORE INSERT ON machine_subtypes
    FOR EACH ROW
    EXECUTE FUNCTION generate_machine_subtype_id();

-- Create machines table with foreign key to machine_types
CREATE TABLE IF NOT EXISTS machines (
    id SERIAL,
    machine_id VARCHAR(10) PRIMARY KEY,
    machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to generate machine_id
CREATE OR REPLACE FUNCTION generate_machine_id()
RETURNS TRIGGER AS $$
DECLARE
    next_id INTEGER;
BEGIN
    -- Get the next value from the id sequence
    SELECT nextval('machines_id_seq') INTO next_id;
    -- Set the machine_id using the id value
    NEW.machine_id := 'M' || LPAD(next_id::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate machine_id
DROP TRIGGER IF EXISTS generate_machine_id_trigger ON machines;
CREATE TRIGGER generate_machine_id_trigger
    BEFORE INSERT ON machines
    FOR EACH ROW
    EXECUTE FUNCTION generate_machine_id();

-- Insert sample machine types if not exists
INSERT INTO machine_types (name) 
VALUES 
    ('Máy in'),
    ('Máy scan'),
    ('Máy photocopy')
ON CONFLICT (machine_type_id) DO NOTHING;

-- Add sample data for machine_subtypes
INSERT INTO machine_subtypes (name) 
VALUES 
    ('Máy in laser'),
    ('Máy in phun'),
    ('Máy scan phẳng'),
    ('Máy scan đa chức năng'),
    ('Máy photocopy màu'),
    ('Máy photocopy đen trắng');

-- Add sample data for machines
INSERT INTO machines (machine_type_id, name, price)
SELECT 
    mt.machine_type_id,
    'HP LaserJet Pro M404dn',
    15000000
FROM machine_types mt 
WHERE mt.name = 'Máy in'
UNION ALL
SELECT 
    mt.machine_type_id,
    'Canon PIXMA TS8270',
    8000000
FROM machine_types mt 
WHERE mt.name = 'Máy in'; 