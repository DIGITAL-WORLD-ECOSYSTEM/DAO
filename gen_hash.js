const { webcrypto: crypto } = require('crypto');

async function hashPassword(password, existingSaltB64) {
	const enc = new TextEncoder();
	let salt;

	if (existingSaltB64) {
		const rawString = atob(existingSaltB64);
		salt = new Uint8Array(rawString.length);
		for (let i = 0; i < rawString.length; i++) {
			salt[i] = rawString.charCodeAt(i);
		}
	} else {
		salt = crypto.getRandomValues(new Uint8Array(16));
	}

	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);

	const derivedBits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
		keyMaterial,
		256, 
	);

	const hashArray = Array.from(new Uint8Array(derivedBits));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	const finalSaltB64 = btoa(String.fromCharCode(...salt));
	return `${finalSaltB64}:${hashHex}`;
}

hashPassword('admin123').then(console.log).catch(console.error);

function timingSafeEqual(a, b) {
	if (a.length !== b.length) {
		let result = 0;
		for (let i = 0; i < a.length; i++) {
			result |= a.charCodeAt(i) ^ a.charCodeAt(i);
		}
		return false;
	}
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}

async function verifyPassword(password, storedHashText) {
	const [saltB64, originalHex] = storedHashText.split(':');
	if (!saltB64 || !originalHex) return false;

	const freshHashFull = await hashPassword(password, saltB64);
	const [, freshHex] = freshHashFull.split(':');

	return timingSafeEqual(originalHex, freshHex);
}

verifyPassword('admin123', 'h5xfNYbFo0xqk2m5t+PNyA==:6c9f3360f84d28b9174eb8a0d3428ed09a671a3d8aaec0492f72ba44810b950d').then(res => console.log('Matches:', res)).catch(console.error);
