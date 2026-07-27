import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  role: string[];
  kycStatus: string[];
  status: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type AccountStatus = 'active' | 'pending' | 'suspended' | 'inactive' | 'blocked';
export type KycStatus = 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';

export type IUserItem = {
  id: string;
  aspId: string;
  did: string;
  name: string;
  city: string;
  role: 'admin' | 'dev' | 'user';
  email: string;
  state: string;
  status: AccountStatus;
  kycStatus: KycStatus;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
  // Credenciais
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  passkeyCount: number;
  biometricVerified: boolean;
  // Atividade e Governança
  lastActivity?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  trustLevel?: 'Alto' | 'Médio' | 'Baixo';
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};
