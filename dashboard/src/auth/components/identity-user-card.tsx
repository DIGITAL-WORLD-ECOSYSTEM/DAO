import type { PresenceStatus, IdentityAvatarSize, UserProfileViewModel } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useUserProfile } from '../facades';
import { IdentityBadge } from './identity-badge';
import { IdentityAvatar } from './identity-avatar';

type Props = {
  user?: UserProfileViewModel;
  size?: IdentityAvatarSize;
  status?: PresenceStatus;
  role?: string;
  action?: React.ReactNode;
};

export function IdentityUserCard({ user, size = 'xl', status, role, action }: Props) {
  const theme = useTheme();
  const currentUser = useUserProfile();
  const resolvedUser = user || currentUser;

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        boxShadow: theme.customShadows?.z8 || theme.shadows[8],
      }}
    >
      {/* Background shape */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 80,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          borderRadius: '12px 12px 0 0',
        }}
      />

      <IdentityAvatar
        user={resolvedUser}
        size={size}
        status={status}
        sx={{
          mt: 2,
          mb: 2,
          border: `4px solid ${theme.palette.background.paper}`,
          zIndex: 1,
        }}
      />

      <Typography variant="h6">{resolvedUser.displayName}</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {resolvedUser.displayEmail}
      </Typography>

      {role && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.info.main, 0.16),
            color: 'info.dark',
            typography: 'caption',
            fontWeight: 'fontWeightBold',
          }}
        >
          <IdentityBadge type="admin" size={16} />
          {role}
        </Box>
      )}

      {action && <Box sx={{ mt: 3, width: '100%' }}>{action}</Box>}
    </Card>
  );
}
