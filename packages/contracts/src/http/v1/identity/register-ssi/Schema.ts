import { z } from 'zod';
import type { RegisterSsiRequest } from './Request';
import {
  usernameSchema,
  publicKeySchema,
  signatureSchema,
  challengeSchema,
} from '../ssi-common';

export const Schema: z.ZodType<RegisterSsiRequest> = z.object({
  username: usernameSchema,
  publicKey: publicKeySchema,
  signature: signatureSchema,
  challenge: challengeSchema,
  firstName: z.string().min(1, 'Nome é obrigatório').max(64),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').max(64),
  encryptedVault: z.string().optional(),
});
