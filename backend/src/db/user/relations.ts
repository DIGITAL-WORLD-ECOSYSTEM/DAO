import { relations, AnyColumn, RelationConfig } from 'drizzle-orm';
import { users, userProfiles, userAddresses, userContacts, userProfessionalExperience, userEducation, userNotificationSettings } from './tables';
import { citizens, identityDocuments, kycVerifications } from '../civil-identity/tables';
import { userAuthenticators, userSessions } from '../authentication/tables';
import { userConsents } from '../compliance/tables';
import { roles, userRoles } from '../authorization/tables';
import { wallets } from '../web3/tables';
import { secureVaults, didIdentities } from '../ssi/tables';
import { organizationMemberships, mandates, organizations } from '../organizations/tables';
import { userSocialLinks } from '../social/tables';
import { notifications } from '../communication/tables';
import { securityEvents } from '../security/tables';




export const usersRelations = relations(users, ({ one, many }) => ({
  citizen: one(citizens, {
    fields: [users.id],
    references: [citizens.userId],
    relationName: 'citizenOwner',
  }),
  verifiedCitizens: many(citizens, { relationName: 'verifiedCitizens' }),
  profile: one(userProfiles),

  authenticators: many(userAuthenticators, { relationName: 'authenticatorOwner' }),
  revokedAuthenticators: many(userAuthenticators, { relationName: 'revokedAuthenticators' }),
  sessions: many(userSessions),
  consents: many(userConsents),
  
  roles: many(userRoles, { relationName: 'roleOwner' }),
  grantedRoles: many(userRoles, { relationName: 'grantedRoles' }),
  revokedRoles: many(userRoles, { relationName: 'revokedRoles' }),

  wallets: many(wallets, { relationName: 'walletOwner' }),
  verifiedWallets: many(wallets, { relationName: 'walletVerifier' }),

  identityDocuments: many(identityDocuments, { relationName: 'userIdentityDocuments' }),
  verifiedDocuments: many(identityDocuments, { relationName: 'verifiedIdentityDocuments' }),
  
  kycVerifications: many(kycVerifications, { relationName: 'kycSubject' }),
  reviewedKycs: many(kycVerifications, { relationName: 'reviewedKycs' }),

  secureVaults: many(secureVaults),
  didIdentities: many(didIdentities),

  addresses: many(userAddresses),
  contacts: many(userContacts),

  organizationMemberships: many(organizationMemberships, { relationName: 'membershipOwner' }),
  appointedMemberships: many(organizationMemberships, { relationName: 'appointedMembers' }),
  mandates: many(mandates),

  professionalExperience: many(userProfessionalExperience),
  education: many(userEducation),

  socialLinks: many(userSocialLinks),
  notificationSettings: many(userNotificationSettings),
  notifications: many(notifications),
  securityEvents: many(securityEvents, { relationName: 'userSecurityEvents' }),
}));



export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));



export const userContactsRelations = relations(userContacts, ({ one }) => ({
  user: one(users, { fields: [userContacts.userId], references: [users.id] }),
}));



export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, { fields: [userAddresses.userId], references: [users.id] }),
}));



export const userProfessionalExperienceRelations = relations(userProfessionalExperience, ({ one }) => ({
  user: one(users, { fields: [userProfessionalExperience.userId], references: [users.id] }),
  organization: one(organizations, { fields: [userProfessionalExperience.organizationId], references: [organizations.id] }),
}));



export const userEducationRelations = relations(userEducation, ({ one }) => ({
  user: one(users, { fields: [userEducation.userId], references: [users.id] }),
  organization: one(organizations, { fields: [userEducation.organizationId], references: [organizations.id] }),
}));

