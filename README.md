# Node.js Ransomware

This is a proof-of-concept Node.js ransomware.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
![david](https://david-dm.org/EL-MTN/Ransomware.svg)

## Disclaimers

This project **DOES NOT** provide the full functionalities and capabilities of a modern ransomware. For example, it doesn't allow for communication of keys between the server and client, rather, you will have to manually communicate these keys by yourself.

The smart contract for reading ethereum transactions and communicating keys with the client is a WIP.

## Table of Contents

- [Pre-requisites](#pre_requisites)
- [Getting Started](#getting_started)
- [Inner Workings](#inner_workings)
- [Project Structure](#project_structure)
- [Dependencies](#dependencies)
- [License](#license)

### Pre-requisites

- Have [Node.js](https://nodejs.org/) installed
- Recommended editor: [VS Code](https://code.visualstudio.com/)

### Getting Started

- Clone the repo

```sh
git clone https://github.com/
```

- Generate unique key pair

```sh
node genKey.js
```

- Modify the `PUBLIC_KEY` in `client/encrypt.js`

- Distribute the virus (Know what you're doing)

### Inner Workings

- 1.  The ransomware first creates a public/private RSA key pair, in which only the private key can decrypt information encrypted by the public key. This creates asymmetrical encryption, in which the client cannot decrypt their own files by themselves
- 2.  The public key is bundled and handed out in the ransomware
- 3.  A unique device key is created for each computer, and encrypted by the public key. This device key is used to encrypt files in a directory
- 4.  The client's files are locked down by running the **encrypt** executable
- 5.  The server receives the client's payment and answers their request to decrypt their device key
- 6.  The server decrypts the device key encoded by the public key using the private key, by running ```decrypt.js```
- 7.  The resulting device key is sent back to the client, and used to decrypt their files

### Project Structure

| Name | Description |
| -----------  | ----------------------------------------------------------------------- |
| **.vscode**  | Holds VS Code editor specific settings                                  |
| **client**   | Contains the virus code intended for infection on the client            |
| **server**   | Holds the public and private key intended for decryption of device keys |
| **scripts**  | Contains shell scripts for building executable                          |
| genKey.js    | Creates a master RSA key pair                                           |
| package.json | Contains information of this package for npm, including dependencies    |

### Dependencies

This code runs just fine on plain [Node.js](https://nodejs.org), however, [pkg](https://github.com/vercel/pkg) can help with bundling code into binaries for execution, it also has support across platforms. **NOTE**: Bundled binary sizes may be large, very.

### License

Licensed under the [MIT](LICENSE.txt) License.

Copyright © 2020 Eric Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
