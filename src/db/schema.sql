-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the Funds table 
CREATE TABLE fund (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    vintage_year int, 
    target_size_usd NUMERIC(15,2), -- 15 digits with rounding to 2 digits after decimal
    status VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Use TIMESTAMPZ (normalized to UTC)
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the Investors table 
CREATE TABLE investor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    investor_type VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the Investments table 
CREATE TABLE investment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES investor(id) ON DELETE CASCADE, -- Automatically delete entry if investor/fund is removed
    fund_id UUID NOT NULL REFERENCES fund(id) ON DELETE CASCADE,
    amount_usd NUMERIC(15,2) CHECK (amount_usd >= 0),
    investment_date TIMESTAMPTZ DEFAULT NOW()
);