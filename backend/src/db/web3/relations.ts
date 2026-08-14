import { relations, AnyColumn, RelationConfig } from 'drizzle-orm';
import { wallets } from './tables';
import { users } from '../user/tables';
import { walletAuthenticators } from '../authentication/tables';




export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
    relationName: 'walletOwner',
  }),
  verifiedByUser: one(users, {
    fields: [wallets.verifiedBy],
    references: [users.id],
    relationName: 'walletVerifier',
  }),
  authenticator: one(walletAuthenticators, {
    fields: [wallets.id],
    references: [walletAuthenticators.walletId],
    relationName: 'walletAuthenticator',
  }),
}));

