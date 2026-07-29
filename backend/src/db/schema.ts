/**
 * Copyright 2025 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Database Schema (Drizzle ORM + SQLite D1)
 * Version: 2.0.0 - Real Identity, SocialFi & Real Estate (RWA) Module
 */
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../dto/email-event';

// === 1. TABELA DE USUÁRIOS (Sincronizado com AuthGuard do Frontend) ===
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    // Identidade Web2
    email: text('email').notNull().unique(),
    password: text('password').notNull(),

    // Status de Verificação
    emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
    avatarUrl: text('avatar_url'),

    // Segurança (Snake_case para o DB, CamelCase para o código)
    mfaSecret: text('mfa_secret'),
    mfaEnabled: integer('mfa_enabled', { mode: 'boolean' }).default(false),
    tokenVersion: integer('token_version').default(1).notNull(),

    // Compliance & Governança
    kycStatus: text('kyc_status', { enum: ['none', 'pending', 'approved', 'rejected'] }).default(
      'none'
    ),
    role: text('role', { enum: ['citizen', 'partner', 'admin', 'system', 'dev', 'user'] }).default(
      'citizen'
    ),

    // Identidade Soberana & Status
    citizenId: integer('citizen_id'),
    active: integer('active', { mode: 'boolean' }).default(true).notNull(),
    status: text('status').default('active').notNull(),

    // LGPD Compliance
    consentAccepted: integer('consent_accepted', { mode: 'boolean' }).default(false).notNull(),
    consentVersion: integer('consent_version').default(0).notNull(),
    consentTimestamp: integer('consent_timestamp', { mode: 'timestamp' }),

    // Timestamps em formato Unix (Melhor performance no D1)
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    roleIdx: index('idx_users_role').on(table.role),
    citizenIdUnique: uniqueIndex('idx_users_citizen_id_unique').on(table.citizenId),
  })
);

// === 1.1. REDES SOCIAIS (Escalável) ===
export const userSocialLinks = sqliteTable(
  'user_social_links',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(), // 'twitter', 'linkedin', 'github', 'instagram', etc.
    url: text('url').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userProviderUnique: uniqueIndex('idx_socials_user_provider').on(table.userId, table.provider),
  })
);

// === 1.2. PREFERÊNCIAS DE NOTIFICAÇÃO (Escalável) ===
export const userNotificationSettings = sqliteTable(
  'user_notification_settings',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'activity_comments', 'application_news', etc.
    enabled: integer('enabled', { mode: 'boolean' }).default(true).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userTypeUnique: uniqueIndex('idx_notifications_user_type').on(table.userId, table.type),
  })
);

// === 2. SEGURANÇA: RECUPERAÇÃO DE SENHA ===
export const passwordResets = sqliteTable('password_resets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  used: integer('used', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === 2.1. SEGURANÇA: CONTROLE DE SESSÕES (REFRESH TOKEN ROTATION) ===
export const userSessions = sqliteTable(
  'user_sessions',
  {
    id: text('id').primaryKey(), // UUID da sessão
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    jti: text('jti').notNull(),
    ip: text('ip'),
    userAgent: text('user_agent'),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    aal: integer('aal').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    revoked: integer('revoked', { mode: 'boolean' }).default(false),
  },
  (table) => ({
    userIdIdx: index('idx_sessions_user').on(table.userId),
  })
);

// === 2.2. SEGURANÇA: DESAFIOS ANTI-REPLAY ===
export const authChallenges = sqliteTable('auth_challenges', {
  id: text('id').primaryKey(), // UUID do desafio
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  challenge: text('challenge').notNull(),
  challengeType: text('challenge_type').notNull(), // 'ssh', 'totp', 'webauthn', 'siwe'
  used: integer('used', { mode: 'boolean' }).default(false),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// === 3. CARTEIRAS (IDENTIDADE WEB3 / TOKENIZAÇÃO) ===
export const wallets = sqliteTable('wallets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  address: text('address').notNull().unique(),
  chainId: integer('chain_id').notNull(),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ======================================================================
// === 4. MÓDULO SOCIALFI (POSTS & BLOG) ===
// ======================================================================

export const posts = sqliteTable(
  'posts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'), // Meta Description e Cards
    content: text('content').notNull(),
    coverUrl: text('cover_url'),
    coverAlt: text('cover_alt'),

    category: text('category').default('Tecnologia'),
    tags: text('tags', { mode: 'json' }).$type<string[]>(), // Tags dinâmicas em JSON

    // SEO Avançado
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    metaKeywords: text('meta_keywords', { mode: 'json' }).$type<string[]>(),

    // Métricas SocialFi
    totalViews: integer('total_views').default(0),
    totalShares: integer('total_shares').default(0),
    totalFavorites: integer('total_favorites').default(0),
    timeToRead: integer('time_to_read').default(5), // Minutos estimados

    // Controle de Destaque e Governança
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
    isTrending: integer('is_trending', { mode: 'boolean' }).default(false),

    // 🟢 AJUSTE: Renomeado para 'status' (Governança Editorial FSM)
    status: text('status', {
      enum: ['draft', 'review', 'published', 'archived'],
    }).default('draft'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    slugIdx: index('idx_posts_slug').on(table.slug),
    statusIdx: index('idx_posts_status').on(table.status),
    categoryIdx: index('idx_posts_category').on(table.category),
  })
);

// --- Comentários ---
export const postComments = sqliteTable(
  'post_comments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    content: text('content').notNull(),
    likes: integer('likes').default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    postIdIdx: index('idx_comments_post').on(table.postId),
    userIdIdx: index('idx_comments_user').on(table.userId),
  })
);

