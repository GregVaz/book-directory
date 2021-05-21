import { default as express } from 'express';
import passport from 'passport';
export const router = express.Router();
import { getAllBooks, getRegister, getLogin, logout } from '../controllers/index.mjs';
import { validateSession, redirectToActiveSession } from '../middleware/index.mjs';

router.get('/', validateSession, getAllBooks);

router.get('/login', redirectToActiveSession, getLogin);

router.get('/register', redirectToActiveSession, getRegister);

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);

router.get('/logout', logout);
