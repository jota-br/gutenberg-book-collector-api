const express = require('express');

const {
    httpGetAllBooks,
    httpGetBookByGutenbergId,
    httpGetBooksByAuthor,
    httpGetBooksBySubject,
    httpUpsertBook,
    httpDeleteByGutenbergId,
} = require('./books.controller');

const { authenticateToken } = require('../../security/token.middleware');

const booksRouter = express.Router(); // CREATE ROUTER

function accessCheck(req, res, next) {
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (reqIp === '127.0.0.1' || reqIp === '::1') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied...' });
    }
}

booksRouter.get('/', httpGetAllBooks); // GET all BOOKS
booksRouter.get('/:id', httpGetBookByGutenbergId); // GET BOOK by ID
booksRouter.get('/author/:author', httpGetBooksByAuthor); // GET BOOKS by AUTHOR
booksRouter.get('/subject/:subject', httpGetBooksBySubject); // GET BOOK by SUBJECT
booksRouter.post('/', authenticateToken, httpUpsertBook); // UPSERT BOOK
booksRouter.post('/delete/:id', authenticateToken, httpDeleteByGutenbergId); // DELETE BOOK by ID

module.exports = booksRouter;