import { describe, it, expect } from 'vitest';
import { ShamirCore } from '../src/crypto/shamir_utils';

describe('ShamirCore: Social Recovery Primitives', () => {
  it('should split and combine a secret correctly (2-of-3)', () => {
    const secret = new TextEncoder().encode('ASPPIBRA-DAO-SECRET-SEED');
    const n = 3;
    const t = 2;

    const shares = ShamirCore.split(secret, n, t);
    expect(shares.length).toBe(3);

    // Recombine 2 shares (1 and 2)
    const recovered12 = ShamirCore.combine([shares[0], shares[1]]);
    expect(new TextDecoder().decode(recovered12)).toBe('ASPPIBRA-DAO-SECRET-SEED');

    // Recombine 2 shares (2 and 3)
    const recovered23 = ShamirCore.combine([shares[1], shares[2]]);
    expect(new TextDecoder().decode(recovered23)).toBe('ASPPIBRA-DAO-SECRET-SEED');
  });

  it('should fail with only 1 share (threshold is 2)', () => {
    const secret = new Uint8Array([1, 2, 3, 4]);
    const shares = ShamirCore.split(secret, 3, 2);
    
    expect(() => ShamirCore.combine([shares[0]])).toThrow('Need at least 2 shares to combine');
  });

  it('should work with 3-of-5 threshold', () => {
    const secret = new Uint8Array(32).fill(0xEE);
    const shares = ShamirCore.split(secret, 5, 3);
    
    const recovered = ShamirCore.combine([shares[0], shares[2], shares[4]]);
    expect(recovered).toEqual(secret);
  });
});
