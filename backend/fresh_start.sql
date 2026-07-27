-- FRESH START: Reconstrução Total da Estrutura ASPPIBRA DAO (3NF)
-- ASPPIBRA DAO - 23/04/2026

-- === LIMPEZA DE TABELAS EXISTENTES ===
PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS re_property_audit_log;
DROP TABLE IF EXISTS re_property_workflow;
DROP TABLE IF EXISTS re_property_blockchain;
DROP TABLE IF EXISTS re_property_media;
DROP TABLE IF EXISTS re_property_documents;
DROP TABLE IF EXISTS re_property_professionals;
DROP TABLE IF EXISTS re_property_owners;
DROP TABLE IF EXISTS re_property_pricing;
DROP TABLE IF EXISTS re_property_infrastructure;
DROP TABLE IF EXISTS re_property_construction;
DROP TABLE IF EXISTS re_property_land;
DROP TABLE IF EXISTS re_survey_points;
DROP TABLE IF EXISTS re_property_location;
DROP TABLE IF EXISTS re_properties;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_favorites;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS membership_cards;
DROP TABLE IF EXISTS citizens;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;

-- === 1. TABELA DE USUÁRIOS ===
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email_verified INTEGER DEFAULT 0,
    avatar_url TEXT,
    mfa_secret TEXT,
    mfa_enabled INTEGER DEFAULT 0,
    kyc_status TEXT CHECK(kyc_status IN ('none', 'pending', 'approved', 'rejected')) DEFAULT 'none',
    role TEXT CHECK(role IN ('citizen', 'partner', 'admin', 'system')) DEFAULT 'citizen',
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- === 2. TABELA DE CIDADÃOS (IDENTIDADE SOBERANA) ===
CREATE TABLE citizens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    did TEXT UNIQUE,
    public_key TEXT,
    rg TEXT,
    orgao_emissor TEXT,
    cpf TEXT,
    nacionalidade TEXT,
    data_nascimento TEXT,
    estado_civil TEXT,
    profissao TEXT,
    cargo_osc TEXT,
    cargo_projects TEXT,
    department TEXT,
    mandate TEXT,
    seniority_level TEXT,
    leadership_style TEXT,
    academic_info TEXT,
    professional_experience TEXT,
    profile_tags TEXT, -- Mode: JSON
    phone_number TEXT,
    encrypted_vault TEXT,
    passkey_id TEXT,
    passkey_public_key TEXT,
    totp_secret TEXT,
    totp_enabled INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_citizens_username ON citizens (username);
CREATE UNIQUE INDEX idx_citizens_did ON citizens (did);

-- === 3. CARTEIRINHAS DE MEMBRO ===
CREATE TABLE membership_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    citizen_id INTEGER NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    card_hash TEXT NOT NULL UNIQUE,
    tier TEXT CHECK(tier IN ('citizen', 'partner', 'founder', 'honorary')) DEFAULT 'citizen',
    issue_date INTEGER DEFAULT (strftime('%s', 'now')),
    expiry_date INTEGER,
    qr_code_url TEXT,
    status TEXT CHECK(status IN ('active', 'expired', 'revoked')) DEFAULT 'active',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_cards_citizen ON membership_cards (citizen_id);
CREATE UNIQUE INDEX idx_cards_hash ON membership_cards (card_hash);

-- === 4. POSTS (SOCIALFI) ===
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT NOT NULL,
    cover_url TEXT,
    category TEXT DEFAULT 'Geral',
    tags TEXT, -- Mode: JSON
    total_views INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    total_favorites INTEGER DEFAULT 0,
    time_to_read INTEGER DEFAULT 5,
    is_featured INTEGER DEFAULT 0,
    is_trending INTEGER DEFAULT 0,
    publish INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_posts_publish ON posts (publish);
CREATE INDEX idx_posts_category ON posts (category);

-- === 5. COMENTÁRIOS E FAVORITOS ===
CREATE TABLE post_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_comments_post ON post_comments (post_id);
CREATE INDEX idx_comments_user ON post_comments (user_id);

CREATE TABLE post_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE UNIQUE INDEX unique_post_user_favorite ON post_favorites (post_id, user_id);

-- === 6. LOGS DE AUDITORIA ===
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_id INTEGER REFERENCES users(id),
    citizen_id INTEGER REFERENCES citizens(id),
    action TEXT NOT NULL,
    status TEXT DEFAULT 'success',
    ip_address TEXT,
    metadata TEXT, -- Mode: JSON
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
CREATE INDEX idx_audit_action ON audit_logs (action);
CREATE INDEX idx_audit_actor ON audit_logs (actor_id);

