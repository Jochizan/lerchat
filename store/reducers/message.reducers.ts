import { messagesGrouped, messageGrouped } from '@libs/groupedMessages';
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
    hasNextPage: boolean;
    loading: boolean;
    create: boolean;
    error: boolean;
    page: number;
  },
  action: MessageActions
) => {
  const { type, payload } = action;
  // console.log(state, action);
  switch (type) {
    case MessageTypes.CREATE:
      return {
        ...state,
        create: true,
        messages: messageGrouped([payload, ...state.messages])
      };

    case MessageTypes.READ:
      return { ...state, messages: messagesGrouped(payload) };

    case MessageTypes.READ_OF_PAGE:
      return {
        ...state,
        create: false,
        messages: messagesGrouped([...state.messages, ...payload])
      };

    case MessageTypes.UPDATE:
      return {
        ...state,
        create: false,
        messages: messagesGrouped(
          state.messages.map((el) =>
            el._id === action.payload._id ? action.payload : el
          )
        )
      };

    case MessageTypes.DELETE:
      return {
        ...state,
        create: false,
        messages: messagesGrouped(
          state.messages.filter((el) => el._id !== action.payload)
        )
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

    case MessageTypes.HAS_NEXT_PAGE:
      return {
        ...state,
        hasNextPage: payload
      };

    case MessageTypes.NEXT_PAGE:
      return {
        ...state,
        page: payload
      };

    default:
      return state;
  }
};
