// const util = require('util');
import { default as express } from 'express';
import { BooksStore as books } from '../models/books-store.mjs';
import DBG from 'debug';
const debug = DBG('books:books-sequelize');
const dberror = DBG('books:error-sequelize');

export const router = express.Router();

// Add a book
router.get('/add', (req, res, next) => {
  res.render('bookedit', {
    title: 'Add a book',
    docreate: true,
    key: '',
    book: undefined
  });
});

// Read the book (read)
router.get('/view', async (req, res, next) => {
  try {
    let book = await books.read(req.query.key);
    dberror(book);
    res.render('bookview', {
      title: book ? book.title : '',
      key: req.query.key,
      book: book
    });
  } catch (err) {
    next(err);
  }
});

// Save the book (create)
router.post('/save', async (req, res, next) => {
  try {
    let book;
    if (req.body.docreate === 'create') {
      book = await books.create(
        req.body.title,
        req.body.author,
        req.body.publication_date,
        req.body.abstract,
        req.body.cover);
    } else {
      book = await books.update(
        req.body.key,
        req.body.title,
        req.body.author,
        req.body.publication_date,
        req.body.abstract,
        req.body.cover);
    }
    res.redirect('/books/view?key=' + req.body.key);
  } catch (err) { 
    next(err);
  }
});

// Edit book (update)
router.get('/edit', async (req, res, next) => {
  try {
    const book = await books.read(req.query.key);
    res.render('bookedit', {
      title: book ? ("Edit " + book.title) : "Add a book",
      docreate: false,
      key: req.query.key,
      book: book
    });
  } catch (err) { next(err); };
});

// Delete book (destroy)
router.get('/destroy', async (req, res, next) => {
  try {
    const book = await books.read(req.query.key);
    res.render('bookdestroy', {
      title: book ? book.title : "",
      key: req.query.key,
      book: book
    });
  } catch (err) {
    next(err);
  }
});

// Really destroy book
router.post('/destroy/confirm', async (req, res, next) => {
  try {
    await books.destroy(req.body.bookkey);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});
