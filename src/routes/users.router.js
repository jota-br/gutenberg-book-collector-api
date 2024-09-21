const express = require('express');

const usersRouter = express.Router(); // CREATE ROUTER

const {
    httpPostUser,
    httpDeleteUserById,

} = require('./users.controller');

const { 
    userOnly,
    adminOnly, 
} = require('../security/access');

async function localAccess(req, res, next) {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (reqIp === '127.0.0.1' || reqIp === '::1' || reqIp === '::ffff:127.0.0.1') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied...' });
    }
}

usersRouter.post('/create_admin', localAccess, httpPostUser);
usersRouter.post('/delete/:id', adminOnly, httpDeleteUserById);

module.exports = usersRouter;