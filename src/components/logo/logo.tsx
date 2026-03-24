'use client';

import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

// Importações visuais
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  // Agora ele tentará mostrar apenas o ícone por padrão.
  isSingle = true,
  ...other
}: LogoProps) {

  // ÍCONE DO GLOBO (Base)
  const logoIcon = (
    <Box
      component="img"
      alt="ASPPIBRA-DAO Icon"
      src="/logo/android-chrome-192x192.png"
      sx={{ 
        width: 40, 
        height: 40, 
        objectFit: 'contain' 
      }}
    />
  );

  // VERSÃO 1: APENAS ÍCONE
  const singleLogo = (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {logoIcon}
    </Box>
  );

  // VERSÃO 2: ÍCONE + TEXTO (Estilo Cointelegraph)
  const fullLogo = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {/* Ícone */}
      {logoIcon}

      {/* Texto */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            lineHeight: 1,
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            color: 'text.primary', // Preto no Light / Branco no Dark
            letterSpacing: '-0.5px'
          }}
        >
          DEX
        </Typography>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            lineHeight: 1,
            fontSize: '0.75rem',
            color: 'text.secondary', // Cinza
            mt: 0.3
          }}
        >
          World
        </Typography>
      </Box>
    </Box>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          // Dimensões base
          width: 40,
          height: 40,
          
          // MUDANÇA 2: Se não for single, expande para caber o texto
          ...(!isSingle && { 
            width: 'auto', 
            height: 40,
            minWidth: 140 
          }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Lógica de Renderização:
         Se isSingle for false (agora é o padrão), mostra fullLogo.
      */}
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

// MUDANÇA 3: Corrigido o CSS que escondia o texto.
const LogoRoot = styled(Link)(({ theme }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  verticalAlign: 'middle',
  alignItems: 'center',
  textDecoration: 'none',
  // Importante: permite que as cores definidas no Typography funcionem
  color: 'inherit', 
}));