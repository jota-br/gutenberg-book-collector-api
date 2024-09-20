const express = require('express');
const passport = require('passport');

const {
    httpAuthLogin
} = require('./auth.controller');

const authRouter = express.Router(); // CREATE ROUTER

authRouter.post('/login', httpAuthLogin);
authRouter.get('/logout', (req, res) => {
    req.session= null;
    res.redirect('/');
});
authRouter.get('/google', passport.authenticate('google', {
    scope: ['email'],
})); // Google login

authRouter.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/',
        session: true,
    }), 
    (req, res) => {
        console.log('Google callback');
    }
);

module.exports = authRouter;