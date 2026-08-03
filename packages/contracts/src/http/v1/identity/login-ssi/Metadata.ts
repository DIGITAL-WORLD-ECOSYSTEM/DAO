export const LoginSsiMetadata = {
  endpoint: '/api/v1/identity/login-ssi',
  method: 'POST',
  tags: ['Identity', 'SSI'],
  summary: 'Login via Identidade Auto-Soberana (Handshake ZK)',
  description: 'Valida a assinatura Ed25519 sobre o challenge emitido para confirmar a identidade sem trafegar senha.',
  permissions: ['public'],
  rateLimit: {
    points: 10,
    duration: 60,
  },
  deprecated: false,
};
