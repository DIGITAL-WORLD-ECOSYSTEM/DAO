import { relations, AnyColumn, RelationConfig } from 'drizzle-orm';
import { organizations, organizationMemberships, mandates } from './tables';
import { users } from '../user/tables';




export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  mandates: many(mandates),
}));



export const organizationMembershipsRelations = relations(organizationMemberships, ({ one }) => ({
  user: one(users, { fields: [organizationMemberships.userId], references: [users.id], relationName: 'membershipOwner' }),
  organization: one(organizations, { fields: [organizationMemberships.organizationId], references: [organizations.id] }),
  appointedByUser: one(users, { fields: [organizationMemberships.appointedBy], references: [users.id], relationName: 'appointedMembers' }),
}));



export const mandatesRelations = relations(mandates, ({ one }) => ({
  user: one(users, { fields: [mandates.userId], references: [users.id] }),
  organization: one(organizations, { fields: [mandates.organizationId], references: [organizations.id] }),
}));

