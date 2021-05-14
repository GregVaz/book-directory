import { BooksStore as books } from '../models/books-store.mjs';

export async function getAllBooks(req, res, next) {
  try {
    const keylist = await books.keylist();
    const keyPromises = keylist.map(id => {
      return books.read(id);
    });
    const notelist = await Promise.all(keyPromises);
    res.render('index', { title: 'Books', notelist: notelist });
  } catch (err) {
    next(err);
  }
}