// --- 🟢 NOVO: Favoritos (Social Proof & SocialFi) ---
// Essencial para o componente de AvatarGroup no Front-end
export const postFavorites = sqliteTable(
  'post_favorites',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    uniqueFavoriteIdx: uniqueIndex('unique_post_user_favorite').on(table.postId, table.userId),
  })
);

// === 5. GESTÃO DE ATIVOS (RWA) & CONTRATOS ===
export const contracts = sqliteTable('contracts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  description: text('description').notNull(),
  totalValue: integer('total_value').notNull(), // Valor em centavos
  installmentValue: integer('installment_value'), // Valor da parcela em centavos
  totalInstallments: integer('total_installments'),
  paidInstallments: integer('paid_installments').default(0),
  nextDueDate: integer('next_due_date', { mode: 'timestamp' }),

  status: text('status', { enum: ['active', 'completed', 'defaulted'] }).default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ======================================================================
// === 7. IDENTIDADE SOBERANA (SSI & VAULT) ===
// ======================================================================

export const citizens = sqliteTable(
  'citizens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),

    username: text('username').notNull().unique(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    did: text('did').unique(), // did:dao:asppibra:<pubkey_hash>
    publicKey: text('public_key'), // Ed25519 (Hex)

    // 👤 Identidade Civil (Ficha Cadastral)
    rg: text('rg'),
    orgaoEmissor: text('orgao_emissor'),
    cpf: text('cpf'),
    nacionalidade: text('nacionalidade'),
    dataNascimento: text('data_nascimento'),
    estadoCivil: text('estado_civil'),
    profissao: text('profissao'),

    // 🏛️ Institucional (Governança & OSC)
    cargoOsc: text('cargo_osc'),
    cargoProjetos: text('cargo_projects'),
    departamento: text('department'),
    mandato: text('mandate'),
    seniorityLevel: text('seniority_level'),
    leadershipStyle: text('leadership_style'),

    // 🎓 Professional & Social
    academicInfo: text('academic_info'),
    professionalExperience: text('professional_experience'),
    profileTags: text('profile_tags', { mode: 'json' }).$type<string[]>(),
    phoneNumber: text('phone_number'),
    occupation: text('occupation'),
    company: text('company'),
    website: text('website'),
    about: text('about'),
    isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),

    // 📍 Localização (Endereço Físico)
    country: text('country').default('BR'),
    state: text('state'),
    city: text('city'),
    zipCode: text('zip_code'),
    address: text('address'),

    // 🔐 Fortress Layer (Phase 3)
    encryptedVault: text('encrypted_vault'), // Mnemonic criptografado localmente
    passkeyId: text('passkey_id'), // WebAuthn Credential ID
    passkeyPublicKey: text('passkey_public_key'), // WebAuthn Public Key
    totpSecret: text('totp_secret'), // Google Authenticator Secret
    totpEnabled: integer('totp_enabled', { mode: 'boolean' }).default(false),

    status: text('status').default('active'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    usernameIdx: index('idx_citizens_username').on(table.username),
    didIdx: uniqueIndex('idx_citizens_did').on(table.did),
    userIdIdx: index('idx_citizens_user').on(table.userId),
  })
);

// === 8. CARTEIRINHAS DE MEMBRO (MEMBERSHIP CARDS) ===
export const membershipCards = sqliteTable(
  'membership_cards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    citizenId: integer('citizen_id')
      .notNull()
      .references(() => citizens.id, { onDelete: 'cascade' }),

    cardHash: text('card_hash').notNull().unique(), // SHA-256 para verificação offline
    tier: text('tier', { enum: ['citizen', 'partner', 'founder', 'honorary'] }).default('citizen'),

    issueDate: integer('issue_date', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    expiryDate: integer('expiry_date', { mode: 'timestamp' }),
    qrCodeUrl: text('qr_code_url'),

    status: text('status', { enum: ['active', 'expired', 'revoked'] }).default('active'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    citizenIdx: index('idx_cards_citizen').on(table.citizenId),
    hashIdx: uniqueIndex('idx_cards_hash').on(table.cardHash),
  })
);

// ======================================================================
// === 6. LOGS DE AUDITORIA (TRANSPARÊNCIA DAO) ===
// ======================================================================

