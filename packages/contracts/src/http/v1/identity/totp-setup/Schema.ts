import { z } from 'zod';
import type { TotpSetupRequest } from './Request';
import { usernameSchema } from '../ssi-common';

export const Schema: z.ZodType<TotpSetupRequest> = z.object({
  username: usernameSchema,
});
