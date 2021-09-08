import { Document, Schema } from 'mongoose';

export default interface IMessage extends Document {
  message: string;
  //author: Schema.Types.ObjectId;
}
