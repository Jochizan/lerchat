import { Router } from 'express';
import {
  createServer,
  getAllServers,
  getServersByCreator
} from '../controllers/server.controllers';

const router = Router();

router.get('/servers', getAllServers);

router.get('/servers/:id', getServersByCreator);

router.post('/servers', createServer);

router.put('/servers');

router.delete('/servers');

export default router;
