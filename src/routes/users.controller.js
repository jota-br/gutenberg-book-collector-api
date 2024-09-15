const {
    userLogin,
    postUser,
    deleteUserById,
} = require('../models/users.model');

async function httpUserLogin(req, res) {
    try {
        const credential = req.body;
        const result = await userLogin(credential);
        if (!result.error) {
            const cookieOptions = {
                httpOnly: true, // Not accessible via JavaScript
                secure: process.env.NODE_ENV === 'production', // In production use TRUE
                maxAge: 3600000 // 1 hour
            };
            res.cookie('token', result, cookieOptions);
            return res.status(200).json({ token: result });
        }
        return res.status(401).json(result);
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ error: err.message });
    }
}

async function httpUserLogout(req, res) {
    try {
        if (req.cookies.token) {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            };
            res.clearCookie('token', cookieOptions);
            return res.status(200).json({ msg: 'Logged out successfully...' });
        }
        throw new Error(`You must be logged in to logout...`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpPostUser(req, res) {
    try {
        const user = req.body;
        const result = await postUser(user);
        if (!result.error) {
            return res.status(201).json(result);
        }
        return res.status(400).json(result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpDeleteUserById(req, res) {
    try {
        const id = req.params.id;
        const result = await deleteUserById(id);
        if (!result.error) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

module.exports = {
    httpUserLogin,
    httpUserLogout,
    httpPostUser,
    httpDeleteUserById,
}