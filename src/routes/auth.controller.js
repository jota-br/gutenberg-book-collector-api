const {
    authLogin,
} = require('../models/auth.model');

async function httpAuthLogin(req, res) {
    try {
        const data = req.body;
        const result = await authLogin(data);
        if (!result.error) {
            req.session.username = result.username;
            req.session.role = result.role;
            return res.status(200).json({ 
                username: req.session.username, 
                role: req.session.role,
            });
        }
        return res.status(400).json(result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

module.exports = {
    httpAuthLogin,
}