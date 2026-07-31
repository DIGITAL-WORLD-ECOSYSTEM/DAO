import type { UserProfileViewModel } from '../types';

import { useMemo } from 'react';

import { useAuthContext } from '../hooks/use-auth-context';
import { transformUserProfile } from '../transformers/profile-transformers';

export function useCurrentUserFacade(): UserProfileViewModel {
  const { user } = useAuthContext();

  return useMemo(() => transformUserProfile(user), [user]);
}

// Alias de retrocompatibilidade para facilitar migração nas sections (Pode ser depreciado no futuro)
export const useUserProfile = useCurrentUserFacade;
