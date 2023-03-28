import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middleware/protectedRoute';

const auth = require('./user/routes/AuthRoute');
const user = require('./user/routes/UserRoute');
const todo = require('./todo/routes/TodoRoute');
dotenv.config();
const app: Express = express();
const port = process.env.PORT;
const dburl = process.env.MONGO_URL as string;
mongoose.connect(dburl, {
	useNewUrlParser: true,
	useUnifiedTopology: true
} as ConnectOptions);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
	res.send('hello world');
});
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/todo', protectedRoute, todo);

app.listen(port, () => {
	console.log(`[server]: server is running at http://localhost:${port}`);
});
