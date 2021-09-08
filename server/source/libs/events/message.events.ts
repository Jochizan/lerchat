import { MessageID } from '../message-management/message.repository';
import IMessage from '@/source/interfaces/message';
import { ValidationErrorItem } from 'joi';

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

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
