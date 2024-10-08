const User = require('./users.mongo');

const { 
    hashPassword,
} = require('../security/password');

async function findUserByUsername(username) {
    try {
        return await User.findOne({
            username: username,
        }, { __v: 0, _id: 0 });
    } catch (err) {
        return { error: err.message };
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
        const user_exists = await findUserByUsername(user.username);

        if (user_exists) {
            has_error.username_exists = true;
        }

        if (!valid_roles.includes(user.role)) {
            has_error.invalid_role = true;
        }

        if (!user.auth_create) {
            if (user.username) {
                if (user.username.includes(' ')) {
                    has_error.username_spaces = true;
                }
            } else {
                has_error.missing_username = true;
            }

            if (user.password) {
                if (user.password.includes(' ')) {
                    has_error.password_spaces = true;
                }
            } else {
                has_error.missing_password = true;
            }

        }

        if (has_error.missing_username === true || has_error.username_spaces === true || has_error.missing_password === true || has_error.password_spaces === true || has_error.invalid_role === true || has_error.username_exists === true) {
            has_error.error = true;
        }

        if (has_error.error === false) {
            const passwordObject = await hashPassword(user);

            const result = await User.create({
                username: user.username,
                salt: passwordObject.salt || null,
                hash: passwordObject.hash || null,
                role: user.role,
                oauth: {
                    provider: user.provider || null,
                    provider_id: user.provider_id || null,
                },
            });
            const returnResult = result.toObject();
            delete returnResult.__v;
            delete returnResult._id;
            delete returnResult.hash;
            delete returnResult.salt;
            delete returnResult.provider;
            delete returnResult.provider_id;
            return returnResult;
        }
        throw new Error(`Something went wrong...`);
    } catch (err) {
        return has_error;
    }
}

async function deleteUserById(id) {
    try {
        const result = await User.deleteOne({ _id: id });
        if (result.acknowledged === true && result.deletedCount === 1) {
            return { msg: `User with id ${id} was deleted...` };
        }
        throw new Error(`User with id ${id} not found...`);
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    findUserByUsername,
    postUser,
    deleteUserById,
}