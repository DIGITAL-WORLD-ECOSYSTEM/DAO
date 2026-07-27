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
  displayName: string;
  displayEmail: string;
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
