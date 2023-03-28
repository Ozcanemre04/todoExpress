import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

interface IUser extends mongoose.Document {
	id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	verified: boolean;
}
const UserSchema = new Schema<IUser>({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	verified: {
		type: Boolean,
		default: false
	}
});

export const Usermodel = mongoose.model('User', UserSchema);
