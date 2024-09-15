const Book = require('./books.mongo');

async function stringToDate(str) {
    let dateObj = new Date(str);
    let timestamp = dateObj.getTime();

    if (!isNaN(timestamp) && isFinite(timestamp)) {
        let date = new Date(timestamp);
        if (date.getTime() === timestamp) {
            return timestamp;
        }
        return null;
    }
}

async function getAllBooks(skip, limit, page) {
    try {
        const totalDocuments = await Book.countDocuments();
        const books = await Book
            .find({},{ __v: 0, _id: 0 })
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return { books, books_total: totalDocuments, current_page: page, total_pages: Math.ceil(totalDocuments / limit), books_per_page: limit };
    } catch (err) {
        return { error: err.message };
    }
}

async function getBookByGutenbergId(gutenbergId) {
    try {
        if (!isNaN(gutenbergId)) {
            return await Book.findOne({
                gutenbergId: gutenbergId
            }, { __v: 0, _id: 0 });
        }
        throw new Error(`gutenbergId required...`, {
            cause: { status: 400 }
        });
    } catch (err) {
        return { error: err.message };
    }
}

async function getBooksByAuthor(author, skip, limit, page) {
    try {
        const totalDocuments = await Book.countDocuments({authors: new RegExp(author.split(' ').join('|'), 'i')});
        const books = await Book
            .find({authors: new RegExp(author.split(' ').join('|'), 'i')}, { __v: 0, _id: 0 })
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return { books, books_total: totalDocuments, current_page: page, total_pages: Math.ceil(totalDocuments / limit), books_per_page: limit };
    } catch (err) {
        return { error: err.message };
    }
}

async function getBooksBySubject(subject, skip, limit, page) {
    try {
        const totalDocuments = await Book.countDocuments({ subjects: new RegExp(subject.split(' ').join('|'), 'i') });
        const books = await Book.find({ subjects: new RegExp(subject.split(' ').join('|'), 'i') }, { __v: 0, _id: 0 })
            .sort({ title: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return { books, books_total: totalDocuments, current_page: page, total_pages: Math.ceil(totalDocuments / limit), books_per_page: limit };
    } catch (err) {
        return { error: err.message };
    }
}

async function upsertBook(data) {
    let has_error = {
        missing_gutenbergId: false,
        missing_title: false,
        error: false,
    };

    const book = data;

    try {
        let timestamp = null;
        let book_id = book['Text#'] || book.gutenbergId;
        let book_title = book.Title || book.title;
        let book_authors = book.Authors || book.authors;
        let book_date = book.Issued || book.releaseDate;
        let book_subjects = book.Subjects || book.subjects;
        let book_language = book.Language || book.language;

        if (book_date) {
            timestamp = await stringToDate(book_date);
        }

        if (!book_id) {
            has_error.missing_gutenbergId = true;
        }

        if (!book_title) {
            has_error.missing_title = true;
        }

        if (has_error.missing_gutenbergId || has_error.missing_title) {
            has_error.error = true;
        }

        if (has_error.error === false) {
            let img = `https://www.gutenberg.org/cache/epub/${book_id}/pg${book_id}.cover.medium.jpg`;
            let url = `https://www.gutenberg.org/ebooks/${book_id}`;
            const result = await Book.updateOne({
                gutenbergId: Number(book_id),
            }, {
                gutenbergId: Number(book_id),
                title: book_title,
                authors: book_authors,
                releaseDate: timestamp,
                subjects: book_subjects,
                language: book_language,
                img: img,
                url: url,
            }, {
                upsert: true,
            });

            if (result.acknowledged === true) {
                console.log(`Upsert success: ${book_id} - ${book_title}`);
                book.releaseDate = timestamp;
                return book;
            }
        }
        throw new Error(`Something went wrong...`);
    } catch (err) {
        return has_error;
    }
}

async function deleteByGutenbergId(gutenbergId) {
    try {
        const bookToDelete = await getBookByGutenbergId(gutenbergId);
        if (bookToDelete) {
            const result = await Book.deleteOne({ gutenbergId: bookToDelete.gutenbergId });
            if (result.acknowledged === true && result.deletedCount === 1) {
                return { msg: `Book with gutenbergId ${gutenbergId} was deleted...`};
            }
        }
        throw new Error(`Book with gutenbergId ${gutenbergId} not found...`);
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    getAllBooks,
    getBookByGutenbergId,
    getBooksByAuthor,
    getBooksBySubject,
    upsertBook,
    deleteByGutenbergId,
}