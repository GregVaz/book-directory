// const util = require('util');
import { default as express } from 'express';
export const router = express.Router();
import { 
  getAddBook,
  viewBook,
  saveBook,
  updateBook,
  destroyBook,
  destroyBookConfirmation 
} from '../controllers/books.mjs';

// Add a book
router.get('/add', getAddBook);

// Read the book (read)
router.get('/view', viewBook);

// Save the book (create)
router.post('/save', saveBook);

// Edit book (update)
router.get('/edit', updateBook);

// Delete book (destroy)
router.get('/destroy', destroyBook);

// Really destroy book
router.post('/destroy/confirm', destroyBookConfirmation);
