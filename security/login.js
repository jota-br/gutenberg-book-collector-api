const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

async function hashPassword(password) {
    if (password.auth_create) {
        return null;
    }
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(32).toString('hex'); // Generate random salt
        crypto.pbkdf2(password.password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
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

async function tokenGeneration(credential, is_valid_credential) {
    if (is_valid_credential) {

        const payload = {
            username: credential.username,
            role: credential.role,
        };

        return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    } else {
        return { error: 'Invalid credential...' };
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
    tokenGeneration,
}