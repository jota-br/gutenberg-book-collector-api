const { mongoose } = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    gutenbergId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
        required: false,
    },
    releaseDate: {
        type: Number,
        required: false,
    },
    subjects: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
    img: {
        type: String,
        required: false,
    },
});

module.exports = model('book', bookSchema);