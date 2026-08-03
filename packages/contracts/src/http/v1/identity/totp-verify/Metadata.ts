export const TotpVerifyMetadata = {
  endpoint: '/api/v1/identity/totp/verify',
  method: 'POST',
  tags: ['Identity', 'MFA'],
  summary: 'Verificar código TOTP',
  description: 'Valida o código de 6 dígitos e ativa o MFA para a conta.',
  permissions: ['public'],
  rateLimit: { points: 10, duration: 60 },
  deprecated: false,
};
