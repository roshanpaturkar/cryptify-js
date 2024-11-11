/*!
* Cryptify-JS v1.0.7
* Copyright(c) 2024 Roshan K. Paturkar
* MIT Licensed
*/

'use strict';

// Importing the forge module
const forge = require('node-forge');

/**
 * AES utility
 * AES encryption and decryption utility
 */
const AES = {
    /**
     * Encrypt the data using the AES algorithm and return the symmetric key and IV used for encryption along with the encrypted data.
     * @param {Object} data Data to be encrypted
     * @returns {Object} Encrypted data with symmetric key and IV
     * @returns {Object.key} Symmetric key used for encryption
     * @returns {Object.iv} Initialization vector used for encryption
     * @returns {Object.data} Encrypted data
     * @throws {Error} If an error occurs while encrypting the data
     */
    encrypt: (data) => {
        try {
            data = JSON.stringify(data);

            const symmetricKey = forge.random.getBytesSync(32); // 256-bit key
            const iv = forge.random.getBytesSync(16); // 128-bit IV

            const cipher = forge.cipher.createCipher("AES-CBC", symmetricKey);
            cipher.start({ iv: iv });
            cipher.update(forge.util.createBuffer(data));
            cipher.finish();
            const encryptedData = cipher.output.getBytes();

            return {
                key: symmetricKey,
                iv,
                data: encryptedData,
            };
        } catch (error) {
            throw new Error("Error while encrypting data", error);
        }
    },

    /**
     * Decrypt the data using the AES algorithm. The symmetric key and IV used for encryption are required for decryption. The decrypted data is returned.
     * @param {String} key Symmetric key used for encryption
     * @param {String} iv Initialization vector used for encryption
     * @param {String} data Encrypted data
     * @returns {String} Decrypted data
     * @throws {Error} If an error occurs while decrypting the data
     */
    decrypt: (key, iv, data) => {
        try {
            const decipher = forge.cipher.createDecipher("AES-CBC", key);

            decipher.start({ iv: iv });
            decipher.update(forge.util.createBuffer(data));
            decipher.finish();
            const decryptedData = decipher.output.toString();

            return decryptedData;
        } catch (error) {
            throw new Error("Error while decrypting data", error);
        }
    },
};

// Export the AES module
module.exports = AES;