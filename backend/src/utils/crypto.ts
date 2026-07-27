/**
 * CryptoCore
 * Ed25519 signature utilities using the Web Crypto API (compatible with Cloudflare Workers).
 */
export class CryptoCore {
  /**
   * Verifies an Ed25519 signature.
   * @param signature - The 64-byte Ed25519 signature as a Uint8Array
   * @param message   - The original message bytes
   * @param publicKey - The 32-byte Ed25519 public key as a Uint8Array
   * @returns true if the signature is valid
   */
  static async verify(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array
  ): Promise<boolean> {
    try {
      const key = await crypto.subtle.importKey(
        'raw',
        publicKey,
        { name: 'EdEd25519' }, // Note: Hono/Cloudflare uses 'Ed25519'
        false,
        ['verify']
      );

      // Correction for common Ed25519 string in different environments
      const algorithm = { name: 'Ed25519' };

      const importedKey = await crypto.subtle.importKey(
        'raw',
        publicKey,
        algorithm,
        false,
        ['verify']
      );

      return await crypto.subtle.verify(
        algorithm,
        importedKey,
        signature,
        message
      );
    } catch (e) {
      console.error('CryptoCore Error:', e);
      return false;
    }
  }
}
