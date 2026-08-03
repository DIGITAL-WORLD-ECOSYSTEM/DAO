import { useQuery } from '@tanstack/react-query';
import { identityKeys } from './queryKeys';
import { IdentityProfile } from '../schemas/identity.schema';

export function useMe(initialData?: IdentityProfile, initialDataUpdatedAt?: number) {
  return useQuery({
    queryKey: identityKeys.me(),
    // Client Side Fetch: Since we hydrate from Server Component, 
    // we only need a fetch function if we actually refetch from the client.
    // For now, we will just hit the BFF /api/auth/me (GET) if needed.
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Failed to fetch me');
      return res.json() as Promise<IdentityProfile>;
    },
    initialData,
    initialDataUpdatedAt,
  });
}
