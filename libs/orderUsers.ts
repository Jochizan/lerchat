import { IUser } from '@store/types/user.types';

const orderListUsers = (users: IUser[]) => {
  const sortedList = users.sort((a, b) => {
    if (a.state === 'connected' && b.state === 'disconnected') {
      return -1;
    } else if (a.state === 'disconnected' && b.state === 'connected') {
      return 1;
    } else if (a.state === b.state) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
    }
    return 0;
  });
  return sortedList;
};

export { orderListUsers };
