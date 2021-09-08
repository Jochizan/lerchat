import { Message as IMessage } from '../interfaces/store.interfaces';
import { ValidationErrorItem } from 'joi';
import { Schema } from 'mongoose';

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

export type MessageID = Schema.Types.ObjectId;

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  'message:created': (message: IMessage) => void;
  'message:updated': (message: IMessage) => void;
  'message:deleted': (id: MessageID) => void;
}

export interface ClientEvents {
  'message:list': (callback: (res: Response<IMessage[]>) => void) => void;

  'message:create': (
    payload: Omit<IMessage, 'id'>,
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
}
