export const RevokeMetadata = {
  endpoint: '/api/v1/identity/revoke',
  method: 'POST',
  tags: ['Identity', 'Lifecycle'],
  summary: 'Revogação de Identidade (Emergência)',
  description: 'Invalida a identidade permanentemente. Requer autenticação Zero-Trust (Assinatura criptográfica forte).',
  permissions: ['public'],
  rateLimit: { points: 2, duration: 600 },
  deprecated: false,
};
