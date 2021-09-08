import { Schema } from 'mongoose';

interface Message {
  id: Schema.Types.ObjectId;
  message: string;
}

interface User {
  id: Schema.Types.ObjectId;
  names: string;
  surnames: string;
  email: string;
}

export type { Message };
