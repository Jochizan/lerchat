import app from './index';
import cors from 'cors';
import httpServer from 'http';
import { createApplication } from './libs/app';
import { MessageRepository } from './libs/messages/repository';
import indexRoutes from './routes/index.routes';

const http = httpServer.createServer(app);

app.use(
  cors({
    origin: app.get('FRONT'),
    credentials: true
  })
);
app.use(indexRoutes);

http.listen(app.get('PORT'), () =>
  console.log(`Listen on port ${app.get('BACK')}`)
);

createApplication(
  http,
  {
    messageRepository: new MessageRepository()
  },
  {
    cors: {
      origin: [app.get('FRONT')]
    }
  }
);
