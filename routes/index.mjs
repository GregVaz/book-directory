import { default as express } from 'express';
import passport from 'passport';
export const router = express.Router();
import { getAllBooks, getRegister, getLogin, logout } from '../controllers/index.mjs';

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) return next();

  res.redirect('/login');
}, getAllBooks);

router.get('/login', (req, res, next) => {
  if (req.isAuthenticated()) res.redirect('/');

  return next();
}, getLogin);

router.get('/register', (req, res, next) => {
  if (req.isAuthenticated()) res.redirect('/');
  
  return next();
}, getRegister);

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);

router.get('/logout', logout);
