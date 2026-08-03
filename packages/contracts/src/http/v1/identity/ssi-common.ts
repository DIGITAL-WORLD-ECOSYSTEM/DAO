import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(3, 'Username deve ter pelo menos 3 caracteres')
  .max(32, 'Username deve ter no máximo 32 caracteres')
  .regex(/^[a-z0-9_]+$/, 'Username deve conter apenas letras minúsculas, números e _');

export const challengeSchema = z.string().uuid('Challenge deve ser um UUID válido');

export const signatureSchema = z.string().min(1, 'Assinatura é obrigatória');

export const publicKeySchema = z.string().min(1, 'Chave pública é obrigatória');
