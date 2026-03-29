import * as bip39 from 'bip39';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { ed25519, x25519 } from '@noble/curves/ed25519';

/**
 * ASPPIBRA-DAO Elite Crypto Utils
 * Layer: @dao/shared
 * Ed25519: Signatures
 * X25519: Key Exchange / Encryption
 */

export const CryptoCore = {
  /**
   * Generates a 24-word BIP-39 mnemonic.
   */
  generateMnemonic: (): string => {
    return bip39.generateMnemonic(256);
  },

  /**
   * Master Seed derivation via PBKDF2 (600,000 iterations).
   * 🛡️ Hardened: Explicit buffer zeroization after derivation.
   */
  deriveSeed: async (mnemonic: string, salt: string): Promise<Uint8Array> => {
    const encoder = new TextEncoder();
    const mnemonicBytes = encoder.encode(mnemonic);
    const saltBytes = encoder.encode(salt);
    
    const seed = pbkdf2(sha256, mnemonicBytes, saltBytes, { c: 600000, dkLen: 64 });
    
    // 🧹 Zeroization
    mnemonicBytes.fill(0);
    saltBytes.fill(0);
    
    return seed;
  },

  /**
   * Ed25519 Keypair (Signing)
   */
  getEd25519KeyPair: (seed: Uint8Array) => {
    const priv = seed.slice(0, 32);
    const pub = ed25519.getPublicKey(priv);
    return { priv, pub };
  },

  /**
   * X25519 Keypair (Encryption)
   */
  getX25519KeyPair: (seed: Uint8Array) => {
    const priv = seed.slice(32, 64);
    const pub = x25519.getPublicKey(priv);
    return { priv, pub };
  },

  /**
   * Sign a message (Uint8Array)
   */
  sign: (msg: Uint8Array, priv: Uint8Array): Uint8Array => {
    return ed25519.sign(msg, priv);
  },

  /**
   * Verify a signature
   */
  verify: (sig: Uint8Array, msg: Uint8Array, pub: Uint8Array): boolean => {
    return ed25519.verify(sig, msg, pub);
  },

  /**
   * AES-GCM Encryption (High-Security Fortress Storage)
   */
  encrypt: async (data: Uint8Array, key: Uint8Array): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await crypto.subtle.importKey('raw', key.slice(0, 32), 'AES-GCM', false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data as any);
    return { ciphertext: new Uint8Array(encrypted), iv };
  },

  /**
   * AES-GCM Decryption
   */
  decrypt: async (ciphertext: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<Uint8Array> => {
    const cryptoKey = await crypto.subtle.importKey('raw', key.slice(0, 32), 'AES-GCM', false, ['decrypt']);
    const decoded = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertext as any);
    return new Uint8Array(decoded);
  }
};
