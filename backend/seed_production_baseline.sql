-- ==============================================================================
-- 🚀 ASPPIBRA DAO - PRODUCTION BASELINE SEED
-- Description: Hard Purge & Definitive Seeding (DEV + Andressa)
-- Environments: Local (Development) & Remote (Production)
-- ==============================================================================

-- 1. HARD PURGE (Cascata Inversa para evitar erros de Foreign Key)
DELETE FROM audit_logs;
DELETE FROM user_social_links;
DELETE FROM user_notification_settings;
DELETE FROM password_resets;
DELETE FROM user_sessions;
DELETE FROM auth_challenges;
DELETE FROM wallets;
DELETE FROM post_comments;
DELETE FROM post_favorites;
DELETE FROM posts;
DELETE FROM treasury_ledger;
DELETE FROM contracts;
DELETE FROM citizens;
DELETE FROM users;

-- 2. ACESSO SISTÊMICO (O único Admin autorizado pelo usuário)
INSERT INTO users (
  id, email, password, email_verified, kyc_status, role, active, status
) VALUES (
  1, 'dev@asppibra.com', 'rmv8Rses44HdwGsa8koAGQ==:65dedf36ef8502f9c72585b83ef7d09718fd7fbafc7c9f2df9e37e50f71bb197', 1, 'approved', 'admin', 1, 'active'
);

-- (Opcional: Preencher a ficha cidadão para o DEV caso o sistema exija profile)
INSERT INTO citizens (
  id, user_id, username, first_name, last_name, status
) VALUES (
  1, 1, 'dev_admin', 'DEV', 'ASO', 'active'
);

-- 3. INJEÇÃO DE DADOS REAIS (Andressa)
INSERT INTO users (
  id, email, password, email_verified, kyc_status, role, active, status
) VALUES (
  2, 'andressa.ferreira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'approved', 'citizen', 1, 'active'
);

INSERT INTO citizens (
  id, user_id, username, first_name, last_name, cpf, address, did, status
) VALUES (
  2, 2, 'andressa_lima', 'Andressa de Lima', 'Ferreira', '17379356780', 'Rua Palmira F. De Carvalho, lote 05, Quadra D, São José de Imbassaí, Maricá - RJ, 24912-000', 'did:dao:asppibra:andressa_01', 'active'
);

-- 4. HISTÓRICO FINANCEIRO (Andressa)
INSERT INTO contracts (
  id, user_id, description, total_value, status
) VALUES (
  1, 2, 'Quota Associativa Master', 6500000, 'active'
);

-- Inbound transações totalizando R$ 35.823,00 (3582300 centavos)
INSERT INTO treasury_ledger (
  citizen_id, type, category, amount_cents, currency, description, status
) VALUES 
  (2, 'inbound', 'membership', 1000000, 'BRL', 'Pagamento Parcela 01 - Via PIX', 'completed'),
  (2, 'inbound', 'membership', 1582300, 'BRL', 'Pagamento Parcela 02 - Via TED', 'completed'),
  (2, 'inbound', 'membership', 1000000, 'BRL', 'Pagamento Parcela 03 - Via PIX', 'completed');
