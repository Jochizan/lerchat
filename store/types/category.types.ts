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

export enum CategoryTypes {
  CREATE = 'CREATE_CATEGORY',
  READ = 'READ_CATEGORY',
  UPDATE = 'UPDATE_CATEGORY',
  DELETE = 'DELETE_CATEGORY',
  ERROR = 'ERROR_CATEGORYS',
  LOADING = 'LOADING_CATEGORYS',
  CHANGE_CONTEXT = 'CHANGE_CONTEXT'
}

export type ICategory = {
  _id: string;
  server: string;
  name: string;
  type: string;
};

type CategoryPayload = {
  [CategoryTypes.CREATE]: ICategory;
  [CategoryTypes.READ]: ICategory[];
  [CategoryTypes.UPDATE]: ICategory;
  [CategoryTypes.DELETE]: string | null | undefined;
  [CategoryTypes.ERROR]: {
    error: boolean;
    msg: string;
  };
  [CategoryTypes.LOADING]: {
    loading: boolean;
    msg: string;
  };
};

export type CategoryActions =
  ActionMap<CategoryPayload>[keyof ActionMap<CategoryPayload>];
