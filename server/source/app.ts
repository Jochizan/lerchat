import app from './index';
import cors from 'cors';
import httpServer from 'http';
import config from './config/config';
import { createApplication } from './libs/app';
import { MessageRepository } from './libs/messages/message.repository';
import { Request, Response } from 'express';
import Namespace from './models/Namespace';

const http = httpServer.createServer(app);

app.use(
  cors({
    origin: app.get('FRONT'),
    credentials: true
  })
);

app.use('/namespaces', async (req: Request, res: Response) => {
  const _namespaces = await Namespace.find();

  res.send({ msg: 'SucessFully namespaces', _namespaces });
});
// app.use(express.static(path.join(__dirname, 'public')));

http.listen(app.get('PORT'), () =>
  console.log(`Listen on port http://localhost:${app.get('PORT')}`)
);

createApplication(
  http,
  {
    messageRepository: new MessageRepository()
  },
  {
    cors: {
      origin: [config.FRONT_URL]
    }
  }
);
