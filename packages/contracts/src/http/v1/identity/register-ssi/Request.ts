export interface RegisterSsiRequest {
  username: string;
  publicKey: string;
  signature: string;
  challenge: string;
  firstName: string;
  lastName: string;
  encryptedVault?: string;
}
