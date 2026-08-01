'use client';

import type { FabProps } from '@mui/material/Fab';

import { cloneElement } from 'react';
import { useBackToTop } from 'minimal-shared/hooks';

import Fab from '@mui/material/Fab';

import { Iconify } from '../iconify';

type BackToTopProps = FabProps & {
  isDebounce?: boolean;
  scrollThreshold?: string | number;
  renderButton?: (isVisible?: boolean) => React.ReactElement;
};

export function BackToTopButton({
  sx,
  isDebounce,
  renderButton,
  scrollThreshold = '90%',
  ...other
}: BackToTopProps) {
  const { onBackToTop, isVisible } = useBackToTop(scrollThreshold, isDebounce);

  if (renderButton) {
    return cloneElement(renderButton(isVisible) as React.ReactElement<{ onClick?: () => void }>, {
      onClick: onBackToTop,
    });
  }

  return (
    <Fab
      size="small"
      aria-label="Back to top"
      onClick={onBackToTop}
      sx={[
        (theme) => ({
          position: 'fixed',
          right: theme.spacing(2),
          bottom: theme.spacing(2), // POSIÇÃO INFERIOR
          width: 40,
          height: 40,
          zIndex: theme.zIndex.speedDial,
          bgcolor: '#00C896',
          color: 'white',
          '&:hover': { bgcolor: '#00A87D' },
          transform: isVisible ? 'scale(1)' : 'scale(0)',
          transition: theme.transitions.create(['transform', 'background-color']),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify width={24} icon="solar:double-alt-arrow-up-bold-duotone" />
    </Fab>
  );
}
