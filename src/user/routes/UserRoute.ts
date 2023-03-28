import express from 'express';
import { deleteYourAccount, userprofile } from '../controller/UserController';
import { protectedRoute } from '../../middleware/protectedRoute';

const router = express.Router();

router.get('/profile', protectedRoute, userprofile);
router.delete('/delete', protectedRoute, deleteYourAccount);

module.exports = router;
