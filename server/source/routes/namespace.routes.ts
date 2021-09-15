import { Router } from 'express';
import {
  createNamespace,
  getAllNamespaces
} from '../controllers/namespace.controllers';

const router = Router();

router.get('/namespaces', getAllNamespaces);

router.post('/namespaces', createNamespace);

router.put('/namespaces');

router.delete('/namespaces');

export default router;
