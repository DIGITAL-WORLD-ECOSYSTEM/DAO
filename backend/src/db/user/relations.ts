import { relations } from 'drizzle-orm';

import {
  userAddresses,
  userContacts,
  userEducation,
  userNotificationSettings,
  userProfessionalExperience,
  userProfiles,
  users,
  membershipCards,
} from './tables';

import {
  citizens,
  identityDocuments,
  kycVerifications,
} from '../civil-identity/tables';

import {
  userAuthenticators,
  userSessions,
  passwordResets,
  authChallenges,
} from '../authentication/tables';

import { userConsents } from '../compliance/tables';

import {
  roles,
  userRoles,
} from '../authorization/tables';

import { wallets } from '../web3/tables';

import {
  didIdentities,
  secureVaults,
} from '../ssi/tables';

import {
  mandates,
  organizationMemberships,
  organizations,
} from '../organizations/tables';

import {
  userSocialLinks,
  posts,
  postComments,
  postFavorites,
} from '../social/tables';

import {
  notifications,
  chatConversations,
  chatParticipants,
  chatMessages,
  chatReadReceipts,
  chatEvents,
} from '../communication/tables';

import { securityEvents } from '../security/tables';

/**
 * ============================================================================
 * USER / ACTOR — RELATIONSHIP MODEL
 * ============================================================================
 *
 * `users` is the relational root for the platform account.
 *
 * IMPORTANT:
 * This file defines database navigation relationships.
 * It does NOT transfer domain ownership to the USER module.
 *
 * USER remains responsible for:
 * - internal account identity;
 * - primary account email;
 * - user-owned profile data;
 * - user-owned contacts;
 * - user-owned personal addresses;
 * - user-owned professional history;
 * - user-owned education history;
 * - user-owned notification preferences.
 *
 * USER does NOT own:
 * - authentication credentials;
 * - sessions;
 * - KYC;
 * - civil identity;
 * - RBAC;
 * - wallets;
 * - SSI/DID;
 * - compliance;
 * - organizations;
 * - communication delivery;
 * - security/audit history.
 *
 * Cross-domain relations below are navigation links only.
 */

