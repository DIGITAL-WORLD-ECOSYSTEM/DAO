export const PasskeyLoginMetadata = {
  endpoint: '/api/v1/identity/passkey/login',
  method: 'POST',
  tags: ['Identity', 'Passkeys'],
  summary: 'Autenticação via Passkey',
  description: 'Gera uma sessão de nível AAL2 utilizando biometria / WebAuthn.',
  permissions: ['public'],
  rateLimit: { points: 10, duration: 60 },
  deprecated: false,
};
