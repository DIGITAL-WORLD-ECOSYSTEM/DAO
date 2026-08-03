import { z } from 'zod';
import type { TotpVerifyRequest } from './Request';
import { usernameSchema } from '../ssi-common';

export const Schema: z.ZodType<TotpVerifyRequest> = z.object({
  username: usernameSchema,
  code: z.string().length(6, 'Código TOTP deve ter 6 dígitos'),
});
