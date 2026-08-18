import { relations } from 'drizzle-orm';
import { organizations, organizationMemberships, mandates } from './tables';
import { users, userProfessionalExperience, userEducation } from '../user/tables';
import { identityDocuments } from '../civil-identity/tables';

/**
 * ============================================================================
 * ORGANIZATIONS DOMAIN RELATIONS
 * ============================================================================
 * ARCHITECTURAL NOTE:
 * Navigation from users to organizations entities is intentionally one-directional
 * (child → parent only), per Section 05 boundary isolation matrix.
 * Direct queries on organizations tables should be executed with { with: { user: true } }
 * instead of querying bidirectionally from users.
 * ============================================================================
 */

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  mandates: many(mandates),
  professionalExperiences: many(userProfessionalExperience),
  educations: many(userEducation),
}));

export const organizationMembershipsRelations = relations(organizationMemberships, ({ one }) => ({
  user: one(users, {
    fields: [organizationMemberships.userId],
    references: [users.id],
    relationName: 'membershipOwner',
  }),
  organization: one(organizations, {
    fields: [organizationMemberships.organizationId],
    references: [organizations.id],
  }),
  appointedByUser: one(users, {
    fields: [organizationMemberships.appointedBy],
    references: [users.id],
    relationName: 'appointedMembers',
  }),
}));

export const mandatesRelations = relations(mandates, ({ one }) => ({
  user: one(users, { fields: [mandates.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [mandates.organizationId],
    references: [organizations.id],
  }),
  appointmentDocument: one(identityDocuments, {
    fields: [mandates.appointmentDocumentId],
    references: [identityDocuments.id],
  }),
}));
