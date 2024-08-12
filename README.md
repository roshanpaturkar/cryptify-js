# cryptify-js
A simple library to encrypt and decrypt strings using AES-256-CBC & RSA algorithm.
This library is written in JavaScript and can be used in both Node.js and TypeScript projects.
This is very useful when you want to encrypt some sensitive data and store it in a database or send it over the network.
It's tested with Nodejs & TypeScript, also supported in the browser. Tested in angular and react projects.

## Features
- Encrypt and decrypt strings using AES-256-CBC & RSA algorithm.
- Encrypt and decrypt objects.
- Supported in Node.js, TypeScript, and the browser.

## Encryption Approach
- Generate a random key and iv for each encryption.
- Encrypt the data using the generated key and iv.
- Encrypt the generated key using the public key.
- Return the encrypted key, iv, and data.

## Decryption Approach
- Decrypt the encrypted key using the private key.
- Decrypt the data using the decrypted key and iv.
- Return the decrypted data.

## Requirements
- Node.js v10.0.0 or higher
- TypeScript v4.0.0 or higher
- RSA Public and Private Key in base64 format

## Generating RSA Public and Private Key and Convert to Base64
```bash
# Generate RSA Private Key - Mac
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Generate RSA Public Key - Mac
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert Private Key to Base64 - Mac
base64 -i private_key.pem -o private_key_base64.txt
# Linux
base64 private_key.pem > private_key_base64.txt

# Convert Public Key to Base64 - Mac
base64 -i public_key.pem -o public_key_base64.txt
# Linux
base64 public_key.pem > public_key_base64.txt
```

## License
This project is licensed under the MIT License.

## Installation
```bash
npm install cryptify-js
```

## Usage
```javascript
const Cryptify = require('cryptify-js');

const cryptify = new Cryptify({
    publicKey: 'RSA PUBLIC KEY BASE64',
    privateKey: 'RSA PRIVATE KEY BASE64'
});

const data = {
    name: 'John Doe',
    email: 'john@mail.com',
    phone: '1234567890'
};

const encrypted = cryptify.encrypt(data);
const decrypted = cryptify.decrypt(encrypted.key, encrypted.iv, encrypted.data);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
```

## Supported Methods

### `encrypt(data: any): { key: string, iv: string, data: string }`
Encrypts the given data and returns the encrypted key, iv, and data.

### `decrypt(key: string, iv: string, data: string): any`
Decrypts the given key, iv, and data and returns the decrypted data.

