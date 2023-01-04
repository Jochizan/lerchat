import {
  INamespace,
  NamespaceTypes,
  NamespaceActions
} from '../types/namespace.types';

export const namespaceReducer = (
  state: {
    namespaces: INamespace[];
    namespacesWithCategory: INamespace[];
    mapNamespaces: { [key: string]: INamespace };
    id: string | null | undefined;
  },
  action: NamespaceActions
) => {
  const { type, payload }: { type: any; payload: any } = action;

  switch (type) {
    case NamespaceTypes.CREATE:
      return {
        ...state,
        namespaces: [...state.namespaces, payload],
        mapNamespaces: { ...state.mapNamespaces, [payload._id]: payload }
      };

    case NamespaceTypes.READ:
      const mapNamespaces: { [key: string]: INamespace } = {};
      payload.forEach((el: any) => {
        mapNamespaces[el._id] = el;
      });

      const namespacesWithCategory = payload.filter((el: any) => {
        if (el.category) return el;
      });

      return {
        ...state,
        namespaces: payload,
        mapNamespaces,
        namespacesWithCategory
      };

    case NamespaceTypes.UPDATE:
      return {
        ...state,
        namespaces: state.namespaces.map((el) =>
          el._id === payload._id ? payload : el
        ),
        mapNamespaces: { ...state.mapNamespaces, [payload._id]: payload }
      };

    case NamespaceTypes.DELETE:
      const newMapNamespaces = state.mapNamespaces;
      delete newMapNamespaces[action.payload as string];

      return {
        ...state,
        namespaces: state.namespaces.filter((el) => el._id !== payload),
        mapNamespaces: newMapNamespaces
      };

    case NamespaceTypes.CHANGE_ID:
      return {
        ...state,
        id: payload
      };

    case NamespaceTypes.GET_LINK: {
      return {
        ...state
      };
    }

    case NamespaceTypes.LOADING:
      return {
        ...state,
        ...payload
      };

    case NamespaceTypes.ERROR:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};
