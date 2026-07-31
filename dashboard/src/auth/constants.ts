import type { 
  PresenceStatus, 
  IdentityBadgeType, 
  IdentityAvatarSize, 
  IdentityAvatarShape,
  IdentityBorderColor
} from './types';

// ======================================================================
// === IDENTITY DOMAIN - ENTERPRISE CONSTANTS                         ===
// ======================================================================

export const DEFAULT_AVATAR_SIZE: IdentityAvatarSize = 'md';
export const DEFAULT_AVATAR_SHAPE: IdentityAvatarShape = 'circle';
export const DEFAULT_STATUS: PresenceStatus = 'offline';
export const DEFAULT_ROLE = 'user';
export const DEFAULT_BADGE: IdentityBadgeType = 'none';
export const DEFAULT_BORDER_COLOR: IdentityBorderColor = 'none';

// Pre-defined mapping for pixel sizes ensuring no magic numbers in UI
export const AVATAR_SIZES_PX: Record<IdentityAvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};
