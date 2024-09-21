async function userOnly(req, res, next) {
    let session = req.session;

    if (!session.role) {
        return res.status(401).json({ error: 'Login required...' });
    } else {
        let date = new Date(Date.now());
        let time = date.toString();
        console.log(`user: ${session.username}:role: ${session.role} @ ${req.originalUrl} -- ${time}`);
    }

    if (session.role !== 'user') {
        return res.status(403).json({ error: 'Access denied...' });
    }

    next();
}

async function adminOnly(req, res, next) {
    let session = req.session;

    if (!session.role) {
        return res.status(401).json({ error: 'Login required...' });
    } else {
        let date = new Date(Date.now());
        let time = date.toString();
        console.log(`user: ${session.username}:role: ${session.role} @ ${req.originalUrl} -- ${time}`);
    }

    if (session.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied...' });
    }

    next();
}

module.exports = {
    userOnly,
    adminOnly,
}