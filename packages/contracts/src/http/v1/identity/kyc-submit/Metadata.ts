export const KycSubmitMetadata = {
  endpoint: '/api/v1/compliance/kyc/submit',
  method: 'POST',
  tags: ['Compliance', 'KYC'],
  summary: 'Submissão de Documentos KYC',
  description: 'Inicia o processo de verificação de identidade do cidadão.',
  permissions: ['citizen'],
  rateLimit: { points: 3, duration: 600 },
  deprecated: false,
};
