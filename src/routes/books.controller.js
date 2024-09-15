const {
    getAllBooks,
    getBookByGutenbergId,
    getBooksByAuthor,
    getBooksBySubject,
    upsertBook,
    deleteByGutenbergId,
} = require('../models/books.model');

const { getPagination } = require('../services/query');

async function httpGetAllBooks(req, res) {
    try {
        const { skip, limit, page } = getPagination(req.query);
        const books = await getAllBooks(skip, limit, page);
        if (books) {
            return res.status(200).json(books);
        }
        throw new Error(`No books found...`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpGetBookByGutenbergId(req, res) {
    try {
        gutenbergId = req.params.id;
        const book = await getBookByGutenbergId(gutenbergId);
        if (book) {
            return res.status(200).json(book);
        }
        throw new Error(`No book found with ID ${gutenbergId}`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpGetBooksByAuthor(req, res) {
    try {
        const { skip, limit, page } = getPagination(req.query);
        const author = req.params.author;
        const books = await getBooksByAuthor(author, skip, limit, page);
        if (books.books_total > 0) {
            return res.status(200).json(books);
        }
        throw new Error(`No book found with author ${author}`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpGetBooksBySubject(req, res) {
    try {
        const { skip, limit, page } = getPagination(req.query);
        const subject = req.params.subject;
        const books = await getBooksBySubject(subject, skip, limit, page);
        if (books.books_total > 0) {
            return res.status(200).json(books);
        }
        throw new Error(`No book found with subject ${subject}`);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpUpsertBook(req, res) {
    try {
        const data = req.body;
        const book = await upsertBook(data);
        return res.status(201).json(book);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

async function httpDeleteByGutenbergId(req, res) {
    try {
        const gutenbergId = req.params.id;
        const result = await deleteByGutenbergId(gutenbergId);
        if (!result.error) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ error: err.message });
    }
}

module.exports = {
    httpGetAllBooks,
    httpGetBookByGutenbergId,
    httpGetBooksByAuthor,
    httpGetBooksBySubject,
    httpUpsertBook,
    httpDeleteByGutenbergId,
}