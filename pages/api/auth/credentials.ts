import { NextApiHandler } from 'next';
import { connectToDatabase } from 'libs/mongodb';
import { compare } from 'bcryptjs';
import { ObjectId } from 'mongodb';

interface User {
  creator: ObjectId;
  name: string;
  lastName: string;
  email: string;
  image: string;
  password?: string;
}

const credentialsAuth: NextApiHandler<User | { msg: string }> = async (
  req,
  res
) => {
  if (req.method !== 'POST') {
    // Not supported method
    res.status(405).end();
  }

  // if (req.body.password === 'jochizan123') {
  //   delete req.body['password'];

  //   return res.status(200).json({
  //     ...req.body,
  //     image: 'default.png',
  //     name: 'jochizan',
  //     _id: '1asfbnaf213'
  //   });
  // }

  // How about using another API to randomly generate user's and avatars? :)
  const DBCOLLECTION = process.env.MONGODB_COLLECTION + '';
  const connection = await connectToDatabase();

  let _password;
  const { email, password } = req.body;
  const db = connection?.database;

  const user = await db
    ?.collection<User>(DBCOLLECTION)
    .findOne({ email: email });

  if (!user) {
    res.status(401).send({ msg: 'User not found' });
    // connection?.mongoClient.close();
    return;
  }

  _password = user.password + '';
  // console.log(user, password, _password);
  const checkPassword = await compare(password, _password);
  // await connection?.mongoClient.close();

  if (!checkPassword) {
    // connection?.mongoClient.close();
    res.status(401).json({ msg: 'Password Incorrect' });
  }

  // Return null if user data could not be retrieved
  // connection?.mongoClient.close();
  delete user['password'];
  user.creator = user._id;

  return res.status(200).json({ ...user });
};

export default credentialsAuth;
