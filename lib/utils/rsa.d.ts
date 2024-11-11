/**
 * Encrypt the message using the RSA algorithm and return the encrypted message.
 * Message will be in base64 format.
 * @param {String} message Message to be encrypted
 * @param {String} publicKey RSA public key in base64 format
 * @returns {String} Encrypted message
 * @throws {Error} If an error occurs while encrypting the message
 */
export function encrypt(message: string, publicKey: string): any;

/**
 * Decrypt the message using the RSA algorithm and return the decrypted message.
 * @param {String} encryptedMessage Encrypted message
 * @param {String} privateKey RSA private key in base64 format
 * @returns {String} Decrypted message
 * @throws {Error} If an error occurs while decrypting the message
 */
export function decrypt(encryptedMessage: string, privateKey: string): string;