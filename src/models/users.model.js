const User = require('./users.mongo');
const { 
    hashPassword, 
    verifyPassword,
    tokenGeneration,
} = require('../../security/login');

async function findUserByCredential(credential) {
    try {
        const user_credential = await User.findOne({
            username: credential.username,

        }, { __v: 0, _id: 0 });
        if (user_credential) {
            const is_valid_credential = await verifyPassword(credential.password, user_credential.salt, user_credential.hash);
            return { user_credential, is_valid_credential };
        }
        throw new Error(`Something went wrong... User credential is: ${user_credential}`);
    } catch (err) {
        return { error: err.message };
    }
}

async function userLogin(credential) {
    let has_error = {
        invalid_credential: false,
        error: false,
    };

    try {
        const { user_credential, is_valid_credential } = await findUserByCredential(credential);
        if (is_valid_credential.error || is_valid_credential === false) {
            has_error.invalid_credential = true;
        }

        if (has_error.invalid_credential === true) {
            has_error.error = true;
        }

        if (has_error.error === false) {
            const token = await tokenGeneration(user_credential, is_valid_credential);
            return token;
        }
        throw new Error(`Something went wrong...`);
    } catch (err) {
        return has_error;
    }
}

async function postUser(user) {
    let has_error = {
        missing_username: false,
        username_spaces: false,
        username_exists: false,
        missing_password: false,
        password_spaces: false,
        invalid_role: false,
        error: false,
    };

    let valid_roles = ['admin', 'user'];

    try {
        const user_exists = await User.findOne({
            username: user.username,

        }, { __v: 0, _id: 0 });

        if (user.username) {
            if (user.username.includes(' ')) {
                has_error.username_spaces = true;
            }
        } else {
            has_error.missing_username = true;
        }

        if (user_exists) {
            has_error.username_exists = true;
        }

        if (user.password) {
            if (user.password.includes(' ')) {
                has_error.password_spaces = true;
            }
        } else {
            has_error.missing_password = true;
        }

        if (!valid_roles.includes(user.role)) {
            has_error.invalid_role = true;
        }

        if (has_error.missing_username === true || has_error.username_spaces === true || has_error.missing_password === true || has_error.password_spaces === true || has_error.invalid_role === true || has_error.username_exists === true) {
            has_error.error = true;
        }

        if (has_error.error === false) {
            const id = await User.countDocuments();
            const passwordObject = await hashPassword(user.password);
            const result = await User.create({
                username: user.username,
                salt: passwordObject.salt,
                hash: passwordObject.hash,
                role: user.role,
                id: id,
            });
            const returnResult = result.toObject();
            delete returnResult.__v;
            delete returnResult._id;
            delete returnResult.hash;
            delete returnResult.salt;
            return returnResult;
        }
        throw new Error(`Something went wrong...`);
    } catch (err) {
        return has_error;
    }
}

async function deleteUserById(id) {
    try {
        const result = await User.deleteOne({ id: id });
        if (result.acknowledged === true && result.deletedCount === 1) {
            return { msg: `User with id ${id} was deleted...` };
        }
        throw new Error(`User with id ${id} not found...`);
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    userLogin,
    postUser,
    deleteUserById,
}