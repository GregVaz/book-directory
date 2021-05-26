import { default as express } from 'express';
export const router = express.Router();
import { saveUser } from '../controllers/users.mjs';

// Save the User (create)
router.post('/save', saveUser);
