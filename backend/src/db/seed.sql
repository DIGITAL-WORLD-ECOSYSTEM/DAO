-- ASOT Genesis Seed Script
-- Este script injeta dados estáticos sintéticos para validar o modelo Account-Centric

-- Limpeza inicial caso existam dados (opcional, pode ser comentado em produção)
DELETE FROM treasury_ledger;
DELETE FROM membership_cards;
DELETE FROM wallets;
DELETE FROM citizens;
DELETE FROM users;

-- Reset de sequence do SQLite não é nativamente simples, mas vamos inserir IDs explícitos ou omitir.
-- Vamos usar IDs fixos para facilitar testes de constraints.

-- 1. Account 001 — Master System Account
INSERT INTO users (id, email, password, role, kyc_status, status, active, created_at, updated_at)
VALUES (
    1, 
    'admin@asppibra.com', 
    '$argon2id$v=19$m=65536,t=3,p=4$default_hash', -- Dummy hash
    'admin', 
    'approved', 
    'active', 
    1, 
    1720000000000, 
    1720000000000
);

-- 2. Account 002 — Citizen Account (Felipe Dev)
INSERT INTO users (id, email, password, role, kyc_status, status, active, created_at, updated_at)
VALUES (
    2, 
    'felipe.dev@asppibra.com', 
    '$argon2id$v=19$m=65536,t=3,p=4$default_hash', 
    'citizen', 
    'approved', 
    'active', 
    1, 
    1720000000000, 
    1720000000000
);

-- 3. Cidadão vinculado à Account 002
INSERT INTO citizens (id, user_id, username, first_name, last_name, cpf, did, public_key, totp_enabled, created_at, updated_at)
VALUES (
    1,
    2,
    'felipedev',
    'Felipe',
    'Dev',
    '11111111111',
    'did:dao:asppibra:felipedev',
    '{"dummy": true}',
    0,
    1720000000000, 
    1720000000000
);

-- 4. Wallet vinculada à Account 002
INSERT INTO wallets (id, user_id, address, chain_id, is_primary, created_at)
VALUES (
    1,
    2,
    '0x1111111111111111111111111111111111111111',
    137,
    1,
    1720000000000
);

-- 5. Membership vinculada à Account 002
INSERT INTO membership_cards (id, user_id, card_hash, tier, issue_date, expiry_date)
VALUES (
    1,
    2,
    'dummy_hash_001',
    'citizen',
    1720000000000,
    1750000000000
);

-- 6. Treasury Transaction (Genesis) para Account 002
INSERT INTO treasury_ledger (id, user_id, type, amount_cents, category, description, status, tx_hash, external_transaction_id, created_at)
VALUES (
    1,
    2,
    'inbound',
    100000,
    'other',
    'Aporte Inicial Genesis',
    'completed',
    '0x4444444444444444444444444444444444444444',
    'GENESIS-001',
    1720000000000
);
