-- SEED: Treasury Ledger Data for Vincit Ledger Dashboard
-- ASPPIBRA DAO

-- Clean up existing treasury ledger data if any (optional, be careful)
-- DELETE FROM treasury_ledger;

-- 1. Inbound Transactions (Entradas)
INSERT INTO treasury_ledger (type, category, amount_cents, currency, description, status, created_at)
VALUES 
('inbound', 'membership', 500000, 'BRL', 'Membership Fee - Paulo Roberto', 'completed', strftime('%s', '2023-08-15')),
('inbound', 'rwa_yield', 120000, 'BRL', 'Yield Property #001 - Sandro Alves', 'completed', strftime('%s', '2023-09-05')),
('inbound', 'membership', 35000, 'BRL', 'Membership Fee - ASPPIBRA Internal', 'completed', strftime('%s', '2023-10-12')),
('inbound', 'operational', 80000, 'BRL', 'Service Fee - Paulo Roberto', 'completed', strftime('%s', '2023-11-20')),
('inbound', 'rwa_yield', 120000, 'BRL', 'Yield Property #002 - Sandro Alves', 'completed', strftime('%s', '2023-12-10'));

-- 2. Outbound Transactions (Saídas / Outflow)
INSERT INTO treasury_ledger (type, category, amount_cents, currency, description, status, created_at)
VALUES 
('outbound', 'operational', 1360000, 'BRL', 'Operational Cost - Server Infrastructure', 'completed', strftime('%s', 'now')),
('outbound', 'grant', 250000, 'BRL', 'Community Grant - Project Alpha', 'completed', strftime('%s', 'now', '-5 days')),
('outbound', 'other', 113333, 'BRL', 'Monthly Software Subscription', 'completed', strftime('%s', 'now', '-10 days'));

-- 3. Historical Data for Charts (Monthly Trend)
-- Data for the line chart (last 12 months)
INSERT INTO treasury_ledger (type, category, amount_cents, currency, description, status, created_at)
VALUES 
('inbound', 'rwa_yield', 150000, 'BRL', 'Historical Yield Jan', 'completed', strftime('%s', '2023-01-15')),
('inbound', 'rwa_yield', 180000, 'BRL', 'Historical Yield Feb', 'completed', strftime('%s', '2023-02-15')),
('inbound', 'rwa_yield', 120000, 'BRL', 'Historical Yield Mar', 'completed', strftime('%s', '2023-03-15')),
('inbound', 'rwa_yield', 160000, 'BRL', 'Historical Yield Apr', 'completed', strftime('%s', '2023-04-15')),
('inbound', 'rwa_yield', 140000, 'BRL', 'Historical Yield May', 'completed', strftime('%s', '2023-05-15')),
('inbound', 'rwa_yield', 170000, 'BRL', 'Historical Yield Jun', 'completed', strftime('%s', '2023-06-15')),
('inbound', 'rwa_yield', 110000, 'BRL', 'Historical Yield Jul', 'completed', strftime('%s', '2023-07-15')),
('inbound', 'rwa_yield', 450000, 'BRL', 'Historical Yield Aug (Peak)', 'completed', strftime('%s', '2023-08-15')),
('inbound', 'rwa_yield', 190000, 'BRL', 'Historical Yield Sep', 'completed', strftime('%s', '2023-09-15')),
('inbound', 'rwa_yield', 130000, 'BRL', 'Historical Yield Oct', 'completed', strftime('%s', '2023-10-15')),
('inbound', 'rwa_yield', 150000, 'BRL', 'Historical Yield Nov', 'completed', strftime('%s', '2023-11-15')),
('inbound', 'rwa_yield', 165000, 'BRL', 'Historical Yield Dec', 'completed', strftime('%s', '2023-12-15'));
