/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Authentication Guard (Route Protection)
 * Version: 1.1.0 - Professional UX & Security Persistence
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/auth/components';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * AuthGuard Component
 * Monitora o estado de autenticação global e intercepta acessos não autorizados.
 * Garante que o usuário seja redirecionado ao Login preservando a rota de origem.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extração do estado reativo do AuthProvider v1.1.0
  const { authenticated, loading } = useAuthContext();

  // Estado local para garantir que a renderização ocorra apenas após a validação do token
  const [isChecking, setIsChecking] = useState(true);

  /**
   * Validação de Permissões
   * Executada sempre que o estado de autenticação ou a rota mudarem.
   */
  const checkPermissions = useCallback((): void => {
    // 1. Se o provedor ainda estiver carregando (ex: validando JWT no D1), aguarde.
    if (loading) {
      return;
    }

    // 2. Interceptação de acesso: Usuário não autenticado
    if (!authenticated) {
      // Criamos um parâmetro de retorno para melhorar a UX (Redirect Back)
      const searchParams = new URLSearchParams({ 
        returnTo: pathname 
      }).toString();
      
      const href = `${paths.auth.signIn}?${searchParams}`;

      // .replace() é usado para remover a página protegida do histórico de navegação
      router.replace(href);
      return;
    }

    // 3. Sucesso: Usuário autenticado e dados carregados
    setIsChecking(false);
  }, [authenticated, loading, pathname, router]);

  /**
   * Ciclo de Vida: Monitoramento Contínuo
   * Garante que se o token expirar ou for removido, o usuário seja ejetado instantaneamente.
   */
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  /**
   * UI de Transição (Forense)
   * Enquanto houver incerteza sobre a identidade (loading ou isChecking),
   * o sistema exibe o SplashScreen oficial da marca para evitar FOUC (Flash of Unstyled Content).
   */
  if (loading || isChecking) {
    return <SplashScreen />;
  }

  // Renderização segura dos componentes filhos (Dashboard/Admin)
  return <>{children}</>;
}