/*!
* Cryptify-JS v1.0.0 
* Copyright(c) 2024 Roshan K. Paturkar
* MIT Licensed
*/

'use strict';

// Importing the forge module
const forge = require('node-forge');
// Importing the AES utility
const aesUtils = require('./utils/aes');

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
        return decryptedData;
    } catch (error) {
        throw new Error("Error while decrypting data", error);
    }
};

// Exporting the CRYPTIFYJS module
module.exports = CRYPTIFYJS;
