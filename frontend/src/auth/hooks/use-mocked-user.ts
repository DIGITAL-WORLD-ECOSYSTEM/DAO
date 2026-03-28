import { useAuthContext } from './use-auth-context';

// ----------------------------------------------------------------------

/**
 * ATENÇÃO: Este hook foi convertido para retornar o usuário REAL da sessão.
 * Ele mantém o nome 'useMockedUser' apenas para evitar quebras em componentes 
 * antigos do template, mas os dados agora vêm do AuthContext (Cloudflare D1).
 */
export function useMockedUser() {
  const { user } = useAuthContext();

  // Retornamos o usuário real. Se não houver ninguém logado, será null.
  return { user };
}