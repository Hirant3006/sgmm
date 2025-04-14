-- Create sequence for order IDs
CREATE SEQUENCE IF NOT EXISTS orders_id_seq;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  machine_id VARCHAR(10) NOT NULL,
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
CREATE INDEX IF NOT EXISTS idx_orders_machine_id ON orders(machine_id);
CREATE INDEX IF NOT EXISTS idx_orders_machine_type_id ON orders(machine_type_id);
CREATE INDEX IF NOT EXISTS idx_orders_machine_subtype_id ON orders(machine_subtype_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);
CREATE INDEX IF NOT EXISTS idx_orders_price ON orders(price);
CREATE INDEX IF NOT EXISTS idx_orders_cost_of_good ON orders(cost_of_good);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function whenever an order is updated
CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 