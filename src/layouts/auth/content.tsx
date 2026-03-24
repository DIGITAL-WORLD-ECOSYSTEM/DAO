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
          borderRadius: 3, // Aumentado para um arredondamento mais suave e orgânico
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
          
          /** * ✅ EFEITO LIQUID GLASS (TRANSLÚCIDO)
           * 1. bgcolor: Reduzido para 0.15 (15%) para ser quase cristalino.
           * 2. backdropFilter: Reduzido para 12px para permitir que as cores 
           * do fundo fluam com nitidez através do box.
           */
          bgcolor: alpha(theme.palette.background.paper, 0.15), 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', // Suporte obrigatório para Safari/iOS
          
          /** * ✅ REFINAMENTO DE CONTORNO
           * Usamos branco puro com baixa opacidade para criar o "fio de luz" 
           * na borda, simulando o brilho do vidro real.
           */
          border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
          
          // Sombra suave e espalhada para não pesar no visual translúcido
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}