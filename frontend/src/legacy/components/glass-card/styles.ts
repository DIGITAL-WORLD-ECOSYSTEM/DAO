'use client';

import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import type { GlassCardProps } from './types';

// ----------------------------------------------------------------------

export const GlassCardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gradientColor' && prop !== 'borderOpacity' && prop !== 'blur',
})<GlassCardProps>(({ theme, gradientColor = 'info', borderOpacity = 0.8, blur = 12 }) => ({
  position: 'relative',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  overflow: 'hidden',
  backgroundColor: alpha('#020817', 0.8),
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  transition: theme.transitions.create(['transform', 'box-shadow', 'background-color']),
  
  // 💎 BORDA NEON (Assinatura Elite)
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    padding: '1px',
    background: `linear-gradient(180deg, 
      ${alpha(theme.palette[gradientColor].main, borderOpacity)} 0%, 
      ${alpha(theme.palette.common.white, 0.05)} 50%, 
      ${alpha(theme.palette.warning.main, borderOpacity)} 100%
    )`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    zIndex: 2,
    pointerEvents: 'none',
  },

  '&:hover': {
    transform: 'translateY(-8px)',
    backgroundColor: alpha('#020817', 0.9),
    boxShadow: `0 0 25px 0 ${alpha(theme.palette[gradientColor].main, 0.2)}`,
  },
}));
