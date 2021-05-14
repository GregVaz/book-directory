import { default as express } from 'express';
export const router = express.Router();
import { getAllBooks } from '../controllers/index.mjs';

/* GET home page. */
router.get('/', getAllBooks);
