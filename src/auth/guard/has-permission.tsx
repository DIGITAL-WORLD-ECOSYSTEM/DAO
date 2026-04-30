'use client';

import { useAuthContext } from 'src/auth/hooks';
import { useTokenGating } from 'src/auth/hooks/use-token-gating';

// ----------------------------------------------------------------------

type Props = {
  roles?: string[];
  contractAddress?: string;
  minBalance?: bigint;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * <HasPermission roles={['admin']} contractAddress="0x..." minBalance={1n}>
 *   <Button>Aprovar Tesouraria (Admin + Dono de SBT)</Button>
 * </HasPermission>
 */
export function HasPermission({
  roles,
  contractAddress,
  minBalance,
  children,
  fallback = null,
}: Props) {
  const { user } = useAuthContext();

  const { hasAccess: hasTokenAccess, isLoading: isTokenLoading } = useTokenGating({
    contractAddress,
    minBalance,
  });

  // 1. Verificação RBAC (Web2)
  const hasRoleAccess = !roles || roles.length === 0 || roles.includes(user?.role || '');

  // 2. Verificação Token-Gating (Web3)
  const isWeb3CheckActive = !!contractAddress;
  const finalHasAccess = isWeb3CheckActive ? hasRoleAccess && hasTokenAccess : hasRoleAccess;

  // Enquanto carrega o estado do contrato, retornamos o fallback para evitar "flickering" de permissão
  if (isWeb3CheckActive && isTokenLoading) {
    return <>{fallback}</>;
  }

  if (!finalHasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
