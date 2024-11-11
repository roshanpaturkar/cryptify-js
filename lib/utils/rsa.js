/*!
* Cryptify-JS v1.0.7
* Copyright(c) 2024 Roshan K. Paturkar
* MIT Licensed
*/

'use strict';

// Importing the forge module
const forge = require('node-forge');

/**
 * RSA utility
 * RSA encryption and decryption utility
 */
const RSA = {
    /**
     * Encrypt the message using the RSA algorithm and return the encrypted message.
     * Message will be in base64 format.
     * @param {String} message Message to be encrypted
     * @param {String} publicKey RSA public key in base64 format
     * @returns {String} Encrypted message
     * @throws {Error} If an error occurs while encrypting the message
     */ 
    encrypt: (message, publicKey) => {
        try {
            const encryptedMessage = publicKey.encrypt(message, 'RSA-OAEP', {
                md: forge.md.sha256.create(),
            })

            return forge.util.encode64(encryptedMessage);
        } catch (error) {
            console.log(error);
            throw new Error("Error while encrypting message", error);
        }
    },

    /**
     * Decrypt the message using the RSA algorithm and return the decrypted message.
     * @param {String} encryptedMessage Encrypted message
     * @param {String} privateKey RSA private key in base64 format
     * @returns {String} Decrypted message
     * @throws {Error} If an error occurs while decrypting the message
     */
    decrypt: (encryptedMessage, privateKey) => {
        try {
            const decryptedMessage = privateKey.decrypt(forge.util.decode64(encryptedMessage), 'RSA-OAEP', {
                md: forge.md.sha256.create(),
            });

            return decryptedMessage;
        } catch (error) {
            throw new Error("Error while decrypting message", error);
        }
    },
};

// Exporting the RSA utility
module.exports = RSA;