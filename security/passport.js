const { postUser } = require('../src/models/users.model')

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
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

module.exports = {
    AUTH_OPTIONS,
    verifyCallback,
}