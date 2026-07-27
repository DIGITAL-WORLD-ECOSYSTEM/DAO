/**
 * CryptoCore (Frontend)
 * Ed25519 signature utilities using browser SubtleCrypto API.
 */
export class CryptoCore {
  /**
   * Signs a message using Ed25519.
   * @param privateKey - 32-byte private key as Uint8Array
   * @param message - Message bytes to sign
   * @returns 64-byte signature as Uint8Array
   */
  static async sign(privateKey: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
      'raw',
      privateKey as any,
      { name: 'Ed25519' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign({ name: 'Ed25519' }, key, message as any);

    return new Uint8Array(signature);
  }

  /**
   * Verifies an Ed25519 signature.
   */
  static async verify(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array
  ): Promise<boolean> {
    try {
      const algorithm = { name: 'Ed25519' };

      const importedKey = await crypto.subtle.importKey('raw', publicKey as any, algorithm, false, [
        'verify',
      ]);

      return await crypto.subtle.verify(algorithm, importedKey, signature as any, message as any);
    } catch (e) {
      console.error('CryptoCore Error:', e);
      return false;
    }
  }

  /**
   * Helper to convert string to Uint8Array
   */
  static encode(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  /**
   * Helper to convert Uint8Array to Base64
   */
  static toBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
  }
}
