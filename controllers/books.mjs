import { BooksStore as books } from '../models/books-store.mjs';
import { default as sendEmail } from '../mail/mailer.mjs';
import { default as summaryDoc } from '../entities/pdf-summary.mjs';
import { approotdir } from '../approotdir.mjs';
import DBG from 'debug';

const debug = DBG('books:books-sequelize');
const dberror = DBG('books:error-sequelize');

export function getAddBook(req, res, next) {
  res.render('bookedit', {
    title: 'Add a book',
    docreate: true,
    id: '',
    book: undefined,
    user: req.user
  });
}

export async function viewBook(req, res, next) {
  try {
    let book = await books.read(req.query.id);
    res.render('bookview', {
      title: book ? book.title : '',
      id: req.query.id,
      book,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
}

export async function saveBook(req, res, next) {
  try {
    let book;
    if (req.body.cover.trim().length === 0) {
      req.body.cover = 'https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg';
    }
    if (req.body.docreate === 'create') {
      book = await books.create(
        req.body.title,
        req.body.author,
        req.body.publication_date,
        req.body.abstract,
        req.body.cover,
        req.body.userId);
      await sendEmail(true, req.body);
    } else {
      book = await books.update(
        req.body.id,
        req.body.title,
        req.body.author,
        req.body.publication_date,
        req.body.abstract,
        req.body.cover,
        req.body.userId);
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
      book,
      user: req.user
    });
  } catch (err) { next(err); };
}

export async function destroyBook(req, res, next) {
  try {
    const book = await books.read(req.query.id);
    res.render('bookdestroy', {
      title: book ? book.title : "",
      id: book.id,
      book,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
}

export async function destroyBookConfirmation(req, res, next) {
  try {
    await books.destroy(req.body.id);
    await sendEmail(false, {userId: req.user.email, title: req.body.title});
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

export async function middlewareBooks(req, res, next) {
  try {
    const book = await books.read(req.query.id);
    if (req.user.email !== book.userId) {
      res.redirect('/');
    }
    next();
  } catch (err) {
    res.redirect('/');
  }
}

export async function getSummary(req, res, next) {
  try {
    const keylist = await books.keylist(req.user.email);
    const keyPromises = keylist.map(id => {
      return books.read(id);
    });
    let booklist = await Promise.all(keyPromises);
    booklist = booklist.map(book => {book.publication_date = book.publication_date.toDateString(); return book; });
    summaryDoc(booklist);
    const file = `${approotdir}/summary-books.pdf`;
    res.download(file);
  } catch (err) {
    next(err);
  }
}
