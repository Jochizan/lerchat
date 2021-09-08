import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';
import IMessage from '../interfaces/message';

mongoose.Promise = global.Promise;

const MessageSchema: Schema = new Schema(
  {
    message: { type: String, required: true },
    //author: { type: Schema.Types.ObjectId, required: true },
    state: { type: Boolean, default: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default mongoose.models.Messages ||
  model<IMessage>('Messages', MessageSchema);
