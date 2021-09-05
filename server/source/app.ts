import express, { Request, Response } from 'express';
import app from './index';
import cors from 'cors';
import path from 'path';
import logger from 'morgan';
import httpServer from 'http';

// controllers chat
import chatController from './controllers/chat.controller';

const http = httpServer.createServer(app);

app.use(
  cors({
    origin: app.get('FRONT'),
    credentials: true
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req: Request, res: Response) => {
  res.send({ data: 'Hello from nodejs api' });
});

http.listen(app.get('PORT'), () =>
  console.log(`Listen on port http://localhost:${app.get('PORT')}`)
);

chatController(http);
