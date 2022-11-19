import { IMessage, INamespace } from '../interfaces/store';

interface Error {
  data: MessageID;
  message: string;
  error?: Error;
}

interface Success<T> {
  data: T;
}

export type MessageID = string | undefined;
export type ServerID = string | undefined;
export type UserID = string | undefined;
export type NamespaceID = string | undefined;

export type Response<T> = Success<T> | Error;

export interface ServerEvents {
  'message:created': (message: IMessage) => void;
  'message:updated': (message: IMessage) => void;
  'message:deleted': (id: MessageID) => void;

  'namespace:created': (namespace: INamespace) => void;
  'namespace:updated': (namespace: INamespace) => void;
  'namespace:deleted': (id: NamespaceID) => void;

  // 'server:created': (server: IServer) => void;
  // 'server:updated': (server: IServer) => void;
  // 'server:deleted': (id: ServerID) => void;

  'user:connect': (id: UserID) => void;
  'user:disconnect': (id: UserID) => void;
  'user:typing': (id: UserID) => void;
  'user:stop-typing': (id: UserID) => void;
}

export interface ClientEvents {
  'message:create': (
    payload: IMessage,
    callback: (res: Response<void>) => void
  ) => void;
  'message:read': (
    id: MessageID,
    callback: (res: Response<void>) => void
  ) => void;
  'message:update': (
    payload: IMessage,
    callback: (res: Response<void>) => void
  ) => void;
  'message:delete': (
    id: MessageID,
    callback: (res: Response<void>) => void
  ) => void;

  'namespace:create': (
    payload: INamespace,
    callback: (res: Response<void>) => void
  ) => void;
  'namespace:read': (
    id: NamespaceID,
    callback: (res: Response<void>) => void
  ) => void;
  'namespace:update': (
    payload: INamespace,
    callback: (res: Response<void>) => void
  ) => void;
  'namespace:delete': (
    id: NamespaceID,
    callback: (res: Response<void>) => void
  ) => void;

  // 'server:create': (
  //   payload: IServer,
  //   callback: (res: Response<void>) => void
  // ) => void;
  // 'server:read': (
  //   id: ServerID,
  //   callback: (res: Response<void>) => void
  // ) => void;
  // 'server:update': (
  //   payload: IServer,
  //   callback: (res: Response<void>) => void
  // ) => void;
  // 'server:delete': (
  //   id: ServerID,
  //   callback: (res: Response<void>) => void
  // ) => void;

  'user:connect': (id: UserID, callback: (res: Response<void>) => void) => void;
  'user:disconnect': (
    id: UserID,
    callback: (res: Response<void>) => void
  ) => void;
  'user:typing': (id: UserID, callback: (res: Response<void>) => void) => void;
  'user:stop-typing': (
    id: UserID,
    callback: (res: Response<void>) => void
  ) => void;
}
