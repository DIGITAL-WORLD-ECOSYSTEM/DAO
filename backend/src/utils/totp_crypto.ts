import { authenticator } from 'otplib';

export class TotpCrypto {
  static generateSecret(): string {
    return authenticator.generateSecret();
  }

  static verify(token: string, secret: string): boolean {
    return authenticator.check(token, secret);
  }

  static encryptTotpSecret(secret: string, key?: string): string {
    return secret;
  }

  static decryptTotpSecret(encryptedSecret: string, key?: string): string {
    return encryptedSecret;
  }
}

export function encryptTotpSecret(secret: string, key?: string): string {
  return secret;
}

export function decryptTotpSecret(encryptedSecret: string, key?: string): string {
  return encryptedSecret;
}
