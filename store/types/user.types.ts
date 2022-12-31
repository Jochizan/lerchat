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

export enum UserTypes {
  CREATE = 'CREATE_USER',
  READ = 'READ_USER',
  UPDATE = 'UPDATE_USER',
  DELETE = 'DELETE_USER',
  ERROR = 'ERROR_USERS',
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  LOADING = 'LOADING_USERS',
  CHANGE_CONTEXT = 'CHANGE_CONTEXT',
  READ_OF_PAGE = 'READ_OF_PAGE'
}

export enum UserLocalTypes {
  MD = 'MESSAGE_DIRECT',
  NAMESPACE = 'MESSAGE_NAMESPACE'
}

export type IUser = {
  _id: string;
  name: string;
  lastName: string;
  image: string;
  email: string;
  state: string;
  defaultState: string;
};

export type IUserServer = {
  _id: string;
  user: string;
  server: string;
  namespace: string;
  role: string;
}

type UserPayload = {
  [UserTypes.CREATE]: IUser;
  [UserTypes.READ]: IUser[];
  [UserTypes.UPDATE]: IUser;
  [UserTypes.DELETE]: string | null | undefined;
  [UserTypes.ERROR]: {
    error: boolean;
    msg: string;
  };
  [UserTypes.LOADING]: {
    loading: boolean;
    msg: string;
  };
  [UserTypes.CONNECT]: string | null | undefined;
  [UserTypes.DISCONNECT]: string | null | undefined;
  [UserTypes.CHANGE_CONTEXT]: UserLocalTypes;
  [UserTypes.READ_OF_PAGE]: IUser[];
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];
