import { z } from 'zod';
import type { LoginRequest } from './Request';

export const Schema: z.ZodType<LoginRequest> = z.object({
  email: z.string().email('Digite um email válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});
