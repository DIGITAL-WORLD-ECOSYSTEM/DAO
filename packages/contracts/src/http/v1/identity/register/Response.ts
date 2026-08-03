export interface RegisterResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  details?: string;
}
