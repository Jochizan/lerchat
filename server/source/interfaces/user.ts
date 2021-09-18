
import { Document, ObjectId } from 'mongoose';

export default interface IUser extends Document {
  _id: ObjectId;
  names: string;
  surnames: string;
  email: string;
}
