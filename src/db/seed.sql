-- Insert sample funds
INSERT INTO funds (name, vintage_year, target_size_usd, status)
VALUES
('Growth Equity Fund I', 2019, 100000000, 'Active'),
('Infrastructure Fund II', 2021, 250000000, 'Closed');

-- Insert investors
INSERT INTO investors (name, investor_type, email)
VALUES
('Alice Capital', 'Institutional', 'alice@example.com'),
('Bob Ventures', 'Individual', 'bob@example.com');

-- Insert sample investments
INSERT INTO investments (investor_id, fund_id, amount_usd)
VALUES
(
    -- Get Ids from the fund and investor table
    (SELECT id from investors where name='Alice Capital'),
    (SELECT id from funds WHERE name='Growth Equity Fund I'), 
    500000
),
(
    (SELECT id from investors where name='Bob Ventures'),
    (SELECT id from funds WHERE name='Infrastructure Fund II'), 
    2000000
);