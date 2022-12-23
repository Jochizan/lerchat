import { IUser, UserTypes, UserActions } from '../types/user.types';

export const usersReducer = (
  state: {
    users: IUser[];
    mapUsers: { [key: string]: IUser };
  },
  action: UserActions
) => {
  const { type, payload } = action;
  // console.log(state, action);
  switch (type) {
    case UserTypes.CREATE:
      return {
        ...state,
        users: [...state.users, payload],
        mapUsers: { ...state.mapUsers, [payload._id]: payload }
      };

    case UserTypes.READ:
      return {
        ...state,
        users: payload,
        mapUsers: payload.reduce<{ [key: string]: IUser }>((acc, el) => {
          acc[el._id] = el;
          return acc;
        }, {})
      };

    case UserTypes.UPDATE:
      return {
        ...state,
        users: state.users.map((el) =>
          el._id === action.payload._id ? action.payload : el
        ),
        mapUsers: { ...state.mapUsers, [payload._id]: payload }
      };

    case UserTypes.DELETE:
      const newMapUsers = state.mapUsers;
      delete newMapUsers[action.payload as string];

      return {
        ...state,
        users: state.users.filter((el) => el._id !== action.payload),
        mapUsers: newMapUsers
      };

    case UserTypes.CONNECT:
      return {
        ...state,
        users: state.users.map((el) => {
          if (el._id === action.payload) el.state = 'connected';

          return el;
        })
      };

    case UserTypes.DISCONNECT:
      return {
        ...state,
        users: state.users.map((el) => {
          if (el._id === action.payload) el.state = 'disconnected';

          return el;
        })
      };

    case UserTypes.LOADING:
      return {
        ...state,
        ...payload
      };

    case UserTypes.ERROR:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
};
