import type { PresenceStatus, IdentityBadgeType } from '../types';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

type Props = {
  type?: IdentityBadgeType;
  status?: PresenceStatus;
  size?: number;
};

export function IdentityBadge({ type, status, size = 20 }: Props) {
  const theme = useTheme();

  if (type && type !== 'none') {
    const icons: Record<string, { icon: string; color: string }> = {
      verified: { icon: 'solar:check-circle-bold', color: 'info.main' },
      admin: { icon: 'solar:shield-star-bold', color: 'error.main' },
      dao: { icon: 'solar:crown-star-bold', color: 'warning.main' },
      moderator: { icon: 'solar:shield-check-bold', color: 'success.main' },
      notification: { icon: 'solar:bell-bold', color: 'error.main' },
    };

    const config = icons[type];
    if (!config) return null;

    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: theme.shadows[2],
        }}
      >
        <Iconify icon={config.icon as any} width={size * 0.7} sx={{ color: config.color }} />
      </Box>
    );
  }

  if (status && status !== 'invisible') {
    const colors: Record<string, string> = {
      online: theme.palette.success.main,
      offline: theme.palette.text.disabled,
      away: theme.palette.warning.main,
      busy: theme.palette.error.main,
    };

    const color = colors[status] || colors.offline;

    return (
      <Box
        sx={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: '50%',
          bgcolor: color,
          border: `2px solid ${theme.palette.background.paper}`,
        }}
      />
    );
  }

  return null;
}
