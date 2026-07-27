import type { UserProfileViewModel } from '../types';

import { useMemo } from 'react';

import { transformUserProfile } from 'src/utils/profile-transformers';

import { useAuthContext } from './use-auth-context';

export function useUserProfile(): UserProfileViewModel {
  const { user } = useAuthContext();

  return useMemo(() => transformUserProfile(user), [user]);
}
