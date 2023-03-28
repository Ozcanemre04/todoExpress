/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { Usermodel } from '../model/UserModel';

export const userprofile = async (req: Request, res: Response) => {
	try {
		const user = (<any>req).user;
		res.status(200).json(user);
	} catch (err: any) {
		res.json(err.message);
	}
};


export const deleteYourAccount = async (req: Request, res: Response) => {
	try {
		await Usermodel.deleteOne({ email: (<any>req).user.email });
		res.status(200).send({ message: 'user deleted' });
	} catch (err: any) {
		res.json(err.message);
	}
};
