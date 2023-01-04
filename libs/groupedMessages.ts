import { IMessage } from '@store/types/message.types';

export const messagesGrouped = (payload: IMessage[]) => {
  // const groupedMessages: number[] = [];
  if (payload.length < 1) return payload;

  if (payload.length < 2) {
    payload[0].next = true;
    payload[0].nextTime = false;
    return payload;
  }

  if (payload.length < 3) {
    const ok = payload[0].author?._id !== payload[1].author?._id;
    const time =
      Math.abs(
        new Date(payload[0].createdAt as string).getTime() -
          new Date(payload[1].createdAt as string).getTime()
      ) > 600000;
    payload[0].next = ok;
    payload[0].nextTime = time;

    payload[1].next = ok;
    payload[1].nextTime = time;
    return payload;
  }

  payload[payload.length - 1].next = true;
  payload[payload.length - 1].nextTime = false;
  for (let i = 1; i <= payload.length - 2; i++) {
    let author = payload[i].author?._id;
    let afterAuthor = payload[i + 1].author?._id !== author;

    if (afterAuthor) {
      payload[i].next = true;
      continue;
    }

    if (
      Math.abs(
        new Date(payload[i].createdAt as string).getTime() -
          new Date(payload[i + 1].createdAt as string).getTime()
      ) > 600000
    ) {
      payload[i].nextTime = true;
      continue;
    }

    payload[i].next = false;
    payload[i].nextTime = false;
  }

  let ok = payload[0].author?._id !== payload[1].author?._id;
  let time = Math.abs(
    new Date(payload[0].createdAt as string).getTime() -
      new Date(payload[1].createdAt as string).getTime()
  );
  payload[0].next = ok;
  payload[0].nextTime = time > 600000;

  return payload;
}; //

export const messageGrouped = (payload: IMessage[]) => {
  if (payload.length < 1) {
    return payload;
  }

  if (payload.length < 2) {
    payload[0].next = true;
    payload[0].nextTime = false;
    return payload;
  }

  if (
    Math.abs(
      new Date(payload[0].createdAt as string).getTime() -
        new Date(payload[1].createdAt as string).getTime()
    ) > 600000
  ) {
    payload[0].nextTime = true;
    return payload;
  }

  if (payload[0].author?._id !== payload[1].author?._id) {
    payload[0].next = true;
    return payload;
  }

  payload[0].next = false;
  payload[0].nextTime = false;

  return payload;
};

export const checkDate = (date: string) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(date);

  if (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  ) {
    return 'hoy a las ';
  }

  if (
    inputDate.getFullYear() === yesterday.getFullYear() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getDate() === yesterday.getDate()
  ) {
    return 'ayer a las ';
  }
};
