// ----------------------------------------------------------------------

const TECHNICAL_PATTERNS = [
  'Failed query', 'SQL', 'SQLite', 'params:', 'Drizzle',
  'BEGIN', 'ROLLBACK', 'COMMIT', 'Exception', 'TypeError',
  'InternalError', 'stack', 'undefined', 'null', 'constraint', 'D1_ERROR',
];

const ERROR_MAP: Record<string, string> = {
  EmailAlreadyExists: 'Este e-mail já possui uma conta. Tente fazer login.',
  InvalidPassword: 'E-mail ou senha inválidos.',
  AccountNotFound: 'E-mail ou senha inválidos.',
  TokenExpired: 'O link expirou. Solicite um novo.',
  TokenInvalid: 'Link inválido. Solicite um novo.',
  TooManyRequests: 'Muitas tentativas. Aguarde alguns minutos.',
  SessionExpired: 'Sua sessão expirou. Faça login novamente.',
};

export function getErrorMessage(error: unknown): string {
  let raw = 'Ocorreu um erro inesperado.';

  if (error instanceof Error) {
    raw = error.message || error.name;
  } else if (typeof error === 'string') {
    raw = error;
  } else if (typeof error === 'object' && error !== null) {
    const errObj = error as any;
    raw = errObj.message || errObj.error || errObj.name || String(error);
  }

  // Mapear erros conhecidos
  if (ERROR_MAP[raw]) return ERROR_MAP[raw];

  // Bloquear qualquer mensagem técnica
  const isTechnical = TECHNICAL_PATTERNS.some(p =>
    raw.toLowerCase().includes(p.toLowerCase())
  );
  if (isTechnical) return 'Ocorreu um erro interno. Tente novamente.';

  return raw;
}
