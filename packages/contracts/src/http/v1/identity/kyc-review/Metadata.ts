export const KycReviewMetadata = {
  endpoint: '/api/v1/compliance/kyc/review',
  method: 'POST',
  tags: ['Compliance', 'KYC', 'Admin'],
  summary: 'Revisão de KYC (Admin)',
  description: 'Aprova ou rejeita a verificação de identidade submetida.',
  permissions: ['admin'],
  rateLimit: { points: 20, duration: 60 },
  deprecated: false,
};
