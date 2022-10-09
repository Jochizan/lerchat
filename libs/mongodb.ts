import { MongoClient } from 'mongodb';
import type { MongoClientOptions, Db } from 'mongodb';

const uri = process.env.MONGODB_URI + '';
const dbname = process.env.MONGODB_NAME + '';
const options: MongoClientOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
} as MongoClientOptions;

let mongoClient: MongoClient | null = null;
let database: Db | null = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export async function connectToDatabase() {
  try {
    if (mongoClient && database) {
      return { mongoClient, database };
    }
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClient) {
        mongoClient = await new MongoClient(uri, options).connect();
        global._mongoClient = mongoClient;
      } else {
        mongoClient = global._mongoClient;
      }
    } else {
      mongoClient = await new MongoClient(uri, options).connect();
    }

    if (mongoClient) {
      database = await mongoClient.db(dbname);
      return { mongoClient, database };
    }
  } catch (e) {
    console.error(e);
  }
}
