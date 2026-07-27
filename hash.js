const crypto = require('crypto');

async function hashPassword(password) {
	let salt = crypto.randomBytes(16);
	const saltB64 = salt.toString('base64');
	
	const key = await new Promise((resolve, reject) => {
	    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
	        if (err) reject(err);
	        else resolve(derivedKey);
	    });
	});
	
	const hashHex = key.toString('hex');
	console.log(`${saltB64}:${hashHex}`);
}

hashPassword('admin123');
