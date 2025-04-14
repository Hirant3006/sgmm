-- Create machine_types table
CREATE TABLE IF NOT EXISTS machine_types (
    machine_type_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create machines table
CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    machine_type_id INTEGER REFERENCES machine_types(machine_type_id),
    machine_subtype_id VARCHAR(10) REFERENCES machine_subtypes(machine_subtype_id),
    price NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sequence for machine_id
CREATE SEQUENCE IF NOT EXISTS machine_id_seq;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_machine_types_updated_at
BEFORE UPDATE ON machine_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
BEFORE UPDATE ON machines
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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
