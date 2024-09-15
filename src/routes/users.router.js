const express = require('express');

const { authenticateToken } = require('../../security/token.middleware');

const usersRouter = express.Router(); // CREATE ROUTER

const {
    httpUserLogin,
    httpUserLogout,
    httpPostUser,
    httpDeleteUserById,

} = require('./users.controller');

async function localAccess(req, res, next) {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (reqIp === '127.0.0.1' || reqIp === '::1') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied...' });
    }
}

usersRouter.post('/create_admin', localAccess, httpPostUser);
usersRouter.post('/login', httpUserLogin);
usersRouter.post('/logout', httpUserLogout);
usersRouter.post('/delete/:id', authenticateToken, httpDeleteUserById);

module.exports = usersRouter;