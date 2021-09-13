import { Document, ObjectId } from 'mongoose';

export default interface IMessage extends Document {
  // id: ObjectId;
  message: string;
  namespace: string;
  //author: Schema.Types.ObjectId;
}
