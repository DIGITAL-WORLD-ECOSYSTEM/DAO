export const RegisterSsiMetadata = {
  endpoint: '/api/v1/identity/register-ssi',
  method: 'POST',
  tags: ['Identity', 'SSI'],
  summary: 'Registra um novo cidadão via Identidade Auto-Soberana',
  description: 'Endpoint responsável por receber a chave pública e assinatura inicial do usuário para criar sua conta descentralizada.',
  permissions: ['public'],
  rateLimit: {
    points: 5,
    duration: 60, // 5 requests por minuto
  },
  deprecated: false,
};
