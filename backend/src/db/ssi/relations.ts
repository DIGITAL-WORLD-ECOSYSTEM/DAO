import { relations, AnyColumn, RelationConfig } from 'drizzle-orm';
import { secureVaults, didIdentities, didVerificationMethods } from './tables';
import { users } from '../user/tables';




export const secureVaultsRelations = relations(secureVaults, ({ one }) => ({
  user: one(users, { fields: [secureVaults.userId], references: [users.id] }),
}));



export const didIdentitiesRelations = relations(didIdentities, ({ one, many }) => ({
  user: one(users, { fields: [didIdentities.userId], references: [users.id] }),
  verificationMethods: many(didVerificationMethods),
}));



export const didVerificationMethodsRelations = relations(didVerificationMethods, ({ one }) => ({
  didIdentity: one(didIdentities, { fields: [didVerificationMethods.didId], references: [didIdentities.id] }),
}));

