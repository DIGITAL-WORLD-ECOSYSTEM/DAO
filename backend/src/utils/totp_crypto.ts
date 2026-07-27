/**
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Encrypted TOTP storage utility using Web Crypto API.
 * Standards: NIST SP 800-57, AES-256-GCM, HKDF key derivation.
 */

async function getTotpEncryptionKey(jwtSecret: string): Promise<CryptoKey> {
	const enc = new TextEncoder();
	
	const masterKey = await crypto.subtle.importKey(
		'raw',
		enc.encode(jwtSecret),
		{ name: 'HKDF' },
		false,
		['deriveKey']
	);

	return await crypto.subtle.deriveKey(
		{
			name: 'HKDF',
			hash: 'SHA-256',
			salt: enc.encode('ASPPIBRA-TOTP'),
			info: enc.encode('AES256-GCM'),
		},
		masterKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

export async function encryptTotpSecret(secret: string, jwtSecret: string): Promise<string> {
	const enc = new TextEncoder();
	const aesKey = await getTotpEncryptionKey(jwtSecret);

	const iv = crypto.getRandomValues(new Uint8Array(12));

	const encryptedBuffer = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		aesKey,
		enc.encode(secret)
	);

	const encryptedBytes = new Uint8Array(encryptedBuffer);
	const ciphertextBytes = encryptedBytes.slice(0, -16);
	const authTagBytes = encryptedBytes.slice(-16);

	const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
	const ciphertextHex = Array.from(ciphertextBytes).map(b => b.toString(16).padStart(2, '0')).join('');
	const authTagHex = Array.from(authTagBytes).map(b => b.toString(16).padStart(2, '0')).join('');

	return JSON.stringify({
		iv: ivHex,
		ciphertext: ciphertextHex,
		authTag: authTagHex
	});
}

export async function decryptTotpSecret(encryptedJson: string, jwtSecret: string): Promise<string> {
	const dec = new TextDecoder();
	
	let parsed;
	try {
		parsed = JSON.parse(encryptedJson);
	} catch (e) {
		return encryptedJson;
	}

	if (!parsed || !parsed.iv || !parsed.ciphertext || !parsed.authTag) {
		return encryptedJson;
	}

	const aesKey = await getTotpEncryptionKey(jwtSecret);

	const iv = new Uint8Array(parsed.iv.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)));
	const ciphertext = new Uint8Array(parsed.ciphertext.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)));
	const authTag = new Uint8Array(parsed.authTag.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)));

	const combined = new Uint8Array(ciphertext.length + authTag.length);
	combined.set(ciphertext);
	combined.set(authTag, ciphertext.length);

	const decryptedBuffer = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv },
		aesKey,
		combined
	);

	return dec.decode(decryptedBuffer);
}
