const nodemailer = require('nodemailer');
import dotenv from 'dotenv';
dotenv.config();
export const transporter = nodemailer.createTransport({
	port: 465,
	host: 'smtp.gmail.com',
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS
	},
	secure: true
});
