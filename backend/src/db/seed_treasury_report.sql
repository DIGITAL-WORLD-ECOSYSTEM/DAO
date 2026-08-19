-- ============================================================================
-- ASPPIBRA DAO - REPORT 2026-07-PM4 SEED SCRIPT
-- Contato Principal: Andressa de Lima Ferreira (#2024001)
-- Transações Financeiras Consolidadas (45 Registros)
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
INSERT OR REPLACE INTO account_balances (id, account_id, asset_id, available_base_units, locked_base_units, version, updated_at)
VALUES
  (10, 10, 1, '3582300', '2917700', 1, unixepoch()),
  (11, 11, 1, '3582300', '0', 1, unixepoch());

-- 5. Inserção das 45 Transações Financeiras do Relatório
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
  (110, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Itaú', 1710154800, 1, 1710154800, 1710154800),
  (111, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1714471200, 1, 1714471200, 1714471200),
  (112, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1714474800, 1, 1714474800, 1714474800),
  (113, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1716976800, 1, 1716976800, 1716976800),
  (114, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1719223200, 1, 1719223200, 1719223200),
  (115, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1722160800, 1, 1722160800, 1722160800),
  (116, 10, 'payment', 'other', 'failed', 'Transação N/A Falha', NULL, 1, 1723716000, 1723716000),
  (117, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú -> Bradesco', 1725616800, 1, 1725616800, 1725616800),
  (118, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Itaú', 1725620400, 1, 1725620400, 1725620400),
  (119, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú -> Bradesco', 1728468000, 1, 1728468000, 1728468000),
  (120, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1731146400, 1, 1731146400, 1731146400),
  (121, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1734516000, 1, 1734516000, 1734516000),
  (122, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1737453600, 1, 1737453600, 1737453600),
  (123, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1737457200, 1, 1737457200, 1737457200),
  (124, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Itaú', 1739181600, 1, 1739181600, 1739181600),
  (125, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1742378400, 1, 1742378400, 1742378400),
  (126, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1745316000, 1, 1745316000, 1745316000),
  (127, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1746007200, 1, 1746007200, 1746007200),
  (128, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1747476000, 1, 1747476000, 1747476000),
  (129, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú -> Inter', 1750154400, 1, 1750154400, 1750154400),
  (130, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú', 1750158000, 1, 1750158000, 1750158000),
  (131, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Nu -> Inter', 1753524000, 1, 1753524000, 1753524000),
  (132, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Nu -> Itaú', 1754128800, 1, 1754128800, 1754128800),
  (133, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú -> Inter', 1755252000, 1, 1755252000, 1755252000),
  (134, 10, 'payment', 'other', 'failed', 'Transação N/A Falha', NULL, 1, 1757930400, 1757930400),
  (135, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú -> Santander', 1760350400, 1, 1760350400, 1760350400),
  (136, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Mercado Pago -> Cora SCFI', 1763374400, 1, 1763374400, 1763374400),
  (137, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Nu -> Cora SCFI', 1764929600, 1, 1764929600, 1764929600),
  (138, 10, 'payment', 'other', 'failed', 'Transação N/A Falha', NULL, 1, 1768472000, 1768472000),
  (139, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Nu -> Cora SCFI', 1770632000, 1, 1770632000, 1770632000),
  (140, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Nu -> Santander', 1770635600, 1, 1770635600, 1770635600),
  (141, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Nu -> Cora SCFI', 1772964800, 1, 1772964800, 1772964800),
  (142, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Itaú -> Cora SCFI', 1773137600, 1, 1773137600, 1773137600),
  (143, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Inter -> Cora SCFI', 1773569600, 1, 1773569600, 1773569600),
  (144, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Inter -> Santander', 1774606400, 1, 1774606400, 1774606400),
  (145, 10, 'payment', 'other', 'failed', 'Transação N/A Falha', NULL, 1, 1776248000, 1776248000);

-- 6. Lançamentos de Partidas Dobradas (Append-Only no D1)
INSERT OR IGNORE INTO financial_ledger_entries (id, transaction_id, account_id, asset_id, direction, amount_base_units, created_at)
VALUES
  (101, 101, 11, 1, 'credit', '500000', 1691492400),
  (102, 102, 11, 1, 'credit', '500000', 1691578800),
  (103, 103, 11, 1, 'credit', '80000', 1695294000),
  (104, 104, 11, 1, 'credit', '80000', 1697800000),
  (105, 105, 11, 1, 'credit', '80000', 1700564400),
  (106, 106, 11, 1, 'credit', '70000', 1703156400),
  (107, 107, 11, 1, 'credit', '80000', 1703242800),
  (109, 109, 11, 1, 'credit', '80000', 1708081200),
  (110, 110, 11, 1, 'credit', '80000', 1710154800),
  (111, 111, 11, 1, 'credit', '70000', 1714471200),
  (112, 112, 11, 1, 'credit', '80000', 1714474800),
  (113, 113, 11, 1, 'credit', '80000', 1716976800),
  (114, 114, 11, 1, 'credit', '80000', 1719223200),
  (115, 115, 11, 1, 'credit', '80000', 1722160800),
  (117, 117, 11, 1, 'credit', '70000', 1725616800),
  (118, 118, 11, 1, 'credit', '80000', 1725620400),
  (119, 119, 11, 1, 'credit', '80000', 1728468000),
  (120, 120, 11, 1, 'credit', '80000', 1731146400),
  (121, 121, 11, 1, 'credit', '80000', 1734516000),
  (122, 122, 11, 1, 'credit', '80000', 1737453600),
  (123, 123, 11, 1, 'credit', '70000', 1737457200),
  (124, 124, 11, 1, 'credit', '80000', 1739181600),
  (125, 125, 11, 1, 'credit', '80000', 1742378400),
  (126, 126, 11, 1, 'credit', '40000', 1745316000),
  (127, 127, 11, 1, 'credit', '40000', 1746007200),
  (128, 128, 11, 1, 'credit', '75000', 1747476000),
  (129, 129, 11, 1, 'credit', '35000', 1750154400),
  (130, 130, 11, 1, 'credit', '80000', 1750158000),
  (131, 131, 11, 1, 'credit', '66700', 1753524000),
  (132, 132, 11, 1, 'credit', '66700', 1754128800),
  (133, 133, 11, 1, 'credit', '66700', 1755252000),
  (135, 135, 11, 1, 'credit', '100000', 1760350400),
  (136, 136, 11, 1, 'credit', '105000', 1763374400),
  (137, 137, 11, 1, 'credit', '55000', 1764929600),
  (139, 139, 11, 1, 'credit', '80000', 1770632000),
  (140, 140, 11, 1, 'credit', '70000', 1770635600),
  (141, 141, 11, 1, 'credit', '25000', 1772964800),
  (142, 142, 11, 1, 'credit', '25000', 1773137600),
  (143, 143, 11, 1, 'credit', '25000', 1773569600),
  (144, 144, 11, 1, 'credit', '67200', 1774606400);
