const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

const { AUTH_OPTIONS, verifyCallback } = require('../../security/passport'); 

const authRouter = express.Router(); // CREATE ROUTER

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

authRouter.get('/google', passport.authenticate('google', {
    scope: ['email'],
})); // Google login

authRouter.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/',
        session: false,
    }), 
    (req, res) => {
        console.log('Google callback');
    }
);

module.exports = authRouter;