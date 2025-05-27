CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    order_date DATE NOT NULL,
    rate_per_kg NUMERIC NOT NULL,
    advance_received NUMERIC DEFAULT 0,
    plate_type TEXT,
    plate_charges NUMERIC DEFAULT 0,
    status BOOLEAN DEFAULT FALSE ,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    product_size TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL
);
