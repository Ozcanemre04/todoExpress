/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { Todomodel } from '../model/todoModel';
import { Usermodel } from '../../user/model/UserModel';
const { validationResult } = require('express-validator');

export const alltodos = async (req: Request, res: Response) => {
	try {
		const userid: string = (<any>req).user.id;
		const todos = await Todomodel.find({ user: userid });
		if (!todos) {
			res.status(404).json('not found');
		}
		res.status(200).json(todos);
	} catch (err: any) {
		res.json(err.message);
	}
};


export const onetodo = async (req: Request, res: Response) => {
	try {
		const todoid: string = req.params.id;
		if (todoid.length === 24) {
			const user = await Usermodel.findOne({ _id: (<any>req).user.id });

			const todo = await Todomodel.findOne({ _id: todoid });
			if (todo) {
				if (todo.user == user?.id) {
					res.status(200).json(todo);
				} else {
					res.status(401).send({ message: 'unauthorized' });
				}
			} else {
				res.status(404).send({ message: 'Not found' });
			}
		} else {
			res.send({ message: 'param must have 24 character' });
		}
	} catch (err: any) {
		res.json(err.message);
	}
};


export const createtodo = async (req: Request, res: Response) => {
	try {
		const { content } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const newTodo = await Todomodel.create({ content, user: (<any>req).user.id });
		if (newTodo) {
			res.status(201).json({ _id: newTodo.id, content: newTodo.content, done: newTodo.done, user: newTodo.user });
		} else {
			res.status(400).send({ error: 'error' });
		}
	} catch (err: any) {
		res.json(err.message);
	}
};


export const deletetodo = async (req: Request, res: Response) => {
	try {
		const todoid = req.params.id as string;
		if (todoid.length === 24) {
			const todoDelete = await Todomodel.findOneAndDelete({ _id: todoid, user: (<any>req).user.id });

			if (!todoDelete) {
				res.status(401).send({ error: 'not found or unauthorized' });
			} else {
				res.status(200).send({ message: 'todo deleted' });
			}
		} else {
			res.send({ message: 'param must have 24 character' });
		}
	} catch (err: any) {
		res.json(err.message);
	}
};


export const upgradetodo = async (req: Request, res: Response) => {
	try {
		const todoid = req.params.id as string;
		const { content, done } = req.body;
		const errors = validationResult(req);
		const update = { content: content, done: done };

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		if (todoid.length === 24) {
			const todoUpgrade = await Todomodel.findOneAndUpdate({ _id: todoid, user: (<any>req).user.id }, update);

			if (!todoUpgrade) {
				res.status(401).send({ error: 'not found or unauthorized' });
			} else {
				res.status(200).json({success:"todo updated"});
			}
		} else {
			res.send({ message: 'param must have 24 character' });
		}
	} catch (err: any) {
		res.json(err.message);
	}
};