export const auditLogs = sqliteTable(
  'audit_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    actorId: integer('actor_id').references(() => users.id),
    citizenId: integer('citizen_id').references(() => citizens.id),

    action: text('action').notNull(), // Ex: 'VAULT_GENESIS', 'HANDSHAKE_SUCCESS'
    status: text('status').default('success'),
    ipAddress: text('ip_address'),

    metadata: text('metadata', { mode: 'json' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    actionIdx: index('idx_audit_action').on(table.action),
    actorIdx: index('idx_audit_actor').on(table.actorId),
  })
);

// ======================================================================
// ===      MÓDULO IMOBILIÁRIO — REAL ESTATE (RWA)                     ===
// ===      Prefixo: re_  |  Version: 2.0.0                           ===
// ======================================================================

// === RE-1. REGISTRO PRINCIPAL DO IMÓVEL ===
export const reProperties = sqliteTable(
  're_properties',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    uuid: text('uuid').notNull().unique(), // UUID v4 gerado na criação
    citizenId: integer('citizen_id').references(() => citizens.id, { onDelete: 'set null' }),

    title: text('title').notNull(), // Título descritivo
    slug: text('slug').notNull().unique(), // URL amigável

    // Classificação
    propertyType: text('property_type', {
      enum: ['urban', 'rural', 'commercial', 'land'],
    })
      .notNull()
      .default('urban'),

    status: text('status', {
      enum: [
        'draft',
        'under_review',
        'approved',
        'registered',
        'tokenized',
        'sold',
        'rented',
        'archived',
      ],
    })
      .notNull()
      .default('draft'),

    // Registros Legais
    registrationNumberRgi: text('registration_number_rgi').unique(), // Matrícula cartório
    iptuNumber: text('iptu_number'),

    // Imutabilidade
    ipfsCidMetadata: text('ipfs_cid_metadata'), // CID IPFS do JSON completo
    ipfsCidDocument: text('ipfs_cid_document'), // CID IPFS do PDF

    // Pipeline
    workflowStep: text('workflow_step', {
      enum: [
        'digitalization',
        'documents_uploaded',
        'technical_review',
        'legal_review',
        'cartorio_submission',
        'cartorio_approved',
        'ipfs_published',
        'blockchain_registered',
        'completed',
      ],
    })
      .notNull()
      .default('digitalization'),

    // Flags
    isTokenized: integer('is_tokenized', { mode: 'boolean' }).default(false),
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),

    notes: text('notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    slugIdx: index('idx_re_properties_slug').on(table.slug),
    statusIdx: index('idx_re_properties_status').on(table.status),
    typeIdx: index('idx_re_properties_type').on(table.propertyType),
  })
);

// === RE-2. ENDEREÇO E GEOLOCALIZAÇÃO ===
export const rePropertyLocation = sqliteTable(
  're_property_location',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    // Endereço
    street: text('street'),
    number: integer('number'),
    block: text('block'), // Quadra
    lot: text('lot'), // Lote
    neighborhood: text('neighborhood'),
    city: text('city'),
    state: text('state'), // UF ex: RJ
    zipCode: text('zip_code'),
    country: text('country').default('BR'),

    // GPS (Decimal Degrees)
    latitude: integer('latitude', { mode: 'number' }),
    longitude: integer('longitude', { mode: 'number' }),

    // Sistema Geodésico Brasileiro (SIRGAS 2000)
    utmZone: text('utm_zone'), // Ex: "23.K"
    utmMeridian: text('utm_meridian'), // Ex: "-45º W"
    utmEasting: integer('utm_easting', { mode: 'number' }), // 711097.00
    utmNorthing: integer('utm_northing', { mode: 'number' }), // 7476024.00
    geodeticSystem: text('geodetic_system').default('SIRGAS 2000'),

    // Zoneamento
    zoningCode: text('zoning_code'), // Ex: "Z6"
    zoningDescription: text('zoning_description'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    cityIdx: index('idx_re_location_city').on(table.city),
    stateIdx: index('idx_re_location_state').on(table.state),
  })
);

