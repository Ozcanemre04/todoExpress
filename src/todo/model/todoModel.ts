import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;
interface ITodo extends mongoose.Document {
	id: Types.ObjectId;
	content: string;
	done: boolean;
	user: string | undefined;
}
const TodoSchema = new Schema<ITodo>({
	content: {
		type: String,
		required: true
	},
	done: {
		type: Boolean,
		default: false
	},
	user: { type: mongoose.Types.ObjectId, ref: 'User' }
});

export const Todomodel = mongoose.model('todo', TodoSchema);
