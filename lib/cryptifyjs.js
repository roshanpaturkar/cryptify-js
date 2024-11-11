/*!
* Cryptify-JS v1.0.7
* Copyright(c) 2024 Roshan K. Paturkar
* MIT Licensed
*/

'use strict';

// Importing the forge module
const forge = require('node-forge');
// Importing the AES utility
const aesUtils = require('./utils/aes');
// Importing the RSA utility
const rsaUtils = require('./utils/rsa');

/**
 * CRYPTIFY-JS module
 * Initialize the CRYPTIFY-JS module with the given `options`.
 * The options must contains the RSA publicKey and privateKey in base64 format.
 * @param {Object} options
 * @param {String} options.publicKey The RSA publicKey in base64 format.
 * @param {String} options.privateKey The RSA privateKey in base64 format.
 * @throws {Error} when the options is not provided.
 */
function CRYPTIFYJS(options) {
    if (!options) {
        throw new Error("cryptify-js module requires an options object");
    }

    this.publicKey = forge.pki.publicKeyFromPem(
        forge.util.decode64(options.publicKey)
    );
    this.privateKey = forge.pki.privateKeyFromPem(
        forge.util.decode64(options.privateKey)
    );
}

/**
 * Encrypt the data using the AES algorithm and return the symmetric key and IV used for encryption along with the encrypted data.
 * The encrypted key will be encrypted using RSA public key.
 * @param {Object} data Data to be encrypted
 * @returns {Object} Encrypted data with symmetric key and IV
 * @returns {Object.key} Symmetric key used for encryption
 * @returns {Object.iv} Initialization vector used for encryption
 * @returns {Object.data} Encrypted data
 * @throws {Error} If an error occurs while encrypting the data
 * @throws {Error} If data is not provided or if data is not an object
*/
CRYPTIFYJS.prototype.encrypt = function (data) {
    if (!data) {
        throw new Error("Data is required for encryption");
    }

    if (typeof data !== "object") {
        throw new Error("Data must be an object");
    }

    try {
        // Encrypt the data using the AES algorithm
        let encryptedData = aesUtils.encrypt(data);
        // Encrypt the AES key using the RSA public key of the application
        const encryptedKey = this.publicKey.encrypt(
            encryptedData.key,
            "RSA-OAEP",
            {
                md: forge.md.sha256.create(),
                mgf1: {
                    md: forge.md.sha1.create(), // OAEP with SHA-1 as MGF1
                },
            }
        );

        // Return the encrypted data with the encrypted AES key
        return {
            key: encryptedKey,
            iv: encryptedData.iv,
            data: encryptedData.data,
        };
    } catch (error) {
        throw new Error("Error while encrypting data", error);
    }
};

/**
 * Decrypt the data using the AES algorithm. The symmetric key and IV used for encryption are required for decryption.
 * Key will be decrypted using RSA private key.
 * The decrypted data is returned.
 * @param {String} key Symmetric key used for encryption
 * @param {String} iv Initialization vector used for encryption
 * @param {String} data Encrypted data
 * @returns {Object} Decrypted data
 * @throws {Error} If data, key, or iv is not provided or if an error occurs while decrypting the data
 * @throws {Error} If key, iv, or data is not a string
 * @throws {Error} If an error occurs while decrypting the data
*/
CRYPTIFYJS.prototype.decrypt = function (key, iv, data) {
    if (!key || !iv || !data) {
        throw new Error("Key, IV, and Data are required for decryption");
    }

    if (
        typeof key !== "string" ||
        typeof iv !== "string" ||
        typeof data !== "string"
    ) {
        throw new Error("Key, IV, and Data must be strings");
    }

    try {
        // Get the current time in ISO format
        const time = new Date().toISOString();
        const decryptedKey = this.privateKey.decrypt(key, "RSA-OAEP", {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha1.create(), // OAEP with SHA-1 as MGF1
            },
        });

        // Decrypt the data using the AES algorithm
        const decryptedData = aesUtils.decrypt(decryptedKey, iv, data);

        // Return the decrypted data
        return JSON.parse(decryptedData);
    } catch (error) {
        throw new Error("Error while decrypting data", error);
    }
};

/**
 * Encrypt the message using the AES algorithm and return the encrypted Message, Key and IV.
 * The AES key will be encrypted using RSA public key.
 * Key, IV and Message will be in base64 format.
 * @param {String} message Message to be encrypted
 * @returns {Object} Encrypted message with encrypted key and IV
 * @returns {Object.key} Encrypted key
 * @returns {Object.iv} Encrypted IV
 * @returns {Object.message} Encrypted message
 * @throws {Error} If message is not provided or if an error occurs while encrypting the message
 * @throws {Error} If message is not a string
 * @throws {Error} If an error occurs while encrypting the message
*/
CRYPTIFYJS.prototype.encryptMessage = function (message) {
    // Check if the message is provided
    if (!message) {
        throw new Error("Message is required for encryption");
    }

    // Check if the message is a string
    if (typeof message !== "string") {
        throw new Error("Message must be a string");
    }

    try {
        // Encrypt the data using the AES algorithm
        let encryptedData = aesUtils.encrypt(message);

        // Encrypt the AES key using the RSA public key of the application
        const encryptedKey = rsaUtils.encrypt(encryptedData.key, this.publicKey);

        // Return the encrypted data with the encrypted AES key
        return {
            key: encryptedKey,
            iv: forge.util.encode64(encryptedData.iv),
            message: forge.util.encode64(encryptedData.data),
        };
    } catch (error) {
        throw new Error("Error while encrypting message", error);
    }
};

/**
 * Decrypt the message using the AES algorithm. The symmetric Key and IV used for encryption are required for decryption.
 * Key will be decrypted using RSA private key.
 * The decrypted message is returned.
 * @param {String} key Encrypted key
 * @param {String} iv Encrypted IV
 * @param {String} message Encrypted message
 * @returns {String} Decrypted message
 * @throws {Error} If key, iv, or message is not provided or if an error occurs while decrypting the message
 * @throws {Error} If key, iv, or message is not a string
 * @throws {Error} If an error occurs while decrypting the message
 */
CRYPTIFYJS.prototype.decryptMessage = function (key, iv, message) {
    // Check if the key, iv, and message are provided
    if (!key || !iv || !message) {
        throw new Error("Key, IV, and Message are required for decryption");
    }

    // Check if the key, iv, and message are strings
    if (
        typeof key !== "string" ||
        typeof iv !== "string" ||
        typeof message !== "string"
    ) {
        throw new Error("Key, IV, and Message must be strings");
    }

    try {
        // Decrypt the AES key using the RSA private key of the application
        const decryptedKey = rsaUtils.decrypt(key, this.privateKey);
        const decryptedIV = forge.util.decode64(iv);
        const decryptedMessage = aesUtils.decrypt(decryptedKey, decryptedIV, forge.util.decode64(message));

        // Return the decrypted message
        return decryptedMessage;
    } catch (error) {
        throw new Error("Error while decrypting message", error);
    }
};

// Exporting the CRYPTIFYJS module
module.exports = CRYPTIFYJS;
