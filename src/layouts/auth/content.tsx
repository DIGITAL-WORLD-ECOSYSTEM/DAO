'use client';

import type { BoxProps } from '@mui/material/Box';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

import { layoutClasses } from '../core';

// ----------------------------------------------------------------------

export type AuthCenteredContentProps = BoxProps;

export function AuthCenteredContent({
  sx,
  children,
  className,
  ...other
}: AuthCenteredContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          py: 5,
          px: 3,
          width: 1,
          zIndex: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
          position: 'relative',

          /** * ✅ ESTILO CRYSTAL (SocialFi 2026)
           * Fundo Deep Midnight + Desfoque Premium
           */
          bgcolor: alpha('#020817', 0.8),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',

          /** * ✅ BORDA CRYSTAL REATIVA
           * Efeito de "fio de luz" gradiente usando máscara
           */
          border: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: `linear-gradient(180deg, 
              ${alpha(theme.palette.primary.main, 1)} 0%, 
              ${alpha(theme.palette.primary.main, 0.1)} 50%, 
              ${alpha(theme.palette.primary.main, 0.6)} 100%
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          },

          // Sombra de profundidade para destacar do vácuo
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.4)}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}
