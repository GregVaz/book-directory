import { BooksStore as books } from '../models/books-store.mjs';
import DBG from 'debug';
const debug = DBG('books:books-sequelize');
const dberror = DBG('books:error-sequelize');

export function getAddBook(req, res, next) {
  res.render('bookedit', {
    title: 'Add a book',
    docreate: true,
    id: '',
    book: undefined
  });
}

export async function viewBook(req, res, next) {
  try {
    let book = await books.read(req.query.id);
    dberror(book);
    res.render('bookview', {
      title: book ? book.title : '',
      id: req.query.id,
      book: book
    });
  } catch (err) {
    next(err);
  }
}

export async function saveBook(req, res, next) {
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
        req.body.id,
        req.body.title,
        req.body.author,
        req.body.publication_date,
        req.body.abstract,
        req.body.cover);
    }
    res.redirect('/books/view?id=' + book.id);
  } catch (err) { 
    next(err);
  }
}

export async function updateBook(req, res, next) {
  try {
    const book = await books.read(req.query.id);
    res.render('bookedit', {
      title: book ? ("Edit " + book.title) : "Add a book",
      docreate: false,
      id: book.id,
      book: book
    });
  } catch (err) { next(err); };
}

export async function destroyBook(req, res, next) {
  try {
    const book = await books.read(req.query.id);
    res.render('bookdestroy', {
      title: book ? book.title : "",
      id: book.id,
      book: book
    });
  } catch (err) {
    next(err);
  }
}

export async function destroyBookConfirmation(req, res, next) {
  try {
    await books.destroy(req.body.id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}