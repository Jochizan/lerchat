import {
  IMessage,
  MessageTypes,
  MessageActions,
  MessageLocalTypes
} from '../types/message.types';

export const messageReducer = (
  state: {
    messages: IMessage[];
    type: MessageLocalTypes;
    loading: boolean;
    error: boolean;
  },
  action: MessageActions
) => {
  const { type, payload } = action;
  console.log(state, action);
  switch (type) {
    case MessageTypes.CREATE:
      return { ...state, messages: [...state.messages, payload] };

    case MessageTypes.READ:
      return { ...state, messages: payload };

    case MessageTypes.READ_OF_PAGE:
      return { ...state, messages: [...payload, ...state.messages] };

    case MessageTypes.UPDATE:
      return {
        ...state,
        messages: state.messages.map((el) =>
          el._id === action.payload._id ? action.payload : el
        )
      };

    case MessageTypes.DELETE:
      return {
        ...state,
        messages: state.messages.filter((el) => el._id !== action.payload)
      };

    case MessageTypes.LOADING:
      return {
        ...state,
        ...payload
      };
    case MessageTypes.ERROR:
      return {
        ...state,
        ...payload
      };

    case MessageTypes.CHANGE_CONTEXT:
      return {
        ...state,
        type: MessageLocalTypes.MD
          ? MessageLocalTypes.NAMESPACE
          : MessageLocalTypes.MD
      };
    default:
      return state;
  }
};
