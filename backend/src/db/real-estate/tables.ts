import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   RWA subsystem
//   USER / ACTOR
//   WEB3 IDENTITY, ORGANIZATIONS
//   N/A

// ----------------------------------------------------------------------
// Entity: reProperties
// ----------------------------------------------------------------------
export const reProperties = sqliteTable(
  're_properties',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    uuid: text('uuid').notNull().unique(), // UUID v4 gerado na criação
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),

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



// ----------------------------------------------------------------------
// Entity: rePropertyLocation
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: reSurveyPoints
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyLand
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyConstruction
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyInfrastructure
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyPricing
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyOwners
// ----------------------------------------------------------------------
export const rePropertyOwners = sqliteTable('re_property_owners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),

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



// ----------------------------------------------------------------------
// Entity: rePropertyProfessionals
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyDocuments
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyMedia
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyBlockchain
// ----------------------------------------------------------------------
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



// ----------------------------------------------------------------------
// Entity: rePropertyWorkflow
// ----------------------------------------------------------------------
export const rePropertyWorkflow = sqliteTable(
  're_property_workflow',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),
    actorUserId: integer('actor_user_id').references(() => users.id, {
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



// ----------------------------------------------------------------------
// Entity: rePropertyAuditLog
// ----------------------------------------------------------------------
export const rePropertyAuditLog = sqliteTable(
  're_property_audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),
    actorUserId: integer('actor_user_id').references(() => users.id, {
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

