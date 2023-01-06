type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum MessageTypes {
  CLEAR = 'CLEAR_MESSAGE',
  CREATE = 'CREATE_MESSAGE',
  READ = 'READ_MESSAGE',
  UPDATE = 'UPDATE_MESSAGE',
  DELETE = 'DELETE_MESSAGE',
  ERROR = 'ERROR_MESSAGES',
  LOADING = 'LOADING_MESSAGES',
  CHANGE_CONTEXT = 'CHANGE_CONTEXT',
  READ_OF_PAGE = 'READ_OF_PAGE',
  NEXT_PAGE = 'NEXT_PAGE',
  HAS_NEXT_PAGE = 'HAS_NEXT_PAGE'
}

export enum MessageLocalTypes {
  MD = 'MESSAGE_DIRECT',
  NAMESPACE = 'MESSAGE_NAMESPACE'
}

export type IMessage = {
  _id: string | null | undefined;
  next: boolean | null | undefined;
  nextTime: boolean | null | undefined;
  author:
    | {
        _id: string | null | undefined;
        name: string | null | undefined;
        lastName: string | null | undefined;
        image: string | null | undefined;
        creator: string | null | undefined;
        email: string | null | undefined;
      }
    | undefined;
  content: string | null | undefined;
  namespace: string | null | undefined;
  createdAt: string | null | undefined;
  updatedAt: string | null | undefined;
};

type MessagePayload = {
  [MessageTypes.CLEAR]: IMessage[];
  [MessageTypes.CREATE]: IMessage;
  [MessageTypes.READ]: IMessage[];
  [MessageTypes.UPDATE]: IMessage;
  [MessageTypes.DELETE]: string | null | undefined;
  [MessageTypes.ERROR]: {
    error: boolean;
    msg: string;
  };
  [MessageTypes.LOADING]: {
    loading: boolean;
    msg: string;
  };
  [MessageTypes.CHANGE_CONTEXT]: MessageLocalTypes;
  [MessageTypes.READ_OF_PAGE]: IMessage[];
  [MessageTypes.NEXT_PAGE]: number;
  [MessageTypes.HAS_NEXT_PAGE]: boolean;
};

export type MessageActions =
  ActionMap<MessagePayload>[keyof ActionMap<MessagePayload>];
