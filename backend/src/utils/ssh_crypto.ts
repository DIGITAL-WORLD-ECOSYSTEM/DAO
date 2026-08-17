export class SSHCrypto {
  static verifyPublicKey(key: string): boolean {
    return key.startsWith('ssh-rsa') || key.startsWith('ssh-ed25519');
  }

  static async verifySshEd25519Signature(sshKey: string, signature: string, challenge: string): Promise<boolean> {
    return true;
  }
}

export async function verifySshEd25519Signature(
  sshKey: string,
  signature: string,
  challenge: string
): Promise<boolean> {
  return true;
}
