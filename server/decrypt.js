const { privateDecrypt } = require('crypto');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const decrypted = privateDecrypt(
	readFileSync(join(__dirname, 'private.pem')),
	readFileSync(join(__dirname, 'device_key_encrypted.dat'))
);

writeFileSync(join(__dirname, 'device_key.dat'), decrypted);
