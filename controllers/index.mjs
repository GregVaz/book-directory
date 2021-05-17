import { BooksStore as books } from '../models/books-store.mjs';

export async function getAllBooks(req, res, next) {
  try {
    const keylist = await books.keylist(req.user.email);
    const keyPromises = keylist.map(id => {
      return books.read(id);
    });
    const notelist = await Promise.all(keyPromises);
    res.render('index', { title: 'Library', notelist: notelist, user: req.user });
  } catch (err) {
    next(err);
  }
}

export function getRegister(req, res, next) {
  res.render('register', {
    title: 'Register',
    message: ''
  });
}

export function getLogin(req, res, next) {
  console.log(req.flash);
  res.render('login', {
    title: 'Login'
  });
}

export function logout(req, res) {
  req.logout();
  res.redirect('/login');
}