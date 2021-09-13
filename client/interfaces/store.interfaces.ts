import { ObjectId } from 'mongoose';

interface IMessage {
  _id: ObjectId;
  message: string;
  namespace: string;
}

interface INamespace {
  _id: ObjectId;
  name: string;
}

interface IUser {
  _id: ObjectId;
  names: string;
  surnames: string;
  email: string;
}

export type { IUser, IMessage, INamespace };