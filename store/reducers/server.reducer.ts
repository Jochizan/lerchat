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
  const { type, payload }: { type: any; payload: any } = action;

  switch (type) {
    case ServerTypes.CREATE:
      return {
        ...state,
        servers: [...state.servers, payload],
        mapServers: { ...state.mapServers, [payload._id]: payload }
      };

    case ServerTypes.READ:
      const mapServers: { [key: string]: IServer } = {};
      payload.forEach((el: any) => {
        mapServers[el._id] = el;
      });

      return {
        ...state,
        servers: payload,
        mapServers
      };

    case ServerTypes.UPDATE:
      return {
        ...state,
        servers: state.servers.map((el) =>
          el._id === payload._id ? payload : el
        ),
        mapServers: { ...state.mapServers, [payload._id]: payload }
      };

    case ServerTypes.DELETE: {
      const newMapServers = state.mapServers;
      delete newMapServers[payload as string];

      return {
        ...state,
        servers: state.servers.filter((el) => el._id !== payload),
        mapServers: newMapServers
      };
    }

    case ServerTypes.GET_LINK: {
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
      return {
        ...state,
        id: payload
        // change: true
      };

    case ServerTypes.CHANGE:
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
