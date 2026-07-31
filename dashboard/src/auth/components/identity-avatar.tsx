import type { AvatarProps } from '@mui/material/Avatar';
import type {
  PresenceStatus,
  IdentityBadgeType,
  IdentityAvatarSize,
  IdentityAvatarShape,
  IdentityBorderColor,
  UserProfileViewModel,
} from '../types';

import { forwardRef } from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

import { useUserProfile } from '../facades';
import { IdentityBadge } from './identity-badge';
import { 
  DEFAULT_BADGE, 
  AVATAR_SIZES_PX, 
  DEFAULT_AVATAR_SIZE, 
  DEFAULT_AVATAR_SHAPE, 
  DEFAULT_BORDER_COLOR 
} from '../constants';

type Props = Omit<AvatarProps, 'variant'> & {
  user?: UserProfileViewModel;
  size?: IdentityAvatarSize;
  variant?: IdentityAvatarShape;
  status?: PresenceStatus;
  badge?: IdentityBadgeType;
  color?: IdentityBorderColor;
  alt?: string;
  src?: string;
  clickable?: boolean;
  lazy?: boolean;
  sx?: any;
};



function stringToColor(string: string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function getInitials(name: string) {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export const IdentityAvatar = forwardRef<HTMLDivElement, Props>(
  (
    {
      user,
      size = DEFAULT_AVATAR_SIZE,
      variant = DEFAULT_AVATAR_SHAPE,
      status,
      badge = DEFAULT_BADGE,
      color = DEFAULT_BORDER_COLOR,
      clickable = false,
      lazy = true,
      alt,
      src,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();
    const currentUser = useUserProfile();
    
    // Resolve user: use provided user, or fallback to mapped legacy props, or fallback to current session
    const resolvedUser = user || (alt || src ? { displayName: alt || '', displayEmail: '', photoURL: src, isWeb3Account: false } : currentUser);
    const { displayName, photoURL } = resolvedUser;

    const sizePx = AVATAR_SIZES_PX[size];
    
    // Resolve border color
    let borderStyle = {};
    if (color !== 'none') {
      const paletteColor = theme.palette[color as 'primary' | 'secondary' | 'success' | 'warning' | 'error']?.main;
      if (paletteColor) {
        borderStyle = {
          border: `2px solid ${paletteColor}`,
          padding: '2px', // space for border
        };
      }
    }

    const avatarProps = {
      src: photoURL,
      alt: displayName,
      variant: (variant === 'circle' ? 'circular' : variant) as 'circular' | 'rounded' | 'square',
      children: photoURL ? undefined : getInitials(displayName),
      sx: {
        width: sizePx,
        height: sizePx,
        cursor: clickable ? 'pointer' : 'default',
        bgcolor: photoURL ? undefined : stringToColor(displayName),
        ...borderStyle,
        ...sx,
      },
      ...other,
    };

    // se tiver lazy loading
    if (lazy) {
      (avatarProps as any).imgProps = { loading: 'lazy' };
    }

    const renderAvatar = <Avatar ref={ref} {...avatarProps} />;

    // Wrap with Badge if status or badge type provided
    if (status || (badge && badge !== 'none')) {
      return (
        <Badge
          overlap={variant === 'circle' ? 'circular' : 'rectangular'}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IdentityBadge 
              type={badge} 
              status={status} 
              size={sizePx * 0.35 > 12 ? sizePx * 0.35 : 12} 
            />
          }
        >
          {renderAvatar}
        </Badge>
      );
    }

    return renderAvatar;
  }
);

IdentityAvatar.displayName = 'IdentityAvatar';
