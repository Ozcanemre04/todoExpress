import express from 'express';
import { authentication, logout, refresh, registerUser, verifyEmail } from '../controller/AuthController';
import { authValidator, createUser } from '../Validator/userValidator';
import { protectedRoute } from '../../middleware/protectedRoute';

const router = express.Router();

router.post('/register', createUser, registerUser);

router.get('/confirmToken/:token', verifyEmail);

router.post('/login', authValidator, authentication);

router.get('/logout', protectedRoute, logout);

router.get('/refresh', protectedRoute, refresh);

module.exports = router;
