const { mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
});

module.exports = model('user', userSchema);