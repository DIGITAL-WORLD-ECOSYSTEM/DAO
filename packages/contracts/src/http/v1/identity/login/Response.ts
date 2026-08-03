export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: {
    id: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
  };
  details?: string;
}
