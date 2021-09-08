import { connect, ConnectOptions } from 'mongoose';
import config from './config/config';

const options: ConnectOptions = {
  autoIndex: true,
  autoCreate: true
};

(async () => {
  try {
    const db = await connect(config.UC_DB, options);

    console.log('Mongodb connection SUCCESS ✔');
    console.log('Database is connected to:', db.connection.name);
  } catch (err) {
    console.error('Mongodb connection FAIL ❌');
    console.error(err);
    process.exit(1);
  }
})();
