-- ============================================================================
-- ASPPIBRA DAO - REPORT 2026-07-PM4 SEED SCRIPT
-- Contato Principal: Andressa de Lima Ferreira (#2024001)
-- ============================================================================

-- 1. Inserção do Usuário Principal (Andressa de Lima Ferreira)
INSERT OR IGNORE INTO users (id, subject_type, email, email_normalized, status, auth_epoch, created_at, updated_at)
VALUES (10, 'human', 'andressa.ferreira@email.com', 'andressa.ferreira@email.com', 'active', 1, 1691452800, 1691452800);

INSERT OR IGNORE INTO user_profiles (user_id, username, username_normalized, display_name, profile_visibility, is_discoverable, created_at, updated_at)
VALUES (10, 'andressa2024001', 'andressa2024001', 'Andressa de Lima Ferreira', 'public', 1, 1691452800, 1691452800);

INSERT OR IGNORE INTO user_authenticators (id, user_id, type, label, verified_at, created_at, updated_at)
VALUES ('auth_andressa_10', 10, 'password', 'Primary Password', unixepoch(), unixepoch(), unixepoch());

INSERT OR IGNORE INTO password_credentials (authenticator_id, password_hash)
VALUES ('auth_andressa_10', 'IPxA0RtNWjsP8pH8V9Qkbw==:5d26aa9c6351ad152951701c6250a747fd2e214cc9e443cb3b345dfe8f12f7d7');

INSERT OR IGNORE INTO citizens (user_id, legal_first_name, legal_last_name, nationality_code, civil_status, verified_at, verified_by, created_at, updated_at)
VALUES (10, 'Andressa', 'de Lima Ferreira', 'BR', 'verified', 1691452800, 1, 1691452800, 1691452800);

INSERT OR IGNORE INTO identity_documents (id, user_id, document_type, country_code, number_lookup_hash, encrypted_number, last4, source, verification_status, verified_at, verified_by, created_at, updated_at)
VALUES (10, 10, 'cpf', 'BR', 'hash_cpf_17379356780', 'enc_cpf_17379356780', '780', 'government', 'verified', 1691452800, 1, 1691452800, 1691452800);

-- 2. Inserção dos Provedores Fiat / Bancos Participantes
INSERT OR IGNORE INTO fiat_providers (id, name, code, type, status, created_at, updated_at)
VALUES
  (1, 'Itaú Unibanco', 'ITAU', 'bank', 'active', unixepoch(), unixepoch()),
  (2, 'Nu Pagamentos', 'NUBANK', 'payment_provider', 'active', unixepoch(), unixepoch()),
  (3, 'Bradesco', 'BRADESCO', 'bank', 'active', unixepoch(), unixepoch()),
  (4, 'Mercado Pago', 'MERCADO_PAGO', 'payment_provider', 'active', unixepoch(), unixepoch()),
  (5, 'Banco Inter', 'INTER', 'bank', 'active', unixepoch(), unixepoch()),
  (6, 'Santander', 'SANTANDER', 'bank', 'active', unixepoch(), unixepoch()),
  (7, 'Cora SCFI', 'CORA', 'bank', 'active', unixepoch(), unixepoch());

-- 3. Contas Financeiras da Andressa e da Tesouraria
INSERT OR IGNORE INTO financial_accounts (id, user_id, account_type, status, name, created_at, updated_at)
VALUES
  (10, 10, 'user_available', 'active', 'Conta Andressa de Lima Ferreira (#2024001)', unixepoch(), unixepoch()),
  (11, NULL, 'treasury', 'active', 'Tesouraria Consolidada ASPPIBRA (Ref: 2026-07-PM4)', unixepoch(), unixepoch());

-- 4. Saldo Consolidado da Conta (Total Pago: R$ 35.823,00 | Saldo Devedor: R$ 29.177,00)
INSERT OR IGNORE INTO account_balances (id, account_id, asset_id, available_base_units, locked_base_units, version, updated_at)
VALUES
  (10, 10, 1, '3582300', '2917700', 1, unixepoch()),
  (11, 11, 1, '3582300', '0', 1, unixepoch());

-- 5. Transações Financeiras do Relatório
INSERT OR IGNORE INTO financial_transactions (id, user_id, type, category, status, description, completed_at, version, created_at, updated_at)
VALUES
  (101, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Nu', 1691492400, 1, 1691492400, 1691492400),
  (102, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Nu', 1691578800, 1, 1691578800, 1691578800),
  (103, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Nu', 1695294000, 1, 1695294000, 1695294000),
  (104, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Nu', 1697800000, 1, 1697800000, 1697800000),
  (105, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Nu', 1700564400, 1, 1700564400, 1700564400),
  (106, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú -> Bradesco', 1703156400, 1, 1703156400, 1703156400),
  (107, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Itaú', 1703242800, 1, 1703242800, 1703242800),
  (108, 10, 'payment', 'other', 'failed', 'Transação N/A Falha', NULL, 1, 1705316400, 1705316400),
  (109, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Itaú', 1708081200, 1, 1708081200, 1708081200),
  (110, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Itaú', 1710154800, 1, 1710154800, 1710154800);

-- 6. Lançamentos de Partidas Dobradas (Append-Only)
INSERT OR IGNORE INTO financial_ledger_entries (id, transaction_id, account_id, asset_id, direction, amount_base_units, created_at)
VALUES
  (101, 101, 11, 1, 'credit', '50000', 1691492400),
  (102, 102, 11, 1, 'credit', '50000', 1691578800),
  (103, 103, 11, 1, 'credit', '8000', 1695294000),
  (104, 104, 11, 1, 'credit', '8000', 1697800000),
  (105, 105, 11, 1, 'credit', '8000', 1700564400),
  (106, 106, 11, 1, 'credit', '7000', 1703156400),
  (107, 107, 11, 1, 'credit', '8000', 1703242800),
  (109, 109, 11, 1, 'credit', '8000', 1708081200),
  (110, 110, 11, 1, 'credit', '8000', 1710154800);
