/**
 * Shamir's Secret Sharing (SSS) over GF(256)
 * Purpose: Splitting the master seed into shards for social recovery.
 */

const GF256_POLY = 0x11d; // x^8 + x^4 + x^3 + x^2 + 1

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

// Precompute Log and Exp tables for GF(256)
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  EXP[i + 255] = x;
  LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= GF256_POLY;
}

function mul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function div(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  if (a === 0) return 0;
  return EXP[LOG[a] - LOG[b] + 255];
}

/**
 * ShamirCore: Primitivas para divisão de segredos.
 */
export class ShamirCore {
  /**
   * Divide um segredo em 'n' pedaços, com threshold 't'.
   */
  static split(secret: Uint8Array, n: number, t: number): Uint8Array[] {
    if (t > n) throw new Error('Threshold cannot be greater than n');
    if (t < 2) throw new Error('Threshold must be at least 2');

    const shares: Uint8Array[] = Array.from({ length: n }, () => new Uint8Array(secret.length + 1));
    
    // Para cada byte do segredo
    for (let i = 0; i < secret.length; i++) {
      const poly = new Uint8Array(t);
      poly[0] = secret[i];
      // Coeficientes aleatórios para o polinômio (exceto o segredo no poly[0])
      for (let j = 1; j < t; j++) {
        poly[j] = Math.floor(Math.random() * 256);
      }

      // Avaliar o polinômio para cada share x = 1...n
      for (let x = 1; x <= n; x++) {
        let val = poly[0];
        let xPow = 1;
        for (let j = 1; j < t; j++) {
          xPow = mul(xPow, x);
          val ^= mul(poly[j], xPow);
        }
        shares[x - 1][0] = x; // O primeiro byte é o índice X
        shares[x - 1][i + 1] = val;
      }
    }

    return shares;
  }

  /**
   * Recombina fragmentos para recuperar o segredo original.
   */
  static combine(shares: Uint8Array[]): Uint8Array {
    if (shares.length < 2) throw new Error('Need at least 2 shares to combine');
    
    const secretLen = shares[0].length - 1;
    const secret = new Uint8Array(secretLen);

    for (let i = 0; i < secretLen; i++) {
        let val = 0;
        for (let j = 0; j < shares.length; j++) {
            let num = 1;
            let den = 1;
            const xj = shares[j][0];
            
            for (let k = 0; k < shares.length; k++) {
                if (j === k) continue;
                const xk = shares[k][0];
                num = mul(num, xk);
                den = mul(den, xj ^ xk);
            }
            
            const lagrange = div(num, den);
            val ^= mul(shares[j][i + 1], lagrange);
        }
        secret[i] = val;
    }

    return secret;
  }
}
