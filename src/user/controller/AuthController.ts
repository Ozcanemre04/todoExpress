/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { Usermodel } from '../model/UserModel';
import { transporter } from '../../middleware/nodemailer';
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


export const registerUser = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const findUser = await Usermodel.findOne({ email });
	if (findUser) {
		res.status(400).send({ message: 'user with this email exist' });
	} else {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await Usermodel.create({ username, email, password: hashedPassword });
		if (user) {
			const token = jwt.sign({ username: user.email }, process.env.TOKEN, {
				expiresIn: '15m'
			});
			const url = `http://localhost:3001/api/auth/confirmToken/${token}`;
			await transporter.sendMail(
				{
					from: process.env.NODEMAILER_USER as string,
					to: user?.email,
					subject: 'Hello ✔',
					text: 'confirm your email',
					html: `<p>Click <a href=${url}>here</a> to confirm your email address </p>`
				},
				(err: any) => {
					if (err) {
						console.log(err);
					} else {
						console.log('The email was sent successfully');
					}
				}
			);
			res.status(201).json({ _id: user.id, email: user.email, message: 'mail send' });
		} else {
			res.status(400);
			throw new Error('User data us not valid');
		}
	}
};


export const verifyEmail = async (req: Request, res: Response) => {
	const token = req.params.token;
	const verifyToken = jwt.verify(token, process.env.TOKEN, (err: any, decoded: { username: string }) => {
		if (err) {
			res.status(400).json({ error: err.message });
		} else {
			const userEmail = decoded.username;
			return userEmail;
		}
	});
	const user = await Usermodel.findOneAndUpdate({ email: verifyToken }, { verified: true });
	if (user) {
		res.status(200).json({ success: 'account verified' });
	} else {
		console.log('error');
	}
};


export const authentication = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const foundUser = await Usermodel.findOne({ email });
	if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
		const accessToken = jwt.sign(
			{
				user: {
					username: foundUser.username,
					email: foundUser.email,
					id: foundUser.id
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: '7d'
		});
		if (foundUser.verified === false) {
			res.status(401).json({ message: 'account not verified' });
		} else {
			res.cookie('refresh', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
			res.status(200).json({ accessToken });
		}
	} else {
		res.status(401).json({ error: 'wrong credentials' });
	}
};


export const refresh = async (req: Request, res: Response) => {
	const cookie = req.cookies;
	if (!cookie?.refresh) return res.status(401).json({ message: 'unauthorized' });
	const refresh = cookie.refresh;

	jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, async (err) => {
		if (err) return res.status(403).json({ message: 'Forbidden' });

		const foundUser = await Usermodel.findOne({ email: (<any>req).user.email });

		if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

		const accessToken = jwt.sign(
			{
				user: {
					username: foundUser.email,
					id: foundUser.id
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(201).json({ accessToken });
	});
};


export const logout = (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.refresh) return res.sendStatus(204);
	res.clearCookie('refresh');
	res.status(200).json({ message: 'Cookie cleared' });
};
