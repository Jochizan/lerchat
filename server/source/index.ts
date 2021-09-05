import express from 'express';
import config from './config/config';
import './db';

const app = express();

app.set('PORT', config.PORT + '');
app.set('FRONT', config.FRONT_URL + '');

export default app;
