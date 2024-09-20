const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const { postUser } = require('./models/users.model');

const authRouter = require('./routes/auth.router');
const booksRouter = require('./routes/books.router');
const usersRouter = require('./routes/users.router');
const gutenbergRouter = require('./routes/gutenberg.router');

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
}

async function verifyCallback(accessToken, refreshToken, profile, done) {
    const user = {
        username: profile._json.email,
        provider: profile.provider,
        provider_id: profile.id,
        role: 'user',
        auth_create: true,
    }
    await postUser(user);
    done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// save the session to the cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// read the session from the cookie
passport.deserializeUser((user, done) => {
    done(null, user);
});

const app = express();

app.use(helmet());
app.use(passport.initialize());
app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
}));
app.use(passport.session());

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());

app.use(
    function (req, res, next) {
        const start = Date.now();
        next();
        const delta = Date.now() - start;
        let date = new Date(Date.now());
        let time = date.toString();
        console.log(`${req.protocol} ${req.originalUrl} ${delta}ms -- ${req.rawHeaders[1]} - ${req.rawHeaders[3]} ${req.rawHeaders[6]} -- ${req.socket.remoteAddress} -- ${time}`);
    });

app.get('/', (req, res) => {
    res.send({ path: '/'} );
});
app.use('/auth', authRouter); // login and logout in usersRouter should be moved to /auth
app.use('/books', booksRouter); // BOOKS router
app.use('/users', usersRouter); // USERS router
app.use('/collect_gutenberg', gutenbergRouter); // start Collector
app.use('/failure', (req, res) => {
    return res.send('Failed to log in...');
}); // start Collector

module.exports = app;