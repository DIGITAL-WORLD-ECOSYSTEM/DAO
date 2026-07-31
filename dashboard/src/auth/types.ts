export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  did?: string;
  role: string;
  username?: string;
  avatarUrl?: string;
  photoURL?: string;
  phoneNumber?: string;
  cpf?: string;
  rg?: string;
  country?: string;
  address?: string;
  physicalAddress?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  about?: string;
  occupation?: string;
  company?: string;
  website?: string;
  isPublic?: boolean;
  kycStatus?: string;
  birthDate?: string | null;
  gender?: string;
  maritalStatus?: string;
  neighborhood?: string;
  cnh?: string;
  cnhCategory?: string;
  motherName?: string;
  fatherName?: string;
  rgIssuer?: string;
  pixKey?: string;
  signatureUrl?: string;
  acceptTerms?: boolean;
  notificationPreferences?: string[];
  socialLinks?: Record<string, string>;
  status?: string;
}

export interface UserProfileViewModel {
  id?: string;
  displayName: string;
  displayEmail: string;
  role?: string;
  address?: string;
  phoneNumber?: string;
  walletAddress?: string;
  isWeb3Account: boolean;
  photoURL?: string;
}

export type UserType = AuthUser | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<AuthUser | null>;
};

// ======================================================================
// === IDENTITY DOMAIN - PUBLIC CONTRACTS & TOKENS                    ===
// ======================================================================

export type PresenceStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';
export type IdentityAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IdentityAvatarShape = 'circle' | 'rounded' | 'square';
export type IdentityBadgeType = 'none' | 'notification' | 'verified' | 'admin' | 'dao' | 'moderator';
export type IdentityBorderColor = 'none' | 'primary' | 'secondary' | 'success' | 'warning';

// ======================================================================
// === INTERNAL DATA CONTRACTS (Restricted to Identity Domain)        ===
// ======================================================================
// Hooks directly use these. Facades wrap them for outside.

export interface CurrentUserFacade {
  get(): UserProfileViewModel;
}

// ======================================================================
// === PUBLIC FACADES (Consumed by Banking, Chat, DAO, etc)           ===
// ======================================================================

export interface ProfileFacade {
  get(id: string): Promise<UserProfileViewModel>;
  update(data: Partial<UserProfileViewModel>): Promise<UserProfileViewModel>;
}

export interface PresenceFacade {
  get(id: string): PresenceStatus;
  subscribe(id: string, cb: (status: PresenceStatus) => void): void;
  unsubscribe(id: string, cb: (status: PresenceStatus) => void): void;
}

export interface AvatarFacade {
  getUrl(id: string): string;
  upload(file: File): Promise<string>;
}
