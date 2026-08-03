export const PasskeyBindMetadata = {
  endpoint: '/api/v1/identity/passkey/bind',
  method: 'POST',
  tags: ['Identity', 'Passkeys'],
  summary: 'Vincular nova Passkey ao usuário',
  description: 'Vincula uma credential biométrica (WebAuthn) provando controle da chave privada SSI.',
  permissions: ['public'],
  rateLimit: { points: 5, duration: 60 },
  deprecated: false,
};
