import { ObjectId } from 'mongoose';

interface IMessage {
  _id?: ObjectId | string;
  author: string;
  message: string;
  namespace?: string;
}

interface IServer {
  _id?: ObjectId | string;
  name: string;
  creator: ObjectId;
}

interface INamespace {
  _id?: ObjectId | string;
  name: string;
}

interface IUser {
  _id?: ObjectId | string;
  names: string;
  surnames: string;
  email: string;
}

export type { IUser, IServer, IMessage, INamespace };
