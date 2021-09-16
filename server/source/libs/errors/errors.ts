export const Errors = {
  ENTITY_NOT_FOUND: 'Entity not found',
  INVALID_PAYLOAD: 'Invalid payload'
};

const errorValues: string[] = Object.values(Errors);

export const sanitizeErrors = (message: string) => {
  if (errorValues.includes(message)) {
    return message;
  } else {
    return 'An unknown error has occurred';
  }
};
