export const TotpSetupMetadata = {
  endpoint: '/api/v1/identity/totp/setup',
  method: 'POST',
  tags: ['Identity', 'MFA'],
  summary: 'Iniciar configuração do TOTP',
  description: 'Gera o segredo e URI para cadastro no Google Authenticator.',
  permissions: ['public'],
  rateLimit: { points: 5, duration: 60 },
  deprecated: false,
};