// === RE-3. PONTOS UTM DE LEVANTAMENTO TOPOGRÁFICO ===
export const reSurveyPoints = sqliteTable('re_survey_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  pointName: text('point_name').notNull(), // P0, P1, P2, P3...
  easting: integer('easting', { mode: 'number' }),
  northing: integer('northing', { mode: 'number' }),
  colorMarker: text('color_marker'), // Ex: "🟦", "#4A90E2"
  description: text('description'),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === RE-4. DADOS DO TERRENO ===
export const rePropertyLand = sqliteTable('re_property_land', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  totalAreaM2: integer('total_area_m2', { mode: 'number' }), // 1100.00
  perimeterM: integer('perimeter_m', { mode: 'number' }),
  terrainType: text('terrain_type'), // plano, acidentado

  // Confrontações
  frontageM: integer('frontage_m', { mode: 'number' }),
  depthRightM: integer('depth_right_m', { mode: 'number' }),
  depthLeftM: integer('depth_left_m', { mode: 'number' }),
  rearM: integer('rear_m', { mode: 'number' }),
  boundaryFront: text('boundary_front'),
  boundaryRight: text('boundary_right'),
  boundaryLeft: text('boundary_left'),
  boundaryRear: text('boundary_rear'),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === RE-5. DADOS DA CONSTRUÇÃO ===
export const rePropertyConstruction = sqliteTable('re_property_construction', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  floors: integer('floors').default(1),
  builtAreaM2: integer('built_area_m2', { mode: 'number' }),

  // Cômodos
  bedrooms: integer('bedrooms').default(0),
  suites: integer('suites').default(0),
  bathrooms: integer('bathrooms').default(0),
  kitchens: integer('kitchens').default(0),
  livingRooms: integer('living_rooms').default(0),
  garages: integer('garages').default(0),
  laundryAreas: integer('laundry_areas').default(0),
  courtyards: integer('courtyards').default(0),

  // Extras
  hasPool: integer('has_pool', { mode: 'boolean' }).default(false),
  hasElevator: integer('has_elevator', { mode: 'boolean' }).default(false),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === RE-6. INFRAESTRUTURA E SERVIÇOS ===
export const rePropertyInfrastructure = sqliteTable('re_property_infrastructure', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  water: integer('water', { mode: 'boolean' }).default(false),
  electricity: integer('electricity', { mode: 'boolean' }).default(false),
  sewage: integer('sewage', { mode: 'boolean' }).default(false),
  paving: integer('paving', { mode: 'boolean' }).default(false),
  publicTransport: integer('public_transport', { mode: 'boolean' }).default(false),
  telephoneNetwork: integer('telephone_network', { mode: 'boolean' }).default(false),
  gasNetwork: integer('gas_network', { mode: 'boolean' }).default(false),
  internet: integer('internet', { mode: 'boolean' }).default(false),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === RE-7. HISTÓRICO DE PREÇOS ===
export const rePropertyPricing = sqliteTable(
  're_property_pricing',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    priceType: text('price_type', {
      enum: ['sale', 'rent', 'appraisal'],
    }).notNull(),

    amountBrlCents: integer('amount_brl_cents').notNull(), // Sempre em centavos
    amountToken: integer('amount_token'), // Tokens ASPPIBRA (opcional)
    currency: text('currency').default('BRL'),

    validFrom: integer('valid_from', { mode: 'timestamp' }),
    validUntil: integer('valid_until', { mode: 'timestamp' }), // NULL = vigente

    paymentMethod: text('payment_method'),
    terms: text('terms'),
    source: text('source'),
    notes: text('notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    priceTypeIdx: index('idx_re_pricing_type').on(table.priceType),
  })
);

// === RE-8. PROPRIETÁRIOS ===
export const rePropertyOwners = sqliteTable('re_property_owners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),
  citizenId: integer('citizen_id').references(() => citizens.id, { onDelete: 'set null' }),

  ownerType: text('owner_type', {
    enum: ['primary', 'spouse', 'heir', 'legal_entity', 'co_owner'],
  })
    .notNull()
    .default('primary'),

  fullName: text('full_name').notNull(),
  cpf: text('cpf'), // Armazenar apenas dígitos: 09566889771
  rg: text('rg'),
  birthDate: text('birth_date'), // ISO 8601: 1981-12-28
  nationality: text('nationality'),
  maritalStatus: text('marital_status', {
    enum: ['single', 'married', 'divorced', 'widowed', 'stable_union'],
  }),
  ownershipSharePct: integer('ownership_share_pct', { mode: 'number' }).default(100), // %

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === RE-9. PROFISSIONAIS ENVOLVIDOS ===
export const rePropertyProfessionals = sqliteTable('re_property_professionals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  role: text('role', {
    enum: ['surveyor', 'civil_engineer', 'lawyer', 'notary', 'appraiser', 'other'],
  }).notNull(),

  fullName: text('full_name').notNull(),
  cpf: text('cpf'),
  rg: text('rg'),

  // Registros Profissionais
  crea: text('crea'), // CREA do engenheiro/topógrafo
  oab: text('oab'), // OAB do advogado
  cft: text('cft'), // CFT do topógrafo
  artNumber: text('art_number'), // Número da ART

  // Empresa
  organizationName: text('organization_name'),
  cnpj: text('cnpj'), // Apenas dígitos

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === RE-10. DOCUMENTOS CARTORIAIS E LEGAIS ===
export const rePropertyDocuments = sqliteTable(
  're_property_documents',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    docType: text('doc_type', {
      enum: [
        'onus_reais',
        'escritura',
        'ata_notarial',
        'declaracao',
        'art',
        'iptu',
        'habite_se',
        'plano_diretor',
        'nota_judicial',
        'matricula',
        'contrato_compra_venda',
        'procuracao',
        'other',
      ],
    }).notNull(),

    name: text('name').notNull(),

    // Cartório
    cartoName: text('carto_name'),
    cartoCnpj: text('carto_cnpj'),
    cartoBook: text('carto_book'), // Livro
    cartoAct: text('carto_act'), // Ato
    cartoFolio: text('carto_folio'), // Folha
    registrationDate: text('registration_date'), // ISO 8601
    electronicSeal: text('electronic_seal'), // EDWG85399
    randomCode: text('random_code'), // AXN

    // Armazenamento
    r2Key: text('r2_key'), // Chave no bucket R2 (privado)
    ipfsCid: text('ipfs_cid'), // CID IPFS (público/imutável)
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),

    notes: text('notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    docTypeIdx: index('idx_re_documents_type').on(table.docType),
  })
);

// === RE-11. MÍDIAS (FOTOS, PLANTAS, AEROFOTOGRAFIA) ===
export const rePropertyMedia = sqliteTable(
  're_property_media',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    mediaType: text('media_type', {
      enum: [
        'photo',
        'aerial_photo',
        'floor_plan',
        'site_plan',
        'zoning_map',
        'cadastral_plan',
        'topographic_plan',
        'video',
        'virtual_tour',
        'other',
      ],
    }).notNull(),

    title: text('title'), // Ex: "Vista Frontal"
    url: text('url'), // URL pública (R2 ou IPFS)
    ipfsCid: text('ipfs_cid'),
    r2Key: text('r2_key'),

    isCover: integer('is_cover', { mode: 'boolean' }).default(false),
    displayOrder: integer('display_order').default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    mediaTypeIdx: index('idx_re_media_type').on(table.mediaType),
  })
);

