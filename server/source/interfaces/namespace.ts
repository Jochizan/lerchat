import { Document } from 'mongoose';

export default interface INamespace extends Document {
  name: string;
  namespace: string;
}
