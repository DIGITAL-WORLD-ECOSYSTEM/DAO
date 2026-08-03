import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.string(),
});

export const CitizenProfileSchema = z.object({
  fullName: z.string().nullable().optional(),
  kycStatus: z.string().nullable().optional(),
});

export const IdentityProfileSchema = z.object({
  user: UserProfileSchema,
  citizen: CitizenProfileSchema.nullable().optional(),
  wallet: z.object({ id: z.string(), address: z.string() }).nullable().optional(),
  membership: z.any().nullable().optional(), // Will detail later
});

export type IdentityProfile = z.infer<typeof IdentityProfileSchema>;


