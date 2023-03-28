import { body, check } from 'express-validator';
import { Todomodel } from '../model/todoModel';

export const updateTodoValidator = [
	check('content').custom(async (value, { req }) => {
		if (value == undefined) {
			const todo = await Todomodel.findOne({ user: req.user.id, _id: req.params?.id });
			value = todo?.content;
			return value;
		}
		if (typeof value !== 'string') {
			throw new Error('must be a string');
		}
		if (value.length < 4) {
			throw new Error('must be have a least 4 character');
		} else {
			return value;
		}
	}),

	check('done').custom(async (value, { req }) => {
		if (value == undefined) {
			const todo = await Todomodel.findOne({ user: req.user.id, _id: req.params?.id });
			value = todo?.done;
			return value;
		}
		if (typeof value !== 'boolean') {
			throw new Error('must be a boolean');
		} else {
			return value;
		}
	})
];

export const createtodoValidator = [
	body('content')
		.isString()
		.withMessage('content field must be string')
		.isLength({ min: 4 })
		.withMessage('min length must be 4 char')
];
