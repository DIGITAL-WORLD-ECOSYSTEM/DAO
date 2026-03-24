'use client';

import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths'; // ✅ Adicionado para garantir o caminho correto
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { signOut as jwtSignOut } from 'src/auth/context/action';

// ----------------------------------------------------------------------

const signOut = jwtSignOut;

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      onClose?.();
      
      // ✅ CORREÇÃO: Em vez de .refresh() (que não existe no seu hook), 
      // usamos o .replace() para redirecionar o usuário para a home ou login.
      router.replace(paths.auth.signIn); 
      
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}