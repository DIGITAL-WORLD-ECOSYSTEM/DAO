import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import IconButton from '@mui/material/IconButton';

import { varTap, varHover, AnimateBorder, transitionTap } from 'src/components/animate';

import { IdentityAvatar } from 'src/auth/components';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps;

export function AccountButton({ sx, ...other }: AccountButtonProps) {
  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
        slotProps={{
          primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
          secondaryBorder: { sx: { color: 'warning.main' } },
        }}
      >
        <IdentityAvatar sx={{ width: 1, height: 1 }} />
      </AnimateBorder>
    </IconButton>
  );
}
