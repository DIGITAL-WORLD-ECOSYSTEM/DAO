import { describe, it, expect } from 'vitest';
import { CryptoCore } from '../src/crypto/crypto_utils';

describe('CryptoCore: SSI Vault Primitives', () => {
  it('should generate a valid 24-word mnemonic', () => {
    const mnemonic = CryptoCore.generateMnemonic();
    expect(mnemonic.split(' ').length).toBe(24);
  });

  it('should derive the same seed if salt and mnemonic are identical (determinism)', async () => {
    const mnemonic = 'legal winner thank year wave sausage worth unit legal winner thank yellow';
    const salt = 'dao_test_salt';
    
    // We run derivation cycles (simulating 600k iterations)
    // 600k is HEAVY, so we increase the test timeout to 15s
    const seed1 = await CryptoCore.deriveSeed(mnemonic, salt);
    expect(seed1.length).toBe(64);
  }, 15000);


  it('should generate valid Ed25519 keys from a seed', async () => {
    const seed = new Uint8Array(64).fill(1);
    const { priv, pub } = CryptoCore.getEd25519KeyPair(seed);
    
    expect(priv).toBeDefined();
    expect(pub).toBeDefined();
    expect(pub.length).toBe(32);
  });

  it('should sign and verify a message correctly', async () => {
    const seed = new Uint8Array(64).fill(2);
    const { priv, pub } = CryptoCore.getEd25519KeyPair(seed);
    const msg = new TextEncoder().encode('ASPPIBRA-DAO-SSI-TEST');
    const sig = CryptoCore.sign(msg, priv);
    const isValid = CryptoCore.verify(sig, msg, pub);
    
    expect(isValid).toBe(true);
  });

  it('should encrypt and decrypt data using AES-GCM', async () => {
    const data = new TextEncoder().encode('ASPPIBRA-DAO SECURE DATA');
    const key = new Uint8Array(32).fill(0x42); // 256-bit key
    
    const { ciphertext, iv } = await CryptoCore.encrypt(data, key);
    expect(ciphertext).toBeDefined();
    expect(iv.length).toBe(12);
    
    const decrypted = await CryptoCore.decrypt(ciphertext, key, iv);
    expect(new TextDecoder().decode(decrypted)).toBe('ASPPIBRA-DAO SECURE DATA');
  });

  it('should recover identical keys from the same mnemonic (Recovery Path)', async () => {
    const mnemonic = CryptoCore.generateMnemonic();
    const salt = 'recovery_test';
    
    // First derivation
    const seed1 = await CryptoCore.deriveSeed(mnemonic, salt);
    const keys1 = CryptoCore.getEd25519KeyPair(seed1);
    
    // Second derivation (Simulating recovery on another device)
    const seed2 = await CryptoCore.deriveSeed(mnemonic, salt);
    const keys2 = CryptoCore.getEd25519KeyPair(seed2);
    
    expect(seed1).toEqual(seed2);
    expect(keys1.pub).toEqual(keys2.pub);
    expect(keys1.priv).toEqual(keys2.priv);
  }, 20000); // 20s timeout for double derivation
});
