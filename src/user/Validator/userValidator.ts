import { body } from 'express-validator';
export const createUser = [
	body('email').notEmpty().withMessage('email field cant be empty').isEmail().withMessage('not valid email'),
	body('username')
		.notEmpty()
		.withMessage('username field cant be empty')
		.matches(/^[A-Z][a-z0-9_-]{2,19}$/)
		.withMessage('first letter should be uppercase,min 3letter and max 19 letter'),
	body('password')
		.notEmpty()
		.withMessage('password field cant be empty')
		.isLength({ min: 3 })
		.withMessage('password so short')
];
export const authValidator = [
	body('email').notEmpty().withMessage('email field cant be empty').isEmail().withMessage('must be an email'),
	body('password').notEmpty().withMessage('password field cant be empty').isString()
];
