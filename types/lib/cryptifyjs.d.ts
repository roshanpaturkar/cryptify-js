export = CRYPTIFYJS;
/**
 * CRYPTIFY-JS module
 * Initialize the CRYPTIFY-JS module with the given `options`.
 * The options must contains the RSA publicKey and privateKey in base64 format.
 * @param {Object} options
 * @param {String} options.publicKey The RSA publicKey in base64 format.
 * @param {String} options.privateKey The RSA privateKey in base64 format.
 * @throws {Error} when the options is not provided.
 */
declare function CRYPTIFYJS(options: {
    publicKey: string;
    privateKey: string;
}): void;
declare class CRYPTIFYJS {
    /**
     * CRYPTIFY-JS module
     * Initialize the CRYPTIFY-JS module with the given `options`.
     * The options must contains the RSA publicKey and privateKey in base64 format.
     * @param {Object} options
     * @param {String} options.publicKey The RSA publicKey in base64 format.
     * @param {String} options.privateKey The RSA privateKey in base64 format.
     * @throws {Error} when the options is not provided.
     */
    constructor(options: {
        publicKey: string;
        privateKey: string;
    });
    publicKey: any;
    privateKey: any;
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
    encrypt(data: any): any;
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
    decrypt(key: string, iv: string, data: string): any;
}