// === RE-12. DADOS BLOCKCHAIN / NFT ===
export const rePropertyBlockchain = sqliteTable(
  're_property_blockchain',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    chainId: integer('chain_id'), // 56 = BSC
    chainName: text('chain_name'), // "bsc", "polygon", "ethereum"
    contractAddress: text('contract_address'), // Endereço do smart contract
    tokenId: text('token_id'), // ID do NFT
    tokenStandard: text('token_standard'), // "ERC-721", "ERC-1155"
    transactionHash: text('transaction_hash'), // Hash da mint tx
    mintedAt: integer('minted_at', { mode: 'timestamp' }),
    ownerWallet: text('owner_wallet'), // Carteira atual
    metadataIpfsCid: text('metadata_ipfs_cid'), // CID do JSON de metadados onchain
    explorerUrl: text('explorer_url'), // Link bscscan/etherscan
    openseaUrl: text('opensea_url'),

    isActive: integer('is_active', { mode: 'boolean' }).default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    contractIdx: index('idx_re_blockchain_contract').on(table.contractAddress),
  })
);

// === RE-13. PIPELINE DE WORKFLOW (Digitalização → Blockchain) ===
export const rePropertyWorkflow = sqliteTable(
  're_property_workflow',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),
    actorCitizenId: integer('actor_citizen_id').references(() => citizens.id, {
      onDelete: 'set null',
    }),

    step: text('step', {
      enum: [
        'digitalization',
        'documents_uploaded',
        'technical_review',
        'legal_review',
        'cartorio_submission',
        'cartorio_approved',
        'ipfs_published',
        'blockchain_registered',
        'completed',
      ],
    }).notNull(),

    status: text('status', {
      enum: ['pending', 'in_progress', 'approved', 'rejected', 'requires_correction'],
    })
      .notNull()
      .default('pending'),

    notes: text('notes'),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    stepIdx: index('idx_re_workflow_step').on(table.step),
    statusIdx: index('idx_re_workflow_status').on(table.status),
  })
);

// === RE-14. LOG DE AUDITORIA FORENSE DO IMÓVEL ===
export const rePropertyAuditLog = sqliteTable(
  're_property_audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),
    actorCitizenId: integer('actor_citizen_id').references(() => citizens.id, {
      onDelete: 'set null',
    }),

    // Ex: PROPERTY_CREATED, STATUS_CHANGED, DOCUMENT_UPLOADED, NFT_MINTED, OWNER_ADDED
    action: text('action').notNull(),
    oldValue: text('old_value', { mode: 'json' }), // Estado anterior (JSON)
    newValue: text('new_value', { mode: 'json' }), // Estado novo (JSON)
    ipAddress: text('ip_address'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    actionIdx: index('idx_re_audit_action').on(table.action),
    propertyIdx: index('idx_re_audit_property').on(table.propertyId),
  })
);

// ======================================================================
// === 15. MÓDULO DE GOVERNANÇA (DAO CORE)                            ===
// ======================================================================

