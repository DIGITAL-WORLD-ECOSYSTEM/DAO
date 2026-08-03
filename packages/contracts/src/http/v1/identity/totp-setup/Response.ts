export interface TotpSetupResponse {
  success: boolean;
  message: string;
  secret?: string;
  uri?: string;
}
