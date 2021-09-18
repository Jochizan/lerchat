import { config } from 'dotenv';

config();

export default {
  TOKEN_SECRET: process.env.TOKEN_SECRET + '',
  TOKEN_ISSUER: process.env.TOKEN_ISSUER + '',
  FRONT_URL: process.env.FRONT_URL + '',
  BACK_URL: process.env.BACK_URL + '',
  UC_DB: process.env.UC_DB + '',
  UL_DB: process.env.UL_DB + '',
  MODE: process.env.MODE + '',
  PORT: process.env.PORT + ''
};
