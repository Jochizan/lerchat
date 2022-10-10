interface IMessage {
  _id: string | null | undefined;
  author:
    | {
        _id?: string | null | undefined;
        name?: string | null | undefined;
        lastName?: string | null | undefined;
        image?: string | null | undefined;
        creator?: string | null | undefined;
        email?: string | null | undefined;
      }
    | undefined;
  content: string | null | undefined;
  namespace: string | null | undefined;
}

interface IServer {
  _id: string;
  name: string;
  creator: string;
}

interface INamespace {
  _id: string;
  name: string;
  server: string;
}

interface IUser {
  _id: string;
  names: string;
  surnames: string;
  email: string;
}

export type { IUser, IServer, IMessage, INamespace };
