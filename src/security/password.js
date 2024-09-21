const crypto = require('crypto');

async function hashPassword(user) {
    if (user.auth_create) {
        return null;
    }
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(32).toString('hex'); // Generate random salt
        crypto.pbkdf2(user.password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve({
                salt: salt,
                hash: derivedKey.toString('hex')
            });
        });
    });
}

async function verifyPassword(password, salt, storedHash) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(storedHash === derivedKey.toString('hex'));
        });
    });
}

module.exports = {
    hashPassword,
    verifyPassword,
}