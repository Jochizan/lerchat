import { MongoClient } from 'mongodb';
import type { MongoClientOptions } from 'mongodb';
import global from 'types';

const uri = process.env.MONGODB_URI + '';
const options: MongoClientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
} as MongoClientOptions;

let mongoClient: MongoClient | null = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export const connectToDatabase: () => Promise<MongoClient | undefined> = async () => {
  try {
    if (mongoClient) {
      return mongoClient;
    }

    if (process.env.NODE_ENV === 'development') {
      if (!globalThis._mongoClient) {
        mongoClient = await new MongoClient(uri, options).connect();
        globalThis._mongoClient = mongoClient;
      } else {
        mongoClient = globalThis._mongoClient;
      }
    } else {
      mongoClient = await new MongoClient(uri, options).connect();
    }
  } catch (e) {
    console.error(e);
  }
};
