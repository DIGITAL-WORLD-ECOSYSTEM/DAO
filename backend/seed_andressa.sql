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

INSERT INTO users (
  id, email, password, email_verified, kyc_status, role, active, status
) VALUES (
  1, 'andressa.ferreira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, 'approved', 'citizen', true, 'active'
);

INSERT INTO citizens (
  id, user_id, username, first_name, last_name, cpf, address, did
) VALUES (
  1, 1, 'andressa_lima', 'Andressa de Lima', 'Ferreira', '17379356780', 'Rua Palmira F. De Carvalho, lote 05, Quadra D, São José de Imbassaí, Maricá - RJ, 24912-000', 'did:dao:asppibra:andressa_01'
);

INSERT INTO contracts (
  id, user_id, description, total_value, status
) VALUES (
  1, 1, 'Quota Associativa Master', 6500000, 'active'
);

INSERT INTO treasury_ledger (
  citizen_id, type, category, amount_cents, currency, description, status
) VALUES 
  (1, 'inbound', 'membership', 1000000, 'BRL', 'Pagamento Parcela 01 - Via PIX', 'completed'),
  (1, 'inbound', 'membership', 1582300, 'BRL', 'Pagamento Parcela 02 - Via TED', 'completed'),
  (1, 'inbound', 'membership', 1000000, 'BRL', 'Pagamento Parcela 03 - Via PIX', 'completed');
