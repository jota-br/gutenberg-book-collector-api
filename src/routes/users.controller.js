const {
    postUser,
    deleteUserById,
} = require('../models/users.model');

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
    httpPostUser,
    httpDeleteUserById,
}