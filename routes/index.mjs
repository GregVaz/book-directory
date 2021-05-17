import { default as express } from 'express';
export const router = express.Router();
import { getAllBooks, getRegister, getLogin } from '../controllers/index.mjs';

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