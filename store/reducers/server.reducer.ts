import { UserID } from '@events/events';
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

  switch (type) {
    case ServerTypes.CREATE:
      return {
        ...state,
        servers: [...state.servers, payload],
        mapServers: { ...state.mapServers, [payload._id]: payload }
      };

    case ServerTypes.READ:
      return {
        ...state,
        servers: payload,
        mapServers: payload.reduce<{ [key: string]: IServer }>((acc, el) => {
          acc[el._id] = el;
          return acc;
        }, {})
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
