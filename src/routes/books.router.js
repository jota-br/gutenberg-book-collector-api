const express = require('express');

const {
    httpGetAllBooks,
    httpGetBookByGutenbergId,
    httpGetBooksByAuthor,
    httpGetBooksBySubject,
    httpUpsertBook,
    httpDeleteByGutenbergId,
} = require('./books.controller');
const booksRouter = express.Router(); // CREATE ROUTER

const {
    adminOnly,
} = require('../security/access');

booksRouter.get('/', httpGetAllBooks); // GET all BOOKS
booksRouter.get('/:id', httpGetBookByGutenbergId); // GET BOOK by ID
booksRouter.get('/author/:author', httpGetBooksByAuthor); // GET BOOKS by AUTHOR
booksRouter.get('/subject/:subject', httpGetBooksBySubject); // GET BOOK by SUBJECT
booksRouter.post('/', adminOnly, httpUpsertBook); // UPSERT BOOK
booksRouter.post('/delete/:id', adminOnly, httpDeleteByGutenbergId); // DELETE BOOK by ID

module.exports = booksRouter;