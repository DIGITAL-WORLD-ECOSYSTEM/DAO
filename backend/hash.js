const crypto = require('crypto');
const password = "password123";
const salt = crypto.randomBytes(16);
crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
  const saltB64 = salt.toString('base64');
  const hashHex = derivedKey.toString('hex');
  console.log(`${saltB64}:${hashHex}`);
});
