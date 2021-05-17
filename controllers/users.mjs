import { UserStore as users } from '../models/books-store.mjs';
import DBG from 'debug';
const debug = DBG('users:users-sequelize');
const dberror = DBG('users:error-sequelize');

export async function getUser(req, res, next) {
  try {
    let User = await users.read(req.query.email);
    res.render('Userview', {
      username: User ? User.username : '',
      email: req.query.email,
      User: User
    });
  } catch (err) {
    next(err);
  }
}

export async function saveUser(req, res, next) {
  try {
    const userFind = await users.read(req.body.email);
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

export async function updateUser(req, res, next) {
  try {
    const User = await users.read(req.query.email);
    res.render('Useredit', {
      username: User ? ("Edit " + User.username) : "Add a User",
      email: User.email,
      User: User
    });
  } catch (err) { next(err); };
}

export async function destroyUser(req, res, next) {
  try {
    const User = await users.read(req.query.email);
    res.render('Userdestroy', {
      username: User ? User.username : "",
      email: User.email,
      User: User
    });
  } catch (err) {
    next(err);
  }
}

export async function destroyUserConfirmation(req, res, next) {
  try {
    await users.destroy(req.body.email);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}