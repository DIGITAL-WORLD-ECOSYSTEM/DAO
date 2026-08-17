import { relations } from 'drizzle-orm';
import {
  secureVaults,
  didIdentities,
  didVerificationMethods,
  verifiableCredentials,
  verifiablePresentations,
} from './tables';
import { users } from '../user/tables';

/**
 * ============================================================================
 * SECURE VAULTS RELATIONS
 * ============================================================================
 */
export const secureVaultsRelations = relations(secureVaults, ({ one }) => ({
  user: one(users, {
    fields: [secureVaults.userId],
    references: [users.id],
    relationName: 'userSecureVaults',
  }),
}));

/**
 * ============================================================================
 * DID IDENTITIES RELATIONS
 * ============================================================================
 */
export const didIdentitiesRelations = relations(didIdentities, ({ one, many }) => ({
  user: one(users, {
    fields: [didIdentities.userId],
    references: [users.id],
    relationName: 'userDidIdentities',
  }),
  verificationMethods: many(didVerificationMethods),
}));

/**
 * ============================================================================
 * DID VERIFICATION METHODS RELATIONS
 * ============================================================================
 */
export const didVerificationMethodsRelations = relations(
  didVerificationMethods,
  ({ one }) => ({
    didIdentity: one(didIdentities, {
      fields: [didVerificationMethods.didId],
      references: [didIdentities.id],
    }),
  }),
);

/**
 * ============================================================================
 * VERIFIABLE CREDENTIALS RELATIONS
 * ============================================================================
 */
export const verifiableCredentialsRelations = relations(
  verifiableCredentials,
  ({ one }) => ({
    holderUser: one(users, {
      fields: [verifiableCredentials.holderUserId],
      references: [users.id],
      relationName: 'userVerifiableCredentials',
    }),
  }),
);

/**
 * ============================================================================
 * VERIFIABLE PRESENTATIONS RELATIONS
 * ============================================================================
 */
export const verifiablePresentationsRelations = relations(
  verifiablePresentations,
  ({ one }) => ({
    user: one(users, {
      fields: [verifiablePresentations.userId],
      references: [users.id],
      relationName: 'userVerifiablePresentations',
    }),
  }),
);