export const govProposals = sqliteTable(
  'gov_proposals',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    description: text('description').notNull(),
    content: text('content'), // Detalhamento Markdown

    status: text('status', {
      enum: ['draft', 'active', 'passed', 'rejected', 'executed', 'cancelled'],
    }).default('active'),

    type: text('type', {
      enum: ['business', 'parameter_change', 'treasury_release', 'membership_grant'],
    }).default('business'),

    // Parâmetros de Votação
    votingStart: integer('voting_start', { mode: 'timestamp' }),
    votingEnd: integer('voting_end', { mode: 'timestamp' }),
    quorum: integer('quorum').default(10), // % mínimo de participação

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    statusIdx: index('idx_gov_status').on(table.status),
  })
);

export const govVotes = sqliteTable(
  'gov_votes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    proposalId: integer('proposal_id')
      .notNull()
      .references(() => govProposals.id, { onDelete: 'cascade' }),
    voterId: integer('voter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    support: integer('support', { mode: 'boolean' }).notNull(), // TRUE = For, FALSE = Against
    votingPower: integer('voting_power').default(1),
    reason: text('reason'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    proposalVoterIdx: uniqueIndex('unique_proposal_voter').on(table.proposalId, table.voterId),
  })
);

// ======================================================================
// === 16. MÓDULO DE TESOURARIA (FINANCIAL LEDGER)                   ===
// ======================================================================

export const treasuryLedger = sqliteTable(
  'treasury_ledger',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    citizenId: integer('citizen_id').references(() => citizens.id, { onDelete: 'set null' }),

    type: text('type', { enum: ['inbound', 'outbound', 'internal_transfer'] }).notNull(),
    category: text('category', {
      enum: ['membership', 'rwa_yield', 'grant', 'operational', 'other'],
    }).default('other'),

    amountCents: integer('amount_cents').notNull(), // Valor em centavos
    currency: text('currency').default('BRL'), // BRL, USDT, ASPPIBRA

    description: text('description').notNull(),
    txHash: text('tx_hash'), // Hash on-chain se aplicável

    status: text('status', { enum: ['pending', 'completed', 'failed'] }).default('completed'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    typeIdx: index('idx_treasury_type').on(table.type),
    citizenIdx: index('idx_treasury_citizen').on(table.citizenId),
  })
);

// ======================================================================
// === 17. MÓDULO DE BOUNTIES (CONTRIBUTIONS)                       ===
// ======================================================================

export const bounties = sqliteTable(
  'bounties',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creatorId: integer('creator_id').references(() => users.id),

    title: text('title').notNull(),
    description: text('description').notNull(),

    rewardAmount: integer('reward_amount'),
    rewardToken: text('reward_token').default('ASPPIBRA'),

    status: text('status', {
      enum: ['open', 'assigned', 'review', 'completed', 'cancelled'],
    }).default('open'),
    difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).default('medium'),

    assigneeId: integer('assignee_id').references(() => users.id),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    statusIdx: index('idx_bounties_status').on(table.status),
  })
);

// ======================================================================
// === 18. DEVOS: API & SECRETS VAULT (FOUNDER GRADE)                 ===
// ======================================================================

export const integrationConfigs = sqliteTable(
  'integration_configs',
  {
    id: text('id').primaryKey(), // UUID
    provider: text('provider').notNull(), // ex: binance, stripe, openai
    category: text('category', {
      enum: ['finance', 'web3', 'ai', 'communications', 'oauth', 'infrastructure', 'analytics'],
    }).notNull(),
    environment: text('environment', {
      enum: ['local', 'preview', 'staging', 'production'],
    })
      .notNull()
      .default('production'),

    baseUrl: text('base_url'),
    sandboxMode: integer('sandbox_mode', { mode: 'boolean' }).default(false),

    riskClassification: text('risk_classification', {
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'NUCLEAR'],
    })
      .notNull()
      .default('MEDIUM'),

    rotationIntervalDays: integer('rotation_interval_days'),
    nextRotationAt: integer('next_rotation_at', { mode: 'timestamp' }),

    status: text('status', {
      enum: ['online', 'failing', 'missing'],
    }).default('missing'),

    dependencies: text('dependencies', { mode: 'json' }).$type<string[]>(), // Ex: ["Billing", "Marketplace"]

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    providerEnvIdx: uniqueIndex('idx_integration_provider_env').on(
      table.provider,
      table.environment
    ),
  })
);

export const integrationSecrets = sqliteTable(
  'integration_secrets',
  {
    id: text('id').primaryKey(), // UUID
    configId: text('config_id')
      .notNull()
      .references(() => integrationConfigs.id, { onDelete: 'cascade' }),
    keyName: text('key_name').notNull(), // ex: STRIPE_SECRET
    encryptedValue: text('encrypted_value').notNull(), // AES-256-GCM encrypted

    version: integer('version').notNull().default(1),
    scopesAllowed: text('scopes_allowed', { mode: 'json' }).$type<string[]>(),

    // Leasing & Ownership
    leaseExpiresAt: integer('lease_expires_at', { mode: 'timestamp' }),
    ownerRole: text('owner_role').default('dev'),
    ownerUserId: integer('owner_user_id').references(() => users.id),

    updatedBy: integer('updated_by').references(() => users.id), // ID do admin
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    configKeyIdx: uniqueIndex('idx_integration_secret_config_key').on(
      table.configId,
      table.keyName
    ),
  })
);

