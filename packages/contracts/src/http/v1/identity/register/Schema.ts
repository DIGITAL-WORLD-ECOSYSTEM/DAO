import { z } from 'zod';
import type { RegisterRequest } from './Request';

export const Schema: z.ZodType<RegisterRequest> = z.object({
  firstName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'O sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  walletAddress: z.string().startsWith('0x', 'Endereço de carteira inválido').optional(),
});
