import { useState, useCallback } from 'react';

import { AvatarService } from '../application/avatar.service';

/**
 * useAvatarFacade
 * Portal para upload e atualização de avatares.
 */
export function useAvatarFacade() {
  const [loading, setLoading] = useState(false);

  const uploadAvatar = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const url = await AvatarService.changeAvatar(file);
      return url;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    uploadAvatar,
  };
}
