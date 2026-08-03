import { z } from 'zod';
import type { RevokeRequest } from './Request';
import { usernameSchema } from '../ssi-common';

export const Schema: z.ZodType<RevokeRequest> = z.object({
  username: usernameSchema,
});
