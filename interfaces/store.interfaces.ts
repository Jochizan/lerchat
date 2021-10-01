interface IMessage {
  _id: string;
  author: string;
  content: string;
  namespace: string;
}

interface IServer {
  _id: string;
  name: string;
  creator: string;
}

interface INamespace {
  _id: string;
  name: string;
}

interface IUser {
  _id: string;
  names: string;
  surnames: string;
  email: string;
}

export type { IUser, IServer, IMessage, INamespace };
