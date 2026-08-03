import { z } from 'zod';
import type { LoginSsiRequest } from './Request';
import { usernameSchema, signatureSchema, challengeSchema } from '../ssi-common';

export const Schema: z.ZodType<LoginSsiRequest> = z.object({
  username: usernameSchema,
  signature: signatureSchema,
  challenge: challengeSchema,
  otpCode: z.string().length(6, 'Código OTP deve ter 6 dígitos').optional(),
});
