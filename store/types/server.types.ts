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

export enum ServerTypes {
  CREATE = 'CREATE_SERVER',
  READ = 'READ_SERVER',
  UPDATE = 'UPDATE_SERVER',
  DELETE = 'DELETE_SERVER',
  ERROR = 'ERROR_SERVER',
  LOADING = 'LOADING_SERVER',
  CHANGE = 'CHANGE',
  CHANGE_ID = 'CHANGE_ID_SERVER',
  GET_LINK = 'GET_LINK',
}

export type IServer = {
  _id: string;
  name: string;
  creator: string;
  image: string;
  invitation: string | null | undefined;
};

type ServerPayload = {
  [ServerTypes.CREATE]: IServer;
  [ServerTypes.READ]: IServer[];
  [ServerTypes.UPDATE]: IServer;
  [ServerTypes.DELETE]: string | null | undefined;
  [ServerTypes.ERROR]: {
    error: boolean;
    msg: string;
  };
  [ServerTypes.LOADING]: {
    loading: boolean;
    msg: string;
  };
  [ServerTypes.GET_LINK]: {
    url: string | null | undefined;
    id: string | null | undefined;
  };
  [ServerTypes.CHANGE]: boolean;
  [ServerTypes.CHANGE_ID]: string | null | undefined;
};

export type ServerActions =
  ActionMap<ServerPayload>[keyof ActionMap<ServerPayload>];
