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

  if (!payload) {
    return state;
  }
  switch (type) {
    case MessageTypes.CREATE:
      if (!payload.hasOwnProperty('_id')) return state;

      return {
        ...state,
        create: true,
        messages: messageGrouped([payload, ...state.messages])
      };

    case MessageTypes.READ:
      if (!(payload instanceof Array)) return state;
      return { ...state, messages: messagesGrouped(payload) };

    case MessageTypes.READ_OF_PAGE:
      if (!(payload instanceof Array)) return state;
      return {
        ...state,
        create: false,
        messages: messagesGrouped([...state.messages, ...payload])
      };

    case MessageTypes.UPDATE:
      if (!(payload instanceof Object)) return state;
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
      if (!(typeof payload === 'string')) return state;
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
      if (!(typeof payload === 'boolean')) return state;
      return {
        ...state,
        hasNextPage: payload
      };

    case MessageTypes.NEXT_PAGE:
      if (!(typeof payload === 'number')) return state;
      return {
        ...state,
        page: payload
      };

    default:
      return state;
  }
};
