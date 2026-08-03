import { useMutation, useQueryClient } from '@tanstack/react-query';
import { identityService } from '../services/identity.service';
import { identityKeys } from '../queries/queryKeys';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { fullName: string }) => identityService.updateProfile(payload),
    onSuccess: () => {
      // Invalidate so that the profile is refreshed in the background
      queryClient.invalidateQueries({ queryKey: identityKeys.me() });
    },
  });
}
