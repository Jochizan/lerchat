import { Schema } from 'mongoose';

interface Message {
  id: Schema.Types.ObjectId;
  message: string;
}

export type { Message };
