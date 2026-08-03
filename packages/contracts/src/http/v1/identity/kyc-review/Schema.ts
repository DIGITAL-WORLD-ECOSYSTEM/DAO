import { z } from 'zod';
import type { KycReviewRequest } from './Request';

export const Schema: z.ZodType<KycReviewRequest> = z.object({
  userId: z.number().int().positive('userId deve ser um número inteiro positivo'),
  status: z.enum(['approved', 'rejected', 'pending'], { message: 'Status inválido' }),
  reason: z.string().max(500).optional(),
});
