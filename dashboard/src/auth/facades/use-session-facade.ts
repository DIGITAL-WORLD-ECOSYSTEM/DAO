import { useCallback } from 'react';

import { useAuthContext } from '../hooks/use-auth-context';
import { IdentitySessionService } from '../application/identity-session.service';

export function useSessionFacade() {
  const { checkUserSession } = useAuthContext();

  const logout = useCallback(async () => {
    await IdentitySessionService.logout();
    if (checkUserSession) {
      await checkUserSession();
    }
  }, [checkUserSession]);

  return {
    logout,
  };
}
