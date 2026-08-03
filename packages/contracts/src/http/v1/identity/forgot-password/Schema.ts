import { z } from 'zod';
import type { ForgotPasswordRequest } from './Request';

export const Schema: z.ZodType<ForgotPasswordRequest> = z.object({
  email: z.string().email('Digite um email válido'),
});
