import { z } from 'zod';
import type { ResetPasswordRequest } from './Request';

export const Schema: z.ZodType<ResetPasswordRequest> = z.object({
  token: z.string().min(1, 'Token de recuperação é obrigatório'),
  password: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
});
