const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const booksRouter = require('./routes/books.router');
const gutenbergRouter = require('./routes/gutenberg.router');
const usersRouter = require('./routes/users.router');

const app = express();

app.use(cookieParser());

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(
    function(req, res, next) {
        const start = Date.now();
        next();
        const delta = Date.now() - start;
        let date = new Date(Date.now());
        let time = date.toString();
        console.log(`${req.protocol} ${req.originalUrl} ${delta}ms -- ${req.rawHeaders[1]} - ${req.rawHeaders[3]} ${req.rawHeaders[6]} -- ${req.socket.remoteAddress} -- ${time}`);
    });

app.use(express.json());

app.use('/books', booksRouter); // BOOKS router
app.use('/collect_gutenberg', gutenbergRouter); // start Collector
app.use('/users', usersRouter); // USERS router

module.exports = app;