/**
 * ============================================================================
 * ROOT USER RELATIONS
 * ============================================================================
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  // --------------------------------------------------------------------------
  // CIVIL IDENTITY
  // --------------------------------------------------------------------------

  /**
   * Canonical citizen relation.
   *
   * The FK must be defined by citizens.userId -> users.id.
   */
  citizen: one(citizens, {
    fields: [users.id],
    references: [citizens.userId],
    relationName: 'citizenOwner',
  }),

  /**
   * Secondary/derived citizen verification relationship.
   *
   * Requires the reverse relation on the civil-identity table to use the
   * exact same relationName.
   */
  verifiedCitizens: many(citizens, {
    relationName: 'verifiedCitizens',
  }),

  // --------------------------------------------------------------------------
  // USER-OWNED PROFILE
  // --------------------------------------------------------------------------

  /**
   * One-to-one user profile.
   *
   * userProfiles.userId is the PK/FK to users.id.
   */
  profile: one(userProfiles),

  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------

  authenticators: many(userAuthenticators, {
    relationName: 'authenticatorOwner',
  }),

  revokedAuthenticators: many(userAuthenticators, {
    relationName: 'revokedAuthenticators',
  }),

  sessions: many(userSessions),

  passwordResets: many(passwordResets),

  authChallenges: many(authChallenges),

  // --------------------------------------------------------------------------
  // COMPLIANCE
  // --------------------------------------------------------------------------

  consents: many(userConsents),

  // --------------------------------------------------------------------------
  // AUTHORIZATION / RBAC
  // --------------------------------------------------------------------------

  roles: many(userRoles, {
    relationName: 'roleOwner',
  }),

  grantedRoles: many(userRoles, {
    relationName: 'grantedRoles',
  }),

  revokedRoles: many(userRoles, {
    relationName: 'revokedRoles',
  }),

  // --------------------------------------------------------------------------
  // WEB3 / WALLET
  // --------------------------------------------------------------------------

  wallets: many(wallets, {
    relationName: 'walletOwner',
  }),

  verifiedWallets: many(wallets, {
    relationName: 'walletVerifier',
  }),

  // --------------------------------------------------------------------------
  // KYC / IDENTITY DOCUMENTS
  // --------------------------------------------------------------------------

  identityDocuments: many(identityDocuments, {
    relationName: 'userIdentityDocuments',
  }),

  verifiedDocuments: many(identityDocuments, {
    relationName: 'verifiedIdentityDocuments',
  }),

  kycVerifications: many(kycVerifications, {
    relationName: 'kycSubject',
  }),

  reviewedKycs: many(kycVerifications, {
    relationName: 'reviewedKycs',
  }),

  // --------------------------------------------------------------------------
  // SSI / DID
  // --------------------------------------------------------------------------

  secureVaults: many(secureVaults),

  didIdentities: many(didIdentities),

  // --------------------------------------------------------------------------
  // USER-OWNED PROFILE DATA
  // --------------------------------------------------------------------------

  addresses: many(userAddresses),

  contacts: many(userContacts),

  professionalExperience: many(userProfessionalExperience),

  education: many(userEducation),

  membershipCards: many(membershipCards),

  // --------------------------------------------------------------------------
  // ORGANIZATIONS
  // --------------------------------------------------------------------------

  organizationMemberships: many(organizationMemberships, {
    relationName: 'membershipOwner',
  }),

  appointedMemberships: many(organizationMemberships, {
    relationName: 'appointedMembers',
  }),

  mandates: many(mandates),

  // --------------------------------------------------------------------------
  // SOCIAL / COMMUNICATION
  // --------------------------------------------------------------------------

  socialLinks: many(userSocialLinks),

  authoredPosts: many(posts, {
    relationName: 'postAuthor',
  }),

  postComments: many(postComments),

  postFavorites: many(postFavorites),

  notificationSettings: many(userNotificationSettings),

  notifications: many(notifications),

  ownedChats: many(chatConversations, {
    relationName: 'chatOwner',
  }),

  chatParticipations: many(chatParticipants),

  sentChatMessages: many(chatMessages, {
    relationName: 'messageSender',
  }),

  chatReadReceipts: many(chatReadReceipts),

  chatEvents: many(chatEvents),

  // --------------------------------------------------------------------------
  // SECURITY / AUDIT
  // --------------------------------------------------------------------------

  securityEvents: many(securityEvents, {
    relationName: 'userSecurityEvents',
  }),
}));

/**
 * ============================================================================
 * USER PROFILE
 * ============================================================================
 *
 * 1:1
 * userProfiles.userId -> users.id
 */
export const userProfilesRelations = relations(
  userProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [userProfiles.userId],
      references: [users.id],
    }),
  }),
);

/**
 * ============================================================================
 * USER CONTACTS
 * ============================================================================
 *
 * N:1
 * userContacts.userId -> users.id
 *
 * The physical schema guarantees at most one primary contact per user,
 * independently of contact type.
 */
export const userContactsRelations = relations(
  userContacts,
  ({ one }) => ({
    user: one(users, {
      fields: [userContacts.userId],
      references: [users.id],
    }),
  }),
);

/**
 * ============================================================================
 * USER ADDRESSES
 * ============================================================================
 *
 * N:1
 * userAddresses.userId -> users.id
 *
 * The physical schema guarantees at most one primary address per user
 * per address type.
 */
export const userAddressesRelations = relations(
  userAddresses,
  ({ one }) => ({
    user: one(users, {
      fields: [userAddresses.userId],
      references: [users.id],
    }),
  }),
);

/**
 * ============================================================================
 * USER PROFESSIONAL EXPERIENCE
 * ============================================================================
 *
 * N:1 user -> professional experience
 * N:1 optional organization link
 */
export const userProfessionalExperienceRelations = relations(
  userProfessionalExperience,
  ({ one }) => ({
    user: one(users, {
      fields: [userProfessionalExperience.userId],
      references: [users.id],
    }),

    organization: one(organizations, {
      fields: [userProfessionalExperience.organizationId],
      references: [organizations.id],
    }),
  }),
);

/**
 * ============================================================================
 * USER EDUCATION
 * ============================================================================
 *
 * N:1 user -> education
 * N:1 optional organization link
 */
export const userEducationRelations = relations(
  userEducation,
  ({ one }) => ({
    user: one(users, {
      fields: [userEducation.userId],
      references: [users.id],
    }),

    organization: one(organizations, {
      fields: [userEducation.organizationId],
      references: [organizations.id],
    }),
  }),
);
