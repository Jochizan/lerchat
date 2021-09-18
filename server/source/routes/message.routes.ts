import { Router } from 'express';
import {
  getAllMessages,
  getMessagesByNamespace
} from '../controllers/message.controllers';

const router = Router();

router.get('/messages', getAllMessages);

router.get('/messages/:id', getMessagesByNamespace);

router.post('/messages');

router.put('/messages');

router.delete('/messages');

export default router;
