import type { AuthUser } from '../types';

import { useState, useCallback } from 'react';

import { useAuthContext } from '../hooks/use-auth-context';
import { AccountSettingsService } from '../application/account-settings.service';

/**
 * useAccountFacade
 * Portal blindado para componentes de UI (ex: account-general.tsx) manipularem o próprio perfil.
 * Protege o Contexto original e expõe apenas métodos de mutação seguros via Application Service.
 */
export function useAccountFacade() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(async (data: Partial<AuthUser>) => {
    setLoading(true);
    try {
      const updated = await AccountSettingsService.updateProfile(data);
      // O Context provider (que assina a sessão) deve idealmente reagir ou ser forçado a atualizar, 
      // mas retornamos o estado mutado. Se o AuthProvider expõe mutate(), seria chamado aqui.
      return updated;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data: Record<string, string>) => {
    setLoading(true);
    try {
      await AccountSettingsService.changePassword(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Expondo o user cru SOMENTE para preenchimento dos fields do Form
    user,
    loading,
    updateProfile,
    changePassword,
  };
}