export const integrationSecretVersions = sqliteTable('integration_secret_versions', {
  id: text('id').primaryKey(), // UUID
  secretId: text('secret_id')
    .notNull()
    .references(() => integrationSecrets.id, { onDelete: 'cascade' }),
  encryptedValue: text('encrypted_value').notNull(),
  version: integer('version').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  createdBy: integer('created_by').references(() => users.id),
});

export const auditLogsImmutable = sqliteTable('audit_logs_immutable', {
  id: text('id').primaryKey(), // UUID
  actorId: integer('actor_id').references(() => users.id),
  actorIp: text('actor_ip'),
  actorUserAgent: text('actor_user_agent'),

  action: text('action').notNull(), // ex: ROTATE_BINANCE_PROD
  resource: text('resource'), // ex: integration_secrets:uuid

  eventHash: text('event_hash').notNull().unique(), // Hash SHA-256 de (id, actorId, action, previousHash, etc)
  previousHash: text('previous_hash'), // Encadeamento

  reason: text('reason'), // Motivo
  status: text('status', { enum: ['success', 'failed'] }).default('success'),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ======================================================================
// === NOTIFICAÇÕES E E-MAILS (COMUNICAÇÃO) ===
// ======================================================================

export const emailAccounts = sqliteTable('email_accounts', {
  id: text('id').primaryKey(),
  department: text('department'),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  type: text('type', {
    enum: [
      'Atendimento',
      'Financeiro',
      'Juridico',
      'Sistema',
      'Marketing',
      'Governança',
      'Newsletter',
      'Diretoria',
    ],
  }),
  criticality: text('criticality', { enum: ['Baixa', 'Média', 'Alta', 'Crítica'] }),
  providerInbound: text('provider_inbound').default('cloudflare'),
  providerOutbound: text('provider_outbound').default('resend'),
  signatureHtml: text('signature_html'),
  replyTo: text('reply_to'),
  color: text('color'),
  status: text('status', {
    enum: ['Provisionando', 'Ativa', 'Erro', 'Suspensa', 'Arquivada', 'Desativada'],
  }).default('Provisionando'),
  healthStatus: text('health_status', { enum: ['Verde', 'Amarelo', 'Vermelho', 'Cinza'] }).default(
    'Cinza'
  ),
  usedSpaceMb: integer('used_space_mb').default(0),
  totalMessages: integer('total_messages').default(0),
  totalAttachments: integer('total_attachments').default(0),
  lastCleanedAt: integer('last_cleaned_at', { mode: 'timestamp' }),
  retentionDays: integer('retention_days').default(365),
  ownerUserId: text('owner_user_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const emailThreads = sqliteTable('email_threads', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => emailAccounts.id)
    .notNull(),
  subject: text('subject').notNull(),
  participants: text('participants', { mode: 'json' }), // array of emails
  messageCount: integer('message_count').default(1),
  status: text('status').default('active'),
  lastMessageDate: integer('last_message_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const emailLabels = sqliteTable('email_labels', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => emailAccounts.id)
    .notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const emails = sqliteTable(
  'emails',
  {
    id: text('id').primaryKey(), // UUID v4 ou ID do Resend
    accountId: text('account_id').references(() => emailAccounts.id),
    threadId: text('thread_id').references(() => emailThreads.id),
    direction: text('direction', { enum: ['inbound', 'outbound'] })
      .notNull()
      .default('outbound'),
    sender: text('sender').notNull(),
    recipient: text('recipient').notNull(),
    cc: text('cc'),
    bcc: text('bcc'),
    subject: text('subject').notNull(),
    bodyHtml: text('body_html'),
    bodyText: text('body_text'),
    status: text('status', {
      enum: [
        'sent',
        'failed',
        'unread',
        'read',
        'draft',
        'queued',
        'processing',
        'sending',
        'bounced',
        'delivered',
      ],
    })
      .notNull()
      .default('sent'),
    priority: text('priority', { enum: ['low', 'normal', 'high', 'urgent', 'critical'] }).default(
      'normal'
    ),
    messageId: text('message_id').unique(), // Resend Message ID ou Inbound Message-ID
    inReplyTo: text('in_reply_to'), // RFC 5322 In-Reply-To
    references: text('references', { mode: 'json' }).$type<string[]>(), // RFC 5322 References
    provider: text('provider').default('cloudflare'),
    deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
    receivedAt: integer('received_at', { mode: 'timestamp' }),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
    openedAt: integer('opened_at', { mode: 'timestamp' }),
    bouncedAt: integer('bounced_at', { mode: 'timestamp' }),
    errorMessage: text('error_message'),
    providerPayload: text('provider_payload', { mode: 'json' }),
    authMetadata: text('auth_metadata', { mode: 'json' }).$type<Record<string, any>>(), // DKIM, SPF, DMARC, ARC
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    accountIdIdx: index('idx_emails_account_id').on(table.accountId),
    threadIdIdx: index('idx_emails_thread_id').on(table.threadId),
    createdAtIdx: index('idx_emails_created_at').on(table.createdAt),
    messageIdIdx: index('idx_emails_message_id').on(table.messageId),
  })
);

export const emailMessageLabels = sqliteTable(
  'email_message_labels',
  {
    messageId: text('message_id')
      .references(() => emails.id)
      .notNull(),
    labelId: text('label_id')
      .references(() => emailLabels.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.labelId] }),
  })
);

export const emailAttachments = sqliteTable('email_attachments', {
  id: text('id').primaryKey(),
  emailId: text('email_id')
    .references(() => emails.id)
    .notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  r2Key: text('r2_key').notNull(),
  publicUrl: text('public_url'),
  contentDisposition: text('content_disposition'),
  inline: integer('inline', { mode: 'boolean' }).default(false),
  cid: text('cid'),
  sha256: text('sha256'),
  virusStatus: text('virus_status', { enum: ['pending', 'clean', 'infected'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const emailEvents = sqliteTable('email_events', {
  id: text('id').primaryKey(),
  emailId: text('email_id').references(() => emails.id),
  messageId: text('message_id'),
  event: text('event').notNull(),
  source: text('source').notNull(),
  provider: text('provider').default('cloudflare'),
  severity: text('severity', { enum: ['info', 'warning', 'error', 'critical'] }).default('info'),
  requestId: text('request_id'),
  correlationId: text('correlation_id'),
  queueMessageId: text('queue_message_id'),
  traceId: text('trace_id'),
  spanId: text('span_id'),
  workerVersion: text('worker_version'),
  durationMs: integer('duration_ms'),
  metadata: text('metadata', { mode: 'json' }).$type<EmailEventMetadata>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// === 14. CHAT (MENSAGERIA INSTANTÂNEA) ===

export const chatConversations = sqliteTable('chat_conversations', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['single', 'group'] }).notNull(),
  category: text('category', { enum: ['ai', 'ticket', 'p2p', 'dao', 'system'] }).notNull(),
  title: text('title'),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const chatParticipants = sqliteTable(
  'chat_participants',
  {
    conversationId: text('conversation_id')
      .references(() => chatConversations.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    role: text('role').default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    lastReadMessageId: text('last_read_message_id'),
    lastReadAt: integer('last_read_at', { mode: 'timestamp' }),
    muted: integer('muted', { mode: 'boolean' }).default(false),
    archived: integer('archived', { mode: 'boolean' }).default(false),
    pinned: integer('pinned', { mode: 'boolean' }).default(false),
    presence: text('presence', { enum: ['online', 'away', 'offline'] }).default('offline'),
    lastSeen: integer('last_seen', { mode: 'timestamp' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.conversationId, t.userId] }),
    convoIdx: index('idx_chat_participants_convo').on(t.conversationId),
    userIdx: index('idx_chat_participants_user').on(t.userId),
  })
);

export const chatMessages = sqliteTable(
  'chat_messages',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .references(() => chatConversations.id)
      .notNull(),
    senderId: integer('sender_id').references(() => users.id), // Nullable for system messages
    type: text('type').default('text'),
    body: text('body').notNull(),
    status: text('status').default('sent'), // sent, delivered, read, edited, deleted
    replyTo: text('reply_to'), // Self-referencing chatMessages.id handled at app level to avoid circular deps
    metadata: text('metadata', { mode: 'json' }),
    version: integer('version').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    editedAt: integer('edited_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  (t) => ({
    convoIdx: index('idx_chat_messages_convo').on(t.conversationId),
    createdAtIdx: index('idx_chat_messages_created_at').on(t.createdAt),
  })
);

export const chatAttachments = sqliteTable('chat_attachments', {
  id: text('id').primaryKey(),
  messageId: text('message_id')
    .references(() => chatMessages.id)
    .notNull(),
  r2Key: text('r2_key').notNull(),
  mime: text('mime'),
  size: integer('size'),
  width: integer('width'),
  height: integer('height'),
  duration: integer('duration'), // Para áudios/vídeos
});

export const chatReadReceipts = sqliteTable(
  'chat_read_receipts',
  {
    messageId: text('message_id')
      .references(() => chatMessages.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.userId] }),
  })
);

export const chatEvents = sqliteTable('chat_events', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .references(() => chatConversations.id)
    .notNull(),
  event: text('event').notNull(),
  userId: integer('user_id').references(() => users.id), // Quem disparou o evento
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
