export interface LoginSsiRequest {
  username: string;
  signature: string;
  challenge: string;
  otpCode?: string;
}
