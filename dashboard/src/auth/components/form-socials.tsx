import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormSocialsProps = BoxProps & {
  signInWithGoogle?: () => void;
  singInWithGithub?: () => void;
  signInWithTwitter?: () => void;
};

export function FormSocials({
  sx,
  signInWithGoogle,
  singInWithGithub,
  signInWithTwitter,
  ...other
}: FormSocialsProps) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: 'flex',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconButton
        color="inherit"
        onClick={signInWithGoogle}
        sx={{
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
            transform: 'scale(1.1)',
            boxShadow: (theme) => `0 0 15px ${alpha(theme.palette.info.main, 0.3)}`,
          },
        }}
      >
        <Iconify width={22} icon="logos:google-icon" />
      </IconButton>
      <IconButton
        color="inherit"
        onClick={singInWithGithub}
        sx={{
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
            transform: 'scale(1.1)',
            boxShadow: (theme) => `0 0 15px ${alpha(theme.palette.info.main, 0.3)}`,
          },
        }}
      >
        <Iconify width={22} icon="logos:github-icon" />
      </IconButton>
      <IconButton
        color="inherit"
        onClick={signInWithTwitter}
        sx={{
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
            transform: 'scale(1.1)',
            boxShadow: (theme) => `0 0 15px ${alpha(theme.palette.info.main, 0.3)}`,
          },
        }}
      >
        <Iconify width={22} icon={'logos:twitter' as any} />
      </IconButton>
    </Box>
  );
}