-- === 7. SEGURANÇA E WALLETS ===
CREATE TABLE wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL UNIQUE,
    chain_id INTEGER NOT NULL,
    is_primary INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- === SEEDING: 10 Cidadãos Fundadores ===

-- 1. ELEONORA
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('eleonora.cfo@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/eleonora_bittencourt.png', 'admin', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'eleonora_cfo', 'Eleonora', 'Bittencourt', 'did:dao:asppibra:eleonora_01', 'pubkey_eleonora_01', 'Co Fundadora', 'Diretora Financeira (CFO)', 'Finanças', 'C-Level', 'active');
INSERT INTO membership_cards (citizen_id, card_hash, tier, status)
VALUES (last_insert_rowid(), 'hash_card_eleonora_01', 'founder', 'active');

-- 2. THIAGO
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('thiago.rh@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/thiago_mendes.png', 'citizen', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'thiago_rh', 'Thiago', 'Mendes', 'did:dao:asppibra:thiago_02', 'pubkey_thiago_02', 'Diretor Estatutário', 'Head de Pessoas e Cultura', 'Recursos Humanos', 'Sênior', 'active');
INSERT INTO membership_cards (citizen_id, card_hash, tier, status)
VALUES (last_insert_rowid(), 'hash_card_thiago_02', 'partner', 'active');

-- 3. LEONARDO
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('leonardo.vendas@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/leonardo_ferraz.png', 'citizen', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'leonardo_vendas', 'Leonardo', 'Ferraz', 'did:dao:asppibra:leonardo_03', 'pubkey_leonardo_03', 'Conselheiro', 'Diretor de Vendas Corporativas', 'Comercial', 'Diretor', 'active');
INSERT INTO membership_cards (citizen_id, card_hash, tier, status)
VALUES (last_insert_rowid(), 'hash_card_leonardo_03', 'citizen', 'active');

-- 4. ISABELLA
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('isabella.tech@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/isabella_viana.png', 'admin', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'isabella_tech', 'Isabella', 'Viana', 'did:dao:asppibra:isabella_04', 'pubkey_isabella_04', 'Membro Titular', 'Tech Lead', 'Tecnologia', 'Sênior', 'active');

-- 5. FELIPE
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('felipe.dev@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/felipe_rios.png', 'citizen', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'felipe_dev', 'Felipe', 'Rios', 'did:dao:asppibra:felipe_05', 'pubkey_felipe_05', 'Associado', 'Desenvolvedor Front-end', 'Produto', 'Pleno', 'active');

-- 6. RAFAEL
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('rafael.pm@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/rafael_costa.png', 'citizen', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'rafael_pm', 'Rafael', 'Costa', 'did:dao:asppibra:rafael_06', 'pubkey_rafael_06', 'Diretor Executivo', 'Product Manager (PM)', 'Produto', 'Pleno', 'active');

-- 7. CAROLINA
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('carolina.rp@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/carolina_alves.png', 'citizen', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'carolina_rp', 'Carolina', 'Alves', 'did:dao:asppibra:carolina_07', 'pubkey_carolina_07', 'Coordenadora', 'Gerente de Comunicação Institucional', 'Comunicação', 'Gerente', 'active');

-- 8. HELENA
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('helena.cso@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/helena_moraes.png', 'admin', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'helena_cso', 'Helena', 'Moraes', 'did:dao:asppibra:helena_08', 'pubkey_helena_08', 'Vice-Presidente', 'Chief Strategy Officer (CSO)', 'Estratégia Corporativa', 'C-Level', 'active');

-- 9. LIVIA
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('livia.arte@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/livia_guedes.png', 'citizen', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'livia_arte', 'Lívia', 'Guedes', 'did:dao:asppibra:livia_09', 'pubkey_livia_09', 'Consultora', 'Diretora de Arte', 'Design / Marketing', 'Diretora', 'active');

-- 10. ARTHUR
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('arthur.eng@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/arthur_guimaraes.png', 'admin', 'approved');
INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, cargo_osc, cargo_projects, department, seniority_level, status)
VALUES (last_insert_rowid(), 'arthur_eng', 'Arthur', 'Guimarães', 'did:dao:asppibra:arthur_10', 'pubkey_arthur_10', 'Presidente', 'Principal Engineer (Staff)', 'Engenharia', 'Staff / Principal', 'active');
