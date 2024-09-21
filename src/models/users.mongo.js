const { mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: false,
    },
    hash: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
    },
    oauth: {
        provider: {
            type: String,
            required: false,
        },
        provider_id: {
            type: String,
            required: false,
        },
    },
});

module.exports = model('user', userSchema);