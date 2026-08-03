import { z } from 'zod';
import type { PasskeyLoginRequest } from './Request';
import { usernameSchema, signatureSchema, challengeSchema } from '../ssi-common';

export const Schema: z.ZodType<PasskeyLoginRequest> = z.object({
  username: usernameSchema,
  challenge: challengeSchema,
  signature: signatureSchema,
});
