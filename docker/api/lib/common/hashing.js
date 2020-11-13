'use strict';
const crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function (password, salt) {
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword (password, salt) {
    salt = salt || genRandomString(16); /** Gives us salt of length 16 */
    const passwordData = sha512(password, salt);
    return passwordData;
}

function familyNameToAddressPrefix (familyName) {
    return crypto.createHash('sha512')
                 .update(familyName)
                 .digest('hex')
                 .slice(0, 6)
}

module.exports = { saltHashPassword, familyNameToAddressPrefix }