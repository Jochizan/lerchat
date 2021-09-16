import { Document, ObjectId } from 'mongoose';

export default interface IMessage extends Document {
  _id: ObjectId;
  message: string;
  namespace: string;
  author: string;
}
