export interface LoginSsiResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    did: string;
    role: string;
  };
  aal?: number;
  mfaRequired?: boolean;
}
