import type { PresenceStatus, IdentityAvatarSize, UserProfileViewModel } from '../types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useUserProfile } from '../facades';
import { IdentityAvatar } from './identity-avatar';

type Props = {
  user?: UserProfileViewModel;
  size?: IdentityAvatarSize;
  status?: PresenceStatus;
  primaryText?: string;
  secondaryText?: string;
  onClick?: () => void;
};

export function IdentityUserChip({
  user,
  size = 'md',
  status,
  primaryText,
  secondaryText,
  onClick,
}: Props) {
  const currentUser = useUserProfile();
  const resolvedUser = user || currentUser;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              opacity: 0.8,
            }
          : {},
      }}
    >
      <IdentityAvatar user={resolvedUser} size={size} status={status} />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" noWrap>
          {primaryText || resolvedUser.displayName}
        </Typography>

        {secondaryText && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {secondaryText}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
