-- SEEDING: 10 Usuários Sintéticos (Cidadãos Fundadores)
-- ASPPIBRA DAO - 23/04/2026

-- 1. ELEONORA BITTENCOURT (ID 1)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('eleonora.cfo@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/eleonora_bittencourt.png', 'admin', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'eleonora_cfo', 'Eleonora', 'Bittencourt', 'did:dao:asppibra:eleonora_01', 'pubkey_eleonora_01', '18.304.552-1', 'SSP-SP', '234.567.890-12', 'Brasileira', '05/11/1978', 'Casada', 'Administradora', 'Co Fundadora', 'Diretora Financeira (CFO)', 'Finanças', '2024 à 2028', 'C-Level', 'Diretiva', 'Doutorado em Economia e MBA Executivo em Finanças.', 'Mais de 20 anos de experiência em gestão financeira de grandes corporações...', '["Autoridade", "Estratégica", "Analítica", "Foco em Processos"]', '(11) 9 8765-4321');

INSERT INTO membership_cards (citizen_id, card_hash, tier, status)
VALUES (last_insert_rowid(), 'hash_card_eleonora_01', 'founder', 'active');

-- 2. THIAGO MENDES (ID 2)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('thiago.rh@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/thiago_mendes.png', 'citizen', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'thiago_rh', 'Thiago', 'Mendes', 'did:dao:asppibra:thiago_02', 'pubkey_thiago_02', '22.114.663-5', 'DETRAN-RJ', '345.678.901-23', 'Brasileiro', '12/04/1985', 'Casado', 'Psicólogo', 'Diretor Estatutário', 'Head de Pessoas e Cultura', 'Recursos Humanos', '2025 à 2030', 'Sênior', 'Democrática', 'Especialização em Gestão de Pessoas e Psicologia Organizacional.', 'Sólida atuação em desenvolvimento humano...', '["Carismático", "Colaborativo", "Empático", "Foco em Pessoas"]', '(21) 9 7654-3210');

INSERT INTO membership_cards (citizen_id, card_hash, tier, status)
VALUES (last_insert_rowid(), 'hash_card_thiago_02', 'partner', 'active');

-- 3. LEONARDO FERRAZ (ID 3)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('leonardo.vendas@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/leonardo_ferraz.png', 'citizen', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'leonardo_vendas', 'Leonardo', 'Ferraz', 'did:dao:asppibra:leonardo_03', 'pubkey_leonardo_03', '15.887.221-0', 'SSP-MG', '456.789.012-34', 'Brasileiro', '22/09/1982', 'Divorciado', 'Gestor Comercial', 'Conselheiro', 'Diretor de Vendas Corporativas', 'Comercial', '2024 à 2026', 'Diretor', 'Orientada a Metas', 'Gestão Comercial com MBA em Negociações Complexas.', 'Especialista em expansão de mercado...', '["Assertivo", "Competitivo", "Negociador", "Foco em Resultados"]', '(31) 9 6543-2109');

INSERT INTO membership_cards (citizen_id, card_hash, tier, status)
VALUES (last_insert_rowid(), 'hash_card_leonardo_03', 'citizen', 'active');

-- 4. ISABELLA VIANA (ID 4)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('isabella.tech@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/isabella_viana.png', 'admin', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'isabella_tech', 'Isabella', 'Viana', 'did:dao:asppibra:isabella_04', 'pubkey_isabella_04', '29.445.112-X', 'SSP-SP', '567.890.123-45', 'Brasileira', '18/02/1990', 'Solteira', 'Arquiteta de Software', 'Membro Titular', 'Tech Lead', 'Tecnologia', '2025 à 2027', 'Sênior', 'Técnica', 'Ciência da Computação com mestrado em Inteligência Artificial.', 'Projetos de arquitetura de sistemas escaláveis...', '["Objetiva", "Minimalista", "Lógica", "Observadora"]', '(11) 9 5432-1098');

-- 5. FELIPE RIOS (ID 5)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('felipe.dev@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/felipe_rios.png', 'citizen', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'felipe_dev', 'Felipe', 'Rios', 'did:dao:asppibra:felipe_05', 'pubkey_felipe_05', '31.554.998-2', 'DIC-RJ', '678.901.234-56', 'Brasileiro', '03/07/1995', 'Solteiro', 'Desenvolvedor', 'Associado', 'Desenvolvedor Front-end', 'Produto', '2025 à 2026', 'Pleno', 'Individual', 'Tecnólogo em Análise e Desenvolvimento de Sistemas.', 'Atuação em startups focadas em inovação ágil...', '["Criativo", "Ágil", "Inovador", "Flexível"]', '(21) 9 4321-0987');

