import { Router } from 'express';
import {
  createNamespace,
  getAllNamespaces,
  getNamespacesByServer
} from '../controllers/namespace.controllers';

const router = Router();

router.get('/namespaces', getAllNamespaces);

router.get('/namespaces/:id', getNamespacesByServer);

router.post('/namespaces', createNamespace);

router.put('/namespaces');

router.delete('/namespaces');

export default router;
