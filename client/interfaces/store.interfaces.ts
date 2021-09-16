import { ObjectId } from 'mongoose';

interface IMessage {
  _id?: ObjectId;
  author: string;
  message: string;
  namespace?: string;
}

interface IServer {
  _id?: ObjectId;
  name: string;
  creator: ObjectId;
}

interface INamespace {
  _id?: ObjectId;
  name: string;
}

interface IUser {
  _id?: ObjectId;
  names: string;
  surnames: string;
  email: string;
}

export type { IUser, IServer, IMessage, INamespace };
