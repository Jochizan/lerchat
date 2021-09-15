import { Router } from 'express';
import { getAllMessages } from '../controllers/message.controllers';

const router = Router();

router.get('/messages', getAllMessages);

router.post('/messages');

router.put('/messages');

router.delete('/messages');

export default router;
