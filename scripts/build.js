const pkg = require('pkg');

if (pkg) {
	const { join } = require('path');

	const encrypt = join(__dirname, '../', 'client', 'encrypt.js');
	const decrypt = join(__dirname, '../', 'client', 'decrypt.js');

	(async () => {
		console.log('Compiling binaries for Windows');

		await pkg.exec([
			encrypt,
			'--target',
			'node14-win-x64',
			'--output',
			`${join(__dirname, '../', 'dist', 'encrypt.exe')}`,
		]);
		await pkg.exec([
			decrypt,
			'--target',
			'node14-win-x64',
			'--output',
			`${join(__dirname, '../', 'dist', 'decrypt.exe')}`,
		]);

		console.log('Compiling binaries for MacOS');
		await pkg.exec([
			encrypt,
			'--target',
			'node14-macos-x64',
			'--output',
			`${join(__dirname, '../', 'dist', 'encrypt')}`,
		]);

		await pkg.exec([
			decrypt,
			'--target',
			'node14-macos-x64',
			'--output',
			`${join(__dirname, '../', 'dist', 'decrypt')}`,
		]);

		console.log('Compiling binaries for Linux');
		await pkg.exec([
			encrypt,
			'--target',
			'node14-linux-x64',
			'--output',
			`${join(__dirname, '../', 'dist', 'encrypt.elf')}`,
		]);

		await pkg.exec([
			decrypt,
			'--target',
			'node14-linux-x64',
			'--output',
			`${join(__dirname, '../', 'dist', 'decrypt.elf')}`,
		]);

		console.log('Compilation complete');
	})();
} else {
	console.log('pkg is not installed!');
}
