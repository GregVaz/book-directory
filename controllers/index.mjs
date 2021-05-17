import { BooksStore as books } from '../models/books-store.mjs';
import { default as passport } from 'passport';

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

export function getRegister(req, res, next) {
  res.render('register', {
    title: 'Register',
    authenticated: req.isAuthenticated()
  });
}

export function getLogin(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
}