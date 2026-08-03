import { z } from 'zod';
import type { PasskeyBindRequest } from './Request';
import { usernameSchema, publicKeySchema, signatureSchema, challengeSchema } from '../ssi-common';

export const Schema: z.ZodType<PasskeyBindRequest> = z.object({
  username: usernameSchema,
  credentialId: z.string().min(1, 'Credential ID é obrigatório'),
  publicKey: publicKeySchema,
  challenge: challengeSchema,
  signature: signatureSchema,
});
