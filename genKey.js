const { generateKeyPairSync } = require('crypto');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
	modulusLength: 4096, // Key length 4096 for security
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem'
	}
});

writeFileSync(join(__dirname, 'server', 'private.pem'), privateKey);
writeFileSync(join(__dirname, 'server', 'public.pem'), publicKey);

console.log('Key pair generated, don\'t forget to change the PUBLIC_KEY in client/encrypt.js');
