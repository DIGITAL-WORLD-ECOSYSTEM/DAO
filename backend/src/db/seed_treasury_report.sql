-- ============================================================================
-- ASPPIBRA DAO - REPORT AUDIT SEED SCRIPT (Andressa de Lima Ferreira)
-- Total Pago Real Comprovado: R$ 36.623,00 | Saldo Devedor: R$ 29.177,00 | Total: R$ 65.800,00
-- Fonte: Auditoria_ASPPIBRA_Andressa.xlsx (45 Transações Auditadas)
-- ============================================================================

-- 0. Garantir Ativo BRL (id=1)
INSERT OR IGNORE INTO financial_assets (id, code, symbol, name, type, decimals, status, created_at, updated_at)
VALUES (1, 'BRL', 'R$', 'Real Brasileiro', 'fiat', 2, 'active', unixepoch(), unixepoch());

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

-- 4. Saldo Consolidado da Conta (Total Pago Comprovado: R$ 36.623,00 | Saldo Devedor: R$ 29.177,00)
INSERT OR REPLACE INTO account_balances (id, account_id, asset_id, available_base_units, locked_base_units, version, updated_at)
VALUES
  (10, 10, 1, '3662300', '2917700', 1, unixepoch()),
  (11, 11, 1, '3662300', '0', 1, unixepoch());

-- 5. Limpeza de registros anteriores
DELETE FROM financial_ledger_entries WHERE id >= 100 OR transaction_id >= 101;
DELETE FROM financial_transactions WHERE id >= 101;

