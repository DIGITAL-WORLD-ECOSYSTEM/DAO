/**
 * Project: Governance System (ASPPIBRA DAO)
 * Role: SSH public key parser and verification utility using Web Crypto API.
 * Standards: RFC 4253, RFC 8709, Ed25519.
 */

export function parseSshEd25519PublicKey(sshKeyStr: string): Uint8Array {
  const parts = sshKeyStr.trim().split(/\s+/);
  // Format is: ssh-ed25519 <base64_blob> [comment]
  const base64Blob = parts[0] === 'ssh-ed25519' ? parts[1] : parts[0];
  if (!base64Blob) {
    throw new Error('Invalid SSH public key format');
  }

  let binary: string;
  try {
    binary = atob(base64Blob);
  } catch (e) {
    throw new Error('Failed to decode base64 SSH public key blob');
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // Verify length prefix for "ssh-ed25519"
  if (bytes.length < 19) {
    throw new Error('SSH public key blob is too short');
  }

  const typeLen = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  const keyTypeOffset = 4;
  const keyLenOffset = keyTypeOffset + typeLen;

  if (bytes.length < keyLenOffset + 4) {
    throw new Error('SSH public key blob has invalid structure');
  }

  const keyLen =
    (bytes[keyLenOffset] << 24) |
    (bytes[keyLenOffset + 1] << 16) |
    (bytes[keyLenOffset + 2] << 8) |
    bytes[keyLenOffset + 3];
  const keyOffset = keyLenOffset + 4;

  if (bytes.length < keyOffset + keyLen) {
    throw new Error('SSH public key blob does not contain entire key');
  }

  return bytes.slice(keyOffset, keyOffset + keyLen);
}

export async function verifySshEd25519Signature(
  publicKeyStr: string,
  signatureBase64OrHex: string,
  challenge: string
): Promise<boolean> {
  try {
    const pubKeyBytes = parseSshEd25519PublicKey(publicKeyStr);

    // Import key as Ed25519 key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      pubKeyBytes,
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      false,
      ['verify']
    );

    // Decode signature (could be hex or base64)
    let sigBytes: Uint8Array;
    if (/^[0-9a-fA-F]+$/.test(signatureBase64OrHex)) {
      // Hex
      const matches = signatureBase64OrHex.match(/.{1,2}/g);
      sigBytes = new Uint8Array(matches ? matches.map((byte) => parseInt(byte, 16)) : []);
    } else {
      // Base64
      const binary = atob(signatureBase64OrHex);
      sigBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        sigBytes[i] = binary.charCodeAt(i);
      }
    }

    // Also handle standard SSH signature structure (contains ssh-ed25519 header prefix)
    // If sigBytes starts with ssh-ed25519 header, extract the raw signature bytes (last 64 bytes)
    if (sigBytes.length > 64) {
      const typeLen = (sigBytes[0] << 24) | (sigBytes[1] << 16) | (sigBytes[2] << 8) | sigBytes[3];
      const sigLenOffset = 4 + typeLen;
      const sigLen =
        (sigBytes[sigLenOffset] << 24) |
        (sigBytes[sigLenOffset + 1] << 16) |
        (sigBytes[sigLenOffset + 2] << 8) |
        sigBytes[sigLenOffset + 3];
      const sigOffset = sigLenOffset + 4;
      if (sigBytes.length >= sigOffset + sigLen) {
        sigBytes = sigBytes.slice(sigOffset, sigOffset + sigLen);
      }
    }

    const enc = new TextEncoder();
    const challengeBytes = enc.encode(challenge);

    return await crypto.subtle.verify({ name: 'Ed25519' }, cryptoKey, sigBytes, challengeBytes);
  } catch (e) {
    console.error('SSH signature verification failed:', e);
    return false;
  }
}
