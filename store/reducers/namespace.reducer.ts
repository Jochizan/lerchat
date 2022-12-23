import {
  INamespace,
  NamespaceTypes,
  NamespaceActions
} from '../types/namespace.types';

export const namespaceReducer = (
  state: {
    namespaces: INamespace[];
    mapNamespaces: { [key: string]: INamespace };
    id: string | null | undefined;
  },
  action: NamespaceActions
) => {
  const { type, payload } = action;
  // console.log(state, action);
  switch (type) {
    case NamespaceTypes.CREATE:
      return {
        ...state,
        namespaces: [...state.namespaces, payload],
        mapNamespaces: { ...state.mapNamespaces, [payload._id]: payload }
      };

    case NamespaceTypes.READ:
      return {
        ...state,
        namespaces: payload,
        mapNamespaces: payload.reduce<{ [key: string]: INamespace }>(
          (acc, el) => {
            acc[el._id] = el;
            return acc;
          },
          {}
        )
      };

    case NamespaceTypes.UPDATE:
      return {
        ...state,
        namespaces: state.namespaces.map((el) =>
          el._id === action.payload._id ? action.payload : el
        ),
        mapNamespaces: { ...state.mapNamespaces, [payload._id]: payload }
      };

    case NamespaceTypes.DELETE:
      const newMapNamespaces = state.mapNamespaces;
      delete newMapNamespaces[action.payload as string];

      return {
        ...state,
        namespaces: state.namespaces.filter((el) => el._id !== action.payload),
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
