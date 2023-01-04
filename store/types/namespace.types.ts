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

export enum NamespaceTypes {
  CREATE = 'CREATE_NAMESPACE',
  READ = 'READ_NAMESPACE',
  UPDATE = 'UPDATE_NAMESPACE',
  DELETE = 'DELETE_NAMESPACE',
  ERROR = 'ERROR_NAMESPACE',
  LOADING = 'LOADING_NAMESPACE',
  CHANGE_ID = 'CHANGE_ID_NAMESPACE',
  GET_LINK = 'GET_LINK'
}

export type INamespace = {
  _id: string;
  name: string;
  server: string;
  category: string;
};

type NamespacePayload = {
  [NamespaceTypes.CREATE]: INamespace;
  [NamespaceTypes.READ]: INamespace[];
  [NamespaceTypes.UPDATE]: INamespace;
  [NamespaceTypes.DELETE]: string | null | undefined;
  [NamespaceTypes.ERROR]: {
    error: boolean;
    msg: string;
  };
  [NamespaceTypes.LOADING]: {
    loading: boolean;
    msg: string;
  };
  [NamespaceTypes.GET_LINK]: string | null | undefined;
  [NamespaceTypes.CHANGE_ID]: string | null | undefined;
};

export type NamespaceActions =
  ActionMap<NamespacePayload>[keyof ActionMap<NamespacePayload>];
