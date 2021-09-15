import { Router } from 'express';
import { createServer, getAllServers } from '../controllers/server.controllers';

const router = Router();

router.get('/servers', getAllServers);

router.post('/servers', createServer);

router.put('/servers');

router.delete('/servers');

export default router;
