import { UserStore as users } from '../models/books-store.mjs';
import DBG from 'debug';

const debug = DBG('users:users-sequelize');
const dberror = DBG('users:error-sequelize');

export async function saveUser(req, res, next) {
  try {
    const userFind = await users.verify(req.body.email);
    if (userFind) {
      res.render('register', {title: 'Register', message: 'The email already exists'})
      return;
    }
    const User = await users.create(
      req.body.email,
      req.body.password,
      req.body.username);
    res.redirect('/');
  } catch (err) { 
    next(err);
  }
}