-- 6. Inserção das 45 Transações Auditadas da Planilha
INSERT INTO financial_transactions (id, user_id, type, category, status, description, completed_at, version, created_at, updated_at)
VALUES
  (101, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Nu Pagamentos', 1691488800, 1, 1691488800, 1691488800),
  (102, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Nu Pagamentos', 1691575200, 1, 1691575200, 1691575200),
  (103, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Nu Pagamentos', 1695290400, 1, 1695290400, 1695290400),
  (104, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Nu Pagamentos', 1697796000, 1, 1697796000, 1697796000),
  (105, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Nu Pagamentos', 1700560800, 1, 1700560800, 1700560800),
  (106, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú Unibanco -> Bradesco', 1703152800, 1, 1703152800, 1703152800),
  (107, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Itaú Unibanco', 1703239200, 1, 1703239200, 1703239200),
  (108, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Itaú Unibanco', 1708077600, 1, 1708077600, 1708077600),
  (109, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Itaú Unibanco', 1710151200, 1, 1710151200, 1710151200),
  (110, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1714471200, 1, 1714471200, 1714471200),
  (111, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1714471200, 1, 1714471200, 1714471200),
  (112, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1716976800, 1, 1716976800, 1716976800),
  (113, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1719223200, 1, 1719223200, 1719223200),
  (114, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1722160800, 1, 1722160800, 1722160800),
  (115, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Itaú Unibanco', 1725616800, 1, 1725616800, 1725616800),
  (116, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú Unibanco -> Bradesco', 1725616800, 1, 1725616800, 1725616800),
  (117, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú Unibanco -> Bradesco', 1728468000, 1, 1728468000, 1728468000),
  (118, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1731146400, 1, 1731146400, 1731146400),
  (119, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1734516000, 1, 1734516000, 1734516000),
  (120, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1737453600, 1, 1737453600, 1737453600),
  (121, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1737453600, 1, 1737453600, 1737453600),
  (122, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Itaú Unibanco', 1739181600, 1, 1739181600, 1739181600),
  (123, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1742378400, 1, 1742378400, 1742378400),
  (124, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1745316000, 1, 1745316000, 1745316000),
  (125, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Mercado Pago -> Bradesco', 1746007200, 1, 1746007200, 1746007200),
  (126, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1747476000, 1, 1747476000, 1747476000),
  (127, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú Unibanco -> Banco Inter', 1750154400, 1, 1750154400, 1750154400),
  (128, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Mercado Pago -> Itaú Unibanco', 1750154400, 1, 1750154400, 1750154400),
  (129, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Nu Pagamentos -> Itaú Unibanco', 1753524000, 1, 1753524000, 1753524000),
  (130, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Nu Pagamentos -> Banco Inter', 1753524000, 1, 1753524000, 1753524000),
  (131, 10, 'payment', 'operational', 'completed', 'Pagamento Sandro Alves de Amorim via Itaú Unibanco -> Banco Inter', 1755252000, 1, 1755252000, 1755252000),
  (132, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Itaú Unibanco -> Santander', 1760349600, 1, 1760349600, 1760349600),
  (133, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Mercado Pago (boleto Cora) -> Cora SCFI', 1763373600, 1, 1763373600, 1763373600),
  (134, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Nu Pagamentos -> Cora SCFI', 1764928800, 1, 1764928800, 1764928800),
  (135, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Nu Pagamentos -> Cora SCFI', 1770631200, 1, 1770631200, 1770631200),
  (136, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Nu Pagamentos -> Santander', 1770631200, 1, 1770631200, 1770631200),
  (137, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Nu Pagamentos -> Cora SCFI', 1772964000, 1, 1772964000, 1772964000),
  (138, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Itaú Unibanco -> Cora SCFI', 1773136800, 1, 1773136800, 1773136800),
  (139, 10, 'payment', 'operational', 'completed', 'Pagamento ASPPIBRA via Banco Inter -> Cora SCFI', 1773568800, 1, 1773568800, 1773568800),
  (140, 10, 'payment', 'membership', 'completed', 'Pagamento Paulo Roberto Batista Ferreira via Banco Inter -> Santander', 1774605600, 1, 1774605600, 1774605600),
  (141, 10, 'payment', 'other', 'failed', 'Linha Falha - Sem transação real', NULL, 1, 1705312800, 1705312800),
  (142, 10, 'payment', 'other', 'failed', 'Linha Falha - Sem transação real', NULL, 1, 1723716000, 1723716000),
  (143, 10, 'payment', 'other', 'failed', 'Linha Falha - Sem transação real', NULL, 1, 1757930400, 1757930400),
  (144, 10, 'payment', 'other', 'failed', 'Linha Falha - Sem transação real', NULL, 1, 1768471200, 1768471200),
  (145, 10, 'payment', 'other', 'failed', 'Linha Falha - Sem transação real', NULL, 1, 1776247200, 1776247200);

-- 7. Lançamentos de Partidas Dobradas (40 Transações Comprovadas)
INSERT INTO financial_ledger_entries (id, transaction_id, account_id, asset_id, direction, amount_base_units, created_at)
VALUES
  (101, 101, 11, 1, 'credit', '500000', 1691488800),
  (102, 102, 11, 1, 'credit', '500000', 1691575200),
  (103, 103, 11, 1, 'credit', '80000', 1695290400),
  (104, 104, 11, 1, 'credit', '80000', 1697796000),
  (105, 105, 11, 1, 'credit', '80000', 1700560800),
  (106, 106, 11, 1, 'credit', '70000', 1703152800),
  (107, 107, 11, 1, 'credit', '80000', 1703239200),
  (108, 108, 11, 1, 'credit', '80000', 1708077600),
  (109, 109, 11, 1, 'credit', '80000', 1710151200),
  (110, 110, 11, 1, 'credit', '70000', 1714471200),
  (111, 111, 11, 1, 'credit', '80000', 1714471200),
  (112, 112, 11, 1, 'credit', '80000', 1716976800),
  (113, 113, 11, 1, 'credit', '80000', 1719223200),
  (114, 114, 11, 1, 'credit', '80000', 1722160800),
  (115, 115, 11, 1, 'credit', '80000', 1725616800),
  (116, 116, 11, 1, 'credit', '70000', 1725616800),
  (117, 117, 11, 1, 'credit', '80000', 1728468000),
  (118, 118, 11, 1, 'credit', '80000', 1731146400),
  (119, 119, 11, 1, 'credit', '80000', 1734516000),
  (120, 120, 11, 1, 'credit', '80000', 1737453600),
  (121, 121, 11, 1, 'credit', '70000', 1737453600),
  (122, 122, 11, 1, 'credit', '80000', 1739181600),
  (123, 123, 11, 1, 'credit', '80000', 1742378400),
  (124, 124, 11, 1, 'credit', '40000', 1745316000),
  (125, 125, 11, 1, 'credit', '40000', 1746007200),
  (126, 126, 11, 1, 'credit', '75000', 1747476000),
  (127, 127, 11, 1, 'credit', '35000', 1750154400),
  (128, 128, 11, 1, 'credit', '80000', 1750154400),
  (129, 129, 11, 1, 'credit', '66700', 1753524000),
  (130, 130, 11, 1, 'credit', '66700', 1753524000),
  (131, 131, 11, 1, 'credit', '66700', 1755252000),
  (132, 132, 11, 1, 'credit', '100000', 1760349600),
  (133, 133, 11, 1, 'credit', '105000', 1763373600),
  (134, 134, 11, 1, 'credit', '55000', 1764928800),
  (135, 135, 11, 1, 'credit', '80000', 1770631200),
  (136, 136, 11, 1, 'credit', '70000', 1770631200),
  (137, 137, 11, 1, 'credit', '25000', 1772964000),
  (138, 138, 11, 1, 'credit', '25000', 1773136800),
  (139, 139, 11, 1, 'credit', '25000', 1773568800),
  (140, 140, 11, 1, 'credit', '67200', 1774605600);
