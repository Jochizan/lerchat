import { Document, ObjectId } from 'mongoose';

export default interface IMessage extends Document {
  _id: ObjectId;
  message: string;
  namespace: ObjectId;
  //author: Schema.Types.ObjectId;
}
