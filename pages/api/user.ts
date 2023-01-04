import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from 'libs/mongodb';
import { hash } from 'bcryptjs';

const HandlerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  //Only POST mothod is accepted
  switch (req.method) {
    case 'POST':
      try {
        //Getting email and password from body
        const { name, lastName, email, password } = req.body;
        //Validate
        if (!name || !lastName || !email || !email.includes('@') || !password)
          return res.status(422).json({ message: 'Invalid Data' });

        const connection = await connectToDatabase();
        if (!connection) return;

        const db = connection.db('lerchat');

        if (db) {
          const checkExisting = await db
            .collection('users')
            .findOne({ email: email });
          //Send error response if duplicate user is found
          if (checkExisting) {
            res.status(422).json({ message: 'User already exists' });
            // connection.mongoClient.close();
            return;
          }
          //Hash password
          const status = await db.collection('users').insertOne({
            ...req.body,
            image: 'default.png',
            avatar: 'default.png',
            password: await hash(password, 12)
          });
          //Send success response
          res.status(201).json({ message: 'User created', ...status });
          //Close DB connection
          // connection?.mongoClient.close();
        } else {
          res.status(500).json({ message: 'Database not Working' });
        }
      } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
      }
      break;

    default:
      res.status(500).json({ message: 'Route not valid' });
      break;
  }
};

export default HandlerUser;
