const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied...' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied...' });
        }
        
        let date = new Date(Date.now());
        let time = date.toString();
        console.log(`user: ${user.username} : role: ${user.role} @ ${req.originalUrl} - ${time}`);

        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
}