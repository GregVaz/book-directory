import { default as express } from 'express';
import { BooksStore as books } from '../models/books-store.mjs';
export const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const keylist = await books.keylist();
    const keyPromises = keylist.map(key => {
      return books.read(key);
    });
    const notelist = await Promise.all(keyPromises);
    res.render('index', { title: 'Books', notelist: notelist });
  } catch (err) {
    next(err);
  }
});
