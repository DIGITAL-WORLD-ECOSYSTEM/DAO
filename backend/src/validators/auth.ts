/**
 * Copyright 2025 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Zod Validation Schemas — SSI + KYC + Legacy Auth
 */
import { z } from 'zod';

// =================================================================
// SCHEMAS LEGADOS (email/password — mantidos para compatibilidade)
// =================================================================

export const signUpSchema = z.object({
	firstName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
	lastName: z.string().min(2, 'O sobrenome deve ter pelo menos 2 caracteres'),
	email: z.string().email('Formato de email inválido'),
	password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
	walletAddress: z.string().startsWith('0x', 'Endereço de carteira inválido').optional(),
});

export const legacyLoginSchema = z.object({
	email: z.string().email('Digite um email válido'),
	password: z.string().min(1, 'A senha é obrigatória'),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email('Digite um email válido'),
});

export const resetPasswordSchema = z.object({
	token: z.string().min(1, 'Token de recuperação é obrigatório'),
	password: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
});

// =================================================================
// SCHEMAS SSI — Self-Sovereign Identity (CMP-01)
// =================================================================

/** Username: apenas letras minúsculas, números e underscore, 3–32 chars */
const usernameSchema = z
	.string()
	.min(3, 'Username deve ter pelo menos 3 caracteres')
	.max(32, 'Username deve ter no máximo 32 caracteres')
	.regex(/^[a-z0-9_]+$/, 'Username deve conter apenas letras minúsculas, números e _');

/** Challenge UUID gerado pelo endpoint /challenge */
const challengeSchema = z.string().uuid('Challenge deve ser um UUID válido');

/** Assinatura Ed25519 serializada como JSON array ou Base64 */
const signatureSchema = z.string().min(1, 'Assinatura é obrigatória');

/** Chave pública Ed25519 serializada como JSON array */
const publicKeySchema = z.string().min(1, 'Chave pública é obrigatória');

// --- 1. Registro de Cidadão ---
export const ssiRegisterSchema = z.object({
	username: usernameSchema,
	publicKey: publicKeySchema,
	signature: signatureSchema,
	challenge: challengeSchema,
	firstName: z.string().min(1, 'Nome é obrigatório').max(64),
	lastName: z.string().min(1, 'Sobrenome é obrigatório').max(64),
	encryptedVault: z.string().optional(),
});

// --- 2. Login (Handshake ZK) ---
export const ssiLoginSchema = z.object({
	username: usernameSchema,
	signature: signatureSchema,
	challenge: challengeSchema,
	otpCode: z.string().length(6, 'Código OTP deve ter 6 dígitos').optional(),
});

// --- 3. Bind Passkey ---
export const passkeyBindSchema = z.object({
	username: usernameSchema,
	credentialId: z.string().min(1, 'Credential ID é obrigatório'),
	publicKey: publicKeySchema,
	challenge: challengeSchema,
	signature: signatureSchema,
});

// --- 3.1. Login Passkey ---
export const passkeyLoginSchema = z.object({
	username: usernameSchema,
	challenge: challengeSchema,
	signature: signatureSchema,
});

// --- 4. Setup TOTP ---
export const totpSetupSchema = z.object({
	username: usernameSchema,
});

// --- 5. Verify TOTP ---
export const totpVerifySchema = z.object({
	username: usernameSchema,
	code: z.string().length(6, 'Código TOTP deve ter 6 dígitos'),
});

// --- 6. Revogação de Identidade ---
export const revokeSchema = z.object({
	username: usernameSchema,
});

// =================================================================
// SCHEMAS KYC — Compliance (CMP-01 / CMP-02)
// =================================================================

export const kycSubmitSchema = z.object({
	userId: z.number().int().positive('userId deve ser um número inteiro positivo'),
	documentType: z.enum(['RG', 'CPF', 'CNH', 'PASSAPORTE', 'OUTROS'], { message: 'Tipo de documento inválido' }),
});

export const kycReviewSchema = z.object({
	userId: z.number().int().positive('userId deve ser um número inteiro positivo'),
	status: z.enum(['approved', 'rejected', 'pending'], { message: 'Status inválido' }),
	reason: z.string().max(500).optional(),
});

// =================================================================
// TIPOS INFERIDOS
// =================================================================

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LegacyLoginInput = z.infer<typeof legacyLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SsiRegisterInput = z.infer<typeof ssiRegisterSchema>;
export type SsiLoginInput = z.infer<typeof ssiLoginSchema>;
export type PasskeyBindInput = z.infer<typeof passkeyBindSchema>;
export type PasskeyLoginInput = z.infer<typeof passkeyLoginSchema>;
export type TotpSetupInput = z.infer<typeof totpSetupSchema>;
export type TotpVerifyInput = z.infer<typeof totpVerifySchema>;
export type RevokeInput = z.infer<typeof revokeSchema>;
export type KycSubmitInput = z.infer<typeof kycSubmitSchema>;
export type KycReviewInput = z.infer<typeof kycReviewSchema>;
