-- Create the Funds table 
CREATE TABLE fund (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    vintage_year int, 
    target_size_usd NUMERIC(15,2), -- 15 digits with rounding to 2 digits after decimal
    status VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() -- Use TIMESTAMPZ (normalized to UTC)
    updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- Create the Investors table 
CREATE TABLE investor (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    investor_type VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Create the Investments table 
CREATE TABLE investment (
    id VARCHAR(255) PRIMARY KEY,
    investor_id VARCHAR(255) NOT NULL REFERENCES investor(id) ON DELETE CASCADE, -- Automatically delete entry if investor/fund is removed
    fund_id VARCHAR(255) NOT NULL REFERENCES fund(id) ON DELETE CASCADE,
    amount_usd NUMERIC(15,2) CHECK (amount_usd >= 0),
    investment_date TIMESTAMPTZ DEFAULT NOW()
)