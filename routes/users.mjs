import { default as express } from 'express';
export const router = express.Router();
import {
  getUser,
  saveUser,
  updateUser,
  destroyUser,
  destroyUserConfirmation } from '../controllers/users.mjs';

// Read the User (read)
router.get('/view', getUser);

// Save the User (create)
router.post('/save', saveUser);

// Edit User (update)
router.get('/edit', updateUser);

// Delete User (destroy)
router.get('/destroy', destroyUser);

// Really destroy User
router.post('/destroy/confirm', destroyUserConfirmation);
