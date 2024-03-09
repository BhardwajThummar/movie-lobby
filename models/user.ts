import { Document, Schema, Model, model } from 'mongoose';

export enum Role {
  user = 'user',
  admin = 'admin'
}

interface IUser {
  username: string;
  password: string;
  email: string;
  role: Role;
}

export interface IUserDocument extends IUser, Document { }

export interface IUserModel extends Model<IUserDocument> { }

const userSchema = new Schema<IUserDocument, IUserModel>({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: Role.user }
});

const User: IUserModel = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
