import { relations, AnyColumn, RelationConfig } from 'drizzle-orm';
import { citizens, identityDocuments, kycVerifications } from './tables';
import { users } from '../user/tables';




export const citizensRelations = relations(citizens, ({ one }) => ({
  user: one(users, { fields: [citizens.userId], references: [users.id], relationName: 'citizenOwner' }),
  verifiedByUser: one(users, { fields: [citizens.verifiedBy], references: [users.id], relationName: 'verifiedCitizens' }),
}));



export const identityDocumentsRelations = relations(identityDocuments, ({ one }) => ({
  user: one(users, { fields: [identityDocuments.userId], references: [users.id], relationName: 'userIdentityDocuments' }),
  verifiedByUser: one(users, { fields: [identityDocuments.verifiedBy], references: [users.id], relationName: 'verifiedIdentityDocuments' }),
}));



export const kycVerificationsRelations = relations(kycVerifications, ({ one }) => ({
  user: one(users, { fields: [kycVerifications.userId], references: [users.id], relationName: 'kycSubject' }),
  reviewedByUser: one(users, { fields: [kycVerifications.reviewedBy], references: [users.id], relationName: 'reviewedKycs' }),
}));

