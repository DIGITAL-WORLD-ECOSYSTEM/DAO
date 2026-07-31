import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { useSessionFacade } from 'src/auth/facades';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();

  const { logout } = useSessionFacade();

  const handleLogout = useCallback(async () => {
    try {
      await logout();

      onClose?.();
      router.replace('/login');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível sair!');
    }
  }, [logout, onClose, router]);

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
      Sair
    </Button>
  );
}