-- 6. RAFAEL COSTA (ID 6)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('rafael.pm@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/rafael_costa.png', 'citizen', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'rafael_pm', 'Rafael', 'Costa', 'did:dao:asppibra:rafael_06', 'pubkey_rafael_06', '25.112.334-7', 'SSP-PR', '789.012.345-67', 'Brasileiro', '28/10/1988', 'Casado', 'Engenheiro de Produção', 'Diretor Executivo', 'Product Manager (PM)', 'Produto', '2024 à 2029', 'Pleno', 'Facilitadora', 'Engenharia de Produção com certificações em Gestão Ágil de Produtos.', 'Visão sistêmica de negócios corporativos...', '["Adaptável", "Visão Sistêmica", "Equilibrado", "Articulador"]', '(41) 9 3210-9876');

-- 7. CAROLINA ALVES (ID 7)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('carolina.rp@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/carolina_alves.png', 'citizen', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'carolina_rp', 'Carolina', 'Alves', 'did:dao:asppibra:carolina_07', 'pubkey_carolina_07', '20.332.115-4', 'DETRAN-RJ', '890.123.456-78', 'Brasileira', '14/05/1986', 'União Estável', 'Relações Públicas', 'Coordenadora', 'Gerente de Comunicação Institucional', 'Comunicação', '2025 à 2028', 'Gerente', 'Inspiradora', 'Relações Públicas e Pós-graduação em Comunicação Corporativa.', 'Gestão de imagem institucional...', '["Acolhedora", "Comunicativa", "Autêntica", "Gestão de Crise"]', '(21) 9 2109-8765');

-- 8. HELENA MORAES (ID 8)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('helena.cso@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/helena_moraes.png', 'admin', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'helena_cso', 'Helena', 'Moraes', 'did:dao:asppibra:helena_08', 'pubkey_helena_08', '17.665.882-9', 'SSP-SP', '901.234.567-89', 'Brasileira', '09/12/1981', 'Solteira', 'Economista', 'Vice-Presidente', 'Chief Strategy Officer (CSO)', 'Estratégia Corporativa', '2024 à 2030', 'C-Level', 'Visionária', 'Doutorado em Estratégia de Negócios e Inovação.', 'Liderança visionária, formulação de políticas estratégicas...', '["Intelectual", "Ousada", "Perspicaz", "Originalidade"]', '(11) 9 1098-7654');

-- 9. LÍVIA GUEDES (ID 9)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('livia.arte@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/livia_guedes.png', 'citizen', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'livia_arte', 'Lívia', 'Guedes', 'did:dao:asppibra:livia_09', 'pubkey_livia_09', '33.778.441-5', 'SSP-SC', '012.345.678-90', 'Brasileira', '25/01/1992', 'Solteira', 'Designer', 'Consultora', 'Diretora de Arte', 'Design / Marketing', '2025 à 2026', 'Diretora', 'Transformacional', 'Design Gráfico com especialização em Culturas Contemporâneas.', 'Atuação independente com forte pragmatismo...', '["Independente", "Pragmática", "Disruptiva", "Atitude"]', '(48) 9 0987-6543');

-- 10. ARTHUR GUIMARÃES (ID 10)
INSERT INTO users (email, password, avatar_url, role, kyc_status) 
VALUES ('arthur.eng@empresa.com.br', '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash', '/assets/images/avatars/synthetic/arthur_guimaraes.png', 'admin', 'approved');

INSERT INTO citizens (user_id, username, first_name, last_name, did, public_key, rg, orgao_emissor, cpf, nacionalidade, data_nascimento, estado_civil, profissao, cargo_osc, cargo_projects, department, mandate, seniority_level, leadership_style, academic_info, professional_experience, profile_tags, phone_number)
VALUES (last_insert_rowid(), 'arthur_eng', 'Arthur', 'Guimarães', 'did:dao:asppibra:arthur_10', 'pubkey_arthur_10', '12.443.990-8', 'SSP-RS', '123.456.789-01', 'Brasileiro', '10/08/1972', 'Casado', 'Engenheiro de Software', 'Presidente', 'Principal Engineer (Staff)', 'Engenharia', '2025 à 2030', 'Staff / Principal', 'Mentoria', 'Engenharia de Computação com 25 anos de carreira.', 'Vasta quilometragem em desenvolvimento de sistemas críticos...', '["Acessível", "Experiente", "Educador", "Referência Técnica"]', '(51) 9 9876-5432');
