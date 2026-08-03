import { z } from 'zod';
import type { KycSubmitRequest } from './Request';

export const Schema: z.ZodType<KycSubmitRequest> = z.object({
  userId: z.number().int().positive('userId deve ser um número inteiro positivo'),
  documentType: z.enum(['RG', 'CPF', 'CNH', 'PASSAPORTE', 'OUTROS'], {
    message: 'Tipo de documento inválido',
  }),
});
