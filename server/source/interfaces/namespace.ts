import { Document, ObjectId } from 'mongoose';

export default interface INamespace extends Document {
  _id: ObjectId;
  name: string;
}
