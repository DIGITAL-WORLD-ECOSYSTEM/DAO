export interface PasskeyBindRequest {
  username: string;
  credentialId: string;
  publicKey: string;
  challenge: string;
  signature: string;
}
