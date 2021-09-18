import { MessageID, NamespaceID, UserID } from '../types';
import IMessage from '../../interfaces/message';
import INamespace from '../../interfaces/namespace';

interface handleError {
  msg: string;
  error?: Error;
}

interface Success<T> {
  data: T;
}

export type Response<T> = handleError | Success<T>;

export interface ServerEvents {
  'message:created': (message: IMessage) => void;
  'message:updated': (message: IMessage) => void;
  'message:deleted': (id: MessageID) => void;

  'namespace:created': (namespace: INamespace) => void;
  'namespace:updated': (namespace: INamespace) => void;
  'namespace:deleted': (id: NamespaceID) => void;

  'user:connect': (id: UserID) => void;
  'user:disconnect': (id: UserID) => void;
  'user:typing': (id: UserID) => void;
  'user:stop-typing': (id: UserID) => void;
}

export interface ClientEvents {
  'message:create': (
    payload: IMessage,
    callback: (res: Response<MessageID>) => void
  ) => void;
  'message:read': (
    id: MessageID,
    callback: (res: Response<IMessage>) => void
  ) => void;
  'message:update': (
    payload: IMessage,
    callback: (res?: Response<void>) => void
  ) => void;
  'message:delete': (
    id: MessageID,
    callback: (res?: Response<void>) => void
  ) => void;

  'namespace:create': (
    payload: INamespace,
    callback: (res: Response<NamespaceID>) => void
  ) => void;
  'namespace:read': (
    id: NamespaceID,
    callback: (res: Response<INamespace>) => void
  ) => void;
  'namespace:update': (
    payload: INamespace,
    callback: (res?: Response<void>) => void
  ) => void;
  'namespace:delete': (
    payload: INamespace,
    callback: (res?: Response<void>) => void
  ) => void;

  'user:connect': (id: UserID, callback: () => void) => void;
  'user:disconnect': (id: UserID, callback: () => void) => void;
  'user:typing': (id: UserID, callback: () => void) => void;
  'user:stop-typing': (id: UserID, callback: () => void) => void;
}
