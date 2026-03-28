// /home/user/SocialFi/src/auth/types.ts

// 1. Definição do Usuário Alinhada com o D1 (Backend)
export type User = {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string; // Criado no mapUser
  role: 'admin' | 'partner' | 'citizen' | 'system';
  photoURL?: string;
  accessToken?: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  phoneNumber?: string | null;
  status?: string;
};

// 2. Estado de Autenticação
export type AuthState = {
  user: User | null;
  loading: boolean;
};

// 3. Valor do Contexto (O que os hooks useAuth vão enxergar)
export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUserSession: () => Promise<void>;
};