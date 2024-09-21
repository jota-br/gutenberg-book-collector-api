const {
    findUserByUsername,
} = require('../models/users.model');

const {
    verifyPassword,
} = require('../security/password');

async function authLogin(data) {
    let has_error = {
        invalid_username: false,
        invalid_credential: false,
        error: false,
    };

    try {
        let username = data.username;
        let password = data.password;
        const user = await findUserByUsername(username);
        if (user) {
            const result = await verifyPassword(password, user.salt, user.hash);
            if (result) {
                return user;
            }
            has_error.invalid_credential = true;
        } else {
            has_error.invalid_username = true;
        }
        if (has_error.invalid_username || has_error.invalid_credential) {
            has_error.error = true;
        }
        throw new Error(`Authentication unsuccessful...`);
    } catch (err) {
        return has_error;
    }
}

module.exports = {
    authLogin,
}