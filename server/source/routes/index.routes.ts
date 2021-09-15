import { Router } from 'express';
import namespaceRoutes from './namespace.routes';
import messageRoutes from './message.routes';
import serverRoutes from './server.routes';

const router = Router();

router.use('/api', [namespaceRoutes, messageRoutes, serverRoutes]);

export default router;
