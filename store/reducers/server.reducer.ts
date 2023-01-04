import { UserID } from '@events/index';
import { IServer, ServerTypes, ServerActions } from '../types/server.types';

export const serverReducer = (
  state: {
    change: boolean;
    servers: IServer[];
    users: UserID[];
    mapServers: { [key: string]: IServer };
    id: string | null | undefined;
  },
  action: ServerActions
) => {
  const { type, payload } = action;

  // console.log(state, action);

  if (!payload) {
    return state;
  }
  switch (type) {
    case ServerTypes.CREATE:
      if (!(payload instanceof Object)) return state;
      return {
        ...state,
        servers: [...state.servers, payload],
        mapServers: { ...state.mapServers, [payload._id]: payload }
      };

    case ServerTypes.READ:
      if (!(payload instanceof Array)) return state;
      const mapServers: { [key: string]: IServer } = {};
      payload.forEach((el) => {
        mapServers[el._id] = el;
      });

      return {
        ...state,
        servers: payload,
        mapServers
      };

    case ServerTypes.UPDATE:
      if (!(payload instanceof Object)) return state;
      return {
        ...state,
        servers: state.servers.map((el) =>
          el._id === payload._id ? payload : el
        ),
        mapServers: { ...state.mapServers, [payload._id]: payload }
      };

    case ServerTypes.DELETE: {
      if (!(typeof payload === 'string')) return state;
      const newMapServers = state.mapServers;
      delete newMapServers[payload as string];

      return {
        ...state,
        servers: state.servers.filter((el) => el._id !== payload),
        mapServers: newMapServers
      };
    }

    case ServerTypes.GET_LINK: {
      if (!(payload instanceof Object)) return state;
      let newMapServers = state.mapServers;
      newMapServers[payload.id as string].invitation = payload.url;

      return {
        ...state,
        servers: state.servers.map((el) =>
          el._id === payload.id ? { ...el, invitation: payload.url } : el
        ),
        mapServers: newMapServers
      };
    }

    case ServerTypes.CHANGE_ID:
      if (!(typeof payload === 'string')) return state;
      return {
        ...state,
        id: payload
        // change: true
      };

    case ServerTypes.CHANGE:
      if (!(typeof payload === 'boolean')) return state;
      return {
        ...state,
        change: payload
      };

    case ServerTypes.LOADING:
      return {
        ...state,
        ...payload
      };

    case ServerTypes.ERROR:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